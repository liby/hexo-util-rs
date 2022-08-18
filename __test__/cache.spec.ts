import test from 'ava'

// @ts-expect-error missing Cache definition in @types/hexo-util-rs
import { Cache } from '../index'

const cache = new Cache()

test('get & set', (t) => {
  cache.set('foo', 123)
  t.is(cache.get('foo'), 123)
})

test('size', (t) => {
  cache.set('foobar', 456)
  t.is(cache.size(), 2)
})

test('has', (t) => {
  t.is(cache.has('foo'), true)
  t.is(cache.has('bar'), false)
})

test('apply - non function', (t) => {
  t.is(cache.apply('bar', 123), 123)
  t.is(cache.apply('bar', 456), 123)
  t.is(cache.apply('foo', 456), 123)
})

test('apply - function', (t) => {
  t.is(
    cache.apply('baz', () => 123),
    123,
  )
  t.is(
    cache.apply('baz', () => 456),
    123,
  )
})

// test('dump', (t) => {
//   t.is(cache.dump(), {
//     bar: 123,
//     baz: 123,
//     foo: 123,
//     foobar: 456,
//   })
// })

test('del', (t) => {
  cache.del('baz')
  t.is(cache.has('foo'), true)
  t.is(cache.has('baz'), false)
})

test('flush', (t) => {
  cache.flush()
  t.is(cache.has('foo'), false)
  t.is(cache.has('bar'), false)
  t.is(cache.has('baz'), false)
  t.is(cache.size(), 0)
})

test('cache null', (t) => {
  cache.apply('foo', null)
  t.is(cache.apply('foo', 123) === null, true)
})
