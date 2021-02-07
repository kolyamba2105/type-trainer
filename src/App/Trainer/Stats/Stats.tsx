import { Box, Button } from 'App/components'
import { differenceInSeconds } from 'date-fns'
import { addSeconds } from 'date-fns/fp'
import { flow, pipe, tupled } from 'fp-ts/function'
import { sequenceT } from 'fp-ts/lib/Apply'
import * as O from 'fp-ts/Option'
import React from 'react'

const secondsToMinutes = (seconds: number): number => seconds / 60

const wordsPerMinute = (charsCount: number) => (timeSpent: number): number =>
  Math.floor(charsCount / 5 / timeSpent)

type StatsProps = {
  finishedTyping: boolean
  handleReset: () => void
  startedTyping: Date | null
  textTyped: string
}

export const Stats: React.FC<StatsProps> = ({
  finishedTyping,
  handleReset,
  startedTyping,
  textTyped,
}) => {
  const [seconds, setSeconds] = React.useState<number>(0)

  const timer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (startedTyping !== null) timer.current = setInterval(() => setSeconds(seconds + 1), 1000)

    return () => {
      if (timer.current !== null) clearInterval(timer.current)
    }
  }, [seconds, startedTyping])

  React.useEffect(() => {
    if (finishedTyping && timer.current !== null) clearInterval(timer.current)
  }, [finishedTyping])

  const result = pipe(
    sequenceT(O.option)(
      pipe(O.fromNullable(startedTyping), O.map(addSeconds(seconds))),
      O.fromNullable(startedTyping),
    ),
    O.map(tupled(differenceInSeconds)),
    O.filter(difference => difference > 1),
    O.fold(() => 0, flow(secondsToMinutes, wordsPerMinute(textTyped.length))),
  )

  const handleClick = (): void => {
    handleReset()
    setSeconds(0)
  }

  return (
    <Box alignItems='center' justifyContent='space-between'>
      <Box>
        <p className='mr-2'>Time spent: {seconds} s</p>
        <p className='mr-2'>Result: {result} wpm</p>
        {finishedTyping ? <p>Done!</p> : null}
      </Box>

      <Button
        type='button'
        disabled={startedTyping === null}
        onClick={handleClick}
        styling='danger'>
        Reset
      </Button>
    </Box>
  )
}
