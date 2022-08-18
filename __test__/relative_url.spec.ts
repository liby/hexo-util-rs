import test from 'ava'

import { relativeUrl } from '../index'

test('from root', (t) => {
  t.is(relativeUrl('', 'css/style.css'), 'css/style.css')
  t.is(relativeUrl('index.html', 'css/style.css'), 'css/style.css')
})

test('from same root', (t) => {
  t.is(relativeUrl('foo/', 'foo/style.css'), 'style.css')
  t.is(relativeUrl('foo/index.html', 'foo/style.css'), 'style.css')
  t.is(relativeUrl('foo/bar/', 'foo/bar/style.css'), 'style.css')
  t.is(relativeUrl('foo/bar/index.html', 'foo/bar/style.css'), 'style.css')
})

test('from different root', (t) => {
  t.is(relativeUrl('foo/', 'css/style.css'), '../css/style.css')
  t.is(relativeUrl('foo/index.html', 'css/style.css'), '../css/style.css')
  t.is(relativeUrl('foo/bar/', 'css/style.css'), '../../css/style.css')
  t.is(relativeUrl('foo/bar/index.html', 'css/style.css'), '../../css/style.css')
})

test('to root', (t) => {
  t.is(relativeUrl('index.html', '/'), 'index.html')
  t.is(relativeUrl('foo/', '/'), '../index.html')
  t.is(relativeUrl('foo/index.html', '/'), '../index.html')
})

test('should encode path', (t) => {
  t.is(relativeUrl('foo/', 'css/fôo.css'), '../css/f%C3%B4o.css')
})
