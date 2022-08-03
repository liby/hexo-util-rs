import test from 'ava'

import { escapeHtml } from '../index'

test('default', (t) => {
  t.is(
    escapeHtml('<p class="foo">Hello "world".</p>'),
    '&lt;p class=&quot;foo&quot;&gt;Hello &quot;world&quot;.&lt;&#x2F;p&gt;',
  )
})

test('buffer', (t) => {
  t.is(
    escapeHtml(Buffer.from('<p class="foo">Hello "world".</p>')),
    '&lt;p class=&quot;foo&quot;&gt;Hello &quot;world&quot;.&lt;&#x2F;p&gt;',
  )
})

test('avoid double escape', (t) => {
  t.is(escapeHtml('&lt;foo>bar</foo&gt;'), '&lt;foo&gt;bar&lt;&#x2F;foo&gt;')
})

test('arg must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => escapeHtml())
})
