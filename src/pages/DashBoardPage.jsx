import { Box, Button } from "@mui/material"
import NavBar from "../components/NavBar"

export default function DashboardPage() {
    return <>
    <NavBar/>
    <Box  sx={{
                height: '100vh',
                background: 'linear-gradient(to bottom, #1a1a1a, #2c3e50, #4682b4)',
                color: 'text.primary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '64px'
            }}>
    </Box>
    </>
}