import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', {
      email: formData.email,
      password: formData.password
    })
    .then(res => {
      console.log("Login successful:", res.data);
      alert("Login successful!");
      if(res.data=='Success'){
        window.location.href = "/Canva";
      }
      
    })
    .catch(err => {
      console.error("Login failed:", err);
      alert("Invalid credentials. Please try again.");
    });
  };

  return (
    <div className="container mt-5">
      <div className="login-container bg-white p-4 shadow rounded mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
          <p className="text-center mt-3">Don't have an account? <a href="/signup">Sign Up</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
