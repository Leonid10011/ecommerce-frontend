import React from 'react';
import { Container, TextField, Button, Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserDTO } from '../../types/ApiInterfaces';

function RegisterForm() {
  const navigation = useNavigate();

  const {signUpUser} = useAuth();

  const handleSignUp = async (user: UserDTO) => {
      await signUpUser(user);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      id: 0,
      username: String(data.get("username") || ""),
      email: String(data.get("email") || ""),
      roleId: 1,
      password: String(data.get("password") || ""),
    };

    handleSignUp(user);
  };

  return (
    <Container maxWidth="sm" sx={{ overflow: "hidden", minHeight: '300px' }}>
      <Typography>
        Note: No formal validation yet.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Grid container spacing={2}>
          {["username", "email", "password", "password2"].map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                required
                id={field}
                label={field === "password2" ? "Confirm Password" : field}
                name={field}
                fullWidth
                type={field.startsWith("password") ? "password" : "text"}
              />
            </Grid>
          ))}
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
          Register
        </Button>
      </Box>
      <ToastContainer/>
    </Container>
  );
}

export default RegisterForm;
