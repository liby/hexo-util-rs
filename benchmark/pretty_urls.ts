import b from 'benny'
// @ts-expect-error missing prettyUrls definition in @types/hexo-util
import { prettyUrls as hexoPrettyUrls } from 'hexo-util'

import { prettyUrls } from '../index'

export async function benchPrettyUrls() {
  await b.suite(
    'default',
    b.add('hexo-util-rs', () => {
      prettyUrls('//example.com/index.html')

      prettyUrls('/bar/foo/index.html/index.html', { trailing_index: false })

      prettyUrls('/bar/foo/index.html/index.html', { trailing_index: false, trailing_html: false })
    }),

    b.add('hexo-util', () => {
      hexoPrettyUrls('//example.com/index.html')

      hexoPrettyUrls('/bar/foo/index.html/index.html', { trailing_index: false })

      hexoPrettyUrls('/bar/foo/index.html/index.html', { trailing_index: false, trailing_html: false })
    }),

    b.cycle(),
    b.complete(),
  )
}
