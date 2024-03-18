import { FilterListRounded } from '@mui/icons-material'
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
        Status:
      </Typography>
      <FormControl fullWidth>
        <InputLabel sx={{ display: { xs: 'block', lg: 'none' }, color: defaultTheme.palette.text.secondary, fontSize: '0.9rem', background: '#F6F6F6' }}>Status</InputLabel>
        <Select
          value={filterStatusType}
          IconComponent={FilterListRounded}
          onChange={(event) => handleStatusChange(event.target.value)}
          color='secondary'
          size='small'
          sx={{
            padding: '0 10px 0 0',
            maxWidth: '40vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '0.9rem',
          }}
        >
          {getStatusType().map((status: StatusType, index: number) => (
            <MenuItem key={index} value={status}>
              {translate(`userManagement.${status.toLowerCase()}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
    </Box>
  )
}
