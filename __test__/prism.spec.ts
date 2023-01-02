import test, { PassAssertion } from 'ava'
// @ts-expect-error missing validator definition in html-tag-validator
import validator from 'html-tag-validator'

import { prismHighlight, escapeHtml, stripIndent } from '../index'

function validateHtmlAsync(str: string, done: PassAssertion) {
  validator(
    str,
    {
      attributes: {
        // 'aria-hidden' is used at <span> for line number
        // Even MDN website itself uses 'aria-hidden' at <span> tag
        // So I believe it is ok to whitelist this
        span: { normal: ['aria-hidden'] },
      },
    },
    (err: string, _ast: unknown) => {
      if (err) {
        done(err)
      } else {
        done()
      }
    },
  )
}

const endTag = '</code></pre>'
const lineNumberStartTag = '<span aria-hidden="true" class="line-numbers-rows">'
const highlightToken = '<span class="token '

test('default (plain text)', (t) => {
  const input = `
    {
      "foo": 1,
      "bar": 2
    }`
  const result = prismHighlight(input)

  // Start Tag
  t.true(result.includes('<pre class="line-numbers language-none">'))
  t.true(result.includes('<code class="language-none'))
  // End Tag
  t.true(result.includes(endTag))
  // Line Number
  t.true(result.includes(lineNumberStartTag))
  // Code should only be escaped.
  t.true(result.includes(escapeHtml(stripIndent(input))))
  t.false(result.includes(highlightToken))

  validateHtmlAsync(result, t.pass)
})

test('lineNumber disabled', (t) => {
  const input = `
    {
      "foo": 1,
      "bar": 2
    }`
  const result = prismHighlight(input, { lineNumber: false })

  // Line Number
  t.false(result.includes(lineNumberStartTag))

  validateHtmlAsync(result, t.pass)
})

test('tab - replace \\t', (t) => {
  const input = ['function fib(i){', '\tif (i <= 1) return i;', '\treturn fib(i - 1) + fib(i - 2);', '}'].join('\n')

  // Use language: 'plain-text' for not supported language with Prism
  const result = prismHighlight(input, { tab: '  ', lang: 'plain-text' })

  t.true(result.includes(escapeHtml(input.replace(/\t/g, '  '))))

  validateHtmlAsync(result, t.pass)
})

test('language - javascript (loaded by default)', (t) => {
  const input = `
      const Prism = require('prismjs');
      /**
        * Wrapper of Prism.highlight()
        * @param {String} code
        * @param {String} language
        */
      function prismHighlight(code, language) {
        // Prism has not load the language pattern
        if (!Prism.languages[language]) prismLoadLanguages(language);
        if (Prism.languages[language]) {
            // Prism escapes output by default
            return Prism.highlight(unescapeHTML(code), Prism.languages[language], language);
        }
        // Current language is not supported by Prism, return origin code;
        return escapeHtml(code);
      }`

  const result = prismHighlight(input, { lang: 'js' })

  // Start Tag
  t.true(result.includes('<pre class="line-numbers language-javascript" data-language="javascript">'))
  t.true(result.includes('<code class="language-javascript'))
  // End Tag
  t.true(result.includes(endTag))
  // Line Number
  t.true(result.includes(lineNumberStartTag))
  // Being highlighted
  t.true(result.includes(highlightToken))

  validateHtmlAsync(result, t.pass)
})

test('language - haml (prismjs/components/)', (t) => {
  const input = "= ['hi', 'there', 'reader!'].join \" \""

  const result = prismHighlight(input, { lang: 'haml' })

  // Start Tag
  t.true(result.includes('<pre class="line-numbers language-haml" data-language="haml">'))
  t.true(result.includes('<code class="language-haml'))
  // End Tag
  t.true(result.includes(endTag))
  // Line Number
  t.true(result.includes(lineNumberStartTag))
  // Being highlighted
  t.true(result.includes(highlightToken))

  validateHtmlAsync(result, t.pass)
})

test('language - ts (an alias for typescript)', (t) => {
  const input = 'const a: string = "";'

  const result = prismHighlight(input, { lang: 'ts' })

  // Start Tag
  t.true(result.includes('<pre class="line-numbers language-typescript" data-language="typescript">'))
  t.true(result.includes('<code class="language-typescript'))
  // End Tag
  t.true(result.includes(endTag))
  // Line Number
  t.true(result.includes(lineNumberStartTag))
  // Being highlighted
  t.true(result.includes(highlightToken))

  validateHtmlAsync(result, t.pass)
})

