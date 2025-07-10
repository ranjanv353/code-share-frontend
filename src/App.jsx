import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { Navigate } from 'react-router-dom';
import CodeEditorPage from './pages/CodeEditorPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashBoardPage';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <DashboardPage /> </ProtectedRoute> }/>
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/signup" element={<Navigate to="/auth" />} />
        <Route path="/editor" element={<CodeEditorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App
