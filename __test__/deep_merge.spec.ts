// The test is modified based on https://github.com/jonschlinkert/merge-deep/blob/master/test.js

import test from 'ava'

import { deepMerge } from '../index'

test('should act as lodash.merge', (t) => {
  const obj1 = { a: [{ b: 2 }, { d: 4 }] }
  const obj2 = { a: [{ c: 3 }, { e: 5 }] }

  const expected = {
    a: [
      { b: 2, c: 3 },
      { d: 4, e: 5 },
    ],
  }

  t.deepEqual(deepMerge(obj1, obj2), expected)
})

test('should do a deep merge', (t) => {
  const obj1 = { a: { b: 1, c: 1, d: { e: 1, f: 1 } } }
  const obj2 = { a: { b: 2, d: { f: 'f' } } }

  const expected = { a: { b: 2, c: 1, d: { e: 1, f: 'f' } } }

  t.deepEqual(deepMerge(obj1, obj2), expected)
})

test('should not merge strings', (t) => {
  const obj1 = { a: 'fooo' }
  const obj2 = { a: { b: 2, d: { f: 'f' } } }
  const obj3 = { a: 'bar' }

  const result = deepMerge(deepMerge(obj1, obj2), obj3)
  t.is(result.a, 'bar')
})

test('should merge simple array', (t) => {
  const obj1 = { a: [1, [2, 3], 4] }
  const obj2 = { a: [1, [3, 4], [5, 6], 6] }

  const result = deepMerge(obj1, obj2)
  const expected = { a: [1, [2, 3, 4], [5, 6], 6] }

  t.deepEqual(result, expected)
})

test('should not merge an objects into an array', (t) => {
  const obj1 = { a: { b: 1 } }
  const obj2 = { a: ['foo', 'bar'] }

  t.deepEqual(deepMerge(obj1, obj2), { a: ['foo', 'bar'] })
})

test('should not affect target & source', (t) => {
  const obj1 = { a: 0, b: 1, c: { d: 1 }, e: 4 }
  const obj2 = { b: 3, c: { d: 2 } }

  const result = deepMerge(obj1, obj2)
  const expected = { a: 0, b: 3, c: { d: 2 }, e: 4 }

  t.deepEqual(result, expected)

  t.notDeepEqual(result, obj1)
  t.deepEqual(obj1, { a: 0, b: 1, c: { d: 1 }, e: 4 })

  t.notDeepEqual(result, obj2)
  t.deepEqual(obj2, { b: 3, c: { d: 2 } })
})

test('should deep clone arrays during merge', (t) => {
  const obj1 = { a: [1, 2, [3, 4]] }
  const obj2 = { b: [5, 6] }

  const result = deepMerge(obj1, obj2) as {
    a: number[]
    b: number[]
  }

  t.deepEqual(result.a, [1, 2, [3, 4]])
  t.deepEqual(result.a[2], [3, 4])
  t.deepEqual(result.b, obj2.b)
})
