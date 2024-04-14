import { Avatar, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import { LazyLoadComponent, LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

export const AvatarWithSkeleton = ({ imageUrl, firstName, width }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <LazyLoadComponent>
      {!imageUrl ? (
        <Avatar
          sx={{
            width,
            height: width,
            margin: 'auto',
          }}
        >
          {firstName && firstName[0]}
        </Avatar>
      ) : (
        <LazyLoadImage beforeLoad={handleImageLoad} src={imageUrl} alt={firstName} effect='blur' width={width} height={width} style={{ borderRadius: '50%' }} loading='lazy' />
      )}
    </LazyLoadComponent>
  )
}
