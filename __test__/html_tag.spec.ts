import test from 'ava'

import { htmlTag, encodeUrl } from '../index'

test('tag', (t) => {
  t.is(htmlTag('hr'), '<hr>')
})

test('tag + attrs', (t) => {
  t.is(
    htmlTag('img', {
      src: 'http://placekitten.com/200/300',
    }),
    '<img src="http://placekitten.com/200/300">',
  )

  t.is(
    htmlTag('img', {
      src: 'http://placekitten.com/200/300',
      width: 200,
      height: 300,
    }),
    '<img src="http://placekitten.com/200/300" width="200" height="300">',
  )
})

test('tag + attrs + text', (t) => {
  t.is(
    htmlTag(
      'a',
      {
        href: 'http://zespia.tw',
      },
      'My blog',
    ),
    '<a href="http://zespia.tw/">My blog</a>',
  )
})

test('tag + empty ALT attr', (t) => {
  t.is(
    htmlTag('img', {
      src: 'http://placekitten.com/200/300',
      alt: '',
    }),
    '<img src="http://placekitten.com/200/300" alt="">',
  )
})

test('passing a zero as attribute', (t) => {
  t.is(
    htmlTag(
      'a',
      {
        href: 'http://zespia.tw',
        tabindex: 0,
      },
      'My blog',
    ),
    '<a href="http://zespia.tw/" tabindex="0">My blog</a>',
  )
})

test('passing a null alt attribute', (t) => {
  t.is(
    htmlTag(
      'a',
      {
        href: 'http://zespia.tw',
        alt: null,
      },
      'My blog',
    ),
    '<a href="http://zespia.tw/">My blog</a>',
  )
})

test('passing a undefined alt attribute', (t) => {
  t.is(
    htmlTag(
      'a',
      {
        href: 'http://zespia.tw',
        alt: undefined,
      },
      'My blog',
    ),
    '<a href="http://zespia.tw/">My blog</a>',
  )
})

test('encode url', (t) => {
  t.is(
    htmlTag('img', {
      src: 'http://foo.com/bár.jpg',
    }),
    '<img src="http://foo.com/b%C3%A1r.jpg">',
  )
})

test('escape html tag', (t) => {
  t.is(
    htmlTag(
      'foo',
      {
        bar: '<b>',
      },
      '<baz>',
    ),
    '<foo bar="&lt;b&gt;">&lt;baz&gt;</foo>',
  )
})

test('escape html tag (escape off)', (t) => {
  t.is(
    htmlTag(
      'foo',
      {
        bar: '<b>',
      },
      '<baz>',
      false,
    ),
    '<foo bar="&lt;b&gt;"><baz></foo>',
  )
})

test('srcset', (t) => {
  t.is(
    htmlTag('img', {
      srcset: 'fóo.jpg 320w,/foo/bár.jpeg 480w,default.png',
    }),
    '<img srcset="f%C3%B3o.jpg 320w,/foo/b%C3%A1r.jpeg 480w,default.png">',
  )
})

test('srcset with whitespace', (t) => {
  t.is(
    htmlTag('img', {
      srcset: `fóo.jpg 320w,
        /foo/bár.jpeg 480w,
        default.png`,
    }),
    `<img srcset="f%C3%B3o.jpg 320w,
        /foo/b%C3%A1r.jpeg 480w,
        default.png">`,
  )
})

test('should not encode style tag', (t) => {
  const text = 'p { content: "<"; }'
  t.is(htmlTag('style', {}, text), '<style>' + text + '</style>')
})

test('should encode url in style tag', (t) => {
  const text = 'p { background: url("bár.jpg"); }'
  t.is(htmlTag('style', {}, text), '<style>p { background: url("b%C3%A1r.jpg"); }</style>')
})

test('script tag with async', (t) => {
  t.is(
    htmlTag(
      'script',
      {
        src: '/foo.js',
        async: true,
      },
      '',
    ),
    '<script src="/foo.js" async></script>',
  )
})

test('meta tag', (t) => {
  t.is(
    htmlTag('meta', {
      property: 'og:title',
      content: 'foo & bar',
    }),
    '<meta property="og:title" content="foo &amp; bar">',
  )

  t.is(
    htmlTag('meta', {
      name: 'twitter:title',
      content: 'foo " bar',
    }),
    '<meta name="twitter:title" content="foo &quot; bar">',
  )
})

test('meta tag - url', (t) => {
  const content = 'https://foo.com/bár.jpg'
  const encoded = encodeUrl(content)

  t.is(
    htmlTag('meta', {
      property: 'og:url',
      content,
    }),
    `<meta property="og:url" content="${encoded}">`,
  )

  t.is(
    htmlTag('meta', {
      property: 'og:image:secure_url',
      content,
    }),
    `<meta property="og:image:secure_url" content="${encoded}">`,
  )

  t.is(
    htmlTag('meta', {
      name: 'twitter:image',
      content,
    }),
    `<meta name="twitter:image" content="${encoded}">`,
  )

  t.is(
    htmlTag('meta', {
      name: 'foo image',
      content: 'bar " baz',
    }),
    '<meta name="foo image" content="bar &quot; baz">',
  )
})

test('meta tag - numeric property', (t) => {
  t.is(
    htmlTag('meta', {
      property: 'fb:app_id',
      content: 123456789,
    }),
    '<meta property="fb:app_id" content="123456789">',
  )
})

test('tag is required', (t) => {
  // @ts-expect-error
  t.throws(() => htmlTag())
})
