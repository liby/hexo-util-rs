import test from 'ava'

import { unescapeHtml } from '../index'

test('default', (t) => {
  t.is(
    unescapeHtml('&lt;p class&#x3D;&quot;foo&quot;&gt;Hello &quot;world&quot;.&lt;&#x2F;p&gt;'),
    '<p class="foo">Hello "world".</p>',
  )
})

test('buffer', (t) => {
  t.is(
    unescapeHtml(Buffer.from('&lt;p class&#x3D;&quot;foo&quot;&gt;Hello &quot;world&quot;.&lt;&#x2F;p&gt;')),
    '<p class="foo">Hello "world".</p>',
  )
})

test('arg must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => escapeDiacritic())
})
