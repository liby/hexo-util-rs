import b from 'benny'
// @ts-expect-error missing Cache definition in @types/hexo-util
import { isExternalLink as hexoIsExternalLink } from 'hexo-util'

import { isExternalLink as isExternalLinkWithEarlyReturn } from '../index.js'
// @ts-expect-error  generated types are for index.js
import { isExternalLink } from '../utils.js'

export async function benchIsExternalLink() {
  await b.suite(
    'Internal absolute url',
    b.add('hexo-util-rs', () => {
      isExternalLink('https://hexo.io/docs/', 'https://hexo.io/')
    }),
    b.add('hexo-util', () => {
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
      hexoIsExternalLink('/example/', 'https://hexo.io/')
    }),

    b.cycle(),
    b.complete(),
  )
}
