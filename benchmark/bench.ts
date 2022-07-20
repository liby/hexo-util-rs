// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error missing Cache definition in @types/hexo-util
import { Cache } from 'hexo-util'

import { benchIsExternalLink } from './is_external_link'
import { benchSlugize } from './slugize'
import { benchStripTags } from './strip_html'

// For fairness, caching in both implementations is not used.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error missing Cache definition in @types/hexo-util
Cache.prototype.apply = (_, val) => val()

benchStripTags()
  .then(() => benchSlugize())
  .then(() => benchIsExternalLink())
  .catch((e) => {
    console.error(e)
  })
