import { FilterListRounded } from '@mui/icons-material'
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { SegmentType } from '../model/enumerations/segment-type.model'
import { useBreakpoints } from '../util/useBreakpoints'

interface ISegmentFilterChipProps {
  filterSegmentType: string
  setFilterSegmentType: (value: React.SetStateAction<SegmentType>) => void
  isAdmin?: boolean
  onMaxWidth?: boolean
  loading?: boolean
}

export const SegmentFilterChip = ({ setFilterSegmentType, filterSegmentType, isAdmin, onMaxWidth }: ISegmentFilterChipProps) => {
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [])

  const { isSMScreen } = useBreakpoints()

  const getSegmentType = () => {
    return [SegmentType.ALL, SegmentType.AUTOMOBILE, SegmentType.REAL_ESTATE, SegmentType.OTHER]
  }

  const handleSegmentChange = (segment) => {
    setFilterSegmentType((prevValue) => (segment === prevValue ? SegmentType.ALL : segment))
  }

  return !isSMScreen || onMaxWidth ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!loading ? (
        <>
          <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
            Segmento:
          </Typography>
          <FormControl fullWidth>
            <InputLabel sx={{ display: { xs: 'block', lg: 'none' }, color: defaultTheme.palette.text.secondary, fontSize: '0.9rem', background: '#F6F6F6' }}>Segmento</InputLabel>
            <Select
              value={filterSegmentType}
              IconComponent={FilterListRounded}
              onChange={(event) => handleSegmentChange(event.target.value)}
              color='secondary'
              size='small'
              sx={{
                padding: '0 10px 0 0',
                maxWidth: onMaxWidth ? '25vw' : '40vw',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.9rem',
              }}
            >
              {getSegmentType().map((segment: SegmentType, index: number) => (
                <MenuItem key={index} value={segment}>
                  {translate(`repasseconsorcioApp.SegmentType.${segment}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        <Skeleton animation='wave' variant='rectangular' width={onMaxWidth ? '10vw' : '25vw'} height={40} sx={{ borderRadius: '10px' }} />
      )}
    </Box>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!loading ? (
        <>
          <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
            Filtrar:
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
        </>
      ) : (
        <Skeleton animation='wave' variant='rectangular' width={onMaxWidth ? '10vw' : '25vw'} height={40} sx={{ borderRadius: '10px' }} />
      )}
    </Box>
  )
}
