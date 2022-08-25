import fs from 'fs'
import { join as pathJoin } from 'path'

import b from 'benny'
// @ts-expect-error missing tocObj definition in @types/hexo-util
import { tocObj as hexoTocObj } from 'hexo-util'

import { tocObj } from '../index'

const miniFixture = [
  '<h1 id="title_1">Title 1</h1>',
  '<div id="title_1_1"><h2>Title 1.1</h2></div>',
  '<h3 id="title_1_1_1">Title 1.1.1</h3>',
  '<h2 id="title_1_2">Title 1.2</h2>',
  '<h2 id="title_1_3">Title 1.3</h2>',
  '<h3 id="title_1_3_1">Title 1.3.1</h3>',
  '<h1 id="title_2">Title 2</h1>',
  '<h2 id="title_2_1">Title 2.1</h2>',
  '<h1 id="title_3">Title should escape &, \', < and "</h1>',
  '<h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>',
].join('')
const miniFixtureBuffer = Buffer.from(miniFixture)
const largeFixtureBuffer = fs.readFileSync(pathJoin(__dirname, './fixture/toc_obj.html'))
const largeFixture = largeFixtureBuffer.toString('utf8')

export async function benchTocObj() {
  await b.suite(
    'mini fixture',
    b.add('hexo-util-rs-buffer', () => {
      tocObj(miniFixtureBuffer)
    }),

    b.add('hexo-util-rs', () => {
      tocObj(miniFixture)
    }),

    b.add('hexo-util', () => {
      hexoTocObj(miniFixture)
    }),

    b.cycle(),
    b.complete(),
  )

  await b.suite(
    'large fixture',
    b.add('hexo-util-rs-buffer', () => {
      tocObj(largeFixtureBuffer)
    }),
    b.add('hexo-util-rs', () => {
      tocObj(largeFixture)
    }),
    b.add('hexo-util', () => {
      hexoTocObj(largeFixture)
    }),

    b.cycle(),
    b.complete(),
  )
}
