import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { Box, Tooltip, AppBar } from '@mui/material'
import { useAppSelector } from 'app/config/store'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import { useHistory } from 'react-router-dom'
import { defaultTheme } from '../themes'

interface ScrollHandlerProps {
  scrollableBoxRef: React.RefObject<HTMLDivElement>
  onScroll: (trigger: boolean) => void
  prevScrollPosition: number
  setPrevScrollPosition: (position: number) => void
}

const ScrollHandler: React.FC<ScrollHandlerProps> = ({ scrollableBoxRef, onScroll, prevScrollPosition, setPrevScrollPosition }) => {
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = scrollableBoxRef?.current?.scrollTop || 0
      setPrevScrollPosition(currentScrollPosition)
      const trigger = currentScrollPosition < prevScrollPosition || currentScrollPosition === 0
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
  }, [scrollableBoxRef, onScroll, prevScrollPosition, setPrevScrollPosition])

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
  const [prevScrollPosition, setPrevScrollPosition] = useState(0)
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
          background: defaultTheme.palette.primary.main,
          boxShadow: 'none',
          height: trigger ? '70px' : '0px',
          transition: 'height 0.5s ease-in-out',
        }}
      >
        {!loading && trigger && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
              gap: { xs: 1, sm: 10 },
              px: { xs: 3 },
            }}
          >
            {isAuthenticated && isMDScreen && (
              <Tooltip title='Início' style={{ cursor: 'pointer', position: 'absolute' }} onClick={() => history.replace('/')}>
                <Box sx={{ width: '110px', height: '40px', maxWidth: '110px' }}>
                  <img src='content/images/logo-repasse-consorcio-text.png' alt='Logo' width='100%' height='100%' />
                </Box>
              </Tooltip>
            )}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: { xs: 2, md: 8 } }}>{children}</Box>
          </Box>
        )}
      </AppBar>
      <ScrollHandler scrollableBoxRef={scrollableBoxRef} onScroll={handleScroll} prevScrollPosition={prevScrollPosition} setPrevScrollPosition={setPrevScrollPosition} />
    </Box>
  )
})
