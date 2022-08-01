import test from 'ava'

import { escapeDiacritic } from '../index'

test('diacritic', (t) => {
  t.is(escapeDiacritic('Hell\u00F2 w\u00F2rld'), 'Hello world')
})

test('arg must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => escapeDiacritic())
})
