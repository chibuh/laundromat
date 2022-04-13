import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import SignIMG from '../assets/SignIN.png';
import axios from "../axios-study"

import { useNavigate } from "react-router-dom"

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const theme = createTheme();

export default function SignIN() {
  const [managerLog,setManagerLog]=React.useState(0);
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  function handleClick(){
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let email= data.get('email');
    let password= data.get('password');
    let user = 'student';
    if(managerLog)  user='manager';
    console.log(email, password);
    
    
    axios.post(`/api/login?user=${user}`, {
      id: email, 
      pass: password
    })
    .then(response=>
    {
      console.log(response)
      // console.log(response.data.length)
      if(response.data.length)
      {
        if(managerLog)
        {
          sessionStorage.setItem('details',response.data[0].ManagerID);
          sessionStorage.setItem('user','manager');
          navigate(process.env.PUBLIC_URL + '/manager');
        }
        else
        {
          sessionStorage.setItem('details',response.data[0].UID);
          sessionStorage.setItem('PID',response.data[0].PID);
          sessionStorage.setItem('washes',response.data[0].WashesUsed);

          sessionStorage.setItem('user','student');
          navigate(process.env.PUBLIC_URL + '/student');
        }
      }
      else handleClick();

    })
    .catch(error=>console.log(error))

  };

  const boxChecked = (event) => {
    setManagerLog(1-managerLog);
  }

  return (
  <>
    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{vertical:'bottom',horizontal:'right'}}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        Invalid Details!
      </Alert>
    </Snackbar>
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={6}
          md={8}
          sx={{
            backgroundImage: `url(${SignIMG})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label= {managerLog? "Manager ID" : "BITS Email Address"}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Sign In as Manager"
                onChange={boxChecked}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  </>
  );
}