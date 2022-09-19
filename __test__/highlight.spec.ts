import test, { PassAssertion } from 'ava'
import hljs from 'highlight.js'
import { encode } from 'html-entities'
// @ts-expect-error missing validator definition in html-tag-validator
import validator from 'html-tag-validator'

import { highlight } from '../index'

const testJson = {
  foo: 1,
  bar: 2,
}

const testString = JSON.stringify(testJson, null, '  ')

const start = '<figure class="highlight plaintext"><table><tr>'
const end = '</tr></table></figure>'

const gutterStart = '<td class="gutter"><pre>'
const gutterEnd = '</pre></td>'

const codeStart = '<td class="code"><pre>'
const codeEnd = '</pre></td>'

function gutter(start: number, end: number) {
  let result = gutterStart

  for (let i = start; i <= end; i++) {
    result += `<span class="line">${i}</span><br>`
  }

  result += gutterEnd

  return result
}

function code(str: string, lang?: string | null) {
  let data

  if (lang) {
    data = hljs.highlight(str, {
      language: lang.toLowerCase(),
    })
  } else if (lang === null) {
    data = { value: str }
  } else {
    data = { value: encode(str) }
  }

  const lines = data.value.split('\n')

  return (
    lines.reduce((prev, current) => {
      return `${prev}<span class="line">${current}</span><br>`
    }, codeStart) + codeEnd
  )
}

function assertResult(...args: string[]) {
  return start + args.join('') + end
}

function validateHtmlAsync(str: string, done: PassAssertion) {
  validator(str, (err: string, _ast: unknown) => {
    if (err) {
      done(err)
    } else {
      done()
    }
  })
}

test('default', (t) => {
  const result = highlight(testString)
  t.is(result, assertResult(gutter(1, 4), code(testString)))
  validateHtmlAsync(result, t.pass)
})

test('gutter: false', (t) => {
  const result = highlight(testString, { gutter: false })
  t.is(result, assertResult(code(testString)))
  validateHtmlAsync(result, t.pass)
})

test('gutter: true, but "wrap: false" (conflict)', (t) => {
  const result = highlight(testString, { gutter: true, wrap: false })
  t.is(result, assertResult(gutter(1, 4), code(testString)))
  validateHtmlAsync(result, t.pass)
})

test('wrap: false (without hljs, without lang)', (t) => {
  const result = highlight(testString, { gutter: false, wrap: false })
  t.is(result, ['<pre><code class="highlight plaintext">', encode(testString), '</code></pre>'].join(''))
  validateHtmlAsync(result, t.pass)
})

test('wrap: false (with hljs, without lang)', (t) => {
  const result = highlight(testString, { gutter: false, wrap: false, hljs: true })
  t.is(result, ['<pre><code class="hljs plaintext">', encode(testString), '</code></pre>'].join(''))
  validateHtmlAsync(result, t.pass)
})

