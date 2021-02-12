import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'

/**
 * Char
 */

interface CharBrand {
  readonly Char: unique symbol
}

export type Char = string & CharBrand

export const isChar = (s: string): s is Char => s.length === 1

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Char = pipe(D.string, D.refine(isChar, 'Char'))

export const fromCharArray = (chars: Array<Char>): string => chars.join(empty)

export const toCharArray = (str: string): Array<Char> => pipe(str.split(empty), A.filter(isChar))

export const whiteSpace = ' '

/**
 * NonEmptyString
 */

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol
}

export type NonEmptyString = string & NonEmptyStringBrand

export const isNonEmptyString = (s: string): s is NonEmptyString => s.length > 0

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NonEmptyString = pipe(D.string, D.refine(isNonEmptyString, 'NonEmptyString'))

/**
 * String
 */

export const empty = ''

export const isEmpty = (a: string): boolean => a === empty

export const cons = (a: string) => (b: string): string => b.concat(a)

export const snoc = (a: string) => (b: string): string => a.concat(b)

export const join = (sep: string) => (chunks: Array<string>): string => chunks.join(sep)

export const length = (str: string): number => str.length

export const slice = (start?: number, end?: number) => (str: string) => str.slice(start, end)

export const split = (sep: string) => (str: string): Array<string> => str.split(sep)

export const trim = (str: string): string => str.trim()
