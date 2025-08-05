import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext"; 

function getUserSub(user) {
  if (!user) return null;
  if (user.signInUserSession && user.signInUserSession.idToken && user.signInUserSession.idToken.payload) {
    return user.signInUserSession.idToken.payload.sub;
  }
  if (user.attributes && user.attributes.sub) return user.attributes.sub;
  if (user.sub) return user.sub;
  return null;
}


const supportedLanguages = [
  "javascript", "python", "java", "typescript", "c#", "cpp", "c", "sql", "go",
  "php", "rust", "kotlin", "html", "css", "bash", "shell", "swift", "ruby", "dart", "markdown", "json"
];
const themes = [
  { label: "Dark", value: "vs-dark" },
  { label: "Light", value: "light" },
  { label: "Classic Light", value: "vs" },
  { label: "High Contrast", value: "hc-black" },
];
const extensionMap = {
  javascript: "js", python: "py", java: "java", typescript: "ts", "c#": "cs", cpp: "cpp", "c++": "cpp", c: "c",
  sql: "sql", go: "go", php: "php", rust: "rs", kotlin: "kt", html: "html", css: "css", bash: "sh", shell: "sh",
  swift: "swift", ruby: "rb", dart: "dart", markdown: "md", json: "json",
};
function getExtension(lang) { return extensionMap[lang] || "txt"; }

function CodeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createRoom, getRoom, updateRoom, shareRoom } = useApi();
  const { user, isLoggedIn } = useAuth();
  console.log('user:', user);
  console.log('isLoggedIn:', isLoggedIn);

  const [editorId, setEditorId] = useState(id || null);
  const [name, setName] = useState("Untitled");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false, message: "", color: "primary"
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access/sharing states
  const [roomType, setRoomType] = useState("public");
  const [isAuthRoom, setIsAuthRoom] = useState(false);
  const [members, setMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  // Sharing form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  useEffect(() => {
    let cancelled = false;
    async function loadOrCreateRoom() {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          const newRoom = await createRoom({});
          if (!cancelled) navigate(`/editor/${newRoom.id}`, { replace: true });
        } else {
          const room = await getRoom(id);
          if (!cancelled) {
            setEditorId(room.id);
            setName(room.name || "Untitled");
            setCode(room.content || "");
            setLanguage(room.language || "javascript");
            setTheme(room.theme || "vs-dark");
            setRoomType(room.type || "public");
            setIsAuthRoom(!!room.owner);
            setMembers(room.members || []);
            const userSub = getUserSub(user);
            setIsOwner(room.owner && userSub && userSub === room.owner);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Room not found.");
        setSnackbar({ open: true, message: err.message || "Room not found.", color: "error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
      return () => { cancelled = true; }
    }
    loadOrCreateRoom();
  }, [id, navigate, user]);

  // Debounced auto-save
  useEffect(() => {
    if (!editorId || loading || !isOwner) return;
    const handler = setTimeout(() => {
      updateRoom(editorId, {
        name, content: code, language, theme
      }).catch(err => {});
    }, 1000);
    return () => clearTimeout(handler);
  }, [editorId, name, code, language, theme, loading, isOwner, updateRoom]);

  const canEdit = isOwner || (isAuthRoom && roomType === "public" && !members.length);

  const handleEditorChange = (value) => {
    if (canEdit) setCode(value || "");
  };

  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleThemeChange = (e) => setTheme(e.target.value);

  // const handleCopyCode = async () => {
  //   try {
  //     await navigator.clipboard.writeText(code);
  //     setSnackbar({ open: true, message: "Code copied!", color: "primary" });
  //   } catch {
  //     setSnackbar({ open: true, message: "Failed to copy code.", color: "error" });
  //   }
  // };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({
      open: true,
      message: "Link copied to clipboard!",
      color: "primary",
    });
  };
  const handleDownload = () => {
    const extension = getExtension(language);
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `code.${extension}`;
    a.click();
    setSnackbar({ open: true, message: "Download started!", color: "primary" });
  };

  const handleNewEditor = () => {
    if (code.trim() || name !== "Untitled") {
      setOpenConfirmDialog(true);
    } else {
      createNewEditor();
    }
  };

  const createNewEditor = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);
    setError(null);
    try {
      const newRoom = await createRoom({});
      navigate(`/editor/${newRoom.id}`);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, color: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

 const handleRoomTypeChange = async (e) => {
  const newType = e.target.value;
  try {
    await updateRoom(editorId, { type: newType });
    setSnackbar({ open: true, message: `Room is now ${newType}`, color: "success" });
    const updatedRoom = await getRoom(editorId);
    setRoomType(updatedRoom.type || "public");
    setMembers(updatedRoom.members || []);
    const userSub = getUserSub(user);
    setIsOwner(updatedRoom.owner && userSub && userSub === updatedRoom.owner);
    setIsAuthRoom(!!updatedRoom.owner);
  } catch (err) {
    setSnackbar({ open: true, message: err.message, color: "error" });
  }
};

  const reloadMembers = async () => {
    if (!editorId) return;
    try {
      const room = await getRoom(editorId);
      setMembers(room.members || []);
    } catch {}
  };

  const handleInviteCollaborator = async () => {
    if (!inviteEmail) return;
    try {
      await shareRoom(editorId, { userId: inviteEmail, role: inviteRole });
      setInviteEmail("");
      setInviteRole("editor");
      reloadMembers();
      setSnackbar({ open: true, message: "Collaborator invited!", color: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, color: "error" });
    }
  };

  const handleChangeRole = async (email, role) => {
    try {
      await shareRoom(editorId, { userId: email, role });
      reloadMembers();
      setSnackbar({ open: true, message: "Role updated!", color: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, color: "error" });
    }
  };

  const handleRemoveCollaborator = async (email) => {
    try {
      await shareRoom(editorId, { userId: email, role: "remove" });
      reloadMembers();
      setSnackbar({ open: true, message: "Collaborator removed!", color: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, color: "error" });
    }
  };

  if (loading) return null;
  if (error) return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography color="error" variant="h5" gutterBottom>
        {error}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          px: 2, pt: 1.2, pb: 1, borderBottom: "1px solid #333", backgroundColor: "#1e1e1e", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1,
        }}
      >
        <Button
          startIcon={<CodeIcon />}
          sx={{ color: "inherit", textTransform: "none", background: "transparent" }}
          disableRipple disableElevation disableFocusRipple
          onClick={() => navigate("/")}
        >
          <Typography variant="h6" noWrap>
            CodeShare
          </Typography>
        </Button>
        <TextField
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Untitled"
          sx={{
            minWidth: 150, maxWidth: 300, flexGrow: 1,
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
          }}
        />

        {/* Room visibility dropdown for owner of auth rooms only */}
        {isAuthRoom && isOwner && (
          <FormControl size="small" sx={{ minWidth: 140, mx: 2 }}>
            <InputLabel sx={{ color: "inherit" }}>Room visibility</InputLabel>
            <Select
              value={roomType}
              onChange={handleRoomTypeChange}
              label="Room visibility"
              sx={{
                color: "#fff",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                ".MuiSvgIcon-root": { color: "#fff" },
              }}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>
        )}

        <Box
          sx={{
            display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap",
            justifyContent: "flex-end", flexGrow: 0, mt: { xs: 1, sm: 0 }, width: { xs: "100%", sm: "auto" },
          }}
        >
          <Tooltip title="New Editor (clear)">
            <Button
              variant="outlined"
              color="warning"
              startIcon={<AddIcon />}
              onClick={handleNewEditor}
            >New</Button>
          </Tooltip>
          <Tooltip title="Copy room link">
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<FileCopyIcon />}
              onClick={handleCopyLink}
            >
              Copy Link
            </Button>
          </Tooltip>

          {isAuthRoom && roomType === "private" && isOwner && (
            <Tooltip title="Manage access/collaborators">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShareIcon />}
                onClick={() => setOpenShareDialog(true)}
              >
                Share
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Download Code">
            <Button variant="outlined" color="inherit" startIcon={<DownloadIcon />} onClick={handleDownload}>
              Download
            </Button>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "inherit" }}>Language</InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
              label="Language"
              sx={{
                color: "#fff",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                ".MuiSvgIcon-root": { color: "#fff" },
              }}
            >
              {supportedLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "inherit" }}>Theme</InputLabel>
            <Select
              value={theme}
              onChange={handleThemeChange}
              label="Theme"
              sx={{
                color: "#fff",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                ".MuiSvgIcon-root": { color: "#fff" },
              }}
            >
              {themes.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={snackbar.message}
          ContentProps={{
            sx: {
              backgroundColor: (theme) =>
                snackbar.color === "success"
                  ? theme.palette.success.main
                  : snackbar.color === "error"
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
              color: (theme) => theme.palette.primary.contrastText,
              fontFamily: "inherit",
            },
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
              sx={{ fontFamily: "inherit" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />

        <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Manage Access</DialogTitle>
          <DialogContent>
            <Typography sx={{ mt: 1 }}>Collaborators:</Typography>
            <Box sx={{ my: 1 }}>
              {members.map(m => (
                <Box key={m.email} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography sx={{ mr: 2 }}>{m.email}</Typography>
                  <Typography sx={{ mr: 2, fontWeight: m.role === "owner" ? "bold" : "normal" }}>
                    {m.role}
                  </Typography>
                  {m.role !== "owner" && (
                    <>
                      <Button size="small" onClick={() => handleRemoveCollaborator(m.email)}>Remove</Button>
                      <Select
                        value={m.role}
                        size="small"
                        onChange={e => handleChangeRole(m.email, e.target.value)}
                        sx={{ ml: 1, minWidth: 90 }}
                      >
                        <MenuItem value="editor">Editor</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                      </Select>
                    </>
                  )}
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <TextField
                label="Email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                size="small"
                sx={{ mr: 2 }}
              />
              <Select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                size="small"
                sx={{ mr: 2, minWidth: 90 }}
              >
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
              <Button
                variant="contained"
                size="small"
                onClick={handleInviteCollaborator}
                disabled={!inviteEmail}
              >
                Invite
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Start New Editor?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will take you to a blank new editor. Your current changes are already saved. Continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={createNewEditor} color="warning" variant="contained">
              New
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Editor
          height="100%"
          theme={theme || "vs-dark"}
          language={language || "javascript"}
          value={code}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            fontFamily: "JetBrains Mono, monospace",
            padding: { top: 16 },
            readOnly: !canEdit,
          }}
        />
      </Box>
    </Box>
  );
}

export default CodeEditorPage;
