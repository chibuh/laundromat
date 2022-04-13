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
import TextField from '@mui/material/TextField';

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

function randomNumber(min, max) { 
  return Math.floor(Math.random() * (max - min) + min);
}

function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            AVAIABLE PACKAGES
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


// function preventDefault(event) {
//   event.preventDefault();
// }


export default function Deposits(props) {

  const [rows,setRows] = React.useState([]);
  const [reload,setReload] = React.useState(0);
 
  React.useEffect(() => {
    axios.post(`/api/packagedetails`, { 
      PID: sessionStorage.getItem('PID')
    })
    .then(response=>
      {
        console.log(response.data);
        setRows(response.data);
      })
      .catch(error=>console.log(error))
    }, [])

      
    
    const [open, setOpen] = React.useState(false);  //place order
    const [open1, setOpen1] = React.useState(false); //buy Package

    if(rows.length) 
    {
      let washesLeft = rows[0].MaxWashes-parseInt(sessionStorage.getItem('washes'));

      const handleOpen = () => setOpen(true);   const handleClose = () => setOpen(false);
      const handleOpen1 = () => setOpen1(true); const handleClose1 = () => setOpen1(false);
      
        function buyPackage()
        {
          if(washesLeft) alert('You have washes left!');
          else handleOpen1();
        }
        function placeOrder(){
          if(washesLeft) handleOpen();
          else  alert('You have 0 washes left! Buy a package first to place order.');
        }

        const handleSubmitOrder = (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          
          const orderid = 'ORD'+randomNumber(10,99999);

          let weight= data.get('weight');

            if(washesLeft>0 && weight<=6)
            {
              axios.post(`/api/placeOrder`, {
                UID: sessionStorage.getItem('details'), 
                Weight: weight,
                LID : 'L001',
                OrderID: orderid,
                PID: sessionStorage.getItem('PID')
              })
              .then(response=>
              {
                console.log(response)
                // setTimeout(setReload(reload+1), 5000);

                washesLeft--;
                sessionStorage.setItem('washes',parseInt(sessionStorage.getItem('washes'))+1);
              })
              .catch(error=>console.log(error))
            }
            else if(weight>6) alert('WEIGHT LIMIT EXCEEDED!');
            else alert('All washes used! Please buy a new package.')
    };

    return (
      <>
      <React.Fragment>
        <Title>Current Package</Title>
        <Typography component="p" variant="h4">
          ₹{rows[0].Price}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          Due Date : {rows[0].EndDate.slice(8,10)+' '+months[parseInt(rows[0].EndDate.slice(6,8))-1]+' '+rows[0].EndDate.slice(0,4)}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          Start Date : {rows[0].StartDate.slice(8,10)+' '+months[parseInt(rows[0].StartDate.slice(6,8))-1]+' '+rows[0].StartDate.slice(0,4)}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          Washes Left : {washesLeft} out of {rows[0].MaxWashes} washes
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Link color="primary" onClick={placeOrder}>
              Place Order
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link color="primary" onClick={buyPackage}>
              Buy Package
            </Link>
          </Grid>
        </Grid>
      </React.Fragment>

      <div>
        <Modal
          open={open1}
          onClose={handleClose1}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            AVAIABLE PACKAGES
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            PLACE ORDER
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmitOrder} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="weight"
                label= "weight"
                name="weight"
                autoComplete="weight"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
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