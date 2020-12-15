const path = require('path')
const fs = require('fs')
const glob = require('glob')
const consola = require('consola')
const HTMLParser = require('node-html-parser')

const LETTERS_INPUT_DIR = 'scripts/assets/letters'
const LETTERS_OUTPUT_DIR = 'content/letters'
const SECTION_TYPES = {
  HEADER: 0,
  FOOTNOTE: 1,
  TEXT: 2,
  IMAGE: 3
}
const HEADER_VARIATIONS = {
  STANDARD: 0,
  NOTE: 1
}

const formatAttributes = attributesOBj => Object.entries(attributesOBj).map(([key, value]) => `${key}="${value}"`).join(' ')

const isEmpty = (node, previousNode) => previousNode.type === SECTION_TYPES.HEADER ? !!node.text.replace(/^[\s-–]*/, '') : !!node.text.replace(/^[\s]*/, '')

const isBold = node => /<b>/ig.test(node.toString())

const isUnderlined = node => /<u>/ig.test(node.toString())

const isLetterHead = node => /^\d+-\d+-\d+|^no date/i.test(node.text.trim())

const isBlue = node => /color="#0070c0"/i.test(node.toString())

const isImage = node => /<img/i.test(node.toString())

const isCentered = node => /align="CENTER"/i.test(node.toString())

const createLetters = (paragraphs) => {
  const letters = []
  let currentLetter

  const startNewLetter = (node) => {
    if (currentLetter) {
      letters.push(currentLetter)
    }

    const dateSearch = /^\d+-\d+-\d+/.exec(node.text)
    currentLetter = {
      date: dateSearch ? dateSearch[0] : null,
      variation: isBlue(node) ? HEADER_VARIATIONS.NOTE : HEADER_VARIATIONS.STANDARD,
      sections: [
        { type: SECTION_TYPES.HEADER }
      ]
    }
  }

  const getPreviousSection = () => currentLetter.sections[currentLetter.sections.length - 1]

  paragraphs.forEach((paragraph) => {
    if (isCentered(paragraph)) {
      if (isImage(paragraph)) {
        currentLetter.sections.push({
          type: SECTION_TYPES.IMAGE,
          sources: [...paragraph.toString().matchAll(/src="(.*?)"/gi)].map(([, res]) => res)
        })
      }
    } else {
      paragraph.childNodes.forEach((node) => {
        if (!isEmpty(node)) {
          if (isLetterHead(node)) {
            startNewLetter(node)
          } else if (isBlue(node) && getPreviousSection().variation !== HEADER_VARIATIONS.NOTE) {
            if (getPreviousSection().type === SECTION_TYPES.HEADER) {
              getPreviousSection().footnote = node
            }
          } else if (isBold(node)) {
            if (getPreviousSection().type === SECTION_TYPES.TEXT) {
              getPreviousSection().value += `<b>${node.text}</b>`
            } else if (getPreviousSection().type !== SECTION_TYPES.HEADER) {
              currentLetter.sections.push({
                type: SECTION_TYPES.TEXT,
                value: `<ul>${node.text}</ul>`
              })
            }
          } else if (isUnderlined(node)) {
            if (getPreviousSection().type === SECTION_TYPES.TEXT) {
              getPreviousSection().value += `<ul>${node.text}</ul>`
            } else {
              currentLetter.sections.push({
                type: SECTION_TYPES.TEXT,
                value: `<ul>${node.text}</ul>`
              })
            }
          }
        }
      })
    }
  })

  letters.push(currentLetter)
  return letters
}

const constructYearIntroduction = (element) => {
  const children = element.childNodes
  const extraAttributes = {}
  if (element.getAttribute && element.getAttribute('face') && element.getAttribute('face').toLowerCase().includes('wingdings')) {
    if (extraAttributes.class) extraAttributes.class = `wingdings ${extraAttributes.class}`
    else extraAttributes.class = 'wingdings'
  }

  if (children.length === 0) {
    return element.text.replace(/\n\s*/gi, ' ')
  }

  if (element.tagName === 'i') {
    return `<i ${formatAttributes(extraAttributes)}>${element.childNodes.map(node => constructYearIntroduction(node)).join('')}</i>`
  }

  if (element.tagName === 'b') {
    return `<b ${formatAttributes(extraAttributes)}>${element.childNodes.map(node => constructYearIntroduction(node)).join('')}</b>`
  }

  if (element.tagName === 'p') {
    return `<p ${formatAttributes(extraAttributes)}>${element.childNodes.map(node => constructYearIntroduction(node)).join('')}</p>`
  }

  return Object.keys(extraAttributes).length > 0
    ? `<span ${formatAttributes(extraAttributes)}>${element.childNodes.map(node => constructYearIntroduction(node)).join('')}</span>`
    : element.childNodes.map(node => constructYearIntroduction(node)).join('')
}

const parseYearDocument = (docPath) => {
  const document = fs.readFileSync(docPath)
  const year = /(\d+)/.exec(path.basename(docPath))[1]
  const root = HTMLParser.parse(document).querySelector('body')
  const paragraphs = root.querySelectorAll('p')
  const intro = constructYearIntroduction(paragraphs[1]).trim()

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

  const formattedYears = lettersByYearDocuments.map(docPath => parseYearDocument(docPath))

  consola.info(`Writing formatted markdown documents to ./${LETTERS_OUTPUT_DIR}`)
  formattedYears.forEach((doc) => {
    fs.writeFileSync(path.resolve(`${LETTERS_OUTPUT_DIR}/${doc.year}.md`), doc.body)
  })
}

generateYearsLetters()
