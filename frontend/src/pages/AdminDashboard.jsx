import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Users, BarChart3, BookOpenCheck } from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const location = useLocation();
  const firstName = location.state?.fullName?.split(' ')[0] || 'Admin';
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('http://localhost:5102/api/admin/overview');
        const raw = await response.text();
        const data = raw ? JSON.parse(raw) : null;

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load admin overview');
        }

        setOverview(data);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load admin overview');
      } finally {
        setIsLoading(false);
      }
    };

    loadOverview();
  }, []);

  const metricCards = overview?.metricCards || [
    { title: 'Total users', value: '0', description: 'All registered learners and admins' },
    { title: 'Active learners', value: '0', description: 'Updated in the last 30 days' },
    { title: 'Courses published', value: '12', description: 'Platform content currently available' },
    { title: 'Pending reviews', value: '0', description: 'Users still missing onboarding data' }
  ];

  const topIndustry = overview?.topIndustryHighlight || { title: 'Popular in your industry', value: 'Python', percent: 44 };
  const topOrganization = overview?.topOrganizationHighlight || { title: 'Popular in your organization', value: 'Technical Analysis (Finance)', percent: 89 };
  const remainingLicenses = overview?.remainingLicenses ?? 999;
  const licenseUtilization = overview?.licenseUtilizationPercent ?? 24;
  const pendingInvitations = overview?.pendingInvitations ?? 91;
  const inactiveUsers = overview?.inactiveUsers ?? 423;
  const activeUserPercent = overview?.activeUserPercent ?? 10.4;

  return (
    <div className="admin-dashboard-page">
      <AdminTopbar locationState={location.state} />

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2>Admin tools</h2>

          <button type="button" className="sidebar-item active">Overview</button>
          <Link to="/admin/users" state={location.state} className="sidebar-item with-icon sidebar-link">
            Manage users <ChevronDown size={15} />
          </Link>
          <Link to="/admin/insights" state={location.state} className="sidebar-item with-icon sidebar-link">
            Insights and reporting <ChevronDown size={15} />
          </Link>
          <Link to="/admin/courses" state={location.state} className="sidebar-item with-icon sidebar-link">
            Manage courses <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item sidebar-link" to="/admin/settings" state={location.state}>Settings</Link>
        </aside>

        <main className="admin-dashboard-content">
          <h1>Welcome to your overview, {firstName}!</h1>
          {error && <div className="admin-banner error">{error}</div>}
          {isLoading && <div className="admin-banner loading">Loading overview...</div>}

          <section className="metrics-strip">
            {metricCards.map((card) => (
              <article className="metric-tile" key={card.title}>
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.description}</p>
              </article>
            ))}
          </section>

          <section className="overview-grid top-grid">
            <article className="panel-card">
              <h3>Manage users successfully</h3>
              <p className="panel-copy">Set your account up for success by inviting users and managing licenses and groups.</p>

              <div className="progress-label">{licenseUtilization}% of available licenses used</div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(licenseUtilization, 100)}%` }}></div>
              </div>

              <div className="split-row">
                <div className="mini-stat">
                  <Users size={15} />
                  <div>
                    <p>{pendingInvitations} pending invitations</p>
                    <Link to="/admin/users" state={location.state}>Review pending invites</Link>
                  </div>
                </div>

                <div className="mini-stat">
                  <BookOpenCheck size={15} />
                  <div>
                    <p>{remainingLicenses} remaining licenses</p>
                    <Link to="/admin/users" state={location.state} className="theme-btn theme-link-btn">Invite new users</Link>
                  </div>
                </div>
              </div>
            </article>

            <article className="panel-card panel-soft">
              <h3>Review your learners' feedback</h3>
              <p className="panel-copy">Understand how helpful Learnix is to learners with regular survey check-ins.</p>
              <div className="feedback-state">{overview?.feedbackStatus || 'Active'}</div>
              <Link to="/admin/users" state={location.state} className="panel-link">View check-in results</Link>
            </article>
          </section>

          <section className="panel-card insights-card">
            <div className="insight-header">
              <div>
                <h3>Take a deep dive into learner insights</h3>
                <p className="panel-copy">Discover the impact of Learnix with insights and reporting.</p>
              </div>
              <div className="insight-actions">
                <button type="button">User adoption funnel</button>
                <button type="button">Course insights</button>
              </div>
            </div>

            <div className="insights-content">
              <div className="insight-left">
                <div className="trend-stat">
                  <BarChart3 size={16} />
                  <span>In last 30 days</span>
                </div>
                <h4>{activeUserPercent}% active users</h4>
                <p>{inactiveUsers} inactive users</p>
                <button type="button" className="theme-btn">Engagement best practices</button>
              </div>

              <div className="insight-right">
                <div className="bar-block">
                  <span>{topIndustry.title}</span>
                  <h4>{topIndustry.value}</h4>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${topIndustry.percent}%` }}></div>
                  </div>
                </div>

                <div className="bar-block">
                  <span>{topOrganization.title}</span>
                  <h4>{topOrganization.value}</h4>
                  <div className="progress-track green">
                    <div className="progress-fill" style={{ width: `${topOrganization.percent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
