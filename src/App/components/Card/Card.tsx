import { pipe } from 'fp-ts/function'
import { className as cn, fromNullableProp } from 'lib/Styles'
import React from 'react'
import './Card.scss'

type CardStyling = 'white' | 'grey'

const toCardStyling = (styling: CardStyling): 'card--grey' | 'card--white' => {
  switch (styling) {
    case 'grey':
      return 'card--grey'
    case 'white':
      return 'card--white'
  }
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  styling?: CardStyling
}

export const Card: React.FC<CardProps> = ({ className, styling, ...props }) => (
  <div
    className={cn([className, 'card', pipe(styling, fromNullableProp(toCardStyling))])}
    {...props}
  />
)
