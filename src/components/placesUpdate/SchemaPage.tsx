import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Slider,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Colorize as ColorizeIcon,
  ZoomIn as ZoomIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import React, { useRef, useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { useAvatar } from '@/hooks/useAvatar';
import { useAuth } from '@/services/useAuth';

interface SchemaPageProps {
  onImageProcessed?: (imageDataUrl: string) => void;
  imageUrl: string;
  wayId: string;
}

export default function SchemaPage({
  onImageProcessed,
  imageUrl,
  wayId,
}: SchemaPageProps) {
  const { token } = useAuth();
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loupeRef = useRef<HTMLCanvasElement | null>(null);
  const [hasImageInResultCanvas, setHasImageInResultCanvas] = useState(false);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [targetColor, setTargetColor] = useState({ r: 0, g: 120, b: 255 });
  const [tolerance, setTolerance] = useState(40);
  const [loupePosition, setLoupePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  let avatarUrl = '';
  if (wayId !== '') {
    avatarUrl = useAvatar(wayId || '', imageUrl, token || '', 'way');
  }

  useEffect(() => {
    const loadAndDisplayImage = async () => {
      if (!wayId) return;

      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          const canvas = resultCanvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Ajuster la taille du canvas à celle de l'image
          canvas.width = img.width;
          canvas.height = img.height;

          // Dessiner l'image
          ctx.drawImage(img, 0, 0);
        };

        if (
          imageUrl &&
          (imageUrl.startsWith('data:') || imageUrl.startsWith('http'))
        ) {
          img.src = imageUrl;
        } else if (avatarUrl) {
          setHasImageInResultCanvas(true);
          img.src = avatarUrl;
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error);
      }
    };

    loadAndDisplayImage();
  }, [wayId, imageUrl, avatarUrl]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5, // Taille maximale du fichier en MB
        maxWidthOrHeight: 800, // Taille maximale en largeur/hauteur
        useWebWorker: true, // Utilise un Web Worker pour de meilleures performances
      };

      let compressedFile: File;
      try {
        compressedFile = await imageCompression(file, options);
      } catch (error) {
        console.error('Erreur lors de la compression:', error);
        compressedFile = file; // En cas d'erreur, on garde le fichier original
      }

      // Créer une URL pour l'image compressée
      const img = new Image();
      const imgUrl = URL.createObjectURL(compressedFile);

      img.onload = () => {
        setImage(img);
        // Convertir en base64 pour le stockage
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Qualité à 80%
          if (onImageProcessed) {
            onImageProcessed(dataUrl);
          }
        }
        URL.revokeObjectURL(imgUrl); // Nettoyer l'URL
      };

      img.src = imgUrl;
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
    }
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setTolerance(newValue);
    }
  };

  const handlePickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * canvas.height
    );

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * canvas.height
    );
    const x_loupe = Math.floor(
      ((e.clientX - rect.left) / rect.width / (canvas.width / rect.width)) *
        canvas.width
    );
    const y_loupe = Math.floor(
      ((e.clientY - rect.top) / rect.height / (canvas.height / rect.height)) *
        canvas.height
    );

    setLoupePosition({ x: x_loupe, y: y_loupe });
    drawLoupe(x, y);
  };

  const drawLoupe = (x: number, y: number, zoom = 3, size = 100) => {
    const canvas = loupeRef.current;
    const ctx = canvas?.getContext('2d');
    const previewCanvas = previewCanvasRef.current;
    if (!canvas || !ctx || !previewCanvas) return;

    canvas.width = size;
    canvas.height = size;

    const sx = Math.max(0, x - size / (2 * zoom));
    const sy = Math.max(0, y - size / (2 * zoom));
    const sWidth = Math.min(previewCanvas.width - sx, size / zoom);
    const sHeight = Math.min(previewCanvas.height - sy, size / zoom);

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(previewCanvas, sx, sy, sWidth, sHeight, 0, 0, size, size);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 5, 0, Math.PI * 2);
    ctx.stroke();
  };

  function rgb2lab({ r, g, b }: { r: number; g: number; b: number }) {
    let R = r / 255,
      G = g / 255,
      B = b / 255;

    R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
    G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
    B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

    let X = R * 0.4124 + G * 0.3576 + B * 0.1805;
    let Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    let Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    X /= 0.95047;
    Y /= 1.0;
    Z /= 1.08883;

    const f = (t: number) =>
      t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;

    const L = 116 * f(Y) - 16;
    const a = 500 * (f(X) - f(Y));
    const bLab = 200 * (f(Y) - f(Z));

    return { L, a, b: bLab };
  }

  useEffect(() => {
    if (!image) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
  }, [image]);

  useEffect(() => {
    if (!image) return;

    const canvas = resultCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const targetLAB = rgb2lab(targetColor);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const pixelLAB = rgb2lab({ r, g, b });

      const dist = Math.sqrt(
        Math.pow(pixelLAB.L - targetLAB.L, 2) +
          Math.pow(pixelLAB.a - targetLAB.a, 2) +
          Math.pow(pixelLAB.b - targetLAB.b, 2)
      );

      if (dist < tolerance) {
        data[i] = targetColor.r;
        data[i + 1] = targetColor.g;
        data[i + 2] = targetColor.b;
      } else {
        const gray = (r + g + b) / 3;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setHasImageInResultCanvas(true);

    if (onImageProcessed) {
      onImageProcessed(canvas.toDataURL('image/png'));
    }
  }, [image, targetColor, tolerance, onImageProcessed]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-image"
            type="file"
            onChange={handleUpload}
          />
          <label htmlFor="upload-image">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              size="large"
              sx={{ borderRadius: 2, px: 4, py: 1.5, minWidth: '200px' }}
            >
              Télécharger une image
            </Button>
          </label>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            size="large"
            onClick={() => {
              if (onImageProcessed) onImageProcessed('');
              setImage(null);
              setHasImageInResultCanvas(false);
              const previewCtx = previewCanvasRef.current?.getContext('2d');
              const resultCtx = resultCanvasRef.current?.getContext('2d');
              if (previewCtx && previewCanvasRef.current) {
                previewCtx.clearRect(
                  0,
                  0,
                  previewCanvasRef.current.width,
                  previewCanvasRef.current.height
                );
              }
              if (resultCtx && resultCanvasRef.current) {
                resultCtx.clearRect(
                  0,
                  0,
                  resultCanvasRef.current.width,
                  resultCanvasRef.current.height
                );
              }
            }}
            sx={{ borderRadius: 2, px: 4, py: 1.5, minWidth: '200px' }}
          >
            Supprimer l'image
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {image && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
              }}
            >
              <CardHeader
                title="Image d'origine"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                avatar={
                  <Tooltip title="Cliquez pour sélectionner une couleur">
                    <ColorizeIcon color="action" />
                  </Tooltip>
                }
              />
              <CardContent
                sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <canvas
                      ref={previewCanvasRef}
                      onClick={handlePickColor}
                      onMouseMove={handleMouseMove}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        cursor: 'crosshair',
                      }}
                    />
                  </Paper>
                  {loupePosition && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: loupePosition.x,
                        top: loupePosition.y,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        overflow: 'hidden',
                        pointerEvents: 'none',
                        zIndex: 1000,
                        boxShadow: 3,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <canvas ref={loupeRef} />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        {(image || hasImageInResultCanvas) && (
          <Grid size={{ xs: 12, md: image ? 6 : 12 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
              }}
            >
              <CardHeader
                title="Résultat"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                action={
                  image && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          bgcolor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
                          border: '1px solid',
                          borderColor: 'divider',
                          mr: 1.5,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Couleur
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {targetColor.r}, {targetColor.g}, {targetColor.b}
                        </Typography>
                      </Box>
                    </Box>
                  )
                }
              />
              <CardContent
                sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <canvas
                    ref={resultCanvasRef}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </Paper>

                {image && (
                  <Box sx={{ px: 3, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <ZoomIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Tolérance de couleur
                      </Typography>
                    </Box>
                    <Slider
                      value={tolerance}
                      onChange={handleChange}
                      min={10}
                      max={200}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                      sx={{
                        '& .MuiSlider-thumb': {
                          width: 16,
                          height: 16,
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.16)',
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
