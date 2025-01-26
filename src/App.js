import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import {Login} from './Pages/Login';
import TaskManager from './Pages/Tasks';
import Feed from './Pages/Feed';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<ProtectedRoute><TaskManager /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
