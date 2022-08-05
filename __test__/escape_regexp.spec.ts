import test from 'ava'

import { escapeRegExp } from '../index'

test('escapeRegExp', (t) => {
  t.is(escapeRegExp('hello*world'), 'hello\\*world')
})

test('arg must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => escapeRegExp())
})
