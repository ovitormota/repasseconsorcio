import { SortRounded, SwapVertRounded } from '@mui/icons-material'
import { Box, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material'
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
}

export const SortingBox = ({ setCurrentSort, currentSort, setOrder, order, sortTypes, translateKey }: ISortingBoxProps) => {
  const handleSortChange = (event) => {
    const selectedSortType = event.target.value
    setCurrentSort(selectedSortType)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='subtitle2' sx={{ color: defaultTheme.palette.text.secondary, mr: '10px', display: { xs: 'none', lg: 'block' } }}>
        Ordenar por:
      </Typography>
      <Select
        value={currentSort}
        onChange={handleSortChange}
        IconComponent={SortRounded}
        color='secondary'
        sx={{
          height: '35px',
          padding: '0 10px 0 0',
          fontSize: { xs: '14px', sm: '15px' },
          borderColor: defaultTheme.palette.secondary.main,
        }}
      >
        {sortTypes.map((type, index) => (
          <MenuItem key={index} value={type}>
            {translate(`${translateKey}.${type}`)}
          </MenuItem>
        ))}
      </Select>
      <Tooltip title={order === ASC ? 'Crescente' : 'Decrescente'}>
        <IconButton color='secondary' onClick={() => setOrder(order === ASC ? DESC : ASC)} sx={{ ml: { xs: 0, sm: 1 } }}>
          <SwapVertRounded />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
