import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

import axios from "../../axios-study"

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


export default function DepositsProfile(props) {

  const [rows,setRows] = React.useState([]);

  React.useEffect(() => {
    axios.post(`/api/userInfo`, { 
      UID: sessionStorage.getItem('details')
    })
    .then(response=>
      {
        console.log(response.data);
        setRows(response.data);
      })
      .catch(error=>console.log(error))
    }, [])

      
    if(rows.length) 
    {
      return (
      <>
      <React.Fragment>
        <Title>My Details</Title>
        <Typography component="p" variant="h4">
          {rows[0].FirstName+' '+rows[0].LastName+' ('+rows[0].Sex+')'}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          User ID : {rows[0].UID}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          Registered Email : {rows[0].Email}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          Phone : {rows[0].Phone}
        </Typography>
      </React.Fragment>
      </>
    );
  }
  else
  {
    return (
    
      <React.Fragment>
        <Title>Current Package</Title>
        <Typography component="p" variant="h4">
          ₹ -
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          Fetching Data
        </Typography>
      </React.Fragment>
    );
  }
}