import { Card, CardBody, CardHeader } from 'components/Card'
import { Textarea } from 'components/Form'
import * as A from 'fp-ts/Array'
import { eqNumber } from 'fp-ts/Eq'
import { constFalse, constNull, pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Random'
import { getTextFromFile, textMaxIndex } from 'lib/Text'
import * as S from 'lib/String'
import { className } from 'lib/Styles'
import React from 'react'
import { Stats } from './Stats'
import './Trainer.scss'

const eqOptionNumber = O.getEq(eqNumber)

type TrainerComponentProps = {
  onAnotherText: () => void
  text: S.NonEmptyString
}

const TrainerComponent: React.FC<TrainerComponentProps> = ({ onAnotherText, text }) => {
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

    if (!eqOptionNumber.equals(errorIndex, currentErrorIndex)) {
      setCurrentErrorIndex(errorIndex)
    }
  }

  const handlePaste = (event: React.SyntheticEvent): void => event.preventDefault()

  const onReset = (): void => {
    setCurrentErrorIndex(O.none)
    setErrorIndexes(A.empty)
    setStartedTyping(O.none)
    setValue(S.empty)
  }

  const finishedTyping = S.fromCharArray(chars) === value.trimRight()

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
    <Card className='trainer mt-4'>
      <CardHeader>
        <Stats
          errorsCount={errorIndexes.length}
          finishedTyping={finishedTyping}
          onAnotherText={onAnotherText}
          onReset={onReset}
          startedTyping={startedTyping}
          textTyped={value}
        />
      </CardHeader>

      <CardBody>
        <div className='trainer__text mb-2'>{processedText}</div>

        <Textarea
          className='trainer__input-field'
          disabled={finishedTyping}
          invalid={O.isSome(currentErrorIndex)}
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

const randomIndexOption: IO.IO<O.Option<number>> = pipe(R.randomInt(0, textMaxIndex), IO.map(O.of))

const generateRandomIndex = (next: O.Option<number>) => (
  current: O.Option<number>,
): O.Option<number> =>
  eqOptionNumber.equals(current, next) ? generateRandomIndex(randomIndexOption())(current) : next

type TrainerProps = {
  customText: O.Option<S.NonEmptyString>
  resetCustomText: () => void
}

export const Trainer: React.FC<TrainerProps> = ({ customText, resetCustomText }) => {
  const [textIndex, setTextIndex] = React.useState<O.Option<number>>(O.none)

  const generateIndex = (): void => {
    setTextIndex(generateRandomIndex(randomIndexOption()))
  }

  const handleAnotherText = (): void => {
    if (O.isSome(customText)) {
      resetCustomText()
    }

    generateIndex()
  }

  React.useEffect(generateIndex, [])

  return pipe(
    customText,
    O.alt(() => pipe(textIndex, O.chain(getTextFromFile))),
    O.fold(constNull, text => <TrainerComponent onAnotherText={handleAnotherText} text={text} />),
  )
}
