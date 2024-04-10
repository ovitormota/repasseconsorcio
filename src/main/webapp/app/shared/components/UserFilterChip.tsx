import { Box, Chip, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { StatusType } from '../model/enumerations/status.model'

interface IUserFilterChipProps {
  filterStatusType: string
  setFilterStatusType: (value: React.SetStateAction<StatusType>) => void
  loading: boolean
}

export const UserFilterChip = ({ setFilterStatusType, filterStatusType, loading }: IUserFilterChipProps) => {
  const getStatusType = () => {
    return [StatusType.ALL, StatusType.ACTIVATED, StatusType.INACTIVED]
  }

  const handleStatusChange = (status) => {
    setFilterStatusType((prevValue) => (status === prevValue ? StatusType.ALL : status))
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!loading ? (
        <>
          <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
            Status:
          </Typography>
          {getStatusType().map((status, index) => (
            <Box key={index} onClick={() => handleStatusChange(status)} sx={{ m: '4px', p: 0 }}>
              <Chip
                label={translate(`userManagement.${status.toLowerCase()}`)}
                variant={status === filterStatusType ? 'filled' : 'outlined'}
                color='secondary'
                sx={{
                  '&:hover': {
                    backgroundColor: defaultTheme.palette.secondary.main,
                    color: defaultTheme.palette.secondary.contrastText,
                    cursor: 'pointer',
                  },
                }}
              />
            </Box>
          ))}
        </>
      ) : (
        <Skeleton variant='rectangular' width='25vw' height={40} sx={{ borderRadius: '10px' }} />
      )}
    </Box>
  )
}
