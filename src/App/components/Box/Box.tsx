import { pipe } from 'fp-ts/lib/function'
import { className as cn, fromNullableProp } from 'lib/Styles'
import React from 'react'
import './Box.scss'

type AlignItems = 'start' | 'center' | 'end'

const toAlignItems = (alignItems: AlignItems): 'box--a-center' | 'box--a-end' | 'box--a-start' => {
  switch (alignItems) {
    case 'center':
      return 'box--a-center'
    case 'end':
      return 'box--a-end'
    case 'start':
      return 'box--a-start'
  }
}

type Direction = 'column' | 'row'

const toDirection = (direction: Direction): 'box--d-row' | 'box--d-column' =>
  direction === 'column' ? 'box--d-column' : 'box--d-row'

type JustifyContent = 'start' | 'center' | 'end' | 'space-between' | 'space-around'

const toJustifyContent = (
  justifyContent: JustifyContent,
):
  | 'box--j-center'
  | 'box--j-end'
  | 'box--j-space-around'
  | 'box--j-space-between'
  | 'box--j-start' => {
  switch (justifyContent) {
    case 'center':
      return 'box--j-center'
    case 'end':
      return 'box--j-end'
    case 'space-around':
      return 'box--j-space-around'
    case 'space-between':
      return 'box--j-space-between'
    case 'start':
      return 'box--j-start'
  }
}

type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  alignItems?: AlignItems
  direction?: Direction
  justifyContent?: JustifyContent
}

export const Box: React.FC<BoxProps> = ({
  alignItems = 'start',
  className,
  direction = 'row',
  justifyContent = 'start',
  ...props
}) => (
  <div
    className={cn([
      className,
      'box',
      pipe(alignItems, fromNullableProp(toAlignItems)),
      pipe(direction, fromNullableProp(toDirection)),
      pipe(justifyContent, fromNullableProp(toJustifyContent)),
    ])}
    {...props}
  />
)
