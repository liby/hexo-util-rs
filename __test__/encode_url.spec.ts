import test from 'ava'

import { encodeUrl } from '../index'

test('regular', (t) => {
  const content = 'http://foo.com/'
  t.is(encodeUrl(content), content)
})

test('auth', (t) => {
  const content = 'http://user:pass@foo.com/'
  t.is(encodeUrl(content), content)
})

test('port', (t) => {
  const content = 'http://foo.com:8080/'
  t.is(encodeUrl(content), content)
})

test('space', (t) => {
  const content = 'http://foo.com/b%C3%A1%20r'
  t.is(encodeUrl(content), content)
})

test('unicode', (t) => {
  const content = 'http://foo.com/bár'
  t.is(encodeUrl(content), 'http://foo.com/b%C3%A1r')
})

test('query', (t) => {
  const content = 'http://foo.com/bar?qúery=báz'
  t.is(encodeUrl(content), 'http://foo.com/bar?q%C3%BAery=b%C3%A1z')
})

test('query contains %', (t) => {
  const content = 'http://foo.com/bar?query=%'
  t.is(encodeUrl(content), 'http://foo.com/bar?query=%25')
})

test('path or query contains %', (t) => {
  const content = '/bar?query=%'
  t.is(encodeUrl(content), '/bar?query=%25')
})

test('multiple queries', (t) => {
  const content = 'http://foo.com/bar?query1=aáa&query2=aàa'
  t.is(encodeUrl(content), 'http://foo.com/bar?query1=a%C3%A1a&query2=a%C3%A0a')
})

test('hash and query', (t) => {
  const content = 'http://foo.com/bar?query=báz#fóo'
  t.is(encodeUrl(content), 'http://foo.com/bar?query=b%C3%A1z#f%C3%B3o')
})

test('Internationalized domain name', (t) => {
  const content = 'http://bár.com/baz'
  t.is(encodeUrl(content), content)
})

test('Internationalized domain name - punycode', (t) => {
  const content = 'http://xn--br-mia.com/baz'
  t.is(encodeUrl(content), 'http://bár.com/baz')
})

test('path', (t) => {
  const content = '/foo/bar/'
  t.is(encodeUrl(content), content)
})

test('path with space', (t) => {
  const content = '/foo bar/baz/'
  t.is(encodeUrl(content), '/foo%20bar/baz/')
})

test('path with unicode', (t) => {
  const content = '/foo/bár/'
  t.is(encodeUrl(content), '/foo/b%C3%A1r/')
})

test('encode once', (t) => {
  const content = 'http://foo.com/b%C3%A1%20r'
  t.is(encodeUrl(content), content)
})

test('query encode once', (t) => {
  const content = '/foo/b%C3%A1r%20/'
  t.is(encodeUrl(content), content)
})

test('anchor with unicode', (t) => {
  const content = '#fóo-bár'
  t.is(encodeUrl(content), '#f%C3%B3o-b%C3%A1r')
})

test('data URLs', (t) => {
  const content = 'data:,Hello%2C%20World!'
  t.is(encodeUrl(content), content)
})
