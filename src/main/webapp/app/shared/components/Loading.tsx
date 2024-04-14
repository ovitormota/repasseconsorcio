// Loading.tsx
import { Box, LinearProgress, Typography } from '@mui/material'
import React from 'react'
import { defaultTheme } from '../layout/themes'

interface LoadingProps {
  message?: string
  height?: string
  marginTop?: number
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Aguarde, carregando...', height = '100vh', marginTop = 0 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height, mt: marginTop }}>
      {/* <Box sx={{ width: '50%%' }}>
        <LinearProgress color='secondary' />
      </Box>
      <Typography variant='body2' mt={2} color={defaultTheme.palette.secondary.main}>
        {message}
      </Typography> */}
    </Box>
  )
}
