import { Box, Button, Typography } from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid"; 

function NavBar({ showLogin = true, showCreateEditor = true }) {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const handleCreateNewEditor = () => {
        navigate(`/editor/${uuidv4()}`);
    };

    return (
        <Box
            sx={{
                height: '64px',
                width: '100vw',
                backgroundColor: ' #1a1a1a',
                position: 'fixed',
                color: 'text.primary',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                zIndex: 1100,
            }}
        >
            <Button
                startIcon={<CodeIcon />}
                sx={{ color: 'inherit', textTransform: 'none', background: 'transparent' }}
                disableRipple
                disableElevation
                disableFocusRipple
                onClick={() => {
                    if (isLoggedIn) {
                        navigate('/dashboard');
                    } else {
                        navigate('/');
                    }
                }}
            >
                <Typography variant="h6">CodeShare</Typography>
            </Button>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {showCreateEditor && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCreateNewEditor}
                    >
                        Create New Editor
                    </Button>
                )}

                {isLoggedIn && showLogin && (
                    <Button
                        disableRipple
                        disableElevation
                        disableFocusRipple
                        variant="outlined"
                        color="inherit"
                        onClick={logout}
                    >   
                        Sign Out
                    </Button>
                )}

                {!isLoggedIn && showLogin && (
                    <Button
                        disableRipple
                        disableElevation
                        disableFocusRipple
                        variant="outlined"
                        color="inherit"
                        onClick={() => navigate('/auth')}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </Box>
    )
}

export default NavBar;
