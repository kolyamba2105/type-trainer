import { className as cn } from 'lib/Styles'
import React from 'react'
import './Card.scss'

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

export const CardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => (
  <div className={cn([className, 'card__header'])} {...props} />
)
