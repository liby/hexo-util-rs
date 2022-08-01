import b from 'benny'
import { escapeDiacritic as hexoEscapeDiacritic } from 'hexo-util'

import { escapeDiacritic } from '../index'

export async function benchEscapeDiacritic() {
  await b.suite(
    'default',
    b.add('hexo-util-rs', () => {
      escapeDiacritic('Hell\u00F2 w\u00F2rld')
    }),

    b.add('hexo-util', () => {
      hexoEscapeDiacritic('Hell\u00F2 w\u00F2rld')
    }),

    b.cycle(),
    b.complete(),
  )
}
