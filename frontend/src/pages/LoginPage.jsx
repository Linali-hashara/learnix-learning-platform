import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Header from '../components/Header';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5102/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login successful:', data);
        if (data.isAdmin) {
          navigate('/admin/dashboard', { state: { userId: data.userId, fullName: data.fullName } });
        } else {
          // Navigate to dashboard with user info
          navigate('/dashboard', { state: { userId: data.userId, fullName: data.fullName } });
        }
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Header */}
      <Header />

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

            {error && <div className="error-message">{error}</div>}

            <div className="form-options">
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Continue'}
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
