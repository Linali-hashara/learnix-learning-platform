import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, User } from 'lucide-react';
import '../styles/AdminDashboard.css';

export default function AdminCourseFormPage() {
  const apiBase = 'http://localhost:5102/api/admin/courses';
  const location = useLocation();
  const navigate = useNavigate();
  const firstName = location.state?.fullName?.split(' ')[0] || 'Admin';
  const existingCourse = location.state?.course || null;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: '',
    instructor: '',
    price: '',
    enrollments: '0',
    rating: '0',
    description: '',
    isPublished: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!existingCourse) {
      return;
    }

    setFormData({
      title: existingCourse.title || '',
      category: existingCourse.category || '',
      level: existingCourse.level || '',
      instructor: existingCourse.instructor || '',
      price: String(existingCourse.price ?? ''),
      enrollments: String(existingCourse.enrollments ?? 0),
      rating: String(existingCourse.rating ?? 0),
      description: existingCourse.description || '',
      isPublished: Boolean(existingCourse.isPublished)
    });
  }, [existingCourse]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      level: formData.level.trim(),
      instructor: formData.instructor.trim(),
      price: Number(formData.price || 0),
      enrollments: Number(formData.enrollments || 0),
      rating: Number(formData.rating || 0),
      description: formData.description.trim(),
      isPublished: formData.isPublished
    };

    if (!payload.title || !payload.category || !payload.level || !payload.instructor) {
      setError('Please fill title, category, level, and instructor.');
      return;
    }

    if (payload.price < 0 || payload.enrollments < 0 || payload.rating < 0 || payload.rating > 5) {
      setError('Price/enrollments must be non-negative and rating must be between 0 and 5.');
      return;
    }

    try {
      setIsSubmitting(true);
      const targetUrl = existingCourse ? `${apiBase}/${existingCourse.courseId}` : apiBase;
      const method = existingCourse ? 'PUT' : 'POST';

      const response = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to save course');
      }

      setSuccessMessage(data.message || 'Course saved successfully');
      setTimeout(() => {
        navigate('/admin/courses', { state: location.state, replace: true });
      }, 500);
    } catch (saveError) {
      setError(saveError.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
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
          <Link className="sidebar-item with-icon sidebar-link active" to="/admin/courses/create" state={location.state}>
            Create course <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item sidebar-link" to="/admin/settings" state={location.state}>Settings</Link>
        </aside>

        <main className="admin-dashboard-content">
          <div className="users-card-header">
            <div>
              <h1>{existingCourse ? 'Edit course' : 'Create course'}, {firstName}!</h1>
              <p className="panel-copy">Fill in the course details on this page, then save to add it to the catalog.</p>
            </div>
            <div className="users-summary">
              <Link className="course-btn secondary theme-link-btn" to="/admin/courses" state={location.state}>Back to courses</Link>
            </div>
          </div>

          {successMessage && <div className="admin-banner success">{successMessage}</div>}
          {error && <div className="admin-banner error">{error}</div>}

          <section className="panel-card course-form-card">
            <div className="users-card-header">
              <div>
                <h3>{existingCourse ? 'Update course details' : 'New course details'}</h3>
                <p className="panel-copy">Provide course metadata, pricing, visibility, and performance hints.</p>
              </div>
            </div>

            <form className="course-form-grid" onSubmit={handleSubmit}>
              <label>
                Title
                <input name="title" value={formData.title} onChange={handleChange} required />
              </label>
              <label>
                Category
                <input name="category" value={formData.category} onChange={handleChange} required />
              </label>
              <label>
                Level
                <input name="level" value={formData.level} onChange={handleChange} required />
              </label>
              <label>
                Instructor
                <input name="instructor" value={formData.instructor} onChange={handleChange} required />
              </label>
              <label>
                Price (USD)
                <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} />
              </label>
              <label>
                Enrollments
                <input name="enrollments" type="number" min="0" step="1" value={formData.enrollments} onChange={handleChange} />
              </label>
              <label>
                Rating (0-5)
                <input name="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} />
              </label>
              <label className="course-publish-label">
                <input name="isPublished" type="checkbox" checked={formData.isPublished} onChange={handleChange} />
                Publish immediately
              </label>
              <label className="course-description-field">
                Description
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
              </label>

              <div className="course-form-actions">
                <button type="submit" className="course-btn primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : existingCourse ? 'Update course' : 'Create course'}
                </button>
                <Link className="course-btn secondary theme-link-btn" to="/admin/courses" state={location.state}>Cancel</Link>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}