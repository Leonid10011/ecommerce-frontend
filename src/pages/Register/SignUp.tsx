import React from 'react';
import { Container, TextField, Button, Grid, Box } from '@mui/material';
import { UserDTO } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterForm() {
  const navigation = useNavigate();

  const {signUpUser} = useAuth();

  const handleSignUp = async (user: UserDTO) => {
      let signUpRes = await signUpUser(user);
      if(signUpRes === 409){
        toast.error("Username Already exists.", {
          position: 'top-center'
        });
      } else if(signUpRes === 201){
        navigation("/p");
      }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      username: String(data.get("username") || ""),
      email: String(data.get("email") || ""),
      password: String(data.get("password") || ""),
    };

    handleSignUp(user);
  };

  return (
    <Container maxWidth="sm" sx={{ overflow: "hidden", minHeight: '300px' }}>
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
