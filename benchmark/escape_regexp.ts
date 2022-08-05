import b from 'benny'
import { escapeRegExp as hexoEscapeRegExp } from 'hexo-util'

import { escapeRegExp } from '../index'

export async function benchEscapeRegExp() {
  await b.suite(
    'default',
    b.add('hexo-util-rs', () => {
      escapeRegExp('hello*world')
    }),

    b.add('hexo-util', () => {
      hexoEscapeRegExp('hello*world')
    }),

    b.cycle(),
    b.complete(),
  )
}
