const path = require('path')
const fs = require('fs')
const glob = require('glob')
const consola = require('consola')
const HTMLParser = require('node-html-parser')

const LETTERS_INPUT_DIR = 'scripts/assets/letters'
const LETTERS_OUTPUT_DIR = 'content/letters'
const SECTION_TYPES = {
  HEADER: 'header',
  FOOTNOTE: 'footnote',
  TEXT: 'text',
  IMAGE: 'image'
}
const HEADER_VARIATIONS = {
  STANDARD: 'standard',
  NOTE: 'note'
}

const getDate = (headerStr, isNote) => {
  const dateSearch = /^\d+-\d+-\d+/.exec(headerStr)

  if (dateSearch && !isNote) return dateSearch[0]
  return headerStr.replace(/\n/, ' ').replace(/[-–]+$/, '').trim()
}

const isEmpty = (node, previousNode) => previousNode && previousNode.type === SECTION_TYPES.HEADER ? !node.text.replace(/^[\s-–]*/, '') : !node.text.replace(/^[\s]*/, '')

const isLetterHead = node => /^\d+-\d+-\d+|^\d+-\?-\d+|^no\s*date/i.test(node.text.trim())

const isBlue = node => /color="#0070c0"/i.test(node.toString())

const isImage = node => /<img/i.test(node.toString())

const isCentered = node => /align=CENTER/i.test(node.toString())

const formatText = (node) => {
  if (node.childNodes.length === 0) return node.text.replace(/\n/g, ' ')

  const formatChildNodes = () => node.childNodes.map(child => formatText(child)).join('')

  if (/^b/i.test(node.tagName)) {
    return `<b>${formatChildNodes()}</b>`
  } else if (/^sup/i.test(node.tagName)) {
    return `<sup>${formatChildNodes()}</sup>`
  } else if (/^u/i.test(node.tagName)) {
    return `<u>${formatChildNodes()}</u>`
  } else if (/wingdings/i.test(node.rawAttrs)) {
    return `<span class="wingdings">${formatChildNodes()}</span>`
  }
  return formatChildNodes()
}

const formatLetterSections = ([header, ...sections]) => {
  let sectionsMarkdown = ''
  sections.forEach((section) => {
    if (section.type === SECTION_TYPES.IMAGE) {
      sectionsMarkdown += `
<v-row><letter-image :sources="[${section.sources}]" >${section.caption ? section.caption : ''}</letter-image></v-row>
`
    } else if (section.type === SECTION_TYPES.FOOTNOTE) {
      sectionsMarkdown += `<footnote>${section.content}</footnote> `
    } else {
      sectionsMarkdown += section.content
    }
  })

  return sectionsMarkdown.trim().replace(/^[\s-–]*/, '')
}

const createLetters = (paragraphs) => {
  const letters = createLettersInterface(paragraphs)
  let finalMarkdown = ''

  letters.forEach((letter) => {
    finalMarkdown += `
<letter date="${letter.date}" variation="${letter.variation}" :has-footnote="${!!letter.footnote}">
${letter.footnote ? `<template #footnote>

${letter.footnote.trim()}

</template>` : ''}
${formatLetterSections(letter.sections)}

</letter>`
  })

  return finalMarkdown.trim()
}

const createLettersInterface = (paragraphs) => {
  const letters = []
  let currentLetter

  const startNewLetter = (node) => {
    if (currentLetter) {
      letters.push(currentLetter)
    }

    const isNote = isBlue(node)
    currentLetter = {
      date: getDate(node.text, isNote),
      variation: isNote ? HEADER_VARIATIONS.NOTE : HEADER_VARIATIONS.STANDARD,
      sections: [
        { type: SECTION_TYPES.HEADER }
      ]
    }
  }

  const getPreviousSection = () => currentLetter ? currentLetter.sections[currentLetter.sections.length - 1] : {}

  paragraphs.forEach((paragraph) => {
    if (isCentered(paragraph)) {
      if (isImage(paragraph)) {
        currentLetter.sections.push({
          type: SECTION_TYPES.IMAGE,
          sources: [...paragraph.toString().matchAll(/src="(.*?)"/gi)].map(([, res]) => `'${res}'`).join(', ')
        })
      } else {
        const prevSection = getPreviousSection()

        paragraph.childNodes.forEach((node) => {
          if (!isEmpty(node, prevSection)) {
            prevSection.caption
              ? prevSection.caption += formatText(node)
              : prevSection.caption = formatText(node)
          }
        })

        prevSection.caption += '\n\n'
      }
    } else {
      paragraph.childNodes.forEach((node) => {
        if (!isEmpty(node, getPreviousSection())) {
          if (isLetterHead(node)) {
            startNewLetter(node)
          } else if (isBlue(node) && currentLetter.variation !== HEADER_VARIATIONS.NOTE) {
            if (getPreviousSection().type === SECTION_TYPES.HEADER) {
              currentLetter.footnote ? currentLetter.footnote += formatText(node) : currentLetter.footnote = formatText(node)
            } else if (getPreviousSection().type === SECTION_TYPES.FOOTNOTE) {
              getPreviousSection().content += formatText(node)
            } else {
              currentLetter.sections.push({
                type: SECTION_TYPES.FOOTNOTE,
                content: formatText(node)
              })
            }
          } else if (getPreviousSection().type === SECTION_TYPES.TEXT) getPreviousSection().content += formatText(node)
          else currentLetter.sections.push({
            type: SECTION_TYPES.TEXT,
            content: formatText(node)
          })
        }
      })
    }
  })

  letters.push(currentLetter)
  return letters
}

const parseYearDocument = (docPath) => {
  const document = fs.readFileSync(docPath)
  const year = /(\d+)/.exec(path.basename(docPath))[1]
  const root = HTMLParser.parse(document).querySelector('body')
  const paragraphs = root.querySelectorAll('p')
  const intro = formatText(paragraphs[1]).trim()

  return {
    year,
    letters: createLetters(paragraphs.slice(2)),
    intro
  }
}

const generateYearsLetters = () => {
  const letterSearchGlob = `${LETTERS_INPUT_DIR}/**/*.html`
  const lettersByYearDocuments = glob.sync(letterSearchGlob)

  if (lettersByYearDocuments.length > 0) consola.success(`Found ${lettersByYearDocuments.length} documents to parse!`)
  else {
    consola.warn(`No documents found with glob '${letterSearchGlob}', exiting...`)
    return
  }

  try {
    const formattedYears = lettersByYearDocuments.map(docPath => parseYearDocument(docPath))

    consola.info(`Writing formatted markdown documents to ./${LETTERS_OUTPUT_DIR}`)
    formattedYears.forEach((doc) => {
      fs.writeFileSync(path.resolve(`${LETTERS_OUTPUT_DIR}/${doc.year}.md`), `---
title: ${doc.year}
description: "${doc.intro.replace(/"/g, '\\"')}"
previewImage: ${/:sources="\['(.*?)'/.test(doc.letters) ? /:sources="\['(.*?)'/.exec(doc.letters)[1] : null}
docPath: "/documents/Dad's letters ${doc.year}.docx"
---
${doc.letters}`)
    })
  } catch (err) {
    consola.error(err)
  }
}

generateYearsLetters()
