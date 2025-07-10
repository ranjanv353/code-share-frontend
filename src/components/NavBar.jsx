import { Box, Button, Typography } from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function NavBar({ showLogin = true }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
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
                onClick={() => navigate('/')}
            >
                <Typography variant="h6">CodeShare</Typography>
            </Button>

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
    )
}

export default NavBar;