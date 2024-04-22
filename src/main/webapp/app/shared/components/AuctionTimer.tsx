import { ArrowOutward } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import React from 'react'
import Countdown from 'react-countdown'
import { IConsortium } from '../model/consortium.model'
import { ConsortiumStatusType } from '../model/enumerations/consortium-status-type.model'

interface IAuctionTimer {
  created: string
  consortium?: IConsortium
}

export const AuctionTimer = ({ created, consortium }: IAuctionTimer) => {
  const expirationDate = new Date(new Date(created).getTime() + 7 * 24 * 60 * 60 * 1000)

  const getWinner = () => {
    const maxObject = consortium?.bids.reduce((maxObj, obj) => (obj.value > maxObj.value ? obj : maxObj), consortium?.bids[0])

    if (maxObject) {
      return `${maxObject.user?.firstName} ${maxObject.user?.lastName}`
    }
  }

  const setPrimaryText = () => {
    if (consortium?.status === ConsortiumStatusType.REGISTERED) {
      return '-'
    } else if (consortium?.status === ConsortiumStatusType.WON) {
      return 'Vencedor'
    } else {
      return 'Encerramento em'
    }
  }

  return (
    <Box sx={{ p: 1, borderRadius: '1em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='caption' color='rgba(43,43,43, 0.7)'>
        {setPrimaryText()}
      </Typography>
      <Typography variant='caption' color='rgba(43,43,43,1)'>
        {consortium?.status === ConsortiumStatusType.REGISTERED ? (
          'Aguardando aprovação'
        ) : (
          <Countdown
            date={expirationDate}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return (
                  <b>
                    {getWinner()}
                    <ArrowOutward style={{ fontSize: '16px', marginBottom: '3px' }} color='secondary' />
                  </b>
                )
              } else {
                const nonZeroValues = []

                if (days > 0) nonZeroValues.push(days === 1 ? '1 dia' : `${days} dias`)
                if (hours > 0) nonZeroValues.push(`${hours} horas`)
                if (minutes > 0) nonZeroValues.push(`${minutes} minutos`)
                if (seconds > 0) nonZeroValues.push(`${seconds} segundos`)

                return <span style={{ fontSize: '14px' }}>{nonZeroValues.join(', ')}</span>
              }
            }}
          />
        )}
      </Typography>
    </Box>
  )
}
