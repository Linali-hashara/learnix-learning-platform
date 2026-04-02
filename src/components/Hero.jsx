import React from 'react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-wrapper">
        <div className="hero-left">
          <h2>Learn from top universities and leading companies.</h2>
          <p>Start your learning journey today with courses from the world's best institutions.</p>
          <button className="get-started-hero-btn">Get Started</button>
        </div>
        <div className="hero-right">
          <div className="hero-content-area">
            {/* Badge: Analytics */}
            <div className="floating-badge badge-analytics">
              <div className="badge-content">
                <span className="badge-emoji">📊</span>
                <span className="badge-label">Analytics</span>
              </div>
            </div>

            {/* Badge: Harvard */}
            <div className="floating-badge badge-harvard">
              <div className="badge-content">
                <span className="badge-emoji">🎓</span>
                <span className="badge-label">Harvard</span>
              </div>
            </div>

            {/* Badge: Learning */}
            <div className="floating-badge badge-learning">
              <div className="badge-content">
                <span className="badge-emoji">📚</span>
                <span className="badge-label">Learning</span>
              </div>
            </div>

            {/* Badge: Microsoft */}
            <div className="floating-badge badge-microsoft">
              <div className="badge-content">
                <span className="badge-emoji">🟦</span>
                <span className="badge-label">Microsoft</span>
              </div>
            </div>

            {/* Badge: Video */}
            <div className="floating-badge badge-video">
              <div className="badge-content">
                <span className="badge-emoji">▶️</span>
                <span className="badge-label">Video</span>
              </div>
            </div>

            {/* Badge: AWS */}
            <div className="floating-badge badge-aws">
              <div className="badge-content">
                <span className="badge-emoji">☁️</span>
                <span className="badge-label">AWS</span>
              </div>
            </div>

            {/* Main Workspace Illustration */}
            <div className="workspace-illustration">
              {/* Desk Surface */}
              <div className="desk">
                {/* Coffee Cup */}
                <div className="coffee-cup-item">
                  <div className="cup"></div>
                  <div className="handle"></div>
                  <div className="steam"></div>
                </div>

                {/* Plant */}
                <div className="plant-item">
                  <div class="pot"></div>
                  <div class="leaf"></div>
                  <div class="leaf leaf-2"></div>
                </div>

                {/* Person at desk */}
                <div className="person-at-desk">
                  {/* Head */}
                  <div className="person-head">
                    <div className="hair"></div>
                    <div className="face"></div>
                    {/* Headphones */}
                    <div className="headphones">
                      <div className="ear-cup left"></div>
                      <div className="ear-cup right"></div>
                      <div className="headband"></div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="person-body">
                    <div className="shirt"></div>
                    <div className="collar"></div>
                  </div>

                  {/* Arms */}
                  <div className="person-arms">
                    <div className="arm left-arm"></div>
                    <div className="arm right-arm"></div>
                  </div>
                </div>

                {/* Laptop */}
                <div className="laptop-item">
                  <div className="laptop-screen">
                    <div className="screen-glow"></div>
                  </div>
                  <div className="laptop-keyboard"></div>
                </div>
              </div>

              {/* Ground shadow */}
              <div className="ground-shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
