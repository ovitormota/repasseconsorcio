import { SortRounded, SwapVertRounded } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Skeleton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { ASC, DESC } from '../util/pagination.constants'

interface ISortingBoxProps {
  currentSort: string
  setCurrentSort: (sort: string) => void
  order: string
  setOrder: (order: string) => void
  sortTypes: string[]
  translateKey?: string
  onMaxWidth?: boolean
  loading: boolean
}

export const SortingBox = ({ setCurrentSort, currentSort, setOrder, order, sortTypes, translateKey, onMaxWidth, loading }: ISortingBoxProps) => {
  const handleSortChange = (event) => {
    const selectedSortType = event.target.value
    setCurrentSort(selectedSortType)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!loading ? (
        <>
          <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
            Ordenar:
          </Typography>
          <FormControl fullWidth>
            <InputLabel sx={{ display: { xs: 'block', lg: 'none' }, color: defaultTheme.palette.text.secondary, fontSize: '0.9rem', background: '#F6F6F6' }}>Ordenar</InputLabel>
            <Select
              value={currentSort}
              onChange={handleSortChange}
              IconComponent={SortRounded}
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
              {sortTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {translate(`${translateKey}.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title={order === ASC ? 'Crescente' : 'Decrescente'}>
            <IconButton color='secondary' onClick={() => setOrder(order === ASC ? DESC : ASC)} sx={{ ml: { xs: 0, sm: 1 } }}>
              <SwapVertRounded />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Skeleton variant='rectangular' width={onMaxWidth ? '10vw' : '25vw'} height={40} sx={{ borderRadius: '10px' }} />
          <Skeleton variant='circular' width={40} height={40} sx={{ borderRadius: '50%', ml: 1 }} />
        </>
      )}
    </Box>
  )
}
