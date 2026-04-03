import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    purpose: '',
    role: '',
    skills: []
  });

  useEffect(() => {
    // Get user info from location state (passed from OnboardingPage)
    if (location.state) {
      const { fullName, email, selectedReason, selectedRole, selectedSkills } = location.state;
      setUserInfo({
        fullName: fullName || 'Student',
        email: email || 'N/A',
        purpose: selectedReason || 'Not selected',
        role: selectedRole || 'Not selected',
        skills: selectedSkills || []
      });
    } else {
      // Fallback if no state provided
      setUserInfo({
        fullName: 'Student',
        email: 'N/A',
        purpose: 'Not selected',
        role: 'Not selected',
        skills: []
      });
    }
  }, [location.state]);

  const skillLabels = {
    python: 'Python',
    sql: 'SQL',
    analytics: 'Analytics',
    network: 'Network'
  };

  const purposeLabels = {
    start_career: 'Start my career',
    grow_career: 'Grow in my career',
    change_career: 'Change my career',
    gain_knowledge: 'Gain my knowledge'
  };

  const roleLabels = {
    writer: 'Writer',
    ba: 'BA',
    se: 'SE',
    cio: 'CIO'
  };

  const handleContinue = () => {
    // TODO: Navigate to courses or next page
    alert('Welcome to Learnix! Your journey begins here.');
  };

  const handleEditOnboarding = () => {
    navigate('/onboarding', { state: { fullName: userInfo.fullName, email: userInfo.email, userId: location.state?.userId } });
  };

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-container">
        <div className="dashboard-card">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1 className="dashboard-greeting">Welcome, {userInfo.fullName}! 🎉</h1>
            <p className="dashboard-subtitle">Your Learning Journey Bus is ready!</p>
          </div>

          {/* User Info Card */}
          <div className="info-section">
            <h2 className="section-title">Your Profile</h2>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Email:</label>
                <p className="info-value">{userInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Onboarding Summary Section */}
          <div className="summary-section">
            <h2 className="section-title">Your Learning Preferences</h2>

            {/* Purpose */}
            <div className="summary-item">
              <div className="summary-header">
                <span className="summary-icon">🎯</span>
                <h3 className="summary-question">Why did you choose Learnix?</h3>
              </div>
              <p className="summary-answer">{purposeLabels[userInfo.purpose] || userInfo.purpose}</p>
            </div>

            {/* Role */}
            <div className="summary-item">
              <div className="summary-header">
                <span className="summary-icon">💼</span>
                <h3 className="summary-question">Interested Role</h3>
              </div>
              <p className="summary-answer">{roleLabels[userInfo.role] || userInfo.role}</p>
            </div>

            {/* Skills */}
            <div className="summary-item">
              <div className="summary-header">
                <span className="summary-icon">🔧</span>
                <h3 className="summary-question">Skills to Develop</h3>
              </div>
              {userInfo.skills.length > 0 ? (
                <div className="summary-skills">
                  {userInfo.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skillLabels[skill] || skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="summary-answer">No skills selected</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="dashboard-footer">
            <button
              className="btn-secondary"
              onClick={handleEditOnboarding}
            >
              Edit Preferences
            </button>
            <button
              className="btn-primary"
              onClick={handleContinue}
            >
              Continue to Courses →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
