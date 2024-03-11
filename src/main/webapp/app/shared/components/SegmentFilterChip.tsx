import { FilterListRounded } from '@mui/icons-material'
import { Box, Chip, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { SegmentType } from '../model/enumerations/segment-type.model'
import { useBreakpoints } from '../util/useBreakpoints'

interface ISegmentFilterChipProps {
  filterSegmentType: string
  setFilterSegmentType: (value: React.SetStateAction<SegmentType>) => void
}

export const SegmentFilterChip = ({ setFilterSegmentType, filterSegmentType }: ISegmentFilterChipProps) => {
  const { isSMScreen } = useBreakpoints()

  const getSegmentType = () => {
    return [SegmentType.ALL, SegmentType.AUTOMOBILE, SegmentType.REAL_ESTATE, SegmentType.OTHER]
  }

  const handleSegmentChange = (segment) => {
    setFilterSegmentType((prevValue) => (segment === prevValue ? SegmentType.ALL : segment))
  }

  return !isSMScreen ? (
    <Select
      value={filterSegmentType}
      IconComponent={FilterListRounded}
      onChange={(event) => handleSegmentChange(event.target.value)}
      sx={{ m: { xs: '3px', sm: 1 }, padding: '0 10px 0 0', height: '35px', fontSize: { xs: '14px', sm: '15px' } }}
    >
      {getSegmentType().map((segment: SegmentType, index: number) => (
        <MenuItem key={index} value={segment}>
          {translate(`repasseconsorcioApp.SegmentType.${segment}`)}
        </MenuItem>
      ))}
    </Select>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
        Filtrar por:
      </Typography>
      {getSegmentType().map((segment, index) => (
        <Box key={index} onClick={() => handleSegmentChange(segment)} sx={{ m: '4px', p: 0 }}>
          <Chip
            label={translate(`repasseconsorcioApp.SegmentType.${segment}`)}
            variant={segment === filterSegmentType ? 'filled' : 'outlined'}
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
