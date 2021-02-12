import { Box, Button } from 'components'
import { differenceInSeconds } from 'date-fns'
import { addSeconds } from 'date-fns/fp'
import { flow, pipe, tupled } from 'fp-ts/function'
import { sequenceT } from 'fp-ts/Apply'
import * as O from 'fp-ts/Option'
import React from 'react'
import './Stats.scss'

const secondsToMinutes = (seconds: number): number => seconds / 60

const wordsPerMinute = (charsCount: number) => (timeSpent: number): number =>
  Math.floor(charsCount / 5 / timeSpent)

type StatsProps = {
  errorsCount: number
  finishedTyping: boolean
  onAnotherText: () => void
  onReset: () => void
  startedTyping: O.Option<Date>
  textTyped: string
}

export const Stats: React.FC<StatsProps> = ({
  errorsCount,
  finishedTyping,
  onAnotherText,
  onReset,
  startedTyping,
  textTyped,
}) => {
  const [seconds, setSeconds] = React.useState<number>(0)

  const timer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (O.isSome(startedTyping)) {
      timer.current = setInterval(() => setSeconds(seconds + 1), 1000)
    }

    return () => {
      if (timer.current !== null) {
        clearInterval(timer.current)
      }
    }
  }, [seconds, startedTyping])

  React.useEffect(() => {
    if (finishedTyping && timer.current !== null) {
      clearInterval(timer.current)
    }
  }, [finishedTyping])

  const result = pipe(
    sequenceT(O.option)(pipe(startedTyping, O.map(addSeconds(seconds))), startedTyping),
    O.map(tupled(differenceInSeconds)),
    O.filter(difference => difference > 1),
    O.fold(() => 0, flow(secondsToMinutes, wordsPerMinute(textTyped.length))),
  )

  const handleReset = (): void => {
    onReset()
    setSeconds(0)
  }

  const handleAnotherText = (): void => {
    handleReset()
    onAnotherText()
  }

  return (
    <Box alignItems='center' className='stats' justifyContent='space-between'>
      <Box>
        <p className='mr-2'>Time spent: {seconds} s</p>
        <p className='mr-2'>Errors: {errorsCount}</p>
        <p className='mr-2'>Result: {result} wpm</p>
      </Box>

      <Box alignItems='center'>
        {finishedTyping ? <p className='stats__done mr-2'>Done!</p> : null}

        <Button className='mr-2' type='button' onClick={handleAnotherText} styling='success'>
          Another text
        </Button>

        <Button
          type='button'
          disabled={O.isNone(startedTyping)}
          onClick={handleReset}
          styling='danger'>
          Restart
        </Button>
      </Box>
    </Box>
  )
}
