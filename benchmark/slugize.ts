import b from 'benny'
import { slugize as hexoSlugize } from 'hexo-util'

import { slugize } from '../index'

const slugifyFixture =
  'Hell\u00F2 w\u00F2rld. ~Hello World~ Hello. ~`!@#$%^&*()-_+=[]{}|\\:"\' < >,. ? /World. 遊戲. Nín hǎo. Wǒ shì zhōng guó rén. Æúű--cool?'

export async function benchSlugize() {
  await b.suite(
    'slugify and escape diacritic',
    b.add('hexo-util-rs', () => {
      slugize(slugifyFixture)
    }),
    b.add('hexo-util', () => {
      hexoSlugize(slugifyFixture)
    }),

    b.cycle(),
    b.complete(),
  )
}
