import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/LockOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GoogleIcon from "@mui/icons-material/Google";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "aws-amplify";

function AuthPage() {
  const [tab, setTab] = useState(0); 
  const [phase, setPhase] = useState("signIn");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    confirmationCode: "",
    forgotCode: "",
    forgotNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });


  const [signupResendTimer, setSignupResendTimer] = useState(0);
  const [forgotResendTimer, setForgotResendTimer] = useState(0);

  const { isLoggedIn, login, googleSignIn, signup, confirmSignUp, forgotPassword,  } = useAuth();

  useEffect(() => {
    if (signupResendTimer > 0) {
      const interval = setInterval(() => setSignupResendTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [signupResendTimer]);

  useEffect(() => {
    if (forgotResendTimer > 0) {
      const interval = setInterval(() => setForgotResendTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [forgotResendTimer]);


  const validate = (fields = form, forSignUp = false) => {
    const newErrors = {};
    if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (forSignUp && (!fields.name || fields.name.length < 2)) {
      newErrors.name = "Please enter your name";
    }
    if (
      (fields.password !== undefined || fields.forgotNewPassword !== undefined) &&
      ((fields.password || fields.forgotNewPassword) ?? "").length < 8
    ) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleTabChange = (_, value) => {
    setTab(value);
    setPhase(value === 0 ? "signIn" : "signUp");
    setForm({
      email: "",
      password: "",
      name: "",
      confirmationCode: "",
      forgotCode: "",
      forgotNewPassword: "",
    });
    setAlert({ type: "", message: "" });
    setErrors({});
    setLoading(false);
  };


  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await login(form.email, form.password);
    } catch {
      setAlert({
        type: "error",
        message:
          "Invalid email or password. If you’re new, sign up or try password reset.",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = validate(form, true);
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await signup(form.email, form.password, form.name);
      setPhase("signUpConfirm");
      setAlert({
        type: "success",
        message: "Check your email for the confirmation code!",
      });
      setSignupResendTimer(60);
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Sign up failed" });
    }
    setLoading(false);
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await confirmSignUp(form.email, form.confirmationCode);
      setTab(0);
      setPhase("signIn");
      setAlert({
        type: "success",
        message: "Account confirmed! You can now sign in.",
      });
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Confirmation failed" });
    }
    setLoading(false);
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await forgotPassword(form.email);
      setPhase("forgotCode");
      setAlert({
        type: "info",
        message:
          "If an account exists for this email, a password reset code will be sent. Check your inbox and spam.",
      });
      setForgotResendTimer(60);
    } catch (err) {
      setAlert({
        type: "info",
        message:
          "If an account exists for this email, a password reset code will be sent. Check your inbox and spam.",
      });
      setPhase("forgotCode");
      setForgotResendTimer(60);
    }
    setLoading(false);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.forgotCode || !form.forgotNewPassword) {
      setErrors({ forgotCode: "All fields are required" });
      return;
    }
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      await Auth.forgotPasswordSubmit(
        form.email,
        form.forgotCode,
        form.forgotNewPassword
      );
      setPhase("signIn");
      setAlert({
        type: "success",
        message: "Password reset! You can now sign in.",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.message ||
          "Could not reset password. Check your code and try again.",
      });
    }
    setLoading(false);
  };

  const handleResendSignUp = async () => {
    setAlert({ type: "", message: "" });
    setSignupResendTimer(60);
    try {
      await Auth.resendSignUp(form.email);
      setAlert({
        type: "info",
        message: "Confirmation code resent! Check your inbox/spam.",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Could not resend code.",
      });
    }
  };

  const handleResendForgot = async () => {
    setAlert({ type: "", message: "" });
    setForgotResendTimer(60);
    try {
      await Auth.forgotPassword(form.email);
      setAlert({
        type: "info",
        message:
          "Code resent! If this email exists, check your inbox/spam.",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Could not resend code.",
      });
    }
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
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {alert.message && (
            <Alert severity={alert.type || "info"} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          )}

          {tab === 0 && phase === "signIn" && (
            <form onSubmit={handleSignIn}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
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
                label="Password"
                type="password"
                margin="normal"
                value={form.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
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
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => {
                  setPhase("forgotEmail");
                  setForm((prev) => ({
                    ...prev,
                    forgotCode: "",
                    forgotNewPassword: "",
                  }));
                  setAlert({ type: "", message: "" });
                  setErrors({});
                }}
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Forgot password?
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
                onClick={googleSignIn}
              >
                Continue with Google
              </Button>
            </form>
          )}

          {tab === 0 && phase === "forgotEmail" && (
            <form onSubmit={handleForgotPassword}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                required
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2, borderRadius: 2 }}
                disabled={loading}
              >
                {loading ? "Sending code..." : "Send Code"}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => {
                  setPhase("signIn");
                  setAlert({ type: "", message: "" });
                  setErrors({});
                }}
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Back to Sign In
              </Button>
            </form>
          )}

          {tab === 0 && phase === "forgotCode" && (
            <form onSubmit={handleForgotPasswordSubmit}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={form.email}
                disabled
              />
              <TextField
                fullWidth
                label="Confirmation Code"
                margin="normal"
                value={form.forgotCode}
                onChange={handleChange("forgotCode")}
                error={!!errors.forgotCode}
                helperText={errors.forgotCode}
                required
              />
              {form.forgotCode.length > 0 && (
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                  value={form.forgotNewPassword}
                  onChange={handleChange("forgotNewPassword")}
                  required
                />
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2, borderRadius: 2 }}
                disabled={
                  loading ||
                  !form.forgotCode.length ||
                  !form.forgotNewPassword.length
                }
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={handleResendForgot}
                disabled={forgotResendTimer > 0}
                sx={{ mt: 1 }}
              >
                {forgotResendTimer > 0
                  ? `Resend code (${forgotResendTimer}s)`
                  : "Resend code"}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => {
                  setPhase("signIn");
                  setAlert({ type: "", message: "" });
                  setErrors({});
                }}
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Back to Sign In
              </Button>
            </form>
          )}

          {tab === 1 && (phase === "signUp" || phase === "signUpConfirm") && (
            <form
              onSubmit={
                phase === "signUp" ? handleSignUp : handleConfirmSignUp
              }
            >
              <TextField
                fullWidth
                name="name"
                label="Name"
                variant="outlined"
                margin="normal"
                value={form.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                disabled={phase === "signUpConfirm"}
              />
              <TextField
                fullWidth
                name="email"
                label="Email"
                variant="outlined"
                margin="normal"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                disabled={phase === "signUpConfirm"}
              />
              <TextField
                fullWidth
                name="password"
                label="Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={form.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                disabled={phase === "signUpConfirm"}
              />
              {phase === "signUpConfirm" && (
                <>
                  <TextField
                    fullWidth
                    name="confirmationCode"
                    label="Confirmation Code"
                    variant="outlined"
                    margin="normal"
                    value={form.confirmationCode}
                    onChange={handleChange("confirmationCode")}
                    helperText="Enter the code sent to your email"
                    required
                  />
                  <Button
                    fullWidth
                    variant="text"
                    color="secondary"
                    onClick={handleResendSignUp}
                    disabled={signupResendTimer > 0}
                    sx={{ mt: 1 }}
                  >
                    {signupResendTimer > 0
                      ? `Resend code (${signupResendTimer}s)`
                      : "Resend code"}
                  </Button>
                </>
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2, borderRadius: 2 }}
                disabled={loading}
              >
                {loading
                  ? phase === "signUpConfirm"
                    ? "Confirming..."
                    : "Signing up..."
                  : phase === "signUpConfirm"
                  ? "Confirm"
                  : "Sign Up"}
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </>
  );
}

export default AuthPage;
