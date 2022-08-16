import b from 'benny'
// @ts-expect-error missing relative_url definition in @types/hexo-util
import { relative_url as hexoRelativeUrl } from 'hexo-util'

import { relativeUrl } from '../index'

export async function benchRelativeUrl() {
  await b.suite(
    'from root',
    b.add('hexo-util-rs', () => {
      relativeUrl('index.html', 'css/style.css')
    }),

    b.add('hexo-util', () => {
      hexoRelativeUrl('index.html', 'css/style.css')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'from same root',
    b.add('hexo-util-rs', () => {
      relativeUrl('foo/bar/index.html', 'foo/bar/style.css')
    }),

    b.add('hexo-util', () => {
      hexoRelativeUrl('foo/bar/index.html', 'foo/bar/style.css')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'from different root',
    b.add('hexo-util-rs', () => {
      relativeUrl('foo/index.html', 'css/style.css')
    }),

    b.add('hexo-util', () => {
      hexoRelativeUrl('foo/index.html', 'css/style.css')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'should encode path',
    b.add('hexo-util-rs', () => {
      relativeUrl('foo/', 'css/fôo.css')
    }),

    b.add('hexo-util', () => {
      hexoRelativeUrl('foo/', 'css/fôo.css')
    }),

    b.cycle(),
    b.complete(),
  )
}
