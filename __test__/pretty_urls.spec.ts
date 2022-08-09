import test from 'ava'

import { prettyUrls } from '../index'

test('default', (t) => {
  t.is(prettyUrls('//example.com/index.html'), '//example.com/index.html')
  t.is(prettyUrls('/bar/foo.html'), '/bar/foo.html')
  t.is(prettyUrls('/bar/foo/'), '/bar/foo/')
})

test('trailing_index', (t) => {
  t.is(prettyUrls('//example.com/index.html', { trailing_index: false }), '//example.com/')
  t.is(prettyUrls('/bar/foo/index.html/index.html', { trailing_index: false }), '/bar/foo/index.html/')
  t.is(prettyUrls('/bar/foo.html', { trailing_index: false }), '/bar/foo.html')
})

test('trailing_html', (t) => {
  t.is(prettyUrls('//example.com/index.html', { trailing_html: false }), '//example.com/index.html')
  t.is(prettyUrls('/bar/foo/index.html/index.html', { trailing_html: false }), '/bar/foo/index.html/index.html')
  t.is(prettyUrls('/bar/foo.html', { trailing_html: false }), '/bar/foo')
})

test('trailing_index and trailing_html', (t) => {
  t.is(prettyUrls('//example.com/index.html', { trailing_index: false, trailing_html: false }), '//example.com/')
  t.is(
    prettyUrls('/bar/foo/index.html/index.html', { trailing_index: false, trailing_html: false }),
    '/bar/foo/index.html/',
  )
  t.is(prettyUrls('/bar/foo.html', { trailing_index: false, trailing_html: false }), '/bar/foo')
})
