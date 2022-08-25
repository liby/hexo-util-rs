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
    { text: 'Title should escape &amp;, &#39;, &lt; and &quot;', id: 'title_3', level: 1 },
    { text: 'Chapter 1 should be printed to toc', id: 'title_4', level: 1 },
  ]

  t.is(tocObj(html), expected)
})
//
// test('options - min_depth', (t) => {
//   const expected = [
//     { text: 'Title 1.1', id: 'title_1_1', level: 2 },
//     { text: 'Title 1.1.1', id: 'title_1_1_1', level: 3 },
//     { text: 'Title 1.2', id: 'title_1_2', level: 2 },
//     { text: 'Title 1.3', id: 'title_1_3', level: 2 },
//     { text: 'Title 1.3.1', id: 'title_1_3_1', level: 3 },
//     { text: 'Title 2.1', id: 'title_2_1', level: 2 },
//   ]
//
//   t.is(tocObj(html, { min_depth: 2 }), expected)
// })
//
// test('options - max_depth', (t) => {
//   const expected = [
//     { text: 'Title 1', id: 'title_1', level: 1 },
//     { text: 'Title 1.1', id: 'title_1_1', level: 2 },
//     { text: 'Title 1.2', id: 'title_1_2', level: 2 },
//     { text: 'Title 1.3', id: 'title_1_3', level: 2 },
//     { text: 'Title 2', id: 'title_2', level: 1 },
//     { text: 'Title 2.1', id: 'title_2_1', level: 2 },
//     { text: 'Title should escape &amp;, &#39;, &lt; and &quot;', id: 'title_3', level: 1 },
//     { text: 'Chapter 1 should be printed to toc', id: 'title_4', level: 1 },
//   ]
//
//   t.is(tocObj(html, { max_depth: 2 }), expected)
// })
