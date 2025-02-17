import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import http from '../../../http.js';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import QrCodeWithLogo from 'qrcode-with-logos';
import Logo from './sizedlogo.png';

function SupplyQR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const fromFoodPage = location.state?.fromFoodPage; 

  const [data, setData] = useState(null);
  const [filename, setFilename] = useState('');
  const [isQRGenerated, setQRGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const endpoint = fromFoodPage
        ? `https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/food/${id}`
        : `https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications/${id}`;

      try {
        const response = await http.get(endpoint);
        const itemData = response.data;
        setData(itemData);
        setFilename(`${itemData.name}.png`);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id, fromFoodPage]);

  useEffect(() => {
    if (data && canvasRef.current) {
      const canvas = canvasRef.current;
      try {
        new QrCodeWithLogo({
          canvas: canvas,
          content: `https://dev.d1hih7jskxsvbh.amplifyapp.com/animaldata/${id}`,
          width: 300
        });
        setQRGenerated(true);
        drawLogoOverQRCode();
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    }
  }, [data]);

  const drawLogoOverQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const logoImg = new Image();
    logoImg.src = Logo;
    logoImg.onload = () => {
      const logoWidth = 100;
      const logoHeight = 100;
      const centerX = (canvas.width - logoWidth) / 2;
      const centerY = (canvas.height - logoHeight) / 2;
      ctx.drawImage(logoImg, centerX, centerY, logoWidth, logoHeight);
    };
  };

  const downloadQRCode = () => {
    const qrcodeImage = canvasRef.current;
    const pngUrl = qrcodeImage.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Grid container alignItems="center" spacing={2} justifyContent="center">
        <Grid item>
          <IconButton
            component={Link}
            to={fromFoodPage ? "/admin/viewfood" : "/admin/viewmedications"}
            color="inherit"
          >
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="h4" sx={{ my: 2 }}>
            QR Code for {data?.name} ({fromFoodPage ? "Food" : "Medication"})
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item>
          {loading ? (
            <Box
              sx={{
                bgcolor: "grey",
                width: 300,
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                style={{ border: "1px solid black", marginTop: 20 }}
              ></canvas>
              {isQRGenerated ? (
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={downloadQRCode}>
                    DOWNLOAD
                  </Button>
                </Box>
              ) : (
                <Typography>No valid QR data available</Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default SupplyQR;
