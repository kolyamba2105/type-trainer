import dangerIcon from 'assets/warning.svg'
import { Box } from 'components/Box'
import React from 'react'
import './ErrorMessage.scss'

export const ErrorMesssage: React.FC = ({ children }) => (
  <Box alignItems='center' className='error-message'>
    <img className='error-message__icon' src={dangerIcon} alt='Danger icon' />
    <p className='error-message__text'>{children}</p>
  </Box>
)
