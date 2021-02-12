import { className as cn } from 'lib/Styles'
import React from 'react'
import './Card.scss'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cn([className, 'card'])} {...props} />
)
