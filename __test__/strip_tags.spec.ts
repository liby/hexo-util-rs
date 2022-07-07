import test from 'ava'

import { stripTags } from '../index'

test('should not strip invalid tags', (t) => {
  const text = 'lorem ipsum < a> < div>'
  t.is(stripTags(text), text)
})

test('should remove simple HTML tags', (t) => {
  const html = '<a href="">lorem <strong>ipsum</strong></a>'
  const text = 'lorem ipsum'

  t.is(stripTags(html), text)
})

test('should remove comments', (t) => {
  const html = '<!-- lorem -- ipsum -- --> dolor sit amet'
  const text = ' dolor sit amet'

  t.is(stripTags(html), text)
})

test('should strip tags wtesthin comments', (t) => {
  const html = '<!-- <strong>lorem ipsum</strong> --> dolor sit'
  const text = ' dolor sit'

  t.is(stripTags(html), text)
})

test('should not fail with nested quotes', (t) => {
  const html = '<article attr="foo \'bar\'">lorem</article> ipsum'
  const text = 'lorem ipsum'

  t.is(stripTags(html), text)
})

test('should strip extra < within tags', (t) => {
  const html = '<div<>>lorem ipsum</div>'
  const text = 'lorem ipsum'

  t.is(stripTags(html), text)
})

test('should strip <> within quotes', (t) => {
  const html = '<a href="<script>">lorem ipsum</a>'
  const text = 'lorem ipsum'

  t.is(stripTags(html), text)
})

test('should strip non string parameters', (t) => {
  const html = ['X']
  // @ts-expect-error
  t.throws(() => stripTags(html))
})
