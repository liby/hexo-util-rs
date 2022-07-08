import { benchSlugize } from './slugize'
import { benchStripTags } from './strip_html'

benchStripTags().catch((e) => {
  console.error(e)
})

benchSlugize().catch((e) => {
  console.error(e)
})
