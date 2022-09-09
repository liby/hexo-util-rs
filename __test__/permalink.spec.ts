import test from 'ava'

import { Permalink } from '../index'

let permalink: Permalink

test('constructor', (t) => {
  permalink = new Permalink(':year/:month/:day/:title')

  t.is(permalink.rule, ':year/:month/:day/:title')
  t.deepEqual(permalink.regex, /^(.+?)\/(.+?)\/(.+?)\/(.+?)$/)
  t.deepEqual(permalink.params, ['year', 'month', 'day', 'title'])

  permalink = new Permalink(':year_:i_month_:i_day_:title')

  t.is(permalink.rule, ':year_:i_month_:i_day_:title')
  t.deepEqual(permalink.regex, /^(.+?)_(.+?)_(.+?)_(.+?)$/)
  t.deepEqual(permalink.params, ['year', 'i_month', 'i_day', 'title'])

  permalink = new Permalink(':year/:month/:day/:title', {
    segments: {
      year: /(\d{4})/,
      month: /(\d{2})/,
      day: /(\d{2})/,
    },
  })

  t.is(permalink.rule, ':year/:month/:day/:title')
  t.deepEqual(permalink.regex, /^(\d{4})\/(\d{2})\/(\d{2})\/(.+?)$/)
  t.deepEqual(permalink.params, ['year', 'month', 'day', 'title'])
})

test('test()', (t) => {
  t.true(permalink.test('2014/01/31/test'))
  t.false(permalink.test('foweirojwoier'))
})

test('parse()', (t) => {
  t.deepEqual(permalink.parse('2014/01/31/test'), {
    year: '2014',
    month: '01',
    day: '31',
    title: 'test',
  })
})

test('stringify()', (t) => {
  t.is(
    permalink.stringify({
      year: '2014',
      month: '01',
      day: '31',
      title: 'test',
    }),
    '2014/01/31/test',
  )
})

test('rule is required', (t) => {
  // @ts-expect-error
  t.throws(() => new Permalink())
})
