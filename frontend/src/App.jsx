import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import NoteDetails from './pages/NoteDetails';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './features/auth/authSlice';

function App() {
  const token = useSelector(selectCurrentToken);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="login" element={!token ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="register" element={!token ? <RegisterPage /> : <Navigate to="/" replace />} />

        {/* Protected routes */}
        <Route index element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="notes/:id" element={token ? <NoteDetails /> : <Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
