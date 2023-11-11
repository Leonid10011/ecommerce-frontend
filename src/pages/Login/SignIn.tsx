import React from 'react';
import { Container, TextField, Button, Grid, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export default function SignIn() {

  const { fetchAndSetToken } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get the data from the fields
    // Yet to validate
    const data = new FormData(event.currentTarget);
    const email = data.get('email')!.toString();
    const password = data.get('password')!.toString();
    fetchAndSetToken(email, password);
    console.log({ email, password });
    toast.success("Logged In", {
      position: "top-center"
    })
  };
  
  const notify = () => {
    toast.error("Not implemented yet!", {
      position: 'top-center'
    });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ overflow: 'auto', minHeight: '300px' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Grid container spacing={2}>
          {['email', 'password'].map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                required
                id={field}
                label={field === 'password' ? 'Password' : 'Email Address'}
                name={field}
                fullWidth
                type={field === 'password' ? 'password' : 'text'}
                autoComplete={field === 'password' ? 'current-password' : 'email'}
                autoFocus={field === 'email'}
              />
            </Grid>
          ))}
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to="#">
              <div onClick={notify}>
                Forgot password?
              </div>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/signup">
              {'Don\'t have an account? Sign Up'}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
