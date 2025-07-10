import { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, IconButton } from "@mui/material";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllEditors, deleteEditor } from "../utils/storage";

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentEditors, setRecentEditors] = useState([]);
    useEffect(() => {
        const editors = getAllEditors();
        const emptyEditors = editors.filter(
            (e) => e.code.trim() === "" && e.name === "Untitled"
        );
        emptyEditors.forEach((editor) => deleteEditor(editor.id));
        const validEditors = editors.filter(
            (e) => e.code.trim() !== "" || e.name !== "Untitled"
        );

        setRecentEditors(validEditors);
    }, []);

    const handleDelete = (id) => {
        deleteEditor(id);
        setRecentEditors(getAllEditors());
    };

    const handleOpen = (id) => {
        navigate(`/editor/${id}`);
    };

    return (
        <>
            <NavBar showCreateEditor={true} />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(to bottom, #1a1a1a, #2c3e50, #4682b4)',
                    color: 'text.primary',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '120px',
                    px: 2,
                    pb: 2,
                }}
            >
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Welcome, {user?.email || "User"}!
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, alignSelf: 'flex-start', pl: 4 }}>
                    Recent Editors
                </Typography>
                <Grid container spacing={3} justifyContent="center" sx={{ mx: '10%' }}>
                    {recentEditors.length === 0 ? (
                        <Typography color="text.secondary" sx={{ ml: 2, mt: 1 }}>
                            No recent editors.
                        </Typography>
                    ) : (
                        recentEditors.map((room) => (
                            <Grid item xs={12} sm={6} md={4} key={room.id}>
                                <Card sx={{ bgcolor: "#23272f", color: "text.primary" }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {room.name}
                                            </Typography>
                                            <IconButton
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => handleDelete(room.id)}
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Last edited: {room.lastEdited && new Date(room.lastEdited).toLocaleString()}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleOpen(room.id)}
                                            >
                                                Open
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </>
    );
}
