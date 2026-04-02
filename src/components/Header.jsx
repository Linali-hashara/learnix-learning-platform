import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';

export default function Header() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const toggleExplore = () => {
    setIsExploreOpen(!isExploreOpen);
  };

  const courses = {
    roles: ['Data Science', 'Web Development', 'Cloud Computing']
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-button">
            <Menu size={24} />
          </button>
          <h1 className="logo">Cadex</h1>
        </div>

        <nav className="nav-desktop">
          <div className="explore-container">
            <button className="nav-link" onClick={toggleExplore}>
              Explore
            </button>
            {isExploreOpen && (
              <div className="explore-dropdown">
                <div className="dropdown-section">
                  <h3>Explore Roles</h3>
                  <ul>
                    {courses.roles.map((role, idx) => (
                      <li key={idx}><a href="#">{role}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="header-right">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search" />
          </div>
          <button className="sign-in-btn">Sign In</button>
        </div>
      </div>
    </header>
  );
}
