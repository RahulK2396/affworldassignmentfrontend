import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://affworld-assignment-backend-seven.vercel.app/api/auth/login', formData);
      localStorage.setItem('token', response.data.token); 
      setMessage('Login successful');
      navigate('/task')
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }

  };
  
    const handleGoogleLoginSuccess = async (response) => {
      try {
        const res = await axios.post('https://affworld-assignment-backend-seven.vercel.app/api/auth/google-login', {
          token:response.credential
        });
        localStorage.setItem('token', res.data.token); 

        setMessage(res.data.message);
        navigate('/task')
        console.log('Google login successful:', res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Google login failed');
      }
    };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
    setMessage('Google login failed. Please try again.');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
      
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full p-3 border rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="block w-full p-3 border rounded mb-4"
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className={`w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div style={{ marginTop: '10px' }}>
          <Link to="/forgot-password" style={{ color: 'blue', textDecoration: 'underline' }}>
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          
          <GoogleLogin
            clientId={"966595839606-5o7udj2gae9cjmkbf5fmtge4hc5r553e.apps.googleusercontent.com"}
            buttonText="Login with Google"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            
            className="mt-2"
          />
        </div>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

