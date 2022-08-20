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

export class Cache {
  private readonly cache: Map<string, any>

  set(id: string, value: any): Map<string, any>

  has(id: string): boolean

  get(id: string): any

  del(id: string): boolean

  apply(id: string, value: any): any

  flush(): void

  size(): number

  dump(): { [p: string]: any }
}
