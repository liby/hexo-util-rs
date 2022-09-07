import { createHash } from 'crypto'

import test from 'ava'

import { hash, createSha1Hash } from '../index'

function sha1(content: any): Buffer | string {
  const hash = createHash('sha1')
  hash.update(content)

  return hash.digest()
}

test('hash', (t) => {
  const content = '123456'
  t.deepEqual(hash(content), sha1(content))
})

test('createSha1Hash', (t) => {
  const _sha1 = createSha1Hash()
  const content = '123456'
  _sha1.update(content)
  t.deepEqual(_sha1.digest(), sha1(content) as Buffer)
})

test('createSha1Hash - streamMode', (t) => {
  const content1 = '123456'
  const content2 = '654321'
  const stream = createSha1Hash()
  // explictest convert
  stream.write(Buffer.from(content1))
  // implictest convert
  stream.write(content2)
  stream.end()
  t.deepEqual(stream.read(), sha1(content1 + content2))
})
