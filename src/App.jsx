import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { Navigate } from 'react-router-dom';
import CodeEditorPage from './pages/CodeEditorPage';
import NotFoundPage from './pages/NotFoundPage';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/signup" element={<Navigate to="/auth" />} />
        <Route path="/404" element={<NotFoundPage/>} />
        <Route path="*" element={<CodeEditorPage />} />
      </Routes>
    </>
  );
}

export default App
