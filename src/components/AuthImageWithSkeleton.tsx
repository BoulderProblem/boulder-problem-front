import React, { useState, useEffect } from 'react';
import ImageWithToken from 'react-image-with-auth';
import { Skeleton, Box } from '@mui/material';

interface AuthImageProps {
  imageUrl: string;
  token: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

const AuthImageWithSkeleton: React.FC<AuthImageProps> = ({
  imageUrl,
  token,
  alt,
  width = '100%',
  height = '100%',
  style,
  className,
}) => {
  const [loaded, setLoaded] = useState(false);

  // charger l’image séparément pour savoir quand elle est prête
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
  }, [imageUrl]);

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
      className={className}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      <ImageWithToken
        imageUrl={imageUrl}
        token={token}
        alt={alt}
        style={{
          ...style,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
};

export default AuthImageWithSkeleton;
