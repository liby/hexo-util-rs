import { parse } from 'url'

import Cache from './cache'
import encodeUrl from './encode_url'
import prettyUrls from './pretty_urls'
import relative_url from './relative_url'

const cache = new Cache<() => string>()

function urlForHelper(
  path = '/',
  options?: {
    relative: boolean
  },
) {
  if (/^(#|\/\/|http(s)?:)/.test(path)) return path

  const { config } = this

  options = Object.assign(
    {
      relative: config.relative_link,
    },
    options,
  )

  // Resolve relative url
  if (options.relative) {
    return relative_url(this.path, path)
  }

  const { root } = config
  const prettyUrlsOptions = Object.assign(
    {
      trailing_index: true,
      trailing_html: true,
    },
    config.pretty_urls,
  )

  // cacheId is designed to works across different hexo.config & options
  return cache.apply(
    `${config.url}-${root}-${prettyUrlsOptions.trailing_index}-${prettyUrlsOptions.trailing_html}-${path}`,
    () => {
      const sitehost = parse(config.url).hostname ?? config.url
      const data = new URL(path, `http://${sitehost}`)

      // Exit if input is an external link or a data url
      if (data.hostname !== sitehost || data.origin === 'null') {
        return path
      }

      // Prepend root path
      path = encodeUrl((root + path).replace(/\/{2,}/g, '/'))

      path = prettyUrls(path, prettyUrlsOptions)

      return path
    },
  )
}

export = urlForHelper
