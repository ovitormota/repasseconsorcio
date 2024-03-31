import { Avatar, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material'
import React from 'react'
import { defaultTheme } from '../layout/themes'
import { useBreakpoints } from '../util/useBreakpoints'

export const ConsortiumCardSkeleton = () => {
  const { isSMScreen } = useBreakpoints()

  return (
    <List sx={{ mb: '150px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
      {[...Array(isSMScreen ? 10 : 2)].map((_, index) => (
        <Card
          key={index}
          sx={{
            mx: { xs: 1.1, sm: 1.1 },
            my: { xs: 1.1, sm: 1.1 },
            width: { xs: '90vw', sm: '330px' },
            background: defaultTheme.palette.background.paper,
            boxShadow: '1px 1px rgba(97, 57, 173, 0.2)',
            borderRadius: '10px',
          }}
        >
          <CardContent sx={{ p: 1.5 }}>
            <ListItem sx={{ mb: 1 }}>
              <ListItemIcon sx={{ mr: 1 }}>
                <Skeleton variant='circular' width={50} height={50} />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column-reverse',
                  background: 'none !important',
                  padding: '0 !important',
                }}
                primaryTypographyProps={{
                  fontSize: '12px !important',
                  sx: {
                    justifyContent: 'space-between',
                    display: 'flex',
                    width: '100%',
                  },
                }}
                primary={
                  <>
                    <span>
                      <Skeleton width={100} />
                    </span>
                    <strong style={{ color: defaultTheme.palette.secondary.main }}>
                      <Skeleton width={30} />
                    </strong>
                  </>
                }
                secondary={<Skeleton width={120} />}
              />
            </ListItem>

            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={<Skeleton width={100} />}
              secondary={<Skeleton width={50} />}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={<Skeleton width={100} />}
              secondary={<Skeleton width={50} />}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={<Skeleton width={100} />}
              secondary={<Skeleton width={50} />}
            />

            <ListItem sx={{ mt: 1 }}>
              <ListItemText
                primaryTypographyProps={{ fontSize: '12px !important' }}
                primary={<Skeleton width={150} />}
                secondary={<Skeleton width={100} />}
                secondaryTypographyProps={{
                  fontSize: '22px !important',
                  fontWeight: '600',
                }}
              />
            </ListItem>

            <ListItem sx={{ p: 0 }}>
              <Skeleton variant='rectangular' width='100%' height={35} sx={{ borderRadius: '8px' }} />
            </ListItem>
          </CardContent>
        </Card>
      ))}
    </List>
  )
}
