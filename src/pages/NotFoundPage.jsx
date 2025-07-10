import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function NotFoundPage() {
    const navigate = useNavigate();
    const handleCreateNewEditor = () => {
        navigate("/editor"); 
    };

    return (
        <>
            <NavBar />
            <Box
                minHeight="100vh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ background: 'linear-gradient(to bottom, #1a1a1a, #2c3e50, #4682b4)' }}
                justifyContent="center"
                textAlign="center"
                gap={2}
            >
                <Box
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                        color: "#FFFFFF", 
                        padding: 4,
                        width: "100%",
                        maxWidth: "500px",
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h1" color="primary" fontWeight={800}>
                        404
                    </Typography>
                    <Typography variant="h5" gutterBottom color="text.primary">
                        Page Not Found
                    </Typography>
                    <Typography color="text.secondary" mb={2}>
                        The page you’re looking for doesn’t exist.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/")}
                        sx={{ mt: 2, mr: 2 }}
                    >
                        Go to Home
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCreateNewEditor}
                        sx={{ mt: 2 }}
                    >
                        Create New Editor
                    </Button>
                </Box>
            </Box>
        </>
    );
}
