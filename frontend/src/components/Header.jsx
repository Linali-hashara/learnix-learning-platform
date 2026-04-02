import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const toggleExplore = () => {
    setIsExploreOpen(!isExploreOpen);
  };

  const courses = {
    roles: ['Data Science', 'Web Development', 'Cloud Computing', 'Mobile Development', 'AI & Machine Learning']
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-left">
          <h1 className="logo">Learnix</h1>
        </div>

        {/* Navigation - Desktop */}
        <nav className="nav-desktop">
          <div className="explore-container">
            <button className="nav-link explore-btn" onClick={toggleExplore}>
              Explore <ChevronDown size={16} />
            </button>
            {isExploreOpen && (
              <div className="explore-dropdown">
                <div className="dropdown-section">
                  <h3>Learning Paths</h3>
                  <ul>
                    {courses.roles.map((role, idx) => (
                      <li key={idx}><a href="#">{role}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <a href="#" className="nav-link">Courses</a>
          <a href="#" className="nav-link">About</a>
        </nav>

        {/* Search & Auth Section */}
        <div className="header-right">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search courses..." />
          </div>
          <Link to="/signup" className="sign-in-btn secondary">Sign In</Link>
          <Link to="/login" className="sign-in-btn primary" style={{ backgroundColor: '#5B3FD1', color: 'white', borderRadius: '8px', padding: '10px 24px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Log In</Link>
        </div>
      </div>
    </header>
  );
}
