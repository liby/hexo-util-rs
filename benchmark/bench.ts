// @ts-expect-error missing Cache definition in @types/hexo-util
import { Cache } from 'hexo-util'

import { benchDecodeUrl } from './decode_url'
import { benchEncodeUrl } from './encode_url'
import { benchEscapeDiacritic } from './escape_diacritic'
import { benchIsExternalLink } from './is_external_link'
import { benchSlugize } from './slugize'
import { benchStripTags } from './strip_html'

// For fairness, caching in both implementations is not used.
// @ts-expect-error missing Cache definition in @types/hexo-util
Cache.prototype.apply = (_, val) => val()

benchStripTags()
  .then(benchSlugize)
  .then(benchIsExternalLink)
  .then(benchEncodeUrl)
  .then(benchDecodeUrl)
  .then(benchEscapeDiacritic)
  .catch((e) => {
    console.error(e)
  })
