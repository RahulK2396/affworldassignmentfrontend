import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';



const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://affworld-assignment-backend-seven.vercel.app/api/auth/register', formData);
      setMessage(response.data.message);
      navigate('/task')
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };
  const handleGoogleLoginSuccess = async (response) => {
    const decodedToken = jwtDecode(response.credential);
    console.log('Google login successful:', decodedToken);
    const googleData = {
      name: decodedToken.name,
      email: decodedToken.email,
      googleId: decodedToken.sub,
    };
    try {
      const res = await  axios.post('https://affworld-assignment-backend-seven.vercel.app/api/auth/google-login', {token:response.credential}, {
        headers: {
                'Content-Type': 'application/json',
            } });
      alert(res.data.message);
      navigate('/task')
    } catch (err) {
      console.error('Error during Google registration:', err.response?.data?.message || err.message);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
    alert('Google login failed. Please try again.');
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full p-3 border rounded mb-4"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full p-3 border rounded mb-4"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="block w-full p-3 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <GoogleLogin
            clientId={"966595839606-5o7udj2gae9cjmkbf5fmtge4hc5r553e.apps.googleusercontent.com"}
            buttonText="Sign Up with Google"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            
            className="mt-2"
          />
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
