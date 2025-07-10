import { Button, Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LandingPage() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;
    return (
        <>
        <NavBar/>
        <Box
            sx={{
                height: '100vh',
                background: 'linear-gradient(to bottom, #1a1a1a, #2c3e50, #4682b4)',
                color: 'text.primary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '64px'
            }}
        >
            <Typography variant="h3" gutterBottom sx={{ pt: 12, textAlign: 'center' }}>
                Collaborate on Code Instantly, from Anywhere
            </Typography>
            <Typography variant="h6" gutterBottom textAlign="center">
                A real-time online code editor for teams, classrooms, and interviews.
            </Typography>
            <Button sx={{ my: 3 }} color='inherit' variant="outlined" size="large" onClick={() => navigate('/editor')}>Share Code Now</Button>
        </Box>
        </>
    );
}

export default LandingPage;
