import { UploadFileRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { defaultTheme } from '../layout/themes'

export const MyDropzone = ({ onFileUpload, consortiumExtract }) => {
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
        onFileUpload(base64)
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

  return (
    <Box
      {...getRootProps()}
      sx={{
        ...dropzoneStyle,
        backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
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
        <p>Arraste e solte o arquivo PDF aqui ou clique para selecioná-lo.</p>
      )}
    </Box>
  )
}

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
}
