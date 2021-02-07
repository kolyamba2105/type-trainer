import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'

interface CharBrand {
  readonly Char: unique symbol
}

export type Char = string & CharBrand

export const isChar = (s: string): s is Char => s.length === 1

export const empty = ''

export const cons = (a: string) => (b: string): string => b.concat(a)

export const snoc = (a: string) => (b: string): string => a.concat(b)

export const fromCharArray = (chars: Array<Char>): string => chars.join(empty)

export const join = (sep: string) => (chunks: Array<string>): string => chunks.join(sep)

export const length = (str: string): number => str.length

export const slice = (start?: number, end?: number) => (str: string) => str.slice(start, end)

export const split = (sep: string) => (str: string): Array<string> => str.split(sep)

export const toCharArray = (str: string): Array<Char> => pipe(str.split(empty), A.filter(isChar))
