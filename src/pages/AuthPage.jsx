import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Navigate } from "react-router-dom";


function AuthPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { isLoggedIn, login } = useAuth();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value) => {
    const passwordErrors = [];
    if (value.length < 8) passwordErrors.push("at least 8 characters");
    if (!/[A-Z]/.test(value)) passwordErrors.push("an uppercase letter");
    if (!/[a-z]/.test(value)) passwordErrors.push("a lowercase letter");
    if (!/\d/.test(value)) passwordErrors.push("a number");
    if (!/[@$!%*?&#^]/.test(value)) passwordErrors.push("a special character");

    if (passwordErrors.length > 0) {
      setPasswordError(`Password must include ${passwordErrors.join(", ")}.`);
    } else {
      setPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) return;

    login(email, password);
    console.log("Logging in or signing up with:", email, password);
  };
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <>
      <NavBar showLogin={false} />
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(to bottom, #1a1a1a, #2c3e50, #4682b4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "64px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            padding: 4,
            width: "100%",
            maxWidth: "500px",
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            color="text.primary"
          >
            Access your coding workspace
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Use your email or Google to sign in or get started
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              variant="outlined"
              type="password"
              margin="normal"
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(passwordError)}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Continue
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", my: 3, mx: 2 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography
                sx={{ mx: 2, color: "text.secondary", whiteSpace: "nowrap" }}
              >
                or
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                borderColor: "#e0e0e0",
                color: "#e0e0e0",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#ffffff",
                },
              }}
            >
              Continue with Google
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default AuthPage;
