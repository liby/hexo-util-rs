import { decodeUrl as decodeUrlRs } from '../utils'

const isInternalLink = (str: string) => !/^(\/\/|http(s)?|data:)/.test(str)

const decodeUrl = function (str: string) {
  if (isInternalLink(str)) return decodeURI(str)

  return decodeUrlRs(str)
}
export = decodeUrl
