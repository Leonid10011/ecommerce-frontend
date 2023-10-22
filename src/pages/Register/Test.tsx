import React from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { signUp } from '../../api/authApi';

function RegisterForm() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user = {
            username: String(data.get("username")!),
            forename: String(data.get("forename")!),
            surname: String(data.get("surname")!),
            city: String(data.get("city")!),
            country: String(data.get("country")!),
            street: String(data.get("street")!),
            zipCode: String(data.get("zipCode")!),
            phone: String(data.get("phone")!),    
            email: String(data.get("email")!),
            password: String(data.get("password")!),
        };

        console.log("User: ", user);

        signUp(user);
    }

  return (
    <Container maxWidth="sm" sx={{overflow: "auto", maxHeight: '80vh'}}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              id="username"
              label="Username"
              name="username"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="forename"
              label="Forename"
              name="forename"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="surname"
              label="Surname"
              name="surname"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="city"
              label="City"
              name="city"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="country"
              label="Country"
              name="country"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="street"
              label="Street"
              name="street"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="zipCode"
              label="ZIP"
              name="zipCode"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="phone"
              label="Phone"
              name="phone"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              label="Email"
              name="email"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              label="Password"
              name="password"
              type="password"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password2"
              label="Confirm Password"
              name="password2"
              type="password"
              fullWidth
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
}

export default RegisterForm;
