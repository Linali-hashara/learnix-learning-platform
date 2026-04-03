import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import '../styles/AdminDashboard.css';

export default function AdminUsersPage() {
  const location = useLocation();
  const firstName = location.state?.fullName?.split(' ')[0] || 'Admin';
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('http://localhost:5102/api/admin/users');
        const raw = await response.text();
        const data = raw ? JSON.parse(raw) : null;

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to load admin users');
        }

        const loadedUsers = data.users || [];
        setUsers(loadedUsers);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load admin users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleDateString();
  };

  const formatList = (items) => {
    if (!items || items.length === 0) return 'None';
    return items.join(', ');
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const closeUserDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <div className="admin-dashboard-page">
      <AdminTopbar locationState={location.state} />

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2>Admin tools</h2>

          <Link className="sidebar-item" to="/admin/dashboard" state={location.state}>Overview</Link>
          <Link className="sidebar-item with-icon active" to="/admin/users" state={location.state}>
            Manage users <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item with-icon sidebar-link" to="/admin/insights" state={location.state}>
            Insights and reporting <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item with-icon sidebar-link" to="/admin/courses" state={location.state}>
            Manage courses <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item sidebar-link" to="/admin/settings" state={location.state}>Settings</Link>
        </aside>

        <main className="admin-dashboard-content">
          <h1>Manage users, {firstName}!</h1>

          <section className="metrics-strip">
            <article className="metric-tile">
              <span>Total users</span>
              <strong>{users.length}</strong>
              <p>All registered accounts</p>
            </article>
            <article className="metric-tile">
              <span>Admin users</span>
              <strong>{users.filter((user) => user.isAdmin).length}</strong>
              <p>Users with admin access</p>
            </article>
            <article className="metric-tile">
              <span>Learners</span>
              <strong>{users.filter((user) => !user.isAdmin).length}</strong>
              <p>Regular platform users</p>
            </article>
            <article className="metric-tile">
              <span>Recent signups</span>
              <strong>{users.slice(0, 6).length}</strong>
              <p>Newest profiles in the system</p>
            </article>
          </section>

          {error && <div className="admin-banner error">{error}</div>}
          {isLoading && <div className="admin-banner loading">Loading users...</div>}

          <section className="panel-card users-card">
            <div className="users-card-header">
              <div>
                <h3>User directory</h3>
                <p className="panel-copy">Showing only ID, name, email, role, and status. Use More to open the full user details view.</p>
              </div>
              <div className="users-summary">
                <span>{users.length} total users</span>
                <span>{users.filter((user) => user.isAdmin).length} admins</span>
              </div>
            </div>

            <div className="table-scroll">
              <div className="users-table manage-users-table">
                <div className="users-table-head manage-users-head">
                  <span>ID</span>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                {users.length > 0 ? users.map((user) => (
                  <div
                    className={selectedUser?.userId === user.userId && isDetailsOpen ? 'users-table-row manage-users-row selected' : 'users-table-row manage-users-row'}
                    key={user.userId}
                  >
                    <span>{user.userId}</span>
                    <span>{user.fullName}</span>
                    <span>{user.email}</span>
                    <span>{user.role || 'Not set'}</span>
                    <span className={user.isAdmin ? 'status-pill admin' : 'status-pill'}>{user.isAdmin ? 'Admin' : 'Learner'}</span>
                    <span>
                      <button
                        type="button"
                        className="details-btn"
                        onClick={() => openUserDetails(user)}
                      >
                        More
                      </button>
                    </span>
                  </div>
                )) : (
                  <div className="users-table-empty">No users to display yet.</div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {isDetailsOpen && selectedUser && (
        <div className="detail-modal-overlay" role="dialog" aria-modal="true" aria-label="User details view">
          <section className="panel-card user-detail-card detail-modal-window">
            <div className="users-card-header">
              <div>
                <h3>{selectedUser.fullName}</h3>
                <p className="panel-copy">Detailed profile view for this user.</p>
              </div>
              <div className="users-summary">
                <span>User ID {selectedUser.userId}</span>
                <span>{selectedUser.isAdmin ? 'Admin account' : 'Learner account'}</span>
                <button type="button" className="details-close-btn" onClick={closeUserDetails}>Close</button>
              </div>
            </div>

            <div className="user-detail-grid">
              <div>
                <span className="detail-label">Email</span>
                <strong>{selectedUser.email}</strong>
              </div>
              <div>
                <span className="detail-label">Purpose</span>
                <strong>{selectedUser.purpose || 'Not set'}</strong>
              </div>
              <div>
                <span className="detail-label">Role</span>
                <strong>{selectedUser.role || 'Not set'}</strong>
              </div>
              <div>
                <span className="detail-label">Education</span>
                <strong>{selectedUser.educationLevel || 'Not set'}</strong>
              </div>
              <div>
                <span className="detail-label">Skills</span>
                <strong>{selectedUser.skills || 'N/A'}</strong>
              </div>
              <div>
                <span className="detail-label">Journey reasons</span>
                <strong>{formatList(selectedUser.journeyReasons)}</strong>
              </div>
              <div>
                <span className="detail-label">Created</span>
                <strong>{formatDate(selectedUser.createdAt)}</strong>
              </div>
              <div>
                <span className="detail-label">Updated</span>
                <strong>{formatDate(selectedUser.updatedAt)}</strong>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}