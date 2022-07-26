import b from 'benny'
// @ts-expect-error missing decodeURL definition in @types/hexo-util
import { decodeURL as hexoDecodeUrl } from 'hexo-util'

import { decodeUrl } from '../index'

export async function benchDecodeUrl() {
  await b.suite(
    'Decode URL - regular',
    b.add('hexo-util-rs', () => {
      decodeUrl('http://foo.com/')
    }),

    b.add('hexo-util', () => {
      hexoDecodeUrl('http://foo.com/')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Decode URL - path with space',
    b.add('hexo-util-rs', () => {
      decodeUrl('/foo%20bar/baz/')
    }),

    b.add('hexo-util', () => {
      hexoDecodeUrl('/foo%20bar/baz/')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Decode URL - space',
    b.add('hexo-util-rs', () => {
      decodeUrl('http://foo.com/bar%20baz')
    }),

    b.add('hexo-util', () => {
      hexoDecodeUrl('http://foo.com/bar%20baz')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Decode URL - hash and query',
    b.add('hexo-util-rs', () => {
      decodeUrl('http://foo.com/bar?query=b%C3%A1z#f%C3%B3o')
    }),

    b.add('hexo-util', () => {
      hexoDecodeUrl('http://foo.com/bar?query=b%C3%A1z#f%C3%B3o')
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'Decode URL - Internationalized domain name',
    b.add('hexo-util-rs', () => {
      decodeUrl('http://xn--br-mia.com/baz')
    }),

    b.add('hexo-util', () => {
      hexoDecodeUrl('http://xn--br-mia.com/baz')
    }),

    b.cycle(),
    b.complete(),
  )
}
