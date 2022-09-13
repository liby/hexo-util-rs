import test from 'ava'

import { urlFor as urlForHelpers } from '../index'

const ctx: {
  config: {
    url?: string
    root?: string
    relative_link?: boolean
    pretty_urls?: {
      trailing_index: boolean
      trailing_html: boolean
    }
  }
  path?: string
} = {
  config: {
    url: 'http://example.com',
  },
}

const urlFor = urlForHelpers.bind(ctx)

test('should encode path', (t) => {
  ctx.config.root = '/'
  t.is(urlFor('fôo.html'), '/f%C3%B4o.html')

  ctx.config.root = '/fôo/'
  t.is(urlFor('bár.html'), '/f%C3%B4o/b%C3%A1r.html')
})

test('internal url (relative off)', (t) => {
  ctx.config.root = '/'
  t.is(urlFor('index.html'), '/index.html')
  t.is(urlFor('/'), '/')
  t.is(urlFor('/index.html'), '/index.html')

  ctx.config.root = '/blog/'
  t.is(urlFor('index.html'), '/blog/index.html')
  t.is(urlFor('/'), '/blog/')
  t.is(urlFor('/index.html'), '/blog/index.html')
})

test('internal url (relative on)', (t) => {
  ctx.config.relative_link = true
  ctx.config.root = '/'

  ctx.path = ''
  t.is(urlFor('index.html'), 'index.html')

  ctx.path = 'foo/bar/'
  t.is(urlFor('index.html'), '../../index.html')

  ctx.config.relative_link = false
})

test('internal url (relative on) - should encode path just once', (t) => {
  ctx.config.relative_link = true
  ctx.config.root = '/'

  ctx.path = 'foo/bar/'
  t.is(urlFor('fôo.html'), '../../f%C3%B4o.html')

  ctx.config.relative_link = false
})

test('internal url (options.relative)', (t) => {
  ctx.config.relative_link = false
  ctx.path = 'foo/bar/'
  t.is(urlFor('index.html', { relative: true }), '../../index.html')

  ctx.config.relative_link = true
  t.is(urlFor('index.html', { relative: false }), '/index.html')
  ctx.config.relative_link = false
})

test('internal url - pretty_urls.trailing_index disabled', (t) => {
  ctx.config.root = '/'
  ctx.config.pretty_urls = {
    trailing_index: false,
    trailing_html: true,
  }

  t.is(urlFor('index.html'), '/')
  t.is(urlFor('/'), '/')
  t.is(urlFor('/index.html'), '/')

  ctx.config.root = '/blog/'
  t.is(urlFor('index.html'), '/blog/')
  t.is(urlFor('/'), '/blog/')
  t.is(urlFor('/index.html'), '/blog/')
})

test('internal url - pretty_urls.trailing_html disabled', (t) => {
  ctx.config.root = '/'
  ctx.config.pretty_urls = {
    trailing_index: true,
    trailing_html: false,
  }

  t.is(urlFor('index.html'), '/index.html')
  t.is(urlFor('/'), '/')
  t.is(urlFor('/foo/bar.html'), '/foo/bar')

  ctx.config.root = '/blog/'
  t.is(urlFor('index.html'), '/blog/index.html')
  t.is(urlFor('/'), '/blog/')
  t.is(urlFor('/foo/bar.html'), '/blog/foo/bar')
})

test('internal url - pretty_urls.trailing_index & pretty_urls.trailing_html disabled', (t) => {
  ctx.config.root = '/'
  ctx.config.pretty_urls = {
    trailing_index: false,
    trailing_html: false,
  }

  t.is(urlFor('index.html'), '/')
  t.is(urlFor('/'), '/')
  t.is(urlFor('/foo/bar.html'), '/foo/bar')

  ctx.config.root = '/blog/'
  t.is(urlFor('index.html'), '/blog/')
  t.is(urlFor('/'), '/blog/')
  t.is(urlFor('/foo/bar.html'), '/blog/foo/bar')
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
    t.is(urlFor(url), url)
  })
})

test('absolute url - should not be processed by relative_url', (t) => {
  ctx.config.relative_link = true
  ;[
    'https://hexo.io/',
    '//google.com/',
    'https://hexo.io/docs/index.html',
    'http://example.com/foo/bar/',
    'https://example.com/foo/bar/',
  ].forEach((url) => {
    t.is(urlFor(url), url)
  })
  ctx.config.relative_link = false
})

test('only hash', (t) => {
  t.is(urlFor('#test'), '#test')
})

test('data url', (t) => {
  ;['mailto:foo@bar.com', 'javascript:foo()'].forEach((url) => {
    t.is(urlFor(url), url)
  })
})
