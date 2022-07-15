import b from 'benny'
// @ts-expect-error
import { encodeURL as hexoEncodeUrl } from 'hexo-util'

import { encodeUrl } from '../index'

export async function benchEncodeUrl() {
  await b.suite(
    'Encode URL',
    b.add('hexo-util-rs', () => {
      encodeUrl('http://foo.com/bar baz')
    }),

    b.add('hexo-util', () => {
      hexoEncodeUrl('http://foo.com/bar baz')
    }),

    b.cycle(),
    b.complete(),
  )
}