test('language - unsupported by prism', (t) => {
  const input = `
      [ yet another pi calculation program in bf
        Just like for pi16.b the accuracy of the result depends on the cellsize:
         - using  8 bit cells causes an overflow after 4 digits
         - using 16 bit cells causes an overflow after 537 digits
         - using 32 bit cells causes an overflow after several millions of digits
        It's about ~38 times shorter than pi16.b, ~364 times faster and works with
        not-wrapping (bignum) implementations.
        by Felix Nawothnig (felix.nawothnig@t-online.de) ]
      >  +++++ +++++ +++++ (15 digits)
      [<+>>>>>>>>++++++++++<<<<<<<-]>+++++[<+++++++++>-]+>>>>>>+[<<+++[>>[-<]<[>]<-]>>
      [>+>]<[<]>]>[[->>>>+<<<<]>>>+++>-]<[<<<<]<<<<<<<<+[->>>>>>>>>>>>[<+[->>>>+<<<<]>
      >>>>]<<<<[>>>>>[<<<<+>>>>-]<<<<<-[<<++++++++++>>-]>>>[<<[<+<<+>>>-]<[>+<-]<++<<+
      >>>>>>-]<<[-]<<-<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+<<<-[>>+<<-]<]<<<<+>>>>>>>
      >[-]>[<<<+>>>-]<<++++++++++<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+>[<<+<+>>>-]<<<
      <+<+>>[-[-[-[-[-[-[-[-[-<->[-<+<->>]]]]]]]]]]<[+++++[<<<++++++++<++++++++>>>>-]<
      <<<+<->>>>[>+<<<+++++++++<->>>-]<<<<<[>>+<<-]+<[->-<]>[>>.<<<<[+.[-]]>>-]>[>>.<<
      -]>[-]>[-]>>>[>>[<<<<<<<<+>>>>>>>>-]<<-]]>>[-]<<<[-]<<<<<<<<]++++++++++.`

  // prismjs supports brainfuck, so specify a 'brainfuck-foo-bar' to trigger unsupported
  const result = prismHighlight(input, { lang: 'brainfuck-foo-bar' })

  // Start Tag
  t.true(result.includes('<pre class="line-numbers language-brainfuck-foo-bar" data-language="brainfuck-foo-bar">'))
  t.true(result.includes('<code class="language-brainfuck-foo-bar'))
  // End Tag
  t.true(result.includes(endTag))
  // Line Number
  t.true(result.includes(lineNumberStartTag))
  // Code should only be escaped.
  t.true(result.includes(escapeHtml(stripIndent(input))))
  t.false(result.includes(highlightToken))

  validateHtmlAsync(result, t.pass)
})

test('isPreprocess - false', (t) => {
  const input = `
      const Prism = require('prismjs');
      /**
        * Wrapper of Prism.highlight()
        * @param {String} code
        * @param {String} language
        */
      function prismHighlight(code, language) {
        // Prism has not load the language pattern
        if (!Prism.languages[language]) prismLoadLanguages(language);
        if (Prism.languages[language]) {
            // Prism escapes output by default
            return Prism.highlight(unescapeHTML(code), Prism.languages[language], language);
        }
        // Current language is not supported by Prism, return origin code;
        return escapeHtml(code);
      }`

  const result = prismHighlight(input, { lang: 'js', isPreprocess: false })

  // Start Tag
  t.true(result.includes('<pre class="line-numbers language-javascript" data-language="javascript">'))
  t.true(result.includes('<code class="language-javascript'))
  // End Tag
  t.true(result.includes(endTag))
  // Line Number
  t.false(result.includes(lineNumberStartTag))
  // Being highlighted
  t.false(result.includes(highlightToken))

  validateHtmlAsync(result, t.pass)
})

test('mark', (t) => {
  const input = `
      [ yet another pi calculation program in bf
        Just like for pi16.b the accuracy of the result depends on the cellsize:
         - using  8 bit cells causes an overflow after 4 digits
         - using 16 bit cells causes an overflow after 537 digits
         - using 32 bit cells causes an overflow after several millions of digits
        It's about ~38 times shorter than pi16.b, ~364 times faster and works with
        not-wrapping (bignum) implementations.
        by Felix Nawothnig (felix.nawothnig@t-online.de) ]
      >  +++++ +++++ +++++ (15 digits)
      [<+>>>>>>>>++++++++++<<<<<<<-]>+++++[<+++++++++>-]+>>>>>>+[<<+++[>>[-<]<[>]<-]>>
      [>+>]<[<]>]>[[->>>>+<<<<]>>>+++>-]<[<<<<]<<<<<<<<+[->>>>>>>>>>>>[<+[->>>>+<<<<]>
      >>>>]<<<<[>>>>>[<<<<+>>>>-]<<<<<-[<<++++++++++>>-]>>>[<<[<+<<+>>>-]<[>+<-]<++<<+
      >>>>>>-]<<[-]<<-<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+<<<-[>>+<<-]<]<<<<+>>>>>>>
      >[-]>[<<<+>>>-]<<++++++++++<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+>[<<+<+>>>-]<<<
      <+<+>>[-[-[-[-[-[-[-[-[-<->[-<+<->>]]]]]]]]]]<[+++++[<<<++++++++<++++++++>>>>-]<
      <<<+<->>>>[>+<<<+++++++++<->>>-]<<<<<[>>+<<-]+<[->-<]>[>>.<<<<[+.[-]]>>-]>[>>.<<
      -]>[-]>[-]>>>[>>[<<<<<<<<+>>>>>>>>-]<<-]]>>[-]<<<[-]<<<<<<<<]++++++++++.`

  // isPreprocess - true (mark should be disabled)
  const result1 = prismHighlight(input, { lang: 'brainfuck', isPreprocess: true, mark: '1,3-6,10' })
  // Start Tag
  t.true(result1.includes('<pre class="line-numbers language-brainfuck" data-language="brainfuck">'))

  // isPreprocess - false
  const result2 = prismHighlight(input, { lang: 'brainfuck', isPreprocess: false, mark: '1,3-6,10' })
  // Start Tag
  t.true(
    result2.includes('<pre class="line-numbers language-brainfuck" data-language="brainfuck" data-line="1,3-6,10">'),
  )

  // Only validate the result2
  validateHtmlAsync(result2, t.pass)
})

