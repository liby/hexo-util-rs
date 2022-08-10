import fs from 'fs'
import { join as pathJoin } from 'path'

import b from 'benny'
import { escapeHTML as hexoEscapeHtml } from 'hexo-util'

import { escapeHtml } from '../index'

const miniFixture = '&lt;foo>bar</foo&gt;'
const miniFixtureBuffer = Buffer.from(miniFixture)
const largeFixtureBuffer = fs.readFileSync(pathJoin(__dirname, './fixture/escape_html.txt'))
const largeFixture = largeFixtureBuffer.toString('utf8')

export async function benchEscapeHtml() {
  await b.suite(
    'mini fixture',
    b.add('hexo-util-rs-buffer', () => {
      escapeHtml(miniFixtureBuffer)
    }),

    b.add('hexo-util-rs', () => {
      escapeHtml(miniFixture)
    }),

    b.add('hexo-util', () => {
      hexoEscapeHtml(miniFixture)
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'large fixture',
    b.add('hexo-util-rs-buffer', () => {
      escapeHtml(largeFixtureBuffer)
    }),
    b.add('hexo-util-rs', () => {
      escapeHtml(largeFixture)
    }),
    b.add('hexo-util', () => {
      hexoEscapeHtml(largeFixture)
    }),

    b.cycle(),
    b.complete(),
  )
}
