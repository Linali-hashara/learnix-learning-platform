import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import '../styles/AdminDashboard.css';

export default function AdminCoursesPage() {
  const apiBase = 'http://localhost:5102/api/admin/courses';
  const location = useLocation();
  const navigate = useNavigate();
  const firstName = location.state?.fullName?.split(' ')[0] || 'Admin';
  const [coursesData, setCoursesData] = useState(null);
  const [actionCourseId, setActionCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const courses = useMemo(() => coursesData?.courses || [], [coursesData]);

  const loadCourses = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError('');

      const response = await fetch(apiBase);
      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load courses');
      }

      setCoursesData(data);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load courses');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [apiBase]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleDateString();
  };

  const formatPrice = (price) => {
    const value = Number(price);
    if (Number.isNaN(value) || value <= 0) {
      return 'Free';
    }

    return `$${value.toFixed(2)}`;
  };

  const handleCreateCourse = () => {
    navigate('/admin/courses/create', { state: location.state });
  };

  const handleEdit = (course) => {
    navigate('/admin/courses/create', {
      state: {
        ...location.state,
        course
      }
    });
  };

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) {
      return;
    }

    try {
      setActionCourseId(courseId);
      setError('');
      setSuccessMessage('');

      const response = await fetch(`${apiBase}/${courseId}`, {
        method: 'DELETE'
      });

      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to delete course');
      }

      setCoursesData(data);
      setSuccessMessage(data.message || 'Course deleted successfully');
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete course');
    } finally {
      setActionCourseId(null);
    }
  };

  const handleTogglePublish = async (courseId, isPublished) => {
    try {
      setActionCourseId(courseId);
      setError('');
      setSuccessMessage('');

      const response = await fetch(`${apiBase}/${courseId}/publish-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished })
      });

      const raw = await response.text();
      const data = raw ? JSON.parse(raw) : null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to update course status');
      }

      setCoursesData(data);
      setSuccessMessage(data.message || 'Course status updated successfully');
      await loadCourses(true);
    } catch (publishError) {
      setError(publishError.message || 'Failed to update course status');
    } finally {
      setActionCourseId(null);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <AdminTopbar locationState={location.state} />

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
          <Link className="sidebar-item with-icon sidebar-link active" to="/admin/courses" state={location.state}>
            Manage courses <ChevronDown size={15} />
          </Link>
          <Link className="sidebar-item sidebar-link" to="/admin/settings" state={location.state}>Settings</Link>
        </aside>

        <main className="admin-dashboard-content">
          <h1>Manage courses, {firstName}!</h1>

          {successMessage && <div className="admin-banner success">{successMessage}</div>}
          {error && <div className="admin-banner error">{error}</div>}
          {isLoading && <div className="admin-banner loading">Loading courses...</div>}

          <section className="metrics-strip">
            <article className="metric-tile">
              <span>Total courses</span>
              <strong>{coursesData?.totalCourses ?? 0}</strong>
              <p>Courses in current catalog</p>
            </article>
            <article className="metric-tile">
              <span>Published</span>
              <strong>{coursesData?.publishedCourses ?? 0}</strong>
              <p>Live and available to learners</p>
            </article>
            <article className="metric-tile">
              <span>Draft courses</span>
              <strong>{coursesData?.draftCourses ?? 0}</strong>
              <p>Pending review or publishing</p>
            </article>
            <article className="metric-tile">
              <span>Total enrollments</span>
              <strong>{coursesData?.totalEnrollments ?? 0}</strong>
              <p>Across all courses</p>
            </article>
          </section>

          <section className="panel-card users-card">
            <div className="users-card-header">
              <div>
                <h3>Course directory</h3>
                <p className="panel-copy">View course performance, pricing, ratings, and publish status.</p>
              </div>
              <div className="users-summary">
                <button type="button" className="course-btn primary" onClick={handleCreateCourse}>Create course</button>
                <span>{courses.length} courses</span>
                <span>{coursesData?.publishedCourses ?? 0} published</span>
              </div>
            </div>

            <div className="table-scroll">
              <div className="users-table courses-table">
                <div className="users-table-head courses-table-head">
                  <span>ID</span>
                  <span>Title</span>
                  <span>Category</span>
                  <span>Level</span>
                  <span>Instructor</span>
                  <span>Price</span>
                  <span>Enrollments</span>
                  <span>Rating</span>
                  <span>Updated</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>

                {courses.length > 0 ? courses.map((course) => (
                  <div className="users-table-row courses-table-row" key={course.courseId}>
                    <span>{course.courseId}</span>
                    <span>{course.title}</span>
                    <span>{course.category}</span>
                    <span>{course.level}</span>
                    <span>{course.instructor}</span>
                    <span>{formatPrice(course.price)}</span>
                    <span>{course.enrollments}</span>
                    <span>{Number(course.rating || 0).toFixed(1)}</span>
                    <span>{formatDate(course.updatedAt)}</span>
                    <span className={course.isPublished ? 'status-pill admin' : 'status-pill'}>{course.isPublished ? 'Published' : 'Draft'}</span>
                    <span className="course-actions-cell">
                      <button type="button" className="course-action-btn" onClick={() => handleEdit(course)} disabled={actionCourseId === course.courseId}>Edit</button>
                      <button
                        type="button"
                        className="course-action-btn"
                        onClick={() => handleTogglePublish(course.courseId, !course.isPublished)}
                        disabled={actionCourseId === course.courseId}
                      >
                        {course.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        className="course-action-btn danger"
                        onClick={() => handleDelete(course.courseId, course.title)}
                        disabled={actionCourseId === course.courseId}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                )) : (
                  <div className="users-table-empty">No courses available yet.</div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
