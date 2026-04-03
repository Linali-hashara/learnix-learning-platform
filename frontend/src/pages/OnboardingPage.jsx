import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/OnboardingPage.css';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = location.state?.fullName || 'Student';
  const userId = location.state?.userId;

  const [step, setStep] = useState('welcome'); // 'welcome' | 'step1_purpose' | 'step2_role' | 'step3_skills' | 'step4_education' | 'welcome_page' | 'complete'
  const [selectedReason, setSelectedReason] = useState(''); // Single selection for purpose
  const [selectedRole, setSelectedRole] = useState(''); // Single selection for role
  const [selectedSkills, setSelectedSkills] = useState([]); // Multiple selection for skills (max 5)
  const [selectedEducation, setSelectedEducation] = useState(''); // Single selection for education level
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [countdown, setCountdown] = useState(30); // Countdown timer for welcome page

  const reasons = [
    { id: 'start_career', label: 'Start my career' },
    { id: 'grow_career', label: 'Grow in my career' },
    { id: 'change_career', label: 'Change my career' },
    { id: 'gain_knowledge', label: 'Gain my knowledge' }
  ];

  const roles = [
    { id: 'writer', label: 'Writer' },
    { id: 'ba', label: 'BA' },
    { id: 'se', label: 'SE' },
    { id: 'cio', label: 'CIO' }
  ];

  const skills = [
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'sql', label: 'SQL', icon: '🔷' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'network', label: 'Network', icon: '🌐' }
  ];

  const educationLevels = [
    { id: 'school_student', label: 'School Student', icon: '🎓' },
    { id: 'diploma', label: 'Diploma', icon: '📜' },
    { id: 'bsc', label: 'BSc', icon: '🎓' },
    { id: 'msc', label: 'MSc', icon: '📚' },
    { id: 'phd', label: 'PhD', icon: '🎓' }
  ];

  // Countdown timer for welcome page
  useEffect(() => {
    if (step === 'welcome_page') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Navigate to dashboard with user preferences after countdown
            navigate('/dashboard', {
              state: {
                fullName: studentName,
                selectedReason: selectedReason,
                selectedRole: selectedRole,
                selectedSkills: selectedSkills,
                selectedEducation: selectedEducation
              }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, navigate, studentName, selectedReason, selectedRole, selectedSkills, selectedEducation]);

  const handleReasonToggle = (id) => {
    setSelectedReason(id); // Single selection for purpose
  };

  const handleRoleToggle = (id) => {
    setSelectedRole(id); // Single selection for role
  };

  const handleSkillToggle = (id) => {
    setSelectedSkills(prev => {
      if (prev.includes(id)) {
        // Remove skill
        return prev.filter(skill => skill !== id);
      } else {
        // Add skill if less than 5
        if (prev.length < 5) {
          return [...prev, id];
        }
        return prev; // Don't add if already 5
      }
    });
  };

  const handleEducationToggle = (id) => {
    setSelectedEducation(id); // Single selection for education level
  };

  const handleStartClick = () => {
    setStep('step1_purpose');
  };

  const handleBackStep = () => {
    if (step === 'step1_purpose') {
      setStep('welcome');
    } else if (step === 'step2_role') {
      setStep('step1_purpose');
    } else if (step === 'step3_skills') {
      setStep('step2_role');
    } else if (step === 'step4_education') {
      setStep('step3_skills');
    }
  };

  const handleBackFromOnboarding = () => {
    navigate('/login');
  };

  const handlePurposeNext = async () => {
    if (!selectedReason) {
      setAlertMessage('Please select a purpose');
      setShowAlert(true);
      return;
    }

    if (!userId) {
      setError('User ID not found. Please sign up again.');
      return;
    }

    // Move to step 2 (role selection)
    setStep('step2_role');
  };

  const handleRoleNext = async () => {
    if (!selectedRole) {
      setAlertMessage('Please select a role');
      setShowAlert(true);
      return;
    }

    // Move to step 3 (skills selection)
    setStep('step3_skills');
  };

  const handleSkillsNext = async () => {
    if (selectedSkills.length === 0) {
      setAlertMessage('Please select the skills');
      setShowAlert(true);
      return;
    }

    // Move to step 4 (education level selection)
    setStep('step4_education');
  };

  const handleEducationNext = async () => {
    if (!selectedEducation) {
      setAlertMessage('Please select your education level');
      setShowAlert(true);
      return;
    }

    if (!userId) {
      setError('User ID not found. Please sign up again.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5102/api/auth/save-user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          purpose: selectedReason,
          role: selectedRole,
          skills: selectedSkills,
          educationLevel: selectedEducation,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('User preferences saved:', data);
        setCountdown(30); // Reset countdown to 30 seconds
        setStep('welcome_page');
      } else {
        setError(data.message || 'Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="onboarding-container">
        <div className="onboarding-card">
          {/* Back Button */}
          <button 
            className="back-btn" 
            onClick={step === 'welcome' ? handleBackFromOnboarding : handleBackStep} 
            title={step === 'welcome' ? "Go back to login" : "Go back to previous step"}
          >
            <ArrowLeft size={24} />
          </button>
          {/* STEP 1: Welcome Screen */}
          {step === 'welcome' && (
            <>
              {/* Welcome Section */}
              <div className="onboarding-welcome">
                <h1 className="onboarding-greeting">Hello {studentName}!</h1>
                <div className="onboarding-bus-title">
                  <span className="bus-icon">🚐</span>
                  <p className="onboarding-subtitle">Begin the Learning Journey Bus!</p>
                </div>
                <p className="onboarding-intro">Let's get to know who you are!</p>
              </div>

              {/* Step Indicator */}
              <div className="onboarding-step">
                <h2 className="step-label">Step 1</h2>
              </div>

              {/* Let's Start Button */}
              <div className="onboarding-footer">
                <button
                  className="onboarding-start-btn"
                  onClick={handleStartClick}
                >
                  <span>Let's Start</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </>
          )}

          {/* STEP 1: Purpose Selection Screen */}
          {step === 'step1_purpose' && (
            <>
              {/* Step Indicator */}
              <div className="onboarding-step">
                <h2 className="step-label">Step 1</h2>
              </div>

              {/* Questions Section */}
              <div className="onboarding-questions">
                <div className="question-group">
                  <p className="question-text">Why do you choose Learnix?</p>
                  <p className="question-subtext">Why are you here?</p>
                </div>

                {/* Radio Button Options */}
                <div className="reasons-list">
                  {reasons.map(reason => (
                    <label key={reason.id} className="reason-item">
                      <input
                        type="radio"
                        name="purpose"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={() => handleReasonToggle(reason.id)}
                        className="reason-radio"
                      />
                      <span className="reason-label">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="onboarding-footer">
                {error && <div className="error-message">{error}</div>}
                <button
                  className="onboarding-next-btn"
                  onClick={handlePurposeNext}
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Loading...' : 'Next'}</span>
                  {!isLoading && <ArrowRight size={20} />}
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Role Selection Screen */}
          {step === 'step2_role' && (
            <>
              {/* Step Indicator */}
              <div className="onboarding-step">
                <h2 className="step-label">Step 2</h2>
              </div>

              {/* Questions Section */}
              <div className="onboarding-questions">
                <div className="question-group">
                  <p className="question-text">Which role are you interested in?</p>
                  <div className="role-search-box">
                    <input 
                      type="text" 
                      placeholder="Search roles..." 
                      className="role-search-input"
                    />
                  </div>
                </div>

                {/* Radio Button Options */}
                <div className="roles-list">
                  {roles.map(role => (
                    <label key={role.id} className="role-item">
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={selectedRole === role.id}
                        onChange={() => handleRoleToggle(role.id)}
                        className="role-radio"
                      />
                      <span className="role-label">{role.label}</span>
                      <span className="role-plus">+</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Back and Next Buttons */}
              <div className="onboarding-footer-dual">
                <button
                  className="onboarding-back-text-btn"
                  onClick={handleBackStep}
                  disabled={isLoading}
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
                <button
                  className="onboarding-next-btn"
                  onClick={handleRoleNext}
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Saving...' : 'Next'}</span>
                  {!isLoading && <ArrowRight size={20} />}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Skills Selection Screen */}
          {step === 'step3_skills' && (
            <>
              {/* Step Indicator */}
              <div className="onboarding-step">
                <h2 className="step-label">Step 3</h2>
              </div>

              {/* Questions Section */}
              <div className="onboarding-questions">
                <div className="question-group">
                  <p className="question-text">Select what are the skills you want to develop?</p>
                  <p className="question-subtext">Choose up to 5 skills</p>
                </div>

                {/* Checkbox Options */}
                <div className="skills-list">
                  {skills.map(skill => (
                    <label key={skill.id} className="skill-item">
                      <input
                        type="checkbox"
                        value={skill.id}
                        checked={selectedSkills.includes(skill.id)}
                        onChange={() => handleSkillToggle(skill.id)}
                        className="skill-checkbox"
                        disabled={selectedSkills.length >= 5 && !selectedSkills.includes(skill.id)}
                      />
                      <span className="skill-icon">{skill.icon}</span>
                      <span className="skill-label">{skill.label}</span>
                      <span className="skill-plus">+</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Back and Next Buttons */}
              <div className="onboarding-footer-dual">
                <button
                  className="onboarding-back-text-btn"
                  onClick={handleBackStep}
                  disabled={isLoading}
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
                <button
                  className="onboarding-next-btn"
                  onClick={handleSkillsNext}
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Saving...' : 'Next'}</span>
                  {!isLoading && <ArrowRight size={20} />}
                </button>
              </div>
            </>
          )}

          {/* STEP 4: Education Level Selection Screen */}
          {step === 'step4_education' && (
            <>
              {/* Step Indicator */}
              <div className="onboarding-step">
                <h2 className="step-label">Step 4</h2>
              </div>

              {/* Questions Section */}
              <div className="onboarding-questions">
                <div className="question-group">
                  <p className="question-text">Your Latest Education Level!!</p>
                  <p className="question-subtext">What is your current education level?</p>
                </div>

                {/* Radio Button Options */}
                <div className="education-list">
                  {educationLevels.map(education => (
                    <label key={education.id} className="education-item">
                      <input
                        type="radio"
                        name="education"
                        value={education.id}
                        checked={selectedEducation === education.id}
                        onChange={() => handleEducationToggle(education.id)}
                        className="education-radio"
                      />
                      <span className="education-icon">{education.icon}</span>
                      <span className="education-label">{education.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Back and Finish Buttons */}
              <div className="onboarding-footer-dual">
                <button
                  className="onboarding-back-text-btn"
                  onClick={handleBackStep}
                  disabled={isLoading}
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
                <button
                  className="onboarding-next-btn"
                  onClick={handleEducationNext}
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Saving...' : 'Finish'}</span>
                  {!isLoading && <ArrowRight size={20} />}
                </button>
              </div>
            </>
          )}

          {/* WELCOME PAGE: After completion */}
          {step === 'welcome_page' && (
            <div className="welcome-page-content">
              <div className="welcome-animated-container">
                {/* Welcome Header */}
                <div className="welcome-header">
                  <h1 className="welcome-main-title">Welcome {studentName}!</h1>
                  <p className="welcome-subtitle">You're all set up!</p>
                </div>

                {/* Illustration */}
                <div className="welcome-illustration">
                  <div className="illustration-student">👨‍🎓</div>
                  <div className="illustration-books">📚</div>
                  <div className="illustration-lightbulb">💡</div>
                  <div className="illustration-clipboard">📋</div>
                  <div className="illustration-apple">🍎</div>
                  <div className="illustration-plane">✈️</div>
                </div>

                {/* Setup Status */}
                <p className="setup-status">Setting up your account ...</p>

                {/* Checklist */}
                <div className="setup-checklist">
                  <div className="checklist-item checklist-show">
                    <span className="checklist-check">✓</span>
                    <span className="checklist-text">Creating your profile...</span>
                  </div>
                  <div className="checklist-item checklist-show" style={{ animationDelay: '0.3s' }}>
                    <span className="checklist-check">✓</span>
                    <span className="checklist-text">Enrolling you in classes...</span>
                  </div>
                  <div className="checklist-item checklist-show" style={{ animationDelay: '0.6s' }}>
                    <span className="checklist-check">✓</span>
                    <span className="checklist-text">Getting everything ready .... </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(countdown / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Final Message */}
                <div className="welcome-final-message">
                  <h2 className="final-title">All Set! Let's Begin Your Journey!</h2>
                  <p className="redirecting-text">Redirecting to your dashboard...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Popup */}
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-popup">
            <div className="alert-content">
              <p className="alert-message">{alertMessage}</p>
              <button
                className="alert-btn"
                onClick={() => setShowAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
