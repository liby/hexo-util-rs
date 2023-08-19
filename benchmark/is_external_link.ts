import b from 'benny'
import { isExternalLink as hexoIsExternalLink } from 'hexo-util'

import { isExternalLink as isExternalLinkWithEarlyReturn } from '../index.js'
import { isExternalLink } from '../utils.js'

export async function benchIsExternalLink() {
  await b.suite(
    'Internal absolute url',
    b.add('hexo-util-rs', () => {
      isExternalLink('https://hexo.io/docs/', 'https://hexo.io/')
    }),
    b.add('hexo-util', () => {
      // @ts-expect-error
      hexoIsExternalLink('https://hexo.io/docs/', 'https://hexo.io/')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'External absolute url',
    b.add('hexo-util-rs', () => {
      isExternalLink('https://example.com/example/', 'https://hexo.io/')
    }),
    b.add('hexo-util', () => {
      // @ts-expect-error
      hexoIsExternalLink('https://example.com/example/', 'https://hexo.io/')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Relative absolute url',
    b.add('hexo-util-rs', () => {
      isExternalLinkWithEarlyReturn('/example/', 'https://hexo.io/')
    }),
    b.add('hexo-util', () => {
      // @ts-expect-error
      hexoIsExternalLink('/example/', 'https://hexo.io/')
    }),

    b.cycle(),
    b.complete(),
  )
}
