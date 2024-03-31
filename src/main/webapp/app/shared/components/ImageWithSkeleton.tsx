import React, { useState } from 'react'
import { Skeleton } from '@mui/material'

export const ImageWithSkeleton = ({ src, alt, width }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <>
      {imageLoaded ? <img src={src} alt={alt} width={width} loading='lazy' /> : <Skeleton variant='circular' width={width} height={width} />}
      <img src={src} alt={alt} width={width} loading='lazy' onLoad={handleImageLoad} style={{ display: 'none' }} />
    </>
  )
}
