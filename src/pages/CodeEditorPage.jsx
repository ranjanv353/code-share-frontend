import { useState, useEffect, useRef } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { getEditorById, upsertEditor } from "../utils/storage";

const supportedLanguages = [
  "javascript",
  "python",
  "java",
  "typescript",
  "c#",
  "cpp",
  "c",
  "sql",
  "go",
  "php",
  "rust",
  "kotlin",
  "html",
  "css",
  "bash",
  "shell",
  "swift",
  "ruby",
  "dart",
  "markdown",
  "json",
];
const themes = [
  { label: "Dark", value: "vs-dark" },
  { label: "Light", value: "light" },
  { label: "Classic Light", value: "vs" },
  { label: "High Contrast", value: "hc-black" },
];
const extensionMap = {
  javascript: "js",
  python: "py",
  java: "java",
  typescript: "ts",
  "c#": "cs",
  cpp: "cpp",
  "c++": "cpp",
  c: "c",
  sql: "sql",
  go: "go",
  php: "php",
  rust: "rs",
  kotlin: "kt",
  html: "html",
  css: "css",
  bash: "sh",
  shell: "sh",
  swift: "swift",
  ruby: "rb",
  dart: "dart",
  markdown: "md",
  json: "json",
};
function getExtension(lang) {
  return extensionMap[lang] || "txt";
}
const defaultLanguage = "javascript";
const defaultTheme = "vs-dark";

function CodeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editorId, setEditorId] = useState(id || null);
  const [name, setName] = useState("Untitled");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(defaultLanguage);
  const [theme, setTheme] = useState(defaultTheme);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "primary",
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      const newId = uuidv4();
      const newEditor = {
        id: newId,
        name: "Untitled",
        code: "",
        language: defaultLanguage,
        theme: defaultTheme,
      };
      upsertEditor(newEditor);
      navigate(`/editor/${newId}`, { replace: true });
      return;
    }

    const stored = getEditorById(id);
    if (stored) {
      setEditorId(stored.id);
      setName(stored.name || "Untitled");
      setCode(stored.code || "");
      setLanguage(stored.language || defaultLanguage);
      setTheme(stored.theme || defaultTheme);
    } else {
      const newEditor = {
        id,
        name: "Untitled",
        code: "",
        language: defaultLanguage,
        theme: defaultTheme,
      };
      upsertEditor(newEditor);
      setEditorId(id);
      setName("Untitled");
      setCode("");
      setLanguage(defaultLanguage);
      setTheme(defaultTheme);
    }
    setLoading(false);
    loadedRef.current = false;
  }, [id, navigate]);

  useEffect(() => {
    if (loading) return;
    loadedRef.current = true;
  }, [loading, name, code, language, theme]);

  useEffect(() => {
    if (!loadedRef.current) return;
    upsertEditor({ id: editorId, name, code, language, theme });
  }, [editorId, name, code, language, theme]);


  const handleEditorChange = (value) => setCode(value || "");
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleThemeChange = (e) => setTheme(e.target.value);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setSnackbar({ open: true, message: "Code copied!", color: "primary" });
    } catch {
      setSnackbar({ open: true, message: "Failed to copy code.", color: "error" });
    }
  };

  const handleShare = () => {
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
  const createNewEditor = () => {
    const newId = uuidv4();
    navigate(`/editor/${newId}`);
    setOpenConfirmDialog(false);
  };


  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return null;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          px: 2,
          pt: 1.2,
          pb: 1,
          borderBottom: "1px solid #333",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Button
          startIcon={<CodeIcon />}
          sx={{ color: "inherit", textTransform: "none", background: "transparent" }}
          disableRipple
          disableElevation
          disableFocusRipple
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
            minWidth: 150,
            maxWidth: 300,
            flexGrow: 1,
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#888",
              },
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flexGrow: 0,
            mt: { xs: 1, sm: 0 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Tooltip title="New Editor (clear)">
            <Button
              variant="outlined"
              color="warning"
              startIcon={<AddIcon />}
              onClick={handleNewEditor}
            >
              New
            </Button>
          </Tooltip>
          <Tooltip title="Copy Code">
            <Button variant="outlined" color="inherit" startIcon={<FileCopyIcon />} onClick={handleCopyCode}>
              Copy
            </Button>
          </Tooltip>
          <Tooltip title="Download Code">
            <Button variant="outlined" color="inherit" startIcon={<DownloadIcon />} onClick={handleDownload}>
              Download
            </Button>
          </Tooltip>
          <Tooltip title="Share URL">
            <Button variant="outlined" color="inherit" startIcon={<ShareIcon />} onClick={handleShare}>
              Share
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
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
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
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
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

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Start New Editor?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will take you to a blank new editor. Your current changes are already saved.
              Continue?
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
          theme={theme}
          language={language}
          value={code}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            fontFamily: "JetBrains Mono, monospace",
            padding: { top: 16 },
          }}
        />
      </Box>
    </Box>
  );
}

export default CodeEditorPage;
