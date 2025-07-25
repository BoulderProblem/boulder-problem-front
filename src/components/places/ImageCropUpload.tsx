import React, { useRef, useState, useCallback } from 'react';
import { IconButton, Dialog, Slider, Button } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface Props {
  onImageCropped: (file: Blob | null) => void;
  className?: string;
}

const ImageCropUpload: React.FC<Props> = ({ onImageCropped, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setOpen(true);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setOpen(false);
    onImageCropped(croppedImage);
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={onSelectFile}
      />
      <IconButton
        onClick={() => inputRef.current?.click()}
        color="primary"
        component="span"
        className={className}
      >
        <PhotoCamera />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 400,
            background: '#333',
          }}
        >
          <Cropper
            image={imageSrc!}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div style={{ padding: 16 }}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value as number)}
          />
          <Button
            onClick={handleCropSave}
            variant="contained"
            color="primary"
            fullWidth
          >
            Utiliser cette image
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default ImageCropUpload;
