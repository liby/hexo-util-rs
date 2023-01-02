const { unescape } = require('querystring')

const {
  Cache,
  CacheStream,
  Color,
  camelCaseKeys,
  createSha1Hash,
  deepMerge,
  fullUrlFor,
  gravatar,
  hash,
  highlight,
  htmlTag,
  Pattern,
  Permalink,
  prettyUrls,
  prismHighlight,
  relativeUrl,
  spawn,
  stripIndent,
  tocObj,
  truncate,
  urlFor,
  wordWrap,
} = require('./common')
const {
  decodeUrl: decodeUrlRs,
  encodeUrl: encodeUrlRs,
  escapeDiacritic,
  escapeHtml,
  escapeRegExp,
  isExternalLink: isExternalLinkRs,
  slugize,
  stripTags,
  unescapeHtml,
} = require('./utils')

const externalLinkCache = new Cache()
const isInternalLink = (str) => !/^(\/\/|http(s)?|data:)/.test(str)

const decodeUrl = function (str) {
  if (isInternalLink(str)) return decodeURI(str)

  return decodeUrlRs(str)
}

const encodeUrl = function (str) {
  if (isInternalLink(str)) return encodeURI(unescape(str))

  return encodeUrlRs(str)
}

const isExternalLink = function (input, sitehost, exclude) {
  // Fast path: return false early for internal link
  // This does not involve costly operations like URL parsing or FFI interop.
  if (isInternalLink(input)) return false

  return externalLinkCache.apply(`${input}-${sitehost}-${exclude}`, () => {
    // Slow path: call Rust implementation for better URL parsing performance.
    return isExternalLinkRs(input, sitehost, exclude)
  })
}

module.exports = {
  Cache,
  CacheStream,
  Color,
  Pattern,
  Permalink,
  camelCaseKeys,
  createSha1Hash,
  decodeUrl,
  deepMerge,
  encodeUrl,
  escapeDiacritic,
  escapeHtml,
  escapeRegExp,
  fullUrlFor,
  gravatar,
  hash,
  highlight,
  htmlTag,
  isExternalLink,
  prettyUrls,
  prismHighlight,
  relativeUrl,
  slugize,
  spawn,
  stripIndent,
  stripTags,
  tocObj,
  truncate,
  unescapeHtml,
  urlFor,
  wordWrap,
}
