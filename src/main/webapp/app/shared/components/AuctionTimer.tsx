import { ListItem, ListItemText } from '@mui/material'
import React from 'react'
import Countdown from 'react-countdown'
import { ConsortiumStatusType } from '../model/enumerations/consortium-status-type.model'

interface IAuctionTimer {
  created: string
  status?: ConsortiumStatusType
}

export const AuctionTimer = ({ created, status }: IAuctionTimer) => {
  const expirationDate = new Date(new Date(created).getTime() + 7 * 24 * 60 * 60 * 1000)

  return (
    <ListItem>
      <ListItemText
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: 'none !important' }}
        primary={`Esse leilão termina em:`}
        primaryTypographyProps={{ fontSize: '12px !important' }}
        secondary={
          status === ConsortiumStatusType.REGISTERED ? (
            'Aguardando aprovação'
          ) : (
            <Countdown
              date={expirationDate}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  return 'Encerrado'
                } else {
                  const nonZeroValues = []

                  if (days > 0) nonZeroValues.push(days === 1 ? '1 dia' : `${days} dias`)
                  if (hours > 0) nonZeroValues.push(`${hours} horas`)
                  if (minutes > 0) nonZeroValues.push(`${minutes} minutos`)
                  if (seconds > 0) nonZeroValues.push(`${seconds} segundos`)

                  return nonZeroValues.join(', ')
                }
              }}
            />
          )
        }
      />
    </ListItem>
  )
}
