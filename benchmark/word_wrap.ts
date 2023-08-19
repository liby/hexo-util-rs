import b from 'benny'
import { wordWrap as hexoWordWrap } from 'hexo-util'

import { wordWrap } from '../index'

const fixture =
  'Once upon a time, in a kingdom called Far Far Away, a king fell ill, and finding a successor to the throne turned out to be more trouble than anyone could have imagined...'

export async function benchWordWrap() {
  await b.suite(
    'Word Wrap',
    b.add('hexo-util', () => {
      hexoWordWrap(fixture)
    }),
    b.add('hexo-util-rs', () => {
      wordWrap(fixture)
    }),

    b.cycle(),
    b.complete(),
  )
}