test('firstLine', (t) => {
  const input = ['function fib(i){', '  if (i <= 1) return i;', '  return fib(i - 1) + fib(i - 2);', '}'].join('\n')

  const result1 = prismHighlight(input, { lang: 'js', isPreprocess: false, lineNumber: true, firstLine: -5 })
  t.true(result1.includes('<pre class="line-numbers language-javascript" data-language="javascript" data-start="-5">'))

  // isPreprocess - true (firstLine should be disabled)
  const result2 = prismHighlight(input, { lang: 'js', isPreprocess: true, lineNumber: true, firstLine: -5 })
  t.true(result2.includes('<pre class="line-numbers language-javascript" data-language="javascript">'))

  // lineNumber - false (firstLine should be disabled)
  const result3 = prismHighlight(input, { lang: 'js', isPreprocess: false, lineNumber: false, firstLine: -5 })
  t.true(result3.includes('<pre class="language-javascript" data-language="javascript">'))

  // Only validate the result1
  validateHtmlAsync(result1, t.pass)
})

test('offset - mark & firstLine', (t) => {
  const input = `
      [ yet another pi calculation program in bf
        Just like for pi16.b the accuracy of the result depends on the cellsize:
         - using  8 bit cells causes an overflow after 4 digits
         - using 16 bit cells causes an overflow after 537 digits
         - using 32 bit cells causes an overflow after several millions of digits
        It's about ~38 times shorter than pi16.b, ~364 times faster and works with
        not-wrapping (bignum) implementations.
        by Felix Nawothnig (felix.nawothnig@t-online.de) ]
      >  +++++ +++++ +++++ (15 digits)
      [<+>>>>>>>>++++++++++<<<<<<<-]>+++++[<+++++++++>-]+>>>>>>+[<<+++[>>[-<]<[>]<-]>>
      [>+>]<[<]>]>[[->>>>+<<<<]>>>+++>-]<[<<<<]<<<<<<<<+[->>>>>>>>>>>>[<+[->>>>+<<<<]>
      >>>>]<<<<[>>>>>[<<<<+>>>>-]<<<<<-[<<++++++++++>>-]>>>[<<[<+<<+>>>-]<[>+<-]<++<<+
      >>>>>>-]<<[-]<<-<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+<<<-[>>+<<-]<]<<<<+>>>>>>>
      >[-]>[<<<+>>>-]<<++++++++++<[->>+<-[>>>]>[[<+>-]>+>>]<<<<<]>[-]>+>[<<+<+>>>-]<<<
      <+<+>>[-[-[-[-[-[-[-[-[-<->[-<+<->>]]]]]]]]]]<[+++++[<<<++++++++<++++++++>>>>-]<
      <<<+<->>>>[>+<<<+++++++++<->>>-]<<<<<[>>+<<-]+<[->-<]>[>>.<<<<[+.[-]]>>-]>[>>.<<
      -]>[-]>[-]>>>[>>[<<<<<<<<+>>>>>>>>-]<<-]]>>[-]<<<[-]<<<<<<<<]++++++++++.`

  // isPreprocess - true (mark should be disabled)
  const result1 = prismHighlight(input, { lang: 'brainfuck', isPreprocess: true, mark: '1,3-6,10', firstLine: -5 })
  // Start Tag
  t.true(result1.includes('<pre class="line-numbers language-brainfuck" data-language="brainfuck">'))

  // isPreprocess - false
  const result2 = prismHighlight(input, { lang: 'brainfuck', isPreprocess: false, mark: '1,3-6,10', firstLine: -5 })
  // Start Tag
  t.true(
    result2.includes(
      '<pre class="line-numbers language-brainfuck" data-language="brainfuck" data-start="-5" data-line="1,3-6,10" data-line-offset="-6">',
    ),
  )

  // Only validate the result2
  validateHtmlAsync(result2, t.pass)
})

test('caption', (t) => {
  const input = `
    {
      "foo": 1,
      "bar": 2
    }`
  const caption = 'foo'
  const result = prismHighlight(input, { caption })

  t.true(result.includes('<div class="caption">' + caption + '</div>'))

  validateHtmlAsync(result, t.pass)
})

test('str must be a string', (t) => {
  // @ts-expect-error
  t.throws(() => prismHighlight())
})
