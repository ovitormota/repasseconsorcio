import { Add } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import React from 'react'

export const AddButton = ({ onClick }) => {
  return (
    <Tooltip title='Adicionar' placement='top'>
      <Button
        sx={{
          position: 'absolute',
          borderRadius: '100%',
          bottom: 90,
          right: { xs: 17, sm: 35 },
          height: 60,
          width: 60,
          zIndex: 1,
        }}
        variant='contained'
        color='secondary'
        onClick={onClick}
      >
        <Add fontSize='large' />
      </Button>
    </Tooltip>
  )
}
