import { FilterListRounded } from '@mui/icons-material'
import { Box, Chip, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { StatusType } from '../model/enumerations/status.model'
import { useBreakpoints } from '../util/useBreakpoints'

interface IUserFilterChipProps {
  filterStatusType: string
  setFilterStatusType: (value: React.SetStateAction<StatusType>) => void
}

export const UserFilterChip = ({ setFilterStatusType, filterStatusType }: IUserFilterChipProps) => {
  const { isSMScreen } = useBreakpoints()

  const getStatusType = () => {
    return [StatusType.ALL, StatusType.ACTIVATED, StatusType.INACTIVED]
  }

  const handleStatusChange = (status) => {
    setFilterStatusType((prevValue) => (status === prevValue ? StatusType.ALL : status))
  }

  return !isSMScreen ? (
    <Select
      value={filterStatusType}
      IconComponent={FilterListRounded}
      onChange={(event) => handleStatusChange(event.target.value)}
      sx={{ m: { xs: '3px', sm: 1 }, padding: '0 10px 0 0', height: '35px', fontSize: { xs: '14px', sm: '15px' } }}
    >
      {getStatusType().map((status: StatusType, index: number) => (
        <MenuItem key={index} value={status}>
          {translate(`userManagement.${status.toLowerCase()}`)}
        </MenuItem>
      ))}
    </Select>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
        Filtrar por:
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
    </Box>
  )
}
