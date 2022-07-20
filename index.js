const Cache = require('./common/cache')
const { isExternalLink: isExternalLinkRs, slugize, stripTags } = require('./utils')

const externalLinkCache = new Cache()
module.exports.isExternalLink = function isExternalLink(input, sitehost, exclude) {
  return externalLinkCache.apply(`${input}-${sitehost}-${exclude}`, () => {
    // Return false early for internal link
    if (!/^(\/\/|http(s)?:)/.test(input)) return false
    return isExternalLinkRs(input, sitehost, exclude)
  })
}

module.exports.slugize = slugize
module.exports.stripTags = stripTags
