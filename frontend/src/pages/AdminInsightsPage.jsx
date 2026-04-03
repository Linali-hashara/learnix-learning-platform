import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronDown, User } from 'lucide-react';
import '../styles/AdminDashboard.css';

export default function AdminInsightsPage() {
  const location = useLocation();
  const firstName = location.state?.fullName?.split(' ')[0] || 'Admin';
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRange, setSelectedRange] = useState('30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setIsLoading(true);
        setError('');

        const baseUrl = 'http://localhost:5102/api/admin/insights';
        let requestUrl = `${baseUrl}?days=${selectedRange}`;

        if (selectedRange === 'custom') {
          const searchParams = new URLSearchParams();
          if (customFrom) searchParams.set('from', customFrom);
          if (customTo) searchParams.set('to', customTo);
          const query = searchParams.toString();
          requestUrl = query ? `${baseUrl}?${query}` : baseUrl;
        }

        const response = await fetch(requestUrl);
        const raw = await response.text();
        const data = raw ? JSON.parse(raw) : null;

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load insights and reporting');
        }

        setInsights(data);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load insights and reporting');
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, [selectedRange, customFrom, customTo]);

  const roleBreakdown = insights?.roleBreakdown || [];
  const educationBreakdown = insights?.educationBreakdown || [];
  const purposeBreakdown = insights?.purposeBreakdown || [];
  const monthlyRegistrations = insights?.monthlyRegistrations || [];

  const maxMonthly = Math.max(1, ...monthlyRegistrations.map((item) => item.count || 0));
  const maxRoleCount = Math.max(1, ...roleBreakdown.map((item) => item.count || 0));
  const maxEducationCount = Math.max(1, ...educationBreakdown.map((item) => item.count || 0));
  const maxPurposeCount = Math.max(1, ...purposeBreakdown.map((item) => item.count || 0));

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
          <Link className="sidebar-item with-icon sidebar-link active" to="/admin/insights" state={location.state}>
            Insights and reporting <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item with-icon sidebar-link" to="/admin/courses" state={location.state}>
            Manage courses <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item sidebar-link" to="/admin/settings" state={location.state}>Settings</Link>
        </aside>

        <main className="admin-dashboard-content">
          <h1>Insights and reporting, {firstName}!</h1>

          <section className="panel-card range-filter-card">
            <div className="range-filter-head">
              <h3>Date range</h3>
              <p className="panel-copy">Choose a reporting window to refresh all insight widgets.</p>
            </div>

            <div className="range-controls">
              <button
                type="button"
                className={selectedRange === '7' ? 'range-btn active' : 'range-btn'}
                onClick={() => setSelectedRange('7')}
              >
                Last 7 days
              </button>
              <button
                type="button"
                className={selectedRange === '30' ? 'range-btn active' : 'range-btn'}
                onClick={() => setSelectedRange('30')}
              >
                Last 30 days
              </button>
              <button
                type="button"
                className={selectedRange === '90' ? 'range-btn active' : 'range-btn'}
                onClick={() => setSelectedRange('90')}
              >
                Last 90 days
              </button>
              <button
                type="button"
                className={selectedRange === 'custom' ? 'range-btn active' : 'range-btn'}
                onClick={() => setSelectedRange('custom')}
              >
                Custom range
              </button>
            </div>

            {selectedRange === 'custom' && (
              <div className="custom-range-inputs">
                <label>
                  From
                  <input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} />
                </label>
                <label>
                  To
                  <input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} />
                </label>
              </div>
            )}

            {insights?.appliedRangeLabel && (
              <p className="range-label">Applied: {insights.appliedRangeLabel}</p>
            )}
          </section>

          {error && <div className="admin-banner error">{error}</div>}
          {isLoading && <div className="admin-banner loading">Loading insights...</div>}

          <section className="metrics-strip">
            <article className="metric-tile">
              <span>Total users</span>
              <strong>{insights?.totalUsers ?? 0}</strong>
              <p>Registered across the platform</p>
            </article>
            <article className="metric-tile">
              <span>Active users</span>
              <strong>{insights?.activeUsers ?? 0}</strong>
              <p>{insights?.activeUserPercent ?? 0}% active in last 30 days</p>
            </article>
            <article className="metric-tile">
              <span>Inactive users</span>
              <strong>{insights?.inactiveUsers ?? 0}</strong>
              <p>Need re-engagement actions</p>
            </article>
            <article className="metric-tile">
              <span>Avg skills per user</span>
              <strong>{insights?.avgSkillsPerUser ?? 0}</strong>
              <p>Skill breadth across learners</p>
            </article>
          </section>

          <section className="insights-report-grid">
            <article className="panel-card">
              <h3>Monthly registrations</h3>
              <p className="panel-copy">New accounts created over the last six months.</p>

              <div className="report-bars">
                {monthlyRegistrations.length > 0 ? monthlyRegistrations.map((item) => (
                  <div className="report-row" key={item.label}>
                    <span className="report-label">{item.label}</span>
                    <div className="report-track">
                      <div className="report-fill" style={{ width: `${(item.count / maxMonthly) * 100}%` }}></div>
                    </div>
                    <span className="report-value">{item.count}</span>
                  </div>
                )) : <p className="users-table-empty">No monthly data available yet.</p>}
              </div>
            </article>

            <article className="panel-card">
              <h3>Role distribution</h3>
              <p className="panel-copy">Most selected roles by users.</p>

              <div className="report-bars">
                {roleBreakdown.length > 0 ? roleBreakdown.map((item) => (
                  <div className="report-row" key={item.name}>
                    <span className="report-label">{item.name}</span>
                    <div className="report-track">
                      <div className="report-fill" style={{ width: `${(item.count / maxRoleCount) * 100}%` }}></div>
                    </div>
                    <span className="report-value">{item.count}</span>
                  </div>
                )) : <p className="users-table-empty">No role data available yet.</p>}
              </div>
            </article>

            <article className="panel-card">
              <h3>Education level</h3>
              <p className="panel-copy">Education background of platform users.</p>

              <div className="report-bars">
                {educationBreakdown.length > 0 ? educationBreakdown.map((item) => (
                  <div className="report-row" key={item.name}>
                    <span className="report-label">{item.name}</span>
                    <div className="report-track">
                      <div className="report-fill" style={{ width: `${(item.count / maxEducationCount) * 100}%` }}></div>
                    </div>
                    <span className="report-value">{item.count}</span>
                  </div>
                )) : <p className="users-table-empty">No education data available yet.</p>}
              </div>
            </article>

            <article className="panel-card">
              <h3>Learning purpose</h3>
              <p className="panel-copy">Why users are using Learnix.</p>

              <div className="report-bars">
                {purposeBreakdown.length > 0 ? purposeBreakdown.map((item) => (
                  <div className="report-row" key={item.name}>
                    <span className="report-label">{item.name}</span>
                    <div className="report-track">
                      <div className="report-fill" style={{ width: `${(item.count / maxPurposeCount) * 100}%` }}></div>
                    </div>
                    <span className="report-value">{item.count}</span>
                  </div>
                )) : <p className="users-table-empty">No purpose data available yet.</p>}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
