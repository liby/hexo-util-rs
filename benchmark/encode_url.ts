import b from 'benny'
// @ts-expect-error missing Cache definition in @types/hexo-util
import { encodeURL as hexoEncodeUrl } from 'hexo-util'

import { encodeUrl } from '../index'

export async function benchEncodeUrl() {
  await b.suite(
    'Encode URL - auth',
    b.add('hexo-util-rs', () => {
      encodeUrl('http://user:pass@foo.com/')
    }),

    b.add('hexo-util', () => {
      hexoEncodeUrl('http://user:pass@foo.com/')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Encode URL - Internationalized domain name',
    b.add('hexo-util-rs', () => {
      encodeUrl('http://bár.com/baz')
    }),

    b.add('hexo-util', () => {
      hexoEncodeUrl('http://bár.com/baz')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Encode URL - path with unicode',
    b.add('hexo-util-rs', () => {
      encodeUrl('/foo/bár/')
    }),

    b.add('hexo-util', () => {
      hexoEncodeUrl('/foo/bár/')
    }),

    b.cycle(),
    b.complete(),
  )
}
