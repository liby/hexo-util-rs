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

export function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown>

export function prettyUrls(
  url: string,
  options?: {
    trailing_index?: boolean
    trailing_html?: boolean
  },
): string

export function relativeUrl(from?: string, to?: string): string

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

export function wordWrap(
  str: string,
  options?: {
    width: number
  },
): string
