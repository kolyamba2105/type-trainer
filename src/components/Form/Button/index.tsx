import { pipe } from 'fp-ts/function'
import { className as cn, fromNullableProp } from 'lib/Styles'
import React from 'react'
import './Button.scss'

type ButtonStyling = 'danger' | 'primary' | 'success'

const toClassName = (
  styling: ButtonStyling,
): 'button--danger' | 'button--primary' | 'button--success' => {
  switch (styling) {
    case 'danger':
      return 'button--danger'
    case 'primary':
      return 'button--primary'
    case 'success':
      return 'button--success'
  }
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  styling?: ButtonStyling
}

export const Button: React.FC<ButtonProps> = ({ className, styling, ...props }) => (
  <button
    className={cn([className, 'button', pipe(styling, fromNullableProp(toClassName))])}
    {...props}
  />
)
