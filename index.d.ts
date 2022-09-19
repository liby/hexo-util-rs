import { Hash } from 'crypto'
import { Transform, TransformCallback } from 'stream'

export * from './utils'

export class Cache {
  private readonly cache: Map<string, unknown>

  set(id: string, value: any): Map<string, unknown>

  has(id: string): boolean

  get(id: string): any

  del(id: string): boolean

  apply(id: string, value: unknown): unknown

  flush(): void

  size(): number

  dump(): { [p: string]: unknown }
}

export class CacheStream extends Transform {
  _transform(
    chunk: Buffer | WithImplicitCoercion<string> | { [Symbol.toPrimitive]: (hint: 'string') => string },
    enc: BufferEncoding,
    callback: TransformCallback,
  ): void

  getCache(): Buffer
}

export class Color {
  constructor(color: string | { r: number; g: number; b: number; a: number })

  _parse(color: string): void

  toString(): `#${number}${number}${number}` | `rgba(${number}, ${number}, ${number}, ${number})`

  mix(color: this | string | { r: number; g: number; b: number; a: number }, ratio: number): this
}

export function camelCaseKeys(obj: Record<string, unknown>): Record<string, unknown>

export function createSha1Hash(): Hash

export function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown>

export function fullUrlFor(path?: string): string

export function gravatar(email: string, options?: number | Record<string, number | string>): string

export function hash(content: unknown): Buffer | string

export function highlight(
  str: string,
  options?: {
    autoDetect?: boolean
    caption?: string
    firstLine?: number
    gutter?: boolean
    hljs?: boolean
    lang?: string
    languageAttr?: boolean
    mark?: string | number[]
    tab?: string
    wrap?: boolean
  },
): string

export function htmlTag(tag: string, attrs?: Record<string, unknown>, text?: string, escape?: boolean): string

export class Pattern {
  constructor(rule: Pattern | RegExp | ((input: any) => any) | string)

  test(str: string): boolean

  match(str: string): Record<string | number, string | undefined> | RegExpMatchArray
}

export class Permalink {
  rule: string
  regex: RegExp
  params: string[]

  constructor(
    rule: string,
    options?: {
      segments: [{ text: string; type: string }] | unknown
    },
  )

  test(str: string): boolean

  parse(str: string): undefined | any

  stringify(data: unknown): string
}

export function prettyUrls(
  url: string,
  options?: {
    trailing_index?: boolean
    trailing_html?: boolean
  },
): string

export function prismHighlight(
  str: string,
  options?: {
    lineNumber?: boolean
    lang?: string
    tab?: string
    mark?: string
    firstLine?: string
    isPreprocess?: boolean
    caption?: string
  },
): string

export function relativeUrl(from?: string, to?: string): string

export function spawn(
  command: string,
  args?: string | string[] | Record<string, unknown>,
  options?: Record<string, unknown> & {
    verbose?: boolean
  },
): Promise<any>

export function stripIndent(string: string): string

export function tocObj(
  str: string,
  options?: {
    min_depth?: number
    max_depth?: number
  },
): { text: string; id: string; level: number; unnumbered?: boolean }[]

export function truncate(
  url: string,
  options?: {
    length?: number
    omission?: string
    separator?: string
  },
): string

export function urlFor(
  path?: string,
  options?: {
    relative?: boolean
  },
): string

export function wordWrap(
  str: string,
  options?: {
    width: number
  },
): string
