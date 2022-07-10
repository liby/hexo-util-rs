import { benchStripTags } from './strip_html'

benchStripTags().catch((e) => {
  console.error(e)
})
