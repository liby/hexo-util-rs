import Prism from 'prismjs'
import prismComponents from 'prismjs/components'
import prismLoadLanguages from 'prismjs/components/'
import stripIndent from 'strip-indent'

// https://github.com/PrismJS/prism/issues/2145

import { escapeHtml } from '../utils'

const prismAlias = Object.entries(prismComponents.languages).reduce((acc, [key, value]) => {
  if (value.alias) {
    if (Array.isArray(value.alias)) {
      value.alias.forEach((alias) => (acc[alias] = key))
    } else if (typeof value.alias === 'string') {
      acc[value.alias] = key
    }
  }
  return acc
}, {})

const prismSupportedLanguages = Object.keys(prismComponents.languages).concat(Object.keys(prismAlias))

/**
 * Wrapper of Prism.highlight()
 * @param {String} code
 * @param {String} language
 */
function prismHighlight(code: string, language: string) {
  // Prism has not load the language pattern
  if (!Prism.languages[language] && prismSupportedLanguages.includes(language)) prismLoadLanguages(language)

  if (Prism.languages[language]) {
    // Prism escapes output by default
    return Prism.highlight(code, Prism.languages[language], language)
  }

  // Current language is not supported by Prism, return origin code;
  return escapeHtml(code)
}

/**
 * Generate line number required HTML snippet
 * @param {String} code - Highlighted code
 */
function lineNumberUtil(code: string) {
  const matched = code.match(/\n(?!$)/g)
  const num = matched ? matched.length + 1 : 1
  const lines = new Array(num + 1).join('<span></span>')

  return `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`
}

function replaceTabs(str: string, tab: string) {
  return str.replace(/^\t+/gm, (match) => tab.repeat(match.length))
}

interface Options {
  caption?: string
  firstLine?: number
  isPreprocess?: boolean
  lang?: string
  lineNumber?: boolean
  mark?: string
  tab?: string
}

function PrismUtil(str: string, options: Options = {}) {
  if (typeof str !== 'string') throw new TypeError('str must be a string!')
  str = stripIndent(str)

  const { lineNumber = true, lang = 'none', tab, mark, firstLine, isPreprocess = true, caption } = options

  // To be consistent with highlight.js
  let language = lang === 'plaintext' || lang === 'none' ? 'none' : lang

  if (prismAlias[language]) language = prismAlias[language]

  const preTagClassArr = []
  const preTagAttrArr = []
  let preTagAttr = ''

  if (lineNumber) preTagClassArr.push('line-numbers')
  preTagClassArr.push(`language-${language}`)

  // Show Languages plugin
  // https://prismjs.com/plugins/show-language/
  if (language !== 'none') preTagAttrArr.push(`data-language="${language}"`)

  if (!isPreprocess) {
    // Shift Line Numbers ('firstLine' option) should only be added under non-preprocess mode
    // https://prismjs.com/plugins/line-numbers/
    if (lineNumber && firstLine) preTagAttrArr.push(`data-start="${firstLine}"`)

    // Line Highlight ('mark' option) should only be added under non-preprocess mode
    // https://prismjs.com/plugins/line-highlight/
    if (mark) preTagAttrArr.push(`data-line="${mark}"`)

    // Apply offset for 'mark' option
    // https://github.com/hexojs/hexo-util/pull/172#issuecomment-571882480
    if (firstLine && mark) preTagAttrArr.push(`data-line-offset="${firstLine - 1}"`)
  }

  if (preTagAttrArr.length) preTagAttr = ' ' + preTagAttrArr.join(' ')

  if (tab) str = replaceTabs(str, tab)

  const codeCaption = caption ? `<div class="caption">${caption}</div>` : ''

  const startTag = `<pre class="${preTagClassArr.join(
    ' ',
  )}"${preTagAttr}>${codeCaption}<code class="language-${language}">`
  const endTag = '</code></pre>'

  let parsedCode = ''

  if (language === 'none' || !isPreprocess) {
    parsedCode = escapeHtml(str)
  } else {
    parsedCode = prismHighlight(str, language)
  }

  // lineNumberUtil() should be used only under preprocess mode
  if (lineNumber && isPreprocess) {
    parsedCode += lineNumberUtil(parsedCode)
  }

  return startTag + parsedCode + endTag
}

export = PrismUtil
