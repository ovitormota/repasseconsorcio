import React, { Fragment } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Avatar, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider } from '@mui/material'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { formatCreated, formatCurrency } from 'app/shared/util/data-utils'

interface IConsortiumHistoryModalProps {
  setOpenConsortiumHistoryModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const ConsortiumHistoryModal = ({ setOpenConsortiumHistoryModal, entityConsortium }: IConsortiumHistoryModalProps) => {
  const renderStatusRibbon = () => (
    <div className='ribbon'>
      <a href=''>{translate('repasseconsorcioApp.consortium.contemplationStatus.approved')}</a>
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
        variant='elevation'
        sx={{
          width: '330px',
          maxWidth: '90vw',
          background: 'transparent',
          ':hover': {
            backgroundColor: defaultTheme.palette.primary.main,
            cursor: 'pointer',
            scale: '1 !important',
          },
        }}
      >
        <CardContent>
          <List>
            {contemplationStatus && renderStatusRibbon()}

            <ListItem sx={{ my: 2 }}>
              <ListItemIcon sx={{ mr: 1 }}>
                <Avatar alt={name} src={name} sx={{ width: 50, height: 50 }} />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'flex-start',
                  flexDirection: 'column-reverse',
                  background: 'none !important',
                }}
                primary={`${translate('repasseconsorcioApp.consortium.segmentType')}: ${translate(`repasseconsorcioApp.SegmentType.${segmentType}`)}`}
                secondary={name}
              />
            </ListItem>

            <ListItemText
              sx={{ my: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')} `}
              secondary={numberOfInstallments}
            />
            <ListItemText
              sx={{ my: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.installmentValue')} `}
              secondary={formatCurrency(installmentValue)}
            />

            <ListItem sx={{ mt: 2, mb: 0 }}>
              <ListItemText
                primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
                secondary={formatCurrency(consortiumValue)}
                secondaryTypographyProps={{
                  fontSize: '22px !important',
                  fontWeight: '600',
                }}
              />
            </ListItem>
            <IconButton onClick={() => setOpenConsortiumHistoryModal(false)} sx={{ position: 'absolute', top: 0, right: 0 }}>
              <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
            </IconButton>
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
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main },
        }}
        onClose={() => setOpenConsortiumHistoryModal(false)}
      >
        <ConsortiumCard consortium={entityConsortium} />
      </Dialog>
    </ThemeProvider>
  )
}
