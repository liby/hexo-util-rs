const { unescape } = require('querystring')

const Cache = require('./common/cache')
const {
  decodeUrl,
  encodeUrl,
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

module.exports.decodeUrl = function decode(str) {
  if (isInternalLink(str)) return decodeURI(str)

  return decodeUrl(str)
}

module.exports.isExternalLink = function isExternalLink(input, sitehost, exclude) {
  // Fast path: return false early for internal link
  // This does not involve costly operations like URL parsing or FFI interop.
  if (isInternalLink(input)) return false

  return externalLinkCache.apply(`${input}-${sitehost}-${exclude}`, () => {
    // Slow path: call Rust implementation for better URL parsing performance.
    return isExternalLinkRs(input, sitehost, exclude)
  })
}

module.exports.encodeUrl = function encode(str) {
  if (isInternalLink(str)) return encodeURI(unescape(str))

  return encodeUrl(str)
}
module.exports.escapeDiacritic = escapeDiacritic
module.exports.escapeHtml = escapeHtml
module.exports.escapeRegExp = escapeRegExp
module.exports.slugize = slugize
module.exports.stripTags = stripTags
module.exports.unescapeHtml = unescapeHtml

module.exports.Cache = Cache
module.exports.CacheStream = require('./common/cache_stream')
module.exports.prettyUrls = require('./common/pretty_urls')
module.exports.wordWrap = require('./common/word_wrap')
module.exports.relativeUrl = require('./common/relative_url')
module.exports.truncate = require('./common/truncate')
