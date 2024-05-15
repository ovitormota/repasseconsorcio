import React from 'react'
import { Typography } from '@mui/material'

export const TypographStyled = ({ children }) => (
  <Typography variant='overline' fontSize={'10px'}>
    {children}
  </Typography>
)
