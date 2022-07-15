const Cache = require('./common/cache')
const { isExternalLink: isExternalLinkRs, slugize, stripTags, encodeUrl } = require('./utils')

const externalLinkCache = new Cache()

module.exports.isExternalLink = function isExternalLink(input, sitehost, exclude) {
  // Fast path: return false early for internal link
  // This does not involve costly operations like URL parsing or FFI interop.
  if (!/^(\/\/|http(s)?:)/.test(input)) return false

  return externalLinkCache.apply(`${input}-${sitehost}-${exclude}`, () => {
    // Slow path: call Rust implementation for better URL parsing performance.
    return isExternalLinkRs(input, sitehost, exclude)
  })
}

module.exports.encodeUrl = encodeUrl
module.exports.slugize = slugize
module.exports.stripTags = stripTags
