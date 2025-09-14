import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
// (later you’ll add: Import LoginPage, RegisterPage, DashboardPage, etc.)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Add more routes here as you create corresponding components */}
        {/* Example: <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
