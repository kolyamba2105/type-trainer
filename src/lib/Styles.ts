import * as A from 'fp-ts/Array'
import { flow } from 'fp-ts/function'
import * as G from 'io-ts/Guard'
import * as S from './String'

export const className: (classes: Array<string | null | undefined>) => string = flow(
  A.filter(G.string.is),
  S.join(' '),
)

export const fromNullableProp = <Prop, Style>(styleFromProp: (prop: Prop) => Style) => (
  prop?: Prop,
): Style | null => (prop ? styleFromProp(prop) : null)
