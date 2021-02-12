import texts from 'assets/texts.json'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as D from 'io-ts/Decoder'
import * as S from 'lib/String'

const Texts = D.array(S.NonEmptyString)

export const textMaxIndex = texts.length - 1

export const getTextFromFile = (index: number): O.Option<S.NonEmptyString> =>
  pipe(Texts.decode(texts), O.fromEither, O.chain(A.lookup(index)))
