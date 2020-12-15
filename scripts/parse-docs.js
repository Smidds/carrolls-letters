const path = require('path')
const fs = require('fs')
const glob = require('glob')
const consola = require('consola')
const parseDateString = require('date-fns/parse')
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

const getDate = (headerStr) => {
  const dateSearch = /^\d+-\d+-\d+/.exec(headerStr)

  if (dateSearch) return parseDateString(dateSearch[0], 'd-M-yy', new Date())
  return headerStr.replace(/^no\s*date[\s-–]*/gi, '')
}

const isEmpty = (node, previousNode) => previousNode && previousNode.type === SECTION_TYPES.HEADER ? !node.text.replace(/^[\s-–]*/, '') : !node.text.replace(/^[\s]*/, '')

const isLetterHead = node => /^\d+-\d+-\d+|^\d+-\?-\d+|^no\s*date/i.test(node.text.trim())

const isBlue = node => /color="#0070c0"/i.test(node.toString())

const isImage = node => /<img/i.test(node.toString())

const isCentered = node => /align="CENTER"/i.test(node.toString())

const formatText = (node) => {
  if (node.childNodes.length === 0) return node.text.replace(/\n/g, ' ')

  const formatChildNodes = () => node.childNodes.map(child => formatText(child)).join('')

  if (/b/i.test(node.tagName)) {
    return `<b>${formatChildNodes()}</b>`
  } else if (/u/i.test(node.tagName)) {
    return `<u>${formatChildNodes()}</u>`
  } else if (/wingdings/i.test(node.getAttribute('face'))) {
    return `<span class="wingdings">${formatChildNodes()}</span>`
  }
  return formatChildNodes()
}

const createLetters = (paragraphs) => {
  const letters = []
  let currentLetter

  const startNewLetter = (node) => {
    if (currentLetter) {
      letters.push(currentLetter)
    }

    currentLetter = {
      date: getDate(node.text),
      variation: isBlue(node) ? HEADER_VARIATIONS.NOTE : HEADER_VARIATIONS.STANDARD,
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
          sources: [...paragraph.toString().matchAll(/src="(.*?)"/gi)].map(([, res]) => res)
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
              getPreviousSection().footnote = formatText(node)
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
      fs.writeFileSync(path.resolve(`${LETTERS_OUTPUT_DIR}/${doc.year}.md`), `# ${doc.year}\n\n${doc.intro}\n\n${JSON.stringify(doc.letters)}`)
    })
  } catch (err) {
    consola.error(err)
  }
}

generateYearsLetters()
