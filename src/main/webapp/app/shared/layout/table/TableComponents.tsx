import React from 'react'
import { Typography } from '@mui/material'

export const TypographStyled = ({ children }) => (
  <Typography
    variant='overline'
    sx={{
      fontWeight: '600 !important',
    }}
  >
    {children}
  </Typography>
)
