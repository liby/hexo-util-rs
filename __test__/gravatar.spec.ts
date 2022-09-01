import { createHash } from 'crypto'

import test from 'ava'

import { gravatar } from '../index'

function md5(str: string) {
  return createHash('md5').update(str).digest('hex')
}

const email = 'abc@abc.com'
const hash = md5(email)

test('default', (t) => {
  t.is(gravatar(email), 'https://www.gravatar.com/avatar/' + hash)
})

test('size', (t) => {
  t.is(gravatar(email, 100), 'https://www.gravatar.com/avatar/' + hash + '?s=100')
})

test('options', (t) => {
  t.is(
    gravatar(email, {
      s: 200,
      r: 'pg',
      d: 'mm',
    }),
    'https://www.gravatar.com/avatar/' + hash + '?s=200&r=pg&d=mm',
  )
})
