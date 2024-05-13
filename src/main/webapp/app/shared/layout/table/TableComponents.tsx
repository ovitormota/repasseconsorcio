import React from 'react'
import { Typography } from '@mui/material'

export const TypographStyled = ({ children }) => (
  <Typography
    variant='overline'
    fontSize={'10px'}
    sx={{
      fontWeight: '600 !important',
    }}
  >
    {children}
  </Typography>
)
