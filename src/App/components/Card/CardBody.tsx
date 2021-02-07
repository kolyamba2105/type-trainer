import { className as cn } from 'lib/Styles'
import React from 'react'
import './Card.scss'

type CardBodyProps = React.HTMLAttributes<HTMLDivElement>

export const CardBody: React.FC<CardBodyProps> = ({ className, ...props }) => (
  <div className={cn([className, 'card__body'])} {...props} />
)
