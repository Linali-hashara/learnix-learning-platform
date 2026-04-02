import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Cadex</h4>
            <p>Learning platform from top universities and companies</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button className="link-btn">Home</button></li>
              <li><button className="link-btn">Courses</button></li>
              <li><button className="link-btn">About</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><button className="link-btn">Help Center</button></li>
              <li><button className="link-btn">Contact Us</button></li>
              <li><button className="link-btn">Privacy</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Cadex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
