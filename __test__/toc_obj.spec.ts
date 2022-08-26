import test from 'ava'

import { tocObj } from '../index'

const html = [
  '<h1 id="title_1">Title 1</h1>',
  '<div id="title_1_1"><h2>Title 1.1</h2></div>',
  '<h3 id="title_1_1_1">Title 1.1.1</h3>',
  '<h2 id="title_1_2">Title 1.2</h2>',
  '<h2 id="title_1_3">Title 1.3</h2>',
  '<h3 id="title_1_3_1">Title 1.3.1</h3>',
  '<h1 id="title_2">Title 2</h1>',
  '<h2 id="title_2_1">Title 2.1</h2>',
  '<h1 id="title_3">Title should escape &, \', < and "</h1>',
  '<h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>',
].join('')

test('default', (t) => {
  const expected = [
    { text: 'Title 1', id: 'title_1', level: 1 },
    { text: 'Title 1.1', id: 'title_1_1', level: 2 },
    { text: 'Title 1.1.1', id: 'title_1_1_1', level: 3 },
    { text: 'Title 1.2', id: 'title_1_2', level: 2 },
    { text: 'Title 1.3', id: 'title_1_3', level: 2 },
    { text: 'Title 1.3.1', id: 'title_1_3_1', level: 3 },
    { text: 'Title 2', id: 'title_2', level: 1 },
    { text: 'Title 2.1', id: 'title_2_1', level: 2 },
    { text: 'Title should escape &amp;, &#x27;, &lt; and &quot;', id: 'title_3', level: 1 },
    { text: 'Chapter 1 should be printed to toc', id: 'title_4', level: 1 },
  ]

  t.deepEqual(tocObj(html), expected)
})

test('options - min_depth', (t) => {
  const expected = [
    { text: 'Title 1.1', id: 'title_1_1', level: 2 },
    { text: 'Title 1.1.1', id: 'title_1_1_1', level: 3 },
    { text: 'Title 1.2', id: 'title_1_2', level: 2 },
    { text: 'Title 1.3', id: 'title_1_3', level: 2 },
    { text: 'Title 1.3.1', id: 'title_1_3_1', level: 3 },
    { text: 'Title 2.1', id: 'title_2_1', level: 2 },
  ]

  t.deepEqual(tocObj(html, { min_depth: 2 }), expected)
})

test('options - max_depth', (t) => {
  const expected = [
    { text: 'Title 1', id: 'title_1', level: 1 },
    { text: 'Title 1.1', id: 'title_1_1', level: 2 },
    { text: 'Title 1.2', id: 'title_1_2', level: 2 },
    { text: 'Title 1.3', id: 'title_1_3', level: 2 },
    { text: 'Title 2', id: 'title_2', level: 1 },
    { text: 'Title 2.1', id: 'title_2_1', level: 2 },
    { text: 'Title should escape &amp;, &#x27;, &lt; and &quot;', id: 'title_3', level: 1 },
    { text: 'Chapter 1 should be printed to toc', id: 'title_4', level: 1 },
  ]

  t.deepEqual(tocObj(html, { max_depth: 2 }), expected)
})

test('no id attribute', (t) => {
  const noid = '<h1>Title 1</h1>'
  const result = tocObj(noid)

  t.is(result[0].id, '')
})

test('empty value in id attribute', (t) => {
  const noid = '<h1 id="">Title 1</h1>'
  const result = tocObj(noid)

  t.is(result[0].id, '')
})

test('invalid input', (t) => {
  const foo = 'barbaz'
  const result = tocObj(foo)

  t.is(result.length, 0)
})

test('empty text', (t) => {
  const input = '<h1></h1>'
  const result = tocObj(input)

  t.is(result[0].text, '')
})

test('<a> element with permalink + text', (t) => {
  const input = [
    '<h1><a>#</a>foo</h1>',
    '<h1>foo<a>#</a></h1>',
    '<h1><a>#</a>foo<a>#</a></h1>',
    '<h1><a># </a>foo</h1>',
    '<h1><a># </a>foo<a> #</a></h1>',
    '<h1><a>号</a>foo</h1>',
  ]
  const result = input.map((str) => tocObj(str))

  result.forEach((str) => t.is(str[0].text, 'foo'))
})

test('<a> element - no text', (t) => {
  const input = '<h1><a>foo</a></h1>'
  const result = tocObj(input)

  t.is(result[0].text, 'foo')
})

test('<a> element - single permalink', (t) => {
  const input = '<h1><a>#</a></h1>'
  const result = tocObj(input)

  t.is(result[0].text, '#')
})

test('<a> element - non-permalink', (t) => {
  const input = '<h1><a>a</a> one</h1>'
  const result = tocObj(input)

  t.is(result[0].text, 'a one')
})

test('non-permalink <a> element + text', (t) => {
  const input = ['<h1><a>foo</a>bar</h1>', '<h1>foo<a>bar</a></h1>']
  const result = input.map((str) => tocObj(str))

  result.forEach((str) => t.is(str[0].text, 'foobar'))
})

test('non-permalink <a> element + unicode text', (t) => {
  const input = ['<h1><a>这是</a>测试</h1>', '<h1>这是<a>测试</a></h1>']
  const result = input.map((str) => tocObj(str))

  result.forEach((str) => t.is(str[0].text, '这是测试'))
})

test('multiple <a> elements', (t) => {
  const input = '<h1><a>foo</a><a>bar</a></h1>'
  const result = tocObj(input)

  t.is(result[0].text, 'foobar')
})

test('element + text', (t) => {
  const input = [
    '<h1><i>foo</i>barbaz</h1>',
    '<h1><i>foo</i>bar</i>baz</h1>',
    '<h1>foo<i>bar</i>baz</h1>',
    '<h1>foobarba<i>z</i></h1>',
  ]
  const result = input.map((str) => tocObj(str))

  result.forEach((str) => t.is(str[0].text, 'foobarbaz'))
})

test('unnumbered headings', (t) => {
  const input = [
    '<h1 id="title_1" data-toc-unnumbered="true">Title 1</h1>',
    '<h2 data-toc-unnumbered="false" id="title_2">Title 2</h2>',
  ].join('')

  const expected = [
    { text: 'Title 1', id: 'title_1', level: 1, unnumbered: true },
    { text: 'Title 2', id: 'title_2', level: 2 },
  ]

  t.deepEqual(tocObj(input), expected)
})
