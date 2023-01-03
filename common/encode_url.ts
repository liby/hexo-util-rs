import { unescape } from 'querystring'

import { encodeUrl as encodeUrlRs } from '../utils'

const isInternalLink = (str: string) => !/^(\/\/|http(s)?|data:)/.test(str)

const encodeUrl = function (str: string) {
  if (isInternalLink(str)) return encodeURI(unescape(str))

  return encodeUrlRs(str)
}

export = encodeUrl
