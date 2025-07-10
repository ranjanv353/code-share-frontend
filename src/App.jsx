import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { Navigate } from 'react-router-dom';
import CodeEditorPage from './pages/CodeEditorPage';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/signup" element={<Navigate to="/auth" />} />
        <Route path="*" element={<CodeEditorPage />} />
      </Routes>
    </>
  );
}

export default App
