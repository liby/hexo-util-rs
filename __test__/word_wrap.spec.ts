import test from 'ava'

import { wordWrap } from '../index'

test('default', (t) => {
  t.is(wordWrap('Once upon a time'), 'Once upon a time')
})

test('default width', (t) => {
  t.is(
    wordWrap(
      'Once upon a time, in a kingdom called Far Far Away, a king fell ill, and finding a successor to the throne turned out to be more trouble than anyone could have imagined...',
    ),
    'Once upon a time, in a kingdom called Far Far Away, a king fell ill, and finding\na successor to the throne turned out to be more trouble than anyone could have\nimagined...',
  )
})

test('width = 8', (t) => {
  t.is(wordWrap('Once upon a time', { width: 8 }), 'Once\nupon a\ntime')
})

test('width = 1', (t) => {
  t.is(wordWrap('Once upon a time', { width: 1 }), 'Once\nupon\na\ntime')
})

test('arg must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => wordWrap())
})
