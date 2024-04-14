import { CloseOutlined } from '@mui/icons-material'
import { IconButton, Slide, SlideProps, Snackbar, Stack, Typography } from '@mui/material'
import React from 'react'
import { defaultTheme } from '../layout/themes'

export const useCustomToast = () => {
  const [open, setOpen] = React.useState(false)
  const [toastContent, setToastContent] = React.useState({ title: '', body: '' })

  const showToast = (title: string, body: string) => {
    setToastContent({ title, body })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction='up' />
  }

  const CustomToastComponent = () => (
    <Snackbar TransitionComponent={SlideTransition} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Stack direction='row' sx={{ bgcolor: 'primary.main', boxShadow: 4, borderRadius: 2, maxWidth: 400 }}>
        <Stack sx={{ flexGrow: 1, p: 2, gap: 1 }}>
          <Typography variant='subtitle2' color='secondary' fontWeight={600}>
            {toastContent.title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {toastContent.body}
          </Typography>
        </Stack>
        <Stack sx={{ p: 1 }}>
          <IconButton color='secondary' size='small' onClick={handleClose}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </Stack>
      </Stack>
    </Snackbar>
  )

  return { showToast, CustomToastComponent }
}
