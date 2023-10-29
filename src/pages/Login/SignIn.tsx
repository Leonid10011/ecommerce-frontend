import React from 'react';
import { Container, TextField, Button, Grid, Box, Link } from '@mui/material';
import { useAuth } from '../../context/authContext';

export default function SignIn() {
  const { fetchAndSetToken } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')!.toString();
    const password = data.get('password')!.toString();
    fetchAndSetToken(email, password);

    console.log({ email, password });
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
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              {'Don\'t have an account? Sign Up'}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
