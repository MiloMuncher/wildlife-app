import React from 'react';
import { Container, Typography} from '@mui/material';

function SupplySuccess() {

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Success!
      </Typography>
      <Typography variant="h6" color="textSecondary" paragraph>
        The food item has been successfully added to the database.
      </Typography>
    </Container>
  );
}

export default SupplySuccess;
