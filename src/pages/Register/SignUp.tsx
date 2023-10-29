import React from 'react';
import { Container, TextField, Button, Grid, Box } from '@mui/material';
import { UserDTO, signUp } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigation = useNavigate();

  const waitResponse = async (user: UserDTO) => {
    try {
      const res = await signUp(user);
      console.log("Code: ", res);
      if (res === 201) {
        console.log("Success signup");
        navigation("/p");
      } else if (res === 409) {
        console.log("Username already exists");
      } else {
        console.log("Provide a correct Email address and a valid password.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
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

    waitResponse(user);
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
    </Container>
  );
}

export default RegisterForm;
