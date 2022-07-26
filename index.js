const Cache = require('./common/cache')
const { isExternalLink: isExternalLinkRs, slugize, stripTags, encodeUrl, decodeUrl } = require('./utils')

const externalLinkCache = new Cache()
const isInternalLink = (str) => !/^(\/\/|http(s)?:)/.test(str)

module.exports.isExternalLink = function isExternalLink(input, sitehost, exclude) {
  // Fast path: return false early for internal link
  // This does not involve costly operations like URL parsing or FFI interop.
  if (isInternalLink(input)) return false

  return externalLinkCache.apply(`${input}-${sitehost}-${exclude}`, () => {
    // Slow path: call Rust implementation for better URL parsing performance.
    return isExternalLinkRs(input, sitehost, exclude)
  })
}

module.exports.decodeUrl = function decode(str) {
  if (isInternalLink(str)) return decodeURI(str)

  return decodeUrl(str)
}

module.exports.encodeUrl = encodeUrl
module.exports.slugize = slugize
module.exports.stripTags = stripTags
