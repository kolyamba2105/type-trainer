import { Card, CardBody, CardHeader } from 'App/components'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
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
  const [value, setValue] = React.useState<string>(S.empty)
  const [errorIndex, setErrorIndex] = React.useState<number | null>(null)
  const [startedTyping, setStartedTyping] = React.useState<Date | null>(null)

  const chars = S.toCharArray(text)

  React.useEffect(() => {
    if (value === S.empty) setErrorIndex(null)
  }, [value])

  React.useEffect(() => {
    if (value !== S.empty && startedTyping === null) setStartedTyping(new Date())
  }, [startedTyping, value])

  const handleChange = (event: React.SyntheticEvent<HTMLTextAreaElement>): void => {
    const currentValue = event.currentTarget.value

    const disableInput = errorIndex !== null ? currentValue.length - errorIndex > 10 : false

    if (!disableInput) setValue(currentValue)

    const currentErrorIndex = pipe(
      chars,
      A.takeLeft(value.length),
      A.zip(S.toCharArray(value)),
      A.findIndex(([a, b]) => a !== b),
      O.toNullable,
    )

    if (currentErrorIndex !== errorIndex) setErrorIndex(currentErrorIndex)
  }

  const handleReset = (): void => {
    setValue(S.empty)
    setErrorIndex(null)
    setStartedTyping(null)
  }

  const processedText = pipe(
    chars,
    A.mapWithIndex((i, char) => {
      const charStyle = pipe(
        value,
        S.toCharArray,
        A.lookup(i),
        O.map(c =>
          errorIndex !== null && errorIndex <= i
            ? 'trainer__char--incorrect'
            : c === char
            ? 'trainer__char--correct'
            : 'trainer__char--incorrect',
        ),
        O.toNullable,
      )

      return (
        <span className={className(['trainer__char', charStyle])} key={i}>
          {char}
        </span>
      )
    }),
  )

  const finishedTyping = text === value.trimRight()

  return (
    <Card styling='grey' className='trainer'>
      <CardHeader>
        <Stats
          finishedTyping={finishedTyping}
          handleReset={handleReset}
          startedTyping={startedTyping}
          textTyped={value}
        />
      </CardHeader>

      <CardBody>
        <p className='trainer__text mx-2'>{processedText}</p>

        <textarea
          className={className([
            'trainer__input-field',
            errorIndex !== null ? 'trainer__input-field--invalid' : null,
          ])}
          disabled={finishedTyping}
          onChange={handleChange}
          rows={4}
          value={value}
        />
      </CardBody>
    </Card>
  )
}
