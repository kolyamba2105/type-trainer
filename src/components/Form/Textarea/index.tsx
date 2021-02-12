import { className as cn } from 'lib/Styles'
import React from 'react'
import * as G from 'io-ts/Guard'
import './Textarea.scss'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({ className, invalid: isInvalid, ...props }) => (
  <textarea
    className={cn([
      className,
      'textarea',
      G.boolean.is(isInvalid) ? (isInvalid ? 'textarea--invalid' : 'textarea--valid') : null,
    ])}
    {...props}
  />
)
