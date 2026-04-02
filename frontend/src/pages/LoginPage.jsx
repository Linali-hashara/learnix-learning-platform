import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // TODO: Add authentication logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <Link to="/" className="login-back-btn">
          <ArrowLeft size={24} />
          <span>Back</span>
        </Link>
        <Link to="/" className="login-logo">
          Learnix
        </Link>
        <div className="login-header-spacer"></div>
      </header>

      {/* Main Content */}
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Log in to continue your learning journey</h1>
          <p className="login-subtitle">Welcome back! Please enter your details to access your account.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-wrapper with-icon">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper with-icon">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-submit-btn">
              Continue
            </button>
          </form>

          <div className="login-divider">
            <span>Or</span>
          </div>

          <div className="login-footer">
            <div className="signup-box">
              <span>Don't have an account? </span>
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
