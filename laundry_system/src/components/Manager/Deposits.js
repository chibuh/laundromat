import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {

  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
      ₹8,000.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 April, 2022
      </Typography>
      
    </React.Fragment>
  );
}