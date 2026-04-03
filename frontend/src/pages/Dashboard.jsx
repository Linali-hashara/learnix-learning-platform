import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userInfo, setUserInfo] = useState({
    fullName: 'Student',
    purpose: '',
    role: '',
    skills: [],
    educationLevel: ''
  });

  const [courses, setCourses] = useState({
    topRecommended: [],
    trending: [],
    youMightWant: []
  });

  useEffect(() => {
    // Get user info from location state (passed from OnboardingPage)
    if (location.state) {
      const { fullName, selectedReason, selectedRole, selectedSkills, selectedEducation } = location.state;
      setUserInfo({
        fullName: fullName || 'Student',
        purpose: selectedReason || '',
        role: selectedRole || '',
        skills: selectedSkills || [],
        educationLevel: selectedEducation || ''
      });

      // Generate AI-recommended courses based on user preferences
      generateRecommendedCourses(selectedReason, selectedRole, selectedSkills);
    }
  }, [location.state]);

  // Generate courses based on user selections
  const generateRecommendedCourses = (purpose, role, skills) => {
    // All available courses with metadata
    const allCourses = [
      // Business Analytics courses
      { id: 1, title: 'Business Analytics 101', category: 'Analytics', level: 'Beginner', price: 'Free', enroll: true, badge: 'Popular', keywords: ['analytics', 'ba', 'business'] },
      { id: 2, title: 'Advanced Data Analysis', category: 'Analytics', level: 'Intermediate', price: '$9', enroll: false, badge: 'Very Popular', keywords: ['analytics', 'data', 'sql'] },
      { id: 3, title: 'Business Intelligence Mastery', category: 'Analytics', level: 'Advanced', price: '$29', enroll: false, badge: 'Premium', keywords: ['analytics', 'ba', 'business'] },
      
      // Python courses
      { id: 4, title: 'Python for Data Science', category: 'Programming', level: 'Intermediate', price: '$19', enroll: false, badge: 'Trending', keywords: ['python', 'data', 'analytics'] },
      { id: 5, title: 'Python Basics', category: 'Programming', level: 'Beginner', price: '$9', enroll: false, badge: 'Top Rated', keywords: ['python', 'programming', 'se'] },
      { id: 6, title: 'Advanced Python Development', category: 'Programming', level: 'Advanced', price: '$39', enroll: false, badge: 'Expert', keywords: ['python', 'se', 'development'] },
      
      // SQL courses
      { id: 7, title: 'SQL Fundamentals', category: 'Database', level: 'Beginner', price: 'Free', enroll: true, badge: 'Essential', keywords: ['sql', 'database', 'analytics'] },
      { id: 8, title: 'Advanced SQL Queries', category: 'Database', level: 'Intermediate', price: '$15', enroll: false, badge: 'Popular', keywords: ['sql', 'database', 'analytics'] },
      { id: 9, title: 'Database Design & Optimization', category: 'Database', level: 'Advanced', price: '$25', enroll: false, badge: 'Professional', keywords: ['sql', 'database', 'optimization'] },
      
      // Network courses
      { id: 10, title: 'Network Fundamentals', category: 'Infrastructure', level: 'Beginner', price: '$12', enroll: false, badge: 'Beginner', keywords: ['network', 'infrastructure', 'se'] },
      { id: 11, title: 'Cybersecurity Basics', category: 'Infrastructure', level: 'Intermediate', price: '$20', enroll: false, badge: 'Secured', keywords: ['network', 'security', 'advanced'] },
      
      // Career development
      { id: 12, title: 'Career Transition Guide', category: 'Career', level: 'Beginner', price: 'Free', enroll: true, badge: 'New', keywords: ['career', 'transition', 'start'] },
      { id: 13, title: 'Leadership Skills for Managers', category: 'Career', level: 'Intermediate', price: '$18', enroll: false, badge: 'Leadership', keywords: ['career', 'grow', 'cio'] },
      { id: 14, title: 'Executive Decision Making', category: 'Career', level: 'Advanced', price: '$49', enroll: false, badge: 'Executive', keywords: ['career', 'cio', 'advanced'] }
    ];

    // Score courses based on user preferences
    const scoredCourses = allCourses.map(course => {
      let score = 0;
      
      // Match by skills
      skills?.forEach(skill => {
        if (course.keywords.includes(skill.toLowerCase())) score += 3;
      });
      
      // Match by role
      if (role && course.keywords.includes(role.toLowerCase())) score += 2;
      
      // Match by purpose
      if (purpose && course.keywords.some(kw => purpose.toLowerCase().includes(kw) || kw.includes(purpose.toLowerCase().split('_')[0]))) {
        score += 1;
      }
      
      return { ...course, score };
    });

    // Sort by score and get top recommendations
    const sorted = scoredCourses.sort((a, b) => b.score - a.score);
    
    setCourses({
      topRecommended: sorted.slice(0, 3),
      trending: sorted.slice(3, 6),
      youMightWant: sorted.slice(6, 9)
    });
  };

  // Get personalized journey message
  const getJourneyMessage = () => {
    const purposeMap = {
      start_career: 'Start my career',
      grow_career: 'Grow in my career',
      change_career: 'Change my career',
      gain_knowledge: 'Gain my knowledge'
    };
    
    const roleMap = {
      writer: 'Writer',
      ba: 'Business Analyst',
      se: 'Software Engineer',
      cio: 'CIO'
    };

    const selectedRole = roleMap[userInfo.role] || userInfo.role;
    const selectedPurpose = purposeMap[userInfo.purpose] || userInfo.purpose;
    
    return `Let's start your Journey in ${selectedRole || selectedPurpose || 'Learning'}.`;
  };

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-image"></div>
      <div className="course-content">
        <p className="course-price">{course.price}</p>
        {course.enroll && <p className="course-action">Enroll</p>}
        <p className="course-chevron">›</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-welcome">Hello {userInfo.fullName}!</h1>
          <p className="dashboard-tagline">We bring you the best courses around the world !</p>
          <p className="dashboard-journey">{getJourneyMessage()}</p>

          {/* Filter */}
          <div className="filter-section">
            <button className="filter-btn">All</button>
            <button className="filter-btn active">
              <span>✓</span> Free
            </button>
          </div>
        </div>

        {/* Top Recommendation Section */}
        <div className="courses-section">
          <h2 className="section-title">Top recommendation</h2>
          <div className="courses-grid">
            {courses.topRecommended.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            <div className="scroll-indicator">
              <ChevronRight size={24} />
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <div className="courses-section">
          <h2 className="section-title">Trending Most Popular courses:</h2>
          <div className="courses-grid">
            {courses.trending.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            <div className="scroll-indicator">
              <ChevronRight size={24} />
            </div>
          </div>
        </div>

        {/* You Might Want Section */}
        <div className="courses-section">
          <h2 className="section-title">You might want</h2>
          <div className="courses-grid">
            {courses.youMightWant.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            <div className="scroll-indicator">
              <ChevronRight size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
        </div>
      </div>
    </div>
  );
}
