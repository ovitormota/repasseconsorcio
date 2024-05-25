import { CloseOutlined, CloudDownloadRounded, UploadFileRounded } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ThemeProvider, Typography } from '@mui/material'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Translate, translate } from 'react-jhipster'

interface IEditExtractConsortiumProps {
  setOpenEditExtractConsortiumModal: (value: boolean) => void
  setConsortiumExtract: (value: any) => void
  consortiumExtract: string | null
  onConsortium?: IConsortium
  handleSave?: (event: any) => void
}

export const EditExtractConsortium = ({ setOpenEditExtractConsortiumModal, setConsortiumExtract, consortiumExtract, onConsortium, handleSave }: IEditExtractConsortiumProps) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        const base64 = btoa(new Uint8Array(reader.result as ArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))

        // Salvar o conteúdo base64 do PDF como blob
        const blob = new Blob([new Uint8Array(reader.result as ArrayBuffer)], { type: 'application/pdf' })
        const blobUrl = URL.createObjectURL(blob)
        setPdfBlobUrl(blobUrl)

        // Fazer upload do arquivo (opcional)
        setConsortiumExtract(base64)
      }

      reader.readAsArrayBuffer(file)
    })
  }, [])

  const openPdfViewer = () => {
    if (pdfBlobUrl) {
      // Abrir o PDF em uma nova aba
      window.open(pdfBlobUrl)
    } else {
      console.error('Nenhum PDF disponível para visualização.')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    maxSize: 5 * 1024 * 1024, // Limite de 5 MB
  })

  const handleDownloadPDF = () => {
    console.log('onConsortium', onConsortium?.consortiumExtract)
    if (onConsortium?.consortiumExtract) {
      const byteCharacters = atob(onConsortium.consortiumExtract)
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      // Fazer download do arquivo PDF
      const a = document.createElement('a')
      a.href = url
      a.download = 'extrato-consorcio.pdf'
      a.click()
    } else {
      console.error('Nenhum PDF disponível para download.')
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenEditExtractConsortiumModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Atualizar extrato do consórcio
          <IconButton onClick={() => setOpenEditExtractConsortiumModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <p>Faça o download do extrato original, edite-o e faça o upload do extrato editado.</p>

            {/* Botão para fazer download do arquivo original */}
            <Button onClick={handleDownloadPDF} variant='contained' color='secondary' startIcon={<CloudDownloadRounded />}>
              Baixar Extrato Original
            </Button>
          </Box>

          <Box
            {...getRootProps()}
            sx={{
              ...dropzoneStyle,
              backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
              mt: 2,
            }}
          >
            <input {...getInputProps()} />
            <UploadFileRounded sx={{ fontSize: '40px', color: defaultTheme.palette.secondary.main, mb: 2, mt: 1 }} />

            {consortiumExtract ? (
              <>
                <p>Arquivo PDF selecionado com sucesso!</p>
                <p>Clique para selecionar outro arquivo ou arraste e solte aqui.</p>
                {/* Botão para visualizar o PDF */}
                <Button onClick={openPdfViewer} variant='outlined' color='secondary'>
                  Visualizar PDF
                </Button>
              </>
            ) : isDragActive ? (
              <p>Solte o arquivo PDF aqui...</p>
            ) : (
              <p>Arraste e solte o arquivo PDF editado aqui ou clique para selecioná-lo.</p>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ pt: '1em' }}>
          <Button onClick={() => setOpenEditExtractConsortiumModal(false)} sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }}>
            <Translate contentKey='entity.action.back'>Voltar</Translate>
          </Button>
          <Button
            sx={{
              background: defaultTheme.palette.secondary.main,
              color: defaultTheme.palette.secondary.contrastText,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                backgroundColor: defaultTheme.palette.secondary.main,
              },
            }}
            disabled={!consortiumExtract}
            onClick={handleSave}
            variant='contained'
          >
            <Typography variant='button'>{translate('repasseconsorcioApp.consortium.approve')}</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
}
