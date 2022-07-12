import { benchSlugize } from './slugize'
import { benchStripTags } from './strip_html'

benchStripTags()
  .then(() => benchSlugize())
  .catch((e) => {
    console.error(e)
  })
