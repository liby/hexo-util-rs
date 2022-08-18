export * from './utils'

export function wordWrap(
  str: string,
  options?: {
    width: number
  },
): string

export function relativeUrl(from?: string, to?: string): string

export function prettyUrls(
  url: string,
  options?: {
    trailing_index?: boolean
    trailing_html?: boolean
  },
): string

export function truncate(
  url: string,
  options?: {
    length?: number
    omission?: string
    separator?: string
  },
): string
