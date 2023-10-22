import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { signUp } from "../../api/authApi";

export default function SignUp() {
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

    console.log({
        username: data.get("username"),
        forename: data.get("forename"),
        surname: data.get("surname"),
        city: data.get("city"),
        country: data.get("country"),
        street: data.get("street"),
        zipCode: data.get("zipCode"),
        phone: data.get("phone"),    
        email: data.get("email"),
        password: data.get("password"),
        password2: data.get("password2")
    });

    signUp(user);
  };
  
  return (
    <Container component="main" maxWidth="xs" sx={{height: '55vh', backgroundColor: 'pink'}}>
      <Box
        sx={{  
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: '100%',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ m: 1, overflow: 'auto', backgroundColor: 'green', fontSize: '0.2em'}}>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="forename"
                    label="Forename"
                    name="forename"
                    autoComplete="forename"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="surname"
                    label="Surname"
                    name="surname"
                    autoComplete="surname"
                    autoFocus
                />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        autoComplete="city"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="country"
                        label="Country"
                        name="country"
                        autoComplete="country"
                        autoFocus
                    />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="street"
                    label="Street"
                    name="street"
                    autoComplete="street"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="zipCode"
                    label="Zip Code"
                    name="zipCode"
                    autoComplete="zipCode"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    autoComplete="password"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password2"
                    label="Password again"
                    name="password2"
                    autoComplete="password2"
                    autoFocus
                />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
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
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}