test('wrap: false (without hljs, with lang)', (t) => {
  const result = highlight(testString, { gutter: false, wrap: false, lang: 'json' })
  hljs.configure({ classPrefix: '' })
  t.is(
    result,
    [
      '<pre><code class="highlight json">',
      hljs.highlight(testString, {
        language: 'json',
      }).value,
      '</code></pre>',
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('wrap: false (with hljs, with lang)', (t) => {
  const result = highlight(testString, { gutter: false, wrap: false, hljs: true, lang: 'json' })
  hljs.configure({ classPrefix: 'hljs-' })
  t.is(
    result,
    [
      '<pre><code class="hljs json">',
      hljs.highlight(testString, {
        language: 'json',
      }).value,
      '</code></pre>',
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('wrap: false (with mark)', (t) => {
  const result = highlight(testString, { gutter: false, wrap: false, hljs: true, lang: 'json', mark: '1' })
  hljs.configure({ classPrefix: 'hljs-' })
  t.is(
    result,
    [
      '<pre><code class="hljs json">',
      hljs
        .highlight(testString, {
          language: 'json',
        })
        .value.replace(
          '<span class="hljs-punctuation">{</span>',
          '<mark><span class="hljs-punctuation">{</span></mark>',
        ),
      '</code></pre>',
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('wrap: false (retain trailing newline)', (t) => {
  const result = highlight(testString + '\n', { gutter: false, wrap: false, hljs: true, lang: 'json' })
  hljs.configure({ classPrefix: 'hljs-' })
  t.is(
    result,
    [
      '<pre><code class="hljs json">',
      hljs.highlight(testString, {
        language: 'json',
      }).value,
      '\n</code></pre>',
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('firstLine', (t) => {
  const result = highlight(testString, { firstLine: 3 })
  t.is(result, assertResult(gutter(3, 6), code(testString)))
  validateHtmlAsync(result, t.pass)
})

test('lang = json', (t) => {
  const result = highlight(testString, { lang: 'json' })

  t.is(result, ['<figure class="highlight json"><table><tr>', gutter(1, 4), code(testString, 'json'), end].join(''))
  validateHtmlAsync(result, t.pass)
})

test('auto detect', (t) => {
  const result = highlight(testString, { autoDetect: true })

  t.is(result, ['<figure class="highlight json"><table><tr>', gutter(1, 4), code(testString, 'json'), end].join(''))
  validateHtmlAsync(result, t.pass)
})

test("don't highlight if language not found", (t) => {
  const result = highlight('test', { lang: 'jrowiejrowi' })
  t.is(result, assertResult(gutter(1, 1), code('test')))
  validateHtmlAsync(result, t.pass)
})

test('caption', (t) => {
  const caption = 'hello world'
  const result = highlight(testString, {
    caption,
  })

  t.is(
    result,
    [
      `<figure class="highlight plaintext"><figcaption>${caption}</figcaption><table><tr>`,
      gutter(1, 4),
      code(testString),
      end,
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('caption (wrap: false)', (t) => {
  const caption = 'hello world'
  const result = highlight(testString, {
    gutter: false,
    wrap: false,
    caption,
  })

  t.is(
    result,
    [
      '<pre>',
      `<div class="caption">${caption}</div>`,
      '<code class="highlight plaintext">',
      encode(testString),
      '</code></pre>',
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('tab', (t) => {
  const spaces = '  '
  const str = ['function fib(i){', '\tif (i <= 1) return i;', '\treturn fib(i - 1) + fib(i - 2);', '}'].join('\n')

  const result = highlight(str, { tab: spaces, lang: 'js' })

  t.is(
    result,
    ['<figure class="highlight js"><table><tr>', gutter(1, 4), code(str.replace(/\t/g, spaces), 'js'), end].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('tab with wrap:false', (t) => {
  const spaces = '  '
  const result = highlight('\t' + testString, { gutter: false, wrap: false, hljs: true, lang: 'json', tab: spaces })
  hljs.configure({ classPrefix: 'hljs-' })
  t.is(
    result,
    [
      '<pre><code class="hljs json">',
      spaces,
      hljs.highlight(testString, {
        language: 'json',
      }).value,
      '</code></pre>',
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('escape html entity', (t) => {
  const str = ['deploy:', '  type: git', '  repo: <repository url>', '  branch: [branch]', '  message: [message]'].join(
    '\n',
  )

  const result = highlight(str)
  t.true(result.includes('&lt;repository url&gt;'))
  validateHtmlAsync(result, t.pass)
})

test('highlight sublanguages', (t) => {
  const str = '<node><?php echo "foo"; ?></node>'
  const result = highlight(str, { autoDetect: true })
  t.is(
    result,
    [
      '<figure class="highlight php-template"><table><tr>',
      gutter(1, 1),
      code(
        '<span class="language-xml"><span class="tag">&lt;<span class="name">node</span>&gt;</span></span><span class="language-php"><span class="meta">&lt;?php</span> <span class="keyword">echo</span> <span class="string">&quot;foo&quot;</span>; <span class="meta">?&gt;</span></span><span class="language-xml"><span class="tag">&lt;/<span class="name">node</span>&gt;</span></span>',
        null,
      ),
      end,
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

// https://github.com/hexojs/hexo/issues/4726
test('highlight sublanguages with tab', (t) => {
  const spaces = '  '
  const str = '<script>\n\tfunction a() {\n\t\treturn;\n\t}\n</script>'
  const result = highlight(str, { tab: spaces, autoDetect: true })
  t.false(result.includes('\t'))
  validateHtmlAsync(result, t.pass)
})

test('parse multi-line strings correctly', (t) => {
  const str = ['var string = `', '  Multi', '  line', '  string', '`'].join('\n')

  const result = highlight(str, { lang: 'js' })
  t.is(
    result,
    [
      '<figure class="highlight js"><table><tr>',
      gutter(1, 5),
      code(
        '<span class="keyword">var</span> string = <span class="string">`</span>\n<span class="string">  Multi</span>\n<span class="string">  line</span>\n<span class="string">  string</span>\n<span class="string">`</span>',
        null,
      ),
      end,
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('parse multi-line strings including empty line', (t) => {
  const str = ['var string = `', '  Multi', '', '  string', '`'].join('\n')

  const result = highlight(str, { lang: 'js' })
  t.is(
    result,
    [
      '<figure class="highlight js"><table><tr>',
      gutter(1, 5),
      code(
        '<span class="keyword">var</span> string = <span class="string">`</span>\n<span class="string">  Multi</span>\n<span class="string"></span>\n<span class="string">  string</span>\n<span class="string">`</span>',
        null,
      ),
      end,
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('auto detect of multi-line statement', (t) => {
  const str = ['"use strict";', 'var string = `', '  Multi', '', '  string', '`'].join('\n')

  const result = highlight(str, { autoDetect: true })
  t.is(
    result,
    [
      '<figure class="highlight typescript"><table><tr>',
      gutter(1, 6),
      code(
        '<span class="meta">&quot;use strict&quot;</span>;</span><br><span class="line"><span class="keyword">var</span> <span class="built_in">string</span> = <span class="string">`</span></span><br><span class="line"><span class="string">  Multi</span></span><br><span class="line"><span class="string"></span></span><br><span class="line"><span class="string">  string</span></span><br><span class="line"><span class="string">`</span>',
        null,
      ),
      end,
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('gives the highlight class to marked lines', (t) => {
  const str = ['roses are red', 'violets are blue', 'sugar is sweet', 'and so are you'].join('\n')

  const result = highlight(str, { mark: [1, 3, 5] })

  t.true(result.includes('class="line marked">roses'))
  t.true(result.includes('class="line">violets'))
  t.true(result.includes('class="line marked">sugar'))
  t.true(result.includes('class="line">and'))
  validateHtmlAsync(result, t.pass)
})

test('hljs compatibility - with lines', (t) => {
  const str = ['function (a) {', '    if (a > 3)', '        return true;', '    return false;', '}'].join('\n')
  const result = highlight(str, { hljs: true, lang: 'javascript' })
  t.true(result.includes(gutterStart))
  t.true(result.includes(codeStart))
  t.true(result.includes('code class="hljs javascript"'))
  t.true(result.includes('class="hljs-keyword"'))
  t.true(result.includes(gutter(1, 5)))
  validateHtmlAsync(result, t.pass)
})

test('hljs compatibility - no lines', (t) => {
  const str = ['function (a) {', '    if (a > 3)', '        return true;', '    return false;', '}'].join('\n')
  const result = highlight(str, { hljs: true, gutter: false, wrap: false, lang: 'javascript' })
  t.false(result.includes(gutterStart))
  t.false(result.includes(codeStart))
  t.true(result.includes('code class="hljs javascript"'))
  t.true(result.includes('class="hljs-keyword"'))
  validateHtmlAsync(result, t.pass)
})

test('hljs compatibility - wrap is true', (t) => {
  const str = ['function (a) {', '    if (a > 3)', '        return true;', '    return false;', '}'].join('\n')
  const result = highlight(str, { hljs: true, gutter: false, wrap: true, lang: 'javascript' })
  t.false(result.includes(gutterStart))
  t.true(result.includes(codeStart))
  t.true(result.includes('code class="hljs javascript"'))
  t.true(result.includes('class="hljs-keyword"'))
  validateHtmlAsync(result, t.pass)
})

test('languageAttr: true', (t) => {
  const str = ['var string = `', '  Multi', '  line', '  string', '`'].join('\n')

  const result = highlight(str, { languageAttr: true, lang: 'js' })
  t.is(
    result,
    [
      '<figure class="highlight js" data-language="js"><table><tr>',
      gutter(1, 5),
      code(
        '<span class="keyword">var</span> string = <span class="string">`</span>\n<span class="string">  Multi</span>\n<span class="string">  line</span>\n<span class="string">  string</span>\n<span class="string">`</span>',
        null,
      ),
      end,
    ].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('languageAttr: true (wrap: false)', (t) => {
  const result = highlight(testString, { gutter: false, wrap: false, languageAttr: true })
  t.is(
    result,
    ['<pre><code class="highlight plaintext" data-language="plaintext">', encode(testString), '</code></pre>'].join(''),
  )
  validateHtmlAsync(result, t.pass)
})

test('str must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => highlight())
})
