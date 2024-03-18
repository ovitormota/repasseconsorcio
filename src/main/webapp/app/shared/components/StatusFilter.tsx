import { FilterListRounded } from '@mui/icons-material'
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { ConsortiumStatusType } from '../model/enumerations/consortium-status-type.model'
import { useBreakpoints } from '../util/useBreakpoints'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from '../auth/private-route'
import { AUTHORITIES } from 'app/config/constants'

interface IStatusFilterProps {
  filterStatusType: string
  setFilterStatusType: (value: React.SetStateAction<ConsortiumStatusType>) => void
}

export const StatusFilter = ({ setFilterStatusType, filterStatusType }: IStatusFilterProps) => {
  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const getStatusType = () => {
    return [ConsortiumStatusType.ALL, ConsortiumStatusType.OPEN, ConsortiumStatusType.WON, ConsortiumStatusType.CLOSED, ConsortiumStatusType.REGISTERED]
  }

  const handleStatusChange = (status) => {
    setFilterStatusType(status)
  }

  const filterByAdmin = (statusType: ConsortiumStatusType[]) => {
    return isAdmin ? statusType.filter((item) => item !== ConsortiumStatusType.REGISTERED) : statusType
  }

  return (
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
            maxWidth: '25vw',
            padding: '0 10px 0 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '0.9rem',
          }}
        >
          {filterByAdmin(getStatusType()).map((status: ConsortiumStatusType, index: number) => (
            <MenuItem key={index} value={status}>
              {translate(`repasseconsorcioApp.ConsortiumStatusType.${status}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
