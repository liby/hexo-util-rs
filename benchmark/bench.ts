import { benchIsExternalLink } from './is_external_link'
import { benchSlugize } from './slugize'
import { benchStripTags } from './strip_html'

benchStripTags()
  .then(() => benchSlugize())
  .then(() => benchIsExternalLink())
  .catch((e) => {
    console.error(e)
  })
