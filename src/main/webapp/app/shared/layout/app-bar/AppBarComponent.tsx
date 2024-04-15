import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { Box, Tooltip, AppBar, Skeleton, Button, IconButton } from '@mui/material'
import { useAppSelector } from 'app/config/store'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import { useHistory } from 'react-router-dom'
import { defaultTheme } from '../themes'
import { ArrowDropUpTwoTone, ArrowUpwardRounded } from '@mui/icons-material'

interface ScrollHandlerProps {
  scrollableBoxRef: React.RefObject<HTMLDivElement>
  onScroll: (trigger: boolean) => void
}

const ScrollHandler: React.FC<ScrollHandlerProps> = ({ scrollableBoxRef, onScroll }) => {
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = scrollableBoxRef?.current?.scrollTop || 0
      const trigger = currentScrollPosition < 20

      onScroll(trigger)
    }

    const boxRef = scrollableBoxRef?.current

    if (boxRef) {
      boxRef.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (boxRef) {
        boxRef.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollableBoxRef])

  return null
}

interface IAppBarComponentProps {
  loading: boolean
  children?: React.ReactNode
  onClick?: () => void
  scrollableBoxRef?: React.RefObject<HTMLDivElement>
}

export const AppBarComponent = forwardRef<HTMLDivElement, IAppBarComponentProps>(({ loading, children, scrollableBoxRef }, ref) => {
  const { isMDScreen } = useBreakpoints()
  const history = useHistory()
  const [trigger, setTrigger] = useState(true)
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)

  useImperativeHandle(ref, () => scrollableBoxRef?.current)

  const handleScroll = (scrollTrigger: boolean) => {
    setTrigger(scrollTrigger)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position='fixed'
        sx={{
          top: 0,
          bottom: 'auto',
          borderRadius: '0px 0px 10px 10px',
          background: defaultTheme.palette.primary.main,
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
          height: trigger ? '70px' : '0px',
          transition: 'height 0.2s ease-in-out',
        }}
      >
        {trigger && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
              gap: { xs: 1, sm: 10 },
              px: { xs: 3 },
              pt: 0.5,
            }}
          >
            {isAuthenticated && isMDScreen && (
              <Tooltip title='Repasse Consórcio' style={{ cursor: 'pointer', position: 'absolute' }} onClick={() => history.replace('/')}>
                <img src='content/images/logo-repasse.png' alt='Logo' width='40px' />
              </Tooltip>
            )}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: { xs: 1, md: 4 } }}>{children}</Box>
          </Box>
        )}
      </AppBar>
      {!trigger && (
        <IconButton
          onClick={() => scrollableBoxRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'absolute',
            zIndex: 1,
            right: { xs: 15, sm: 30 },
            bottom: 90,
            background: defaultTheme.palette.secondary.main,
            ':hover': {
              background: defaultTheme.palette.secondary.main,
            },
          }}
        >
          <ArrowUpwardRounded color='primary' />
        </IconButton>
      )}
      <ScrollHandler scrollableBoxRef={scrollableBoxRef} onScroll={handleScroll} />
    </Box>
  )
})
