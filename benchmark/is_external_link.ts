import b from 'benny'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { isExternalLink as hexoIsExternalLink } from 'hexo-util'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore generated types are for index.js
import { isExternalLink } from '../utils.js'

export async function benchIsExternalLink() {
  // eslint-disable-next-line no-console
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
      isExternalLink('/example/', 'https://hexo.io/')
    }),
    b.add('hexo-util', () => {
      hexoIsExternalLink('/example/', 'https://hexo.io/')
    }),

    b.cycle(),
    b.complete(),
  )
}
