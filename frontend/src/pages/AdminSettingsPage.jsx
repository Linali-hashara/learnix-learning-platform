import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, Settings, ShieldCheck, User } from 'lucide-react';
import '../styles/AdminDashboard.css';

const storageKey = 'learnix-admin-settings';

const defaultSettings = {
  notificationEmails: true,
  weeklyDigest: true,
  twoFactorAuth: true,
  darkTheme: false,
  dashboardDensity: 'comfortable',
  defaultCourseVisibility: 'draft'
};

export default function AdminSettingsPage() {
  const location = useLocation();
  const firstName = location.state?.fullName?.split(' ')[0] || 'Admin';
  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return;
    }

    try {
      setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSavedMessage('');
  };

  const handleSave = (event) => {
    event.preventDefault();
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
    setSavedMessage('Settings saved locally for this browser.');
  };

  return (
    <div className="admin-dashboard-page">
      <header className="admin-topbar">
        <div className="topbar-brand">
          <span className="brand-learnix">learnix</span>
          <span className="brand-admin">admin</span>
        </div>

        <div className="topbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search admin tools" />
        </div>

        <div className="topbar-actions">
          <Link to="/">Home</Link>
          <button type="button" className="profile-btn" aria-label="Admin profile">
            <User size={16} />
          </button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2>Admin tools</h2>

          <Link className="sidebar-item sidebar-link" to="/admin/dashboard" state={location.state}>Overview</Link>
          <Link className="sidebar-item with-icon sidebar-link" to="/admin/users" state={location.state}>
            Manage users <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item with-icon sidebar-link" to="/admin/insights" state={location.state}>
            Insights and reporting <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item with-icon sidebar-link" to="/admin/courses" state={location.state}>
            Manage courses <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item sidebar-link active" to="/admin/settings" state={location.state}>
            Settings <Settings size={15} />
          </Link>
        </aside>

        <main className="admin-dashboard-content">
          <div className="users-card-header">
            <div>
              <h1>Settings, {firstName}!</h1>
              <p className="panel-copy">Configure admin notifications, security defaults, and dashboard behavior.</p>
            </div>
            <div className="users-summary">
              <ShieldCheck size={16} />
              <span>Admin preferences</span>
            </div>
          </div>

          {savedMessage && <div className="admin-banner success">{savedMessage}</div>}

          <form className="settings-grid" onSubmit={handleSave}>
            <section className="panel-card settings-card">
              <h3>Notifications</h3>
              <label className="settings-toggle">
                <input type="checkbox" name="notificationEmails" checked={settings.notificationEmails} onChange={handleChange} />
                Email notifications for platform activity
              </label>
              <label className="settings-toggle">
                <input type="checkbox" name="weeklyDigest" checked={settings.weeklyDigest} onChange={handleChange} />
                Weekly digest summary
              </label>
            </section>

            <section className="panel-card settings-card">
              <h3>Security</h3>
              <label className="settings-toggle">
                <input type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} />
                Require two-factor authentication
              </label>
              <p className="panel-copy settings-note">Security preferences are stored locally here for now.</p>
            </section>

            <section className="panel-card settings-card">
              <h3>Display</h3>
              <label>
                Dashboard density
                <select name="dashboardDensity" value={settings.dashboardDensity} onChange={handleChange}>
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </label>
              <label>
                Default new course visibility
                <select name="defaultCourseVisibility" value={settings.defaultCourseVisibility} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="settings-toggle">
                <input type="checkbox" name="darkTheme" checked={settings.darkTheme} onChange={handleChange} />
                Dark theme preview for admin pages
              </label>
            </section>

            <section className="panel-card settings-card settings-actions-card">
              <h3>Save changes</h3>
              <p className="panel-copy">These values are stored in your browser until backend preferences are connected.</p>
              <div className="settings-actions">
                <button type="submit" className="course-btn primary">Save settings</button>
                <Link className="course-btn secondary theme-link-btn" to="/admin/dashboard" state={location.state}>Back to overview</Link>
              </div>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
}