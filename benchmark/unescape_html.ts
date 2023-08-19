import fs from 'fs'
import { join as pathJoin } from 'path'

import b from 'benny'
import { unescapeHTML as hexoUnescapeHtml } from 'hexo-util'

import { unescapeHtml } from '../index'

const miniFixture = '&lt;p class&#x3D;&quot;foo&quot;&gt;Hello &quot;world&quot;.&lt;&#x2F;p&gt;'
const miniFixtureBuffer = Buffer.from(miniFixture)
const largeFixtureBuffer = fs.readFileSync(pathJoin(__dirname, './fixture/unescape_html.txt'))
const largeFixture = largeFixtureBuffer.toString('utf8')

export async function benchUnescapeHtml() {
  await b.suite(
    'mini fixture',
    b.add('hexo-util-rs-buffer', () => {
      unescapeHtml(miniFixtureBuffer)
    }),

    b.add('hexo-util-rs', () => {
      unescapeHtml(miniFixture)
    }),

    b.add('hexo-util', () => {
      hexoUnescapeHtml(miniFixture)
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'large fixture',
    b.add('hexo-util-rs-buffer', () => {
      unescapeHtml(largeFixtureBuffer)
    }),
    b.add('hexo-util-rs', () => {
      unescapeHtml(largeFixture)
    }),
    b.add('hexo-util', () => {
      hexoUnescapeHtml(largeFixture)
    }),

    b.cycle(),
    b.complete(),
  )
}
