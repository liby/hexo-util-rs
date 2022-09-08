import test from 'ava'

import { Pattern } from '../index'

test('String - posts/:id', (t) => {
  const pattern = new Pattern('posts/:id')
  const result = pattern.match('/posts/89')

  t.deepEqual(result, {
    0: 'posts/89',
    1: '89',
    id: '89',
  })
})

test('String - posts/*path', (t) => {
  const pattern = new Pattern('posts/*path')
  const result = pattern.match('posts/2013/hello-world')

  t.deepEqual(result, {
    0: 'posts/2013/hello-world',
    1: '2013/hello-world',
    path: '2013/hello-world',
  })
})

test('String - posts/:id?', (t) => {
  const pattern = new Pattern('posts/:id?')

  t.deepEqual(pattern.match('posts/'), {
    0: 'posts/',
    1: undefined,
    id: undefined,
  })

  t.deepEqual(pattern.match('posts/89'), {
    0: 'posts/89',
    1: '89',
    id: '89',
  })
})

test('RegExp', (t) => {
  const pattern = new Pattern(/ab?cd/)

  t.truthy(pattern.match('abcd'))
  t.truthy(pattern.match('acd'))
})

test('Function', (t) => {
  const pattern = new Pattern((str: string) => {
    t.is(str, 'foo')
    return {}
  })

  t.deepEqual(pattern.match('foo'), {})
})

test('rule is required', (t) => {
  // @ts-expect-error
  t.throws(() => new Pattern())
})
