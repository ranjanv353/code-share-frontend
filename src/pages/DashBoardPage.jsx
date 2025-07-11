import { useState, useEffect, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { getAllEditors, deleteEditor } from "../utils/storage";
import { keyframes } from "@mui/system";
import { DASHBOARD_VIEW_MODE } from "../constants";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Editor = lazy(() => import("@monaco-editor/react"));

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentEditors, setRecentEditors] = useState([]);
 const [viewMode, setViewMode] = useState(() => {
  return localStorage.getItem(DASHBOARD_VIEW_MODE) || "grid";
});

useEffect(() => {
  localStorage.setItem(DASHBOARD_VIEW_MODE, viewMode);
}, [viewMode]);



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

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteEditor(id);
    setRecentEditors(getAllEditors());
  };

  const handleOpen = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) setViewMode(nextView);
  };

  return (
    <>
      <NavBar showCreateEditor={true} />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #1a1a1a, #2c3e50, #4682b4)",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "120px",
          px: 2,
          pb: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome, {user?.email || "User"}!
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: 1200,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ alignSelf: "flex-start", pl: 0 }}>
            Recent Editors
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
            size="small"
            sx={{ bgcolor: "background.paper", borderRadius: 1 }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {recentEditors.length === 0 ? (
          <Typography color="text.secondary" sx={{ ml: 2, mt: 1 }}>
            No recent editors.
          </Typography>
        ) : viewMode === "grid" ? (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mx: { xs: 2, sm: 6, md: 10 } }}
          >
            {recentEditors.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={room.id} sx={{ p: 2 }}>
                <Card
                  onClick={() => handleOpen(room.id)}
                  sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    borderRadius: 2,
                    height: 320,
                    width: 320, 
                    overflow: "hidden",
                    boxShadow: 3,
                    transition: "transform 0.2s",
                    position: "relative",
                    animation: `${fadeInUp} 0.5s ease forwards`,
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e, room.id);
                    }}
                  >
                    <IconButton aria-label="delete" color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                    <Suspense
                      fallback={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      }
                    >
                      <Editor
                        height="100%"
                        defaultLanguage={room.language || "javascript"}
                        value={room.code.trim() || "// No code yet"}
                        theme={room.theme || "vs-dark"}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          lineNumbers: "off",
                          scrollBeyondLastLine: false,
                          renderLineHighlight: "none",
                          wordWrap: "on",
                          fontSize: 12,
                        }}
                      />
                    </Suspense>
                  </Box>

                  <CardContent
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flexShrink: 0,
                      py: 1,
                      px: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flexShrink: 1,
                        }}
                      >
                        {room.name}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          borderRadius: "12px",
                          px: 1.5,
                          py: 0.3,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          userSelect: "none",
                          flexShrink: 0,
                        }}
                      >
                        {room.language || "javascript"}
                      </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                      Last edited: {room.lastEdited && new Date(room.lastEdited).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ width: "100%", maxWidth: 900 }}>
            {recentEditors.map((room, index) => (
              <Card
                key={room.id}
                onClick={() => handleOpen(room.id)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  color: "text.primary",
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  height: 100,
                  animation: `${fadeInUp} 0.5s ease forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  px: 2,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    zIndex: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(e, room.id);
                  }}
                >
                  <IconButton aria-label="delete" color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    noWrap
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flexShrink: 1,
                    }}
                  >
                    {room.name}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: "12px",
                      px: 1.5,
                      py: 0.3,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      userSelect: "none",
                      flexShrink: 0,
                      ml: 2,
                    }}
                  >
                    {room.language || "javascript"}
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                  Last edited: {room.lastEdited && new Date(room.lastEdited).toLocaleString()}
                </Typography>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
