import React from 'react'
import { Translate, translate } from 'react-jhipster'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { AuctionTimer } from 'app/shared/components/AuctionTimer'
import { AvatarWithSkeleton } from 'app/shared/components/AvatarWithSkeleton'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { formatCurrency, getStatusColor, showElement } from 'app/shared/util/data-utils'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { CloseOutlined, DirectionsCarRounded, HomeRounded, MoreRounded } from '@mui/icons-material'
import { BidHistoryModal } from '../bid/BidHistoryModal'
import { StatusRibbon } from 'app/shared/components/StatusRibbon'

interface IConsortiumHistoryModalProps {
  setOpenConsortiumHistoryModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const ConsortiumHistoryModal = ({ setOpenConsortiumHistoryModal, entityConsortium }: IConsortiumHistoryModalProps) => {
  const [openBidHistoryModal, setOpenBidHistoryModal] = React.useState(false)

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
          borderRadius: '1rem',
          mt: 2,
          position: 'relative',
          ':hover': {
            scale: '1 !important',
          },
        }}
        elevation={0}
        onClick={() => setOpenBidHistoryModal(true)}
      >
        <Box
          sx={{
            overflow: 'hidden',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <IconButton
            sx={{
              background: defaultTheme.palette.background.paper,
              position: 'absolute',
              top: 30,
              ':hover': {
                background: defaultTheme.palette.background.paper,
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
          variant='filled'
          size='small'
          style={showElement(!!consortium?.bids?.length)}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            cursor: 'pointer',
            background: defaultTheme.palette.background.paper,
            color: defaultTheme.palette.secondary.main,
            border: `1px solid ${defaultTheme.palette.secondary['A100']}`,
          }}
        />
        {contemplationStatus && StatusRibbon()}
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
              <AuctionTimer created={created} consortium={consortium} />
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
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenConsortiumHistoryModal(false)}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography color='secondary' fontWeight={'600'} fontSize={'18px'}>
            <Translate contentKey='repasseconsorcioApp.consortium.home.title'>Consortium</Translate> #{entityConsortium.id}
          </Typography>
          <IconButton onClick={() => setOpenConsortiumHistoryModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
          <ConsortiumCard consortium={entityConsortium} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConsortiumHistoryModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
            <Translate contentKey='entity.action.back'>Back</Translate>
          </Button>
        </DialogActions>
      </Dialog>
      {openBidHistoryModal && <BidHistoryModal setOpenBidHistoryModal={setOpenBidHistoryModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}
