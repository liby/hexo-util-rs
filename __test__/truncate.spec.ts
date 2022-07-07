import test from 'ava'

import { truncate } from '../index'

test('default', (t) => {
  t.is(truncate('Once upon a time in a world far far away'), 'Once upon a time in a world...')
})

test('shorter string', (t) => {
  t.is(truncate('Once upon'), 'Once upon')
})

test('truncate', (t) => {
  t.is(truncate('Once upon a time in a world far far away', { length: 17 }), 'Once upon a ti...')
})

test('separator', (t) => {
  t.is(truncate('Once upon a time in a world far far away', { length: 17, separator: ' ' }), 'Once upon a...')
})

test('omission', (t) => {
  t.is(
    truncate('And they found that many people were sleeping better.', { length: 25, omission: '... (continued)' }),
    'And they f... (continued)',
  )
})

test('str must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => truncate())
})
