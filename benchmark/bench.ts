import fs from 'fs'
import { join as pathJoin } from 'path'

import b from 'benny'
import { stripHTML as hexoUtilStripHTML } from 'hexo-util'
import { stripHtml as stringStripHtml } from 'string-strip-html'
import striptags from 'striptags'

import { stripTags } from '../index'

const miniFixture =
  '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="https://www.google.com">Google</a><div>'
const miniFixtureBuffer = Buffer.from(miniFixture)
const largeFixtureBuffer = fs.readFileSync(pathJoin(__dirname, './fixture.html'))
const largeFixture = largeFixtureBuffer.toString('utf8')

async function run() {
  await b.suite(
    'mini fixture',
    b.add('hexo-util-rs-buffer', () => {
      stripTags(miniFixtureBuffer)
    }),
    b.add('hexo-util-rs', () => {
      stripTags(miniFixture)
    }),
    b.add('hexo-util', () => {
      hexoUtilStripHTML(miniFixture)
    }),
    b.add('striptags', () => {
      striptags(miniFixture)
    }),
    b.add('string-strip-html', () => {
      stringStripHtml(miniFixture)
    }),

    b.cycle(),
    b.complete(),
  )
  await b.suite(
    'large fixture',
    b.add('hexo-util-rs-buffer', () => {
      stripTags(largeFixtureBuffer)
    }),
    b.add('hexo-util-rs', () => {
      stripTags(largeFixture)
    }),
    b.add('hexo-util', () => {
      hexoUtilStripHTML(largeFixture)
    }),
    b.add('striptags', () => {
      striptags(largeFixture)
    }),
    b.add('string-strip-html', () => {
      stringStripHtml(largeFixture)
    }),

    b.cycle(),
    b.complete(),
  )
}

run().catch((e) => {
  console.error(e)
})
