import React from 'react';
import { IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'; // For navigation

const BackButton = () => {
  const navigate = useNavigate(); // For navigating back to the previous page

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <IconButton 
      color="primary" 
      onClick={handleBack} 
      style={{ fontSize: '16px' }} // Adjust font size for text
      size="small" // Adjust the size of the button itself
    >
      <ArrowBackIcon style={{ fontSize: '18px' }} /> {/* Adjust the icon size */}
      <Typography variant="button" style={{ marginLeft: '8px' }}>
        Back
      </Typography>
    </IconButton>
  );
};

export default BackButton;
