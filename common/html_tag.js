'use strict'

const { encodeUrl, escapeHtml } = require('../index')

const regexUrl = /(cite|download|href|src|url)$/i
const regexMeta = /^(og:|twitter:)(audio|image|url|video)(:secure_url)?$/i

function encSrcset(str) {
  str.split(' ').forEach((subStr) => {
    if (subStr.match(/\S/)) {
      subStr = subStr.trim()
      str = str.replace(subStr, encodeUrl(subStr))
    }
  })
  return str
}

function htmlTag(tag, attrs, text, escape = true) {
  if (!tag) throw new TypeError('tag is required!')

  let result = `<${escapeHtml(tag)}`

  for (const i in attrs) {
    if (attrs[i] == null) result += ''
    else {
      if (
        i.match(regexUrl) ||
        (tag === 'meta' && !String(attrs[i]).match(regexMeta) && Object.values(attrs)[0].match(regexMeta))
      ) {
        result += ` ${escapeHtml(i)}="${encodeUrl(attrs[i])}"`
        // eslint-disable-next-line no-restricted-syntax
      } else if (attrs[i] === true || i === attrs[i]) {
        result += ` ${escapeHtml(i)}`
      } else if (i.match(/srcset$/i)) {
        result += ` ${escapeHtml(i)}="${encSrcset(attrs[i])}"`
      } else {
        result += ` ${escapeHtml(i)}="${escapeHtml(String(attrs[i]))}"`
      }
    }
  }

  if (escape && text && tag !== 'style') text = escapeHtml(String(text))
  if (text && tag === 'style') {
    text = text.replace(/url\(['"](.*?)['"]\)/gi, (urlAttr, url) => {
      return `url("${encodeUrl(url)}")`
    })
  }

  if (text == null) {
    result += '>'
  } else {
    result += `>${text}</${escapeHtml(tag)}>`
  }

  return result
}

module.exports = htmlTag
