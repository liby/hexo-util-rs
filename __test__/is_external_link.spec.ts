import test from 'ava'

import { isExternalLink } from '../index'

const SITE_URL = 'https://example.com'

test('invalid url', (t) => {
  t.is(isExternalLink('https://localhost:4000你好', SITE_URL), false)
})

test('external link', (t) => {
  t.is(isExternalLink('https://hexo.io/', SITE_URL), true)
  t.is(isExternalLink('//hexo.io/', SITE_URL), true)
})

test('internal link', (t) => {
  t.is(isExternalLink('https://example.com', SITE_URL), false)
  t.is(isExternalLink('//example.com', SITE_URL), false)
  t.is(isExternalLink('//example.com/archives/foo.html', SITE_URL), false)
  t.is(isExternalLink('/archives/foo.html', SITE_URL), false)
  t.is(isExternalLink('/archives//hexo.io', SITE_URL), false)
})

test('hash, mailto, javascript', (t) => {
  t.is(isExternalLink('#top', SITE_URL), false)
  t.is(isExternalLink('mailto:hi@hexo.io', SITE_URL), false)
  t.is(isExternalLink("javascript:alert('Hexo is Awesome')", SITE_URL), false)
})

test('exclude - empty string', (t) => {
  t.is(isExternalLink('https://hexo.io/', SITE_URL, ''), true)
})

test('exclude - string', (t) => {
  const exclude = 'foo.com'
  t.is(isExternalLink('https://foo.com/', SITE_URL, exclude), false)
  t.is(isExternalLink('https://bar.com/', SITE_URL, exclude), true)
  t.is(isExternalLink('https://baz.com/', SITE_URL, exclude), true)
})

test('exclude - array', (t) => {
  const exclude = ['foo.com', 'bar.com']
  t.is(isExternalLink('https://foo.com/', SITE_URL, exclude), false)
  t.is(isExternalLink('https://bar.com/', SITE_URL, exclude), false)
  t.is(isExternalLink('https://baz.com/', SITE_URL, exclude), true)
})
