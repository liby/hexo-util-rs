import { isExternalLink as isExternalLinkRs } from '../utils'

import Cache from './cache'

const externalLinkCache = new Cache()
const isInternalLink = (str: string) => !/^(\/\/|http(s)?|data:)/.test(str)

const isExternalLink = function (input: string, sitehost: string, exclude?: string | string[] | undefined | null) {
  // Fast path: return false early for internal link
  // This does not involve costly operations like URL parsing or FFI interop.
  if (isInternalLink(input)) return false

  return externalLinkCache.apply(`${input}-${sitehost}-${exclude}`, () => {
    // Slow path: call Rust implementation for better URL parsing performance.
    return isExternalLinkRs(input, sitehost, exclude)
  })
}
export = isExternalLink
