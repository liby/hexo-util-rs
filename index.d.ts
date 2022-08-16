/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export function decodeUrl(url: string): string
export function encodeUrl(url: string): string
export function escapeDiacritic(input: string): string
export function escapeHtml(input: Buffer | string): string
export function escapeRegExp(input: string): string
export function isExternalLink(url: string, sitehost: string, exclude?: string | Array<string> | undefined | null): boolean
export function relativeUrl(from: string, to: string): string
export interface Options {
  separator?: string
  transform?: number
}
export function slugize(str: Buffer | string, options?: Options | undefined | null): string
export function stripTags(htmlContent: Buffer | string): string
export function unescapeHtml(input: Buffer | string): string
