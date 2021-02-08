import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import { constNull, flow, pipe } from 'fp-ts/function'
import * as G from 'io-ts/Guard'
import * as S from './String'

export const className: (classNames: Array<string | null | undefined>) => string = flow(
  A.filter(G.string.is),
  S.join(' '),
)

export const fromNullableProp = <Prop, Style>(styleFromProp: (prop: Prop) => Style) => (
  prop?: Prop,
): Style | null => pipe(O.fromNullable(prop), O.fold(constNull, styleFromProp))
