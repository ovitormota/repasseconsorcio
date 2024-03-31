import { Avatar } from '@mui/material'
import React, { useState } from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component'

export const AvatarWithSkeleton = ({ imageUrl, firstName, width }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <LazyLoadComponent>
      {!imageUrl && (
        <Avatar
          sx={{
            width,
            height: width,
            margin: 'auto',
          }}
        >
          {firstName && firstName[0]}
        </Avatar>
      )}
      {imageUrl && <img onLoad={handleImageLoad} src={imageUrl} alt={firstName} style={{ borderRadius: '50%', width, height: width }} />}
    </LazyLoadComponent>
  )
}
