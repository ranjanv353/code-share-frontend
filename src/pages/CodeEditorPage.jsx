import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
    Box,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import CodeIcon from '@mui/icons-material/Code';

const supportedLanguages = [
    "javascript", "python", "java", "typescript", "c#", "cpp", "c", "sql",
    "go", "php", "rust", "kotlin", "html", "css", "bash", "shell", "swift",
    "ruby", "dart", "markdown", "json"
];

const themes = [
    { label: "Dark", value: "vs-dark" },
    { label: "Light", value: "light" },
    { label: "Classic Light", value: "vs" },
    { label: "High Contrast", value: "hc-black" },
];

function CodeEditorPage() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const navigate = useNavigate();

    const handleEditorChange = (value) => {
        setCode(value || "");
        console.log("updated value: ", value);
    };

    const handleSave = () => {
        console.log("Code saved:", code);
    };
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };
    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    px: 2,
                    paddingTop: 1.2,
                    paddingBottom: 1,
                    borderBottom: "1px solid #333",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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


                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel sx={{ color: "inherit" }}>Language</InputLabel>
                        <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            label="Language"
                            sx={{
                                color: "#fff",
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#555",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#888",
                                },
                                ".MuiSvgIcon-root": {
                                    color: "#fff",
                                },
                            }}
                        >
                            {supportedLanguages.map((lang) => (
                                <MenuItem key={lang} value={lang}>
                                    {lang}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel sx={{ color: "inherit" }}>Theme</InputLabel>
                        <Select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            label="Theme"
                            sx={{
                                color: "#fff",
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#555",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#888",
                                },
                                ".MuiSvgIcon-root": {
                                    color: "#fff",
                                },
                            }}
                        >
                            {themes.map((t) => (
                                <MenuItem key={t.value} value={t.value}>
                                    {t.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="outlined" color="inherit" onClick={handleSave}>
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleShare}
                    >
                        Share
                    </Button>
                </Box>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={snackbarOpen}
                    autoHideDuration={2000}
                    onClose={handleSnackbarClose}
                    message="Link copied to clipboard!"
                    ContentProps={{
                        sx: {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: (theme) => theme.palette.primary.contrastText,
                            fontFamily: 'inherit', 
                        }
                    }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleSnackbarClose}
                            sx={{ fontFamily: 'inherit' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
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
