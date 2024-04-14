import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'

export const SkeletonTable = ({ rowCount, columnCount }) => {
  // Função para criar um array com números sequenciais para simular chaves únicas
  const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i)

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {range(0, columnCount).map((index) => (
              <TableCell key={index} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {range(0, rowCount).map((index) => (
            <TableRow key={index}>
              {range(0, columnCount).map((item) => (
                <TableCell key={item} sx={{ py: 0, background: 'transparent' }}>
                  <Skeleton animation='wave' height={50} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
