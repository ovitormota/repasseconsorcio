import { AddAPhoto, Delete, Edit } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { useAppSelector } from 'app/config/store'
import 'cropperjs/dist/cropper.css'
import React, { useRef, useState } from 'react'
import Cropper from 'react-cropper'
import { Translate } from 'react-jhipster'
import { defaultTheme } from 'app/shared/layout/themes'

interface IImageUploaderProps {
  onUpload: (image: any) => void
  currentImage?: string
  name?: string
  isUser?: boolean
}

export const ImageUploader: React.FC<IImageUploaderProps> = ({ onUpload, currentImage, name, isUser = true }) => {
  const cropperRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)
  const [defaultImage, setDefaultImage] = useState<string | null>(currentImage)
  const [originalFileName, setOriginalFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setOriginalFileName(file.name) // Armazena o nome do arquivo original
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper
      if (cropper) {
        cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
          if (blob) {
            const file = new File([blob], originalFileName, { type: 'image/jpeg' })

            onUpload(file)
            convertBlobToBase64(blob)
              .then((base64String: string) => {
                setCroppedImage(base64String)
              })
              .catch((error: any) => {
                console.error('Error converting blob to base64:', error)
              })
          }
        }, 'image/jpeg')
      }
    }
  }

  const convertBlobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  const clearImage = () => {
    setDefaultImage(null)
    setSelectedImage(null)

    if (croppedImage) {
      setCroppedImage(null)
    }

    onUpload(null)
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' mb={2}>
      {selectedImage && !croppedImage ? (
        <Dialog
          open={true}
          sx={{ backgroundColor: defaultTheme.palette.background.default }}
          PaperProps={{
            sx: {
              borderRadius: '1em',
              background: defaultTheme.palette.primary.main,
              p: { sm: 2 },
              minWidth: { xs: '92vw', sm: '80vw', md: '600px' },
              overflowX: 'hidden',
            },
          }}
        >
          <DialogContent>
            <Cropper ref={cropperRef} src={selectedImage} aspectRatio={isUser ? 1 : 16 / 9} width={isUser ? 300 : 533} height={300} guides={true} initialAspectRatio={1} />
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button variant='text' sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }} onClick={() => setSelectedImage(null)}>
                <Translate contentKey='entity.action.cancel'>Cancel</Translate>
              </Button>
              <Button onClick={handleCrop} color='secondary' variant='contained' sx={{ fontWeight: '600' }}>
                <Translate contentKey='entity.action.edit'>Edit</Translate>
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      ) : (
        (!selectedImage || croppedImage || defaultImage) && (
          <Box>
            <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileChange} style={{ display: 'none' }} />
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={croppedImage || defaultImage}
                alt={name}
                sx={{ width: isUser ? 130 : 230, height: 130, cursor: 'pointer', fontSize: '3rem', borderRadius: isUser ? '50%' : '8px' }}
                onClick={handleAvatarClick}
              >
                {name ? name[0].toUpperCase() : ''}
              </Avatar>
              {selectedImage || croppedImage || defaultImage ? (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    left: -4,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: defaultTheme.palette.secondary.main,
                    background: defaultTheme.palette.primary.main,

                    '&:hover': {
                      color: defaultTheme.palette.primary.main,
                      background: defaultTheme.palette.secondary.main,
                    },
                  }}
                  onClick={clearImage}
                >
                  <Delete style={{ fontSize: 18 }} />
                </IconButton>
              ) : null}

              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: defaultTheme.palette.secondary.main,
                  background: defaultTheme.palette.primary.main,

                  '&:hover': {
                    color: defaultTheme.palette.primary.main,
                    background: defaultTheme.palette.secondary.main,
                  },
                }}
                onClick={handleAvatarClick}
              >
                {defaultImage ? <Edit style={{ fontSize: 18 }} /> : <AddAPhoto style={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Box>
        )
      )}
    </Box>
  )
}
