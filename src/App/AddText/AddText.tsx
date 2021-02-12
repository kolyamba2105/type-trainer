import { Box } from 'components/Box'
import { Card, CardBody, CardHeader } from 'components/Card'
import { Button, ErrorMesssage, Textarea } from 'components/Form'
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import { constNull, pipe } from 'fp-ts/function'
import * as S from 'lib/String'
import * as V from 'lib/Validation'
import React from 'react'
import './AddText.scss'

const TEXT_MAX_LENGTH = 1000
const TEXT_MIN_LENGTH = 100

const validateText = V.combine([V.minLength(TEXT_MIN_LENGTH), V.maxLength(TEXT_MAX_LENGTH)])

type AddTextProps = {
  handleAddText: (text: S.NonEmptyString) => void
}

export const AddText: React.FC<AddTextProps> = ({ handleAddText }) => {
  const [text, setText] = React.useState(S.empty)
  const [submitted, setSubmitted] = React.useState<boolean>(false)

  const validationResult = validateText(text)

  const handleChange = (event: React.SyntheticEvent<HTMLTextAreaElement>): void => {
    setText(event.currentTarget.value)
  }

  const handleSubmit = (event: React.SyntheticEvent): void => {
    setSubmitted(true)
    pipe(
      validationResult,
      E.map(S.trim),
      E.chainW(S.NonEmptyString.decode),
      E.fold(constNull, handleAddText),
    )
  }

  const validationErrors: Array<JSX.Element> | null = submitted
    ? pipe(
        validationResult,
        E.fold(
          A.mapWithIndex((i, error) => <ErrorMesssage key={i}>{error.message}</ErrorMesssage>),
          constNull,
        ),
      )
    : null

  return (
    <Card className='add-text mt-4'>
      <CardHeader>
        <h3 className='add-text__title'>Add Text</h3>
      </CardHeader>

      <CardBody>
        <Box direction='column' className='add-text__form-group'>
          <Textarea
            className='add-text__text-field'
            maxLength={TEXT_MAX_LENGTH}
            onChange={handleChange}
            placeholder='Paste your text here...'
            rows={4}
            value={text}
          />
          {validationErrors}
        </Box>
        <Box justifyContent='end' className='add-text__button-group'>
          <Button onClick={handleSubmit} styling='success' type='submit'>
            Submit
          </Button>
        </Box>
      </CardBody>
    </Card>
  )
}
