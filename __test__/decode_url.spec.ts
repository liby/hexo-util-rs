import test from 'ava'

import { decodeUrl } from '../index'

test('regular', (t) => {
  const content = 'http://foo.com/'
  t.is(decodeUrl(content), content)
})

test('auth', (t) => {
  const content = 'http://user:pass@foo.com/'
  t.is(decodeUrl(content), content)
})

test('port', (t) => {
  const content = 'http://foo.com:8080/'
  t.is(decodeUrl(content), content)
})

test('space', (t) => {
  const content = 'http://foo.com/bar%20baz'
  t.is(decodeUrl(content), 'http://foo.com/bar baz')
})

test('unicode', (t) => {
  const content = 'http://foo.com/b%C3%A1r'
  t.is(decodeUrl(content), 'http://foo.com/bár')
})

test('hash', (t) => {
  const content = 'http://foo.com/b%C3%A1r#b%C3%A0z'
  t.is(decodeUrl(content), 'http://foo.com/bár#bàz')
})

test('query', (t) => {
  const content = 'http://foo.com/bar?q%C3%BAery=b%C3%A1z'
  t.is(decodeUrl(content), 'http://foo.com/bar?qúery=báz')
})

test('multiple queries', (t) => {
  const content = 'http://foo.com/bar?query1=a%C3%A1a&query2=a%C3%A0a'
  t.is(decodeUrl(content), 'http://foo.com/bar?query1=aáa&query2=aàa')
})

test('hash and query', (t) => {
  const content = 'http://foo.com/bar?query=b%C3%A1z#f%C3%B3o'
  t.is(decodeUrl(content), 'http://foo.com/bar?query=báz#fóo')
})

test('Internationalized domain name', (t) => {
  const content = 'http://xn--br-mia.com/baz'
  t.is(decodeUrl(content), 'http://bár.com/baz')
})

test('decode path', (t) => {
  const content = '/foo/bar/'
  t.is(decodeUrl(content), content)
})

test('path with space', (t) => {
  const content = '/foo%20bar/baz/'
  t.is(decodeUrl(content), '/foo bar/baz/')
})

test('path with unicode', (t) => {
  const content = '/foo/b%C3%A1r/'
  t.is(decodeUrl(content), '/foo/bár/')
})

test('decode path once', (t) => {
  const content = '/foo/bár /'
  t.is(decodeUrl(content), content)
})

test('anchor with unicode', (t) => {
  const content = '#f%C3%B3o-b%C3%A1r'
  t.is(decodeUrl(content), '#fóo-bár')
})
