import test from 'ava'

import { camelCaseKeys } from '../index'

test('default', (t) => {
  const result = camelCaseKeys({
    foo_bar: 'test',
  })

  t.deepEqual(result, {
    foo_bar: 'test',
    fooBar: 'test',
  })
})

test('obj must be an object', (t) => {
  // @ts-expect-error
  t.throws(() => camelCaseKeys())
})

test('setter', (t) => {
  const result = camelCaseKeys({
    foo_bar: 'test',
  })

  result.foo_bar = 'new'
  t.is(result.fooBar, 'new')
})

test('ignore prefixing underscore', (t) => {
  const result = camelCaseKeys({
    _foo_bar: 'test',
    __bar_baz: 'foo',
  })

  t.deepEqual(result, {
    _fooBar: 'test',
    _foo_bar: 'test',
    __barBaz: 'foo',
    __bar_baz: 'foo',
  })
})

test('do nothing if the key is camelCase', (t) => {
  const result = camelCaseKeys({ fooBar: 'test' })
  t.deepEqual(result, { fooBar: 'test' })
})
