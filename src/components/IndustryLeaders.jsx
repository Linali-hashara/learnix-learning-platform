import React from 'react';

export default function IndustryLeaders() {
  const companies = [
    { id: 1, name: 'Microsoft', logo: '🔷' },
    { id: 2, name: 'Firebase', logo: '📊' },
    { id: 3, name: 'AWS', logo: '☁️' },
    { id: 4, name: 'Azure', logo: '🔵' }
  ];

  // Duplicate companies for seamless loop animation
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="industry-leaders">
      <div className="container">
        <h2>Learn with industry leaders</h2>
        <p>Partnered with world-class institutions</p>

        <div className="companies-wrapper">
          <div className="companies-grid">
            {duplicatedCompanies.map((company, index) => (
              <div key={index} className="company-card">
                <div className="company-logo">{company.logo}</div>
                <span>{company.name}</span>
              </div>
            ))}
          </div>
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
