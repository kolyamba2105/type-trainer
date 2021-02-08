import { Card, CardBody, CardHeader } from 'App/components'
import * as A from 'fp-ts/Array'
import { eqNumber } from 'fp-ts/Eq'
import { constFalse, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as S from 'lib/String'
import { className } from 'lib/Styles'
import React from 'react'
import { Stats } from './Stats'
import './Trainer.scss'

type TrainerProps = {
  text: string
}

export const Trainer: React.FC<TrainerProps> = ({ text }) => {
  const [currentErrorIndex, setCurrentErrorIndex] = React.useState<O.Option<number>>(O.none)
  const [errorIndexes, setErrorIndexes] = React.useState<Array<number>>(A.empty)
  const [startedTyping, setStartedTyping] = React.useState<O.Option<Date>>(O.none)
  const [value, setValue] = React.useState<string>(S.empty)

  const chars = S.toCharArray(text)

  React.useEffect(() => {
    if (value === S.empty) {
      setCurrentErrorIndex(O.none)
    }
  }, [value])

  React.useEffect(() => {
    if (O.isSome(currentErrorIndex)) {
      setErrorIndexes(pipe(errorIndexes, A.cons(currentErrorIndex.value)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentErrorIndex])

  React.useEffect(() => {
    if (value !== S.empty && O.isNone(startedTyping)) {
      setStartedTyping(O.some(new Date()))
    }
  }, [startedTyping, value])

  const handleChange = (event: React.SyntheticEvent<HTMLTextAreaElement>): void => {
    const currentValue = event.currentTarget.value

    const disableInput = pipe(
      currentErrorIndex,
      O.fold(constFalse, index => currentValue.length - index > 10),
    )

    if (!disableInput) {
      setValue(currentValue)
    }

    const errorIndex = pipe(
      chars,
      A.takeLeft(value.length),
      A.zip(S.toCharArray(value)),
      A.findIndex(([a, b]) => a !== b),
    )

    if (!O.getEq(eqNumber).equals(errorIndex, currentErrorIndex)) {
      setCurrentErrorIndex(errorIndex)
    }
  }

  const handlePaste = (event: React.SyntheticEvent): void => event.preventDefault()

  const handleReset = (): void => {
    setCurrentErrorIndex(O.none)
    setErrorIndexes(A.empty)
    setStartedTyping(O.none)
    setValue(S.empty)
  }

  const finishedTyping = text === value.trimRight()

  const processedText = pipe(
    chars,
    A.mapWithIndex((i, char) => {
      const style = pipe(
        S.toCharArray(value),
        A.lookup(i),
        O.map(c =>
          O.isSome(currentErrorIndex) && currentErrorIndex.value <= i
            ? 'trainer__char--incorrect'
            : c === char
            ? 'trainer__char--correct'
            : 'trainer__char--incorrect',
        ),
        O.toNullable,
      )

      const finishedTypingStyle = pipe(errorIndexes, A.elem(eqNumber)(i))
        ? 'trainer__char--incorrect'
        : 'trainer__char--correct'

      return (
        <span
          className={className(['trainer__char', finishedTyping ? finishedTypingStyle : style])}
          key={i}>
          {char}
        </span>
      )
    }),
  )

  return (
    <Card styling='grey' className='trainer'>
      <CardHeader>
        <Stats
          errorsCount={errorIndexes.length}
          finishedTyping={finishedTyping}
          handleReset={handleReset}
          startedTyping={startedTyping}
          textTyped={value}
        />
      </CardHeader>

      <CardBody>
        <div className='trainer__text mx-2'>{processedText}</div>

        <textarea
          className={className([
            'trainer__input-field',
            O.isSome(currentErrorIndex) ? 'trainer__input-field--invalid' : null,
          ])}
          disabled={finishedTyping}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder='Start typing...'
          rows={4}
          value={value}
        />
      </CardBody>
    </Card>
  )
}
