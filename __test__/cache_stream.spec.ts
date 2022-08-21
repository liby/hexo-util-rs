import { Readable } from 'stream'

import test from 'ava'

import { CacheStream } from '../index'

test('default', (t) => {
  const src = new Readable()
  const cacheStream = new CacheStream()
  const content = Buffer.from('test')

  src.push(content)
  src.push(null)
  src.pipe(cacheStream)

  const somePromise = new Promise((resolve) =>
    cacheStream.on('finish', () => {
      return resolve(cacheStream.getCache())
    }),
  )

  return somePromise.then((result) => {
    t.deepEqual(result, content)
  })
})
