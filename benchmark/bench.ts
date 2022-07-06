import b from 'benny'

import { stripTags } from '../index'

function hexoUtilStriptags(html: string) {
  // Todo: implement
  // eslint-disable-next-line no-console
  console.log(html)
}

async function run() {
  await b.suite(
    'faster than hexo-util-strip-tags',

    b.add('RiiR', () => {
      stripTags('lorem ipsum < a> < div>')
    }),

    b.add('Hexo util', () => {
      hexoUtilStriptags('lorem ipsum < a> < div>')
    }),

    b.cycle(),
    b.complete(),
  )
}

run().catch((e) => {
  console.error(e)
})
