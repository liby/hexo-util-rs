import test from 'ava'

import { fullUrlFor as fullUrlForHelpers } from '../index'

const ctx: {
  config: {
    url: string
    pretty_urls?: {
      trailing_index: boolean
      trailing_html: boolean
    }
  }
} = {
  config: {
    url: 'http://example.com',
  },
}

const fullUrlFor = fullUrlForHelpers.bind(ctx)

test('internal url - root directory', (t) => {
  ctx.config.url = 'https://example.com'
  t.is(fullUrlFor('index.html'), ctx.config.url + '/index.html')
  t.is(fullUrlFor('/'), ctx.config.url + '/')
})

test('internal url - subdirectory', (t) => {
  ctx.config.url = 'https://example.com/blog'
  t.is(fullUrlFor('index.html'), ctx.config.url + '/index.html')
  t.is(fullUrlFor('/'), ctx.config.url + '/')
})

test('internal url - no duplicate slash', (t) => {
  ctx.config.url = 'https://example.com'
  t.is(fullUrlFor('/index.html'), 'https://example.com/index.html')
})

test('internal url - pretty_urls.trailing_index disabled', (t) => {
  ctx.config.url = 'https://example.com'
  ctx.config.pretty_urls = {
    trailing_index: false,
    trailing_html: true,
  }

  t.is(fullUrlFor('index.html'), ctx.config.url + '/')
  t.is(fullUrlFor('/'), ctx.config.url + '/')
})

test('internal url - pretty_urls.trailing_html disabled', (t) => {
  ctx.config.url = 'https://example.com'
  ctx.config.pretty_urls = {
    trailing_index: true,
    trailing_html: false,
  }

  t.is(fullUrlFor('index.html'), ctx.config.url + '/index.html')
  t.is(fullUrlFor('/foo/bar.html'), ctx.config.url + '/foo/bar')
})

test('internal url - pretty_urls.trailing_index & pretty_urls.trailing_html disabled', (t) => {
  ctx.config.url = 'https://example.com'
  ctx.config.pretty_urls = {
    trailing_index: false,
    trailing_html: false,
  }

  t.is(fullUrlFor('index.html'), ctx.config.url + '/')
  t.is(fullUrlFor('/'), ctx.config.url + '/')
  t.is(fullUrlFor('/foo/bar.html'), ctx.config.url + '/foo/bar')
})

test('absolute url', (t) => {
  ;[
    'https://hexo.io/',
    '//google.com/',
    // url_for shouldn't process external link even if trailing_index is disabled.
    'https://hexo.io/docs/index.html',
    // shouldn't process internal absolute url
    'http://example.com/foo/bar/',
    'https://example.com/foo/bar/',
  ].forEach((url) => {
    t.is(fullUrlFor(url), url)
  })
})

test('only hash', (t) => {
  ctx.config.url = 'https://example.com/blog'
  t.is(fullUrlFor('#test'), ctx.config.url + '/#test')
})

test('data url', (t) => {
  ;['mailto:foo@bar.com', 'javascript:foo()'].forEach((url) => {
    t.is(fullUrlFor(url), url)
  })
})
