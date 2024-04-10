import React from 'react'
import { translate } from 'react-jhipster'

import { Box, Card, CardContent, Chip, Dialog, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider } from '@mui/material'
import { AuctionTimer } from 'app/shared/components/AuctionTimer'
import { AvatarWithSkeleton } from 'app/shared/components/AvatarWithSkeleton'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { formatCurrency, getStatusColor, showElement } from 'app/shared/util/data-utils'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { DirectionsCarRounded, HomeRounded, MoreRounded } from '@mui/icons-material'

interface IConsortiumHistoryModalProps {
  setOpenConsortiumHistoryModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const ConsortiumHistoryModal = ({ setOpenConsortiumHistoryModal, entityConsortium }: IConsortiumHistoryModalProps) => {
  const renderStatusRibbon = () => (
    <div className='ribbon'>
      <a href=''>{translate('repasseconsorcioApp.consortium.contemplationTypeStatus.approved')}</a>
    </div>
  )

  const ConsortiumCard = ({ consortium }: { consortium: IConsortium }) => {
    const {
      consortiumAdministrator: { name, image },
      segmentType,
      consortiumValue,
      numberOfInstallments,
      installmentValue,
      created,
      contemplationStatus,
      minimumBidValue,
      status,
    } = consortium
    return (
      <Card
        sx={{
          background: defaultTheme.palette.background.paper,
          border: '1px solid rgba(72, 86, 150, 0.05)',
          borderRadius: '1rem',
          ':hover': {
            scale: '1 !important',
          },
          position: 'relative',
        }}
        elevation={2}
      >
        <Box
          sx={{
            borderRadius: '0% 0% 50% 50% / 21% 55% 30% 30%',
            background: defaultTheme.palette.primary.light,
            overflow: 'hidden',
            width: { xs: '90vw', sm: '330px' },
            height: '55px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <IconButton
            sx={{
              background: defaultTheme.palette.primary.main,
              position: 'absolute',
              top: 30,
              ':hover': {
                background: defaultTheme.palette.primary.main,
              },
            }}
          >
            {segmentType === SegmentType.AUTOMOBILE ? (
              <DirectionsCarRounded sx={{ fontSize: '30px', color: defaultTheme.palette.secondary.light }} />
            ) : segmentType === SegmentType.REAL_ESTATE ? (
              <HomeRounded sx={{ fontSize: '30px', color: defaultTheme.palette.secondary.light }} />
            ) : (
              <MoreRounded sx={{ fontSize: '25px', color: defaultTheme.palette.secondary.light }} />
            )}
          </IconButton>
        </Box>
        <Chip
          label={consortium?.bids?.length ? `${consortium?.bids?.length} lances` : 'Sem lances'}
          color={getStatusColor(status)}
          variant='outlined'
          size='small'
          style={showElement(!!consortium?.bids?.length)}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            cursor: 'pointer',
          }}
        />
        {contemplationStatus && renderStatusRibbon()}
        <CardContent sx={{ p: 1.5 }}>
          <List>
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.consortiumAdministrator')} `}
              secondary={name}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')} `}
              secondary={numberOfInstallments}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              secondaryTypographyProps={{ fontWeight: '600 !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.installmentValue')} `}
              secondary={formatCurrency(installmentValue)}
            />
            <hr className='hr-text' data-content='' style={{ height: 0 }} />

            <ListItem sx={{ m: 0, p: 0 }}>
              <ListItemText
                primaryTypographyProps={{ fontSize: '12px !important' }}
                primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
                secondary={formatCurrency(consortiumValue)}
                secondaryTypographyProps={{
                  fontSize: '25px !important',
                  fontWeight: '600 !important',
                }}
              />
            </ListItem>
            <hr className='hr-text' data-content='' style={{ height: 0 }} />
            <ListItem sx={{ m: 0, p: 0 }}>
              <AuctionTimer created={created} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '10px', background: defaultTheme.palette.primary.main, width: { xs: '90vw', sm: '330px' } },
        }}
        onClose={() => setOpenConsortiumHistoryModal(false)}
      >
        <ConsortiumCard consortium={entityConsortium} />
      </Dialog>
    </ThemeProvider>
  )
}
