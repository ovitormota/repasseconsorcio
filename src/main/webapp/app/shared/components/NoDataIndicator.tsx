import React from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import { defaultTheme } from '../layout/themes'

export const NoDataIndicator = ({ message = 'Nenhum dado encontrado' }) => {
  return (
    <Box
      sx={{
        color: defaultTheme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 90, color: defaultTheme.palette.grey[200], mx: 'auto' }} />
      <Typography variant='overline' sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  )
}

export const NoDataIndicatorRelative = ({ message = 'Nenhum dado encontrado' }) => {
  return (
    <Box
      sx={{
        color: defaultTheme.palette.secondary.main,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 90, color: defaultTheme.palette.grey[200], mx: 'auto' }} />
      <Typography variant='overline' sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  )
}
