import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';

export default function AdminTopbar({ locationState, searchPlaceholder = 'Search admin tools' }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate('/admin/settings', { state: locationState });
  };

  const handleLogoutClick = () => {
    const authKeys = ['learnix-auth', 'learnix-user', 'learnix-session', 'token', 'authToken'];
    authKeys.forEach((key) => {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    });

    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-brand">
        <span className="brand-learnix">learnix</span>
        <span className="brand-admin">admin</span>
      </div>

      <div className="topbar-search">
        <Search size={16} />
        <input type="text" placeholder={searchPlaceholder} />
      </div>

      <div className="topbar-actions" ref={menuRef}>
        <Link to="/">Home</Link>
        <button
          type="button"
          className="profile-btn"
          aria-label="Admin profile"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <User size={16} />
        </button>

        {isMenuOpen && (
          <div className="topbar-profile-menu">
            <button type="button" className="topbar-menu-item" onClick={handleProfileClick}>Profile</button>
            <button type="button" className="topbar-menu-item danger" onClick={handleLogoutClick}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
