import test from 'ava'

import { slugize } from '../index'

test('spaces', (t) => {
  t.is(slugize('Hello World'), 'Hello-World')
})

test('diacritic', (t) => {
  t.is(slugize('Hell\u00F2 w\u00F2rld'), 'Hello-world')
})

test('continous dashes', (t) => {
  t.is(slugize('Hello  World'), 'Hello-World')
})

test('prefixing and trailing dashes', (t) => {
  t.is(slugize('~Hello World~'), 'Hello-World')
})

test('other special characters', (t) => {
  t.is(slugize('Hello ~`!@#$%^&*()-_+=[]{}|\\:"\' < >,. ? /World'), 'Hello-World')
})

test('custom separator', (t) => {
  t.is(slugize('Hello World', { separator: '_' }), 'Hello_World')
})

test('lower case', (t) => {
  t.is(slugize('Hello World', { transform: 1 }), 'hello-world')
})

test('upper case', (t) => {
  t.is(slugize('Hello World', { transform: 2 }), 'HELLO-WORLD')
})

test('non-english', (t) => {
  t.is(slugize('遊戲'), 'You-Xi')
})

test('str must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => slugize())
})
