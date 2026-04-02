import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import '../styles/SignIn.css';

export default function SignIn({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', {
      ...formData,
      rememberMe
    });
    // TODO: Add authentication logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="signin-overlay" onClick={handleBackdropClick}>
      <div className="signin-modal">
        <button className="signin-close-btn" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <h1 className="signin-title">{isLogin ? 'Log in' : 'Sign in'}</h1>

        <form onSubmit={handleSubmit} className="signin-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Eye size={20} className="eye-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
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

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <div className="form-options">
            <a href="#" className="forgot-password">
              {isLogin ? 'Forgot password?' : 'Forgot password?'}
            </a>
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="signin-submit-btn">
            {isLogin ? 'Log in' : 'Sign in'}
          </button>
        </form>

        <div className="signin-footer">
          {isLogin ? (
            <>
              <span>Don't have an account? </span>
              <button 
                type="button"
                className="toggle-mode-link"
                onClick={toggleMode}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account? </span>
              <button 
                type="button"
                className="toggle-mode-link"
                onClick={toggleMode}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
