import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Universities() {
  const universities = [
    { id: 1, name: 'Harvard', logo: '🎓' },
    { id: 2, name: 'MIT', logo: '🔬' },
    { id: 3, name: 'Stanford', logo: '📚' },
    { id: 4, name: 'Oxford', logo: '🏛️' },
    { id: 5, name: 'Yale', logo: '🎯' }
  ];

  return (
    <section className="universities">
      <div className="container">
        <div className="universities-header">
          <div>
            <h2>Learn from 10+ top universities</h2>
            <p>Partnered with world-class institutions</p>
          </div>
          <button className="view-all">View All →</button>
        </div>

        <div className="universities-carousel">
          <button className="carousel-btn prev">
            <ChevronLeft size={24} />
          </button>

          <div className="universities-grid">
            {universities.map((uni) => (
              <div key={uni.id} className="university-card">
                <div className="university-logo">{uni.logo}</div>
                <p>{uni.name}</p>
              </div>
            ))}
          </div>

          <button className="carousel-btn next">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
}
