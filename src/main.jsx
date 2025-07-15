import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme.jsx';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { Amplify} from "aws-amplify";
import { Auth } from "aws-amplify";   
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
       <AuthProvider>
        <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
