import * as E from 'fp-ts/Either'
import { flow, Lazy, pipe } from 'fp-ts/function'
import * as NEA from 'fp-ts/NonEmptyArray'

export const applicativeValidation = E.getValidation(NEA.getSemigroup<ValidationError>())

/**
 * ValidationError
 */

const toError = (name: string, message: string): Error => ({ name, message })

export class ValidationError extends Error {
  name = 'ValidationError'

  static create(message: string): ValidationError {
    return toError(this.name, message)
  }

  static onFalse(message: string): Lazy<ValidationError> {
    return () => ValidationError.create(message)
  }
}

/**
 * Validator
 */

export type Validator<A> = (a: A) => E.Either<ValidationError, A>

export const minLength = (min: number): Validator<string> =>
  E.fromPredicate(
    str => str.length >= min,
    ValidationError.onFalse(`Value must be at least ${min} chars long!`),
  )

export const maxLength = (max: number): Validator<string> =>
  E.fromPredicate(
    str => str.length <= max,
    ValidationError.onFalse(`Value must be less than ${max} chars long!`),
  )

/**
 * LiftedValidator
 */

export type LiftedValidator<A> = (a: A) => E.Either<NEA.NonEmptyArray<ValidationError>, A>

export const lift = <A>(validator: Validator<A>): LiftedValidator<A> =>
  flow(validator, E.mapLeft(NEA.of))

export const combine = <A>(validators: NEA.NonEmptyArray<Validator<A>>): LiftedValidator<A> => (
  a: A,
) =>
  pipe(
    validators,
    NEA.map(validator => pipe(a, lift(validator))),
    NEA.sequence(applicativeValidation),
    E.map(() => a),
  )
