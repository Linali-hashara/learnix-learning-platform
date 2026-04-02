import React from 'react';
import { BarChart3, Globe, Cloud } from 'lucide-react';

export default function LearningPaths() {
  const paths = [
    {
      id: 1,
      title: 'Data Science',
      description: 'Learn more more now',
      icon: 'bar-chart',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Web Development',
      description: 'Learn more more now',
      icon: 'globe',
      color: 'teal'
    },
    {
      id: 3,
      title: 'Cloud Computing',
      description: 'Learn more more now',
      icon: 'cloud',
      color: 'purple'
    }
  ];

  const getIcon = (iconType) => {
    switch(iconType) {
      case 'bar-chart':
        return <BarChart3 size={48} />;
      case 'globe':
        return <Globe size={48} />;
      case 'cloud':
        return <Cloud size={48} />;
      default:
        return null;
    }
  };

  return (
    <section className="learning-paths">
      <div className="container">
        <h2>Start your learning journey</h2>
        <p>Explore curated paths to grow your skills faster</p>

        <div className="paths-grid">
          {paths.map((path) => (
            <div key={path.id} className={`path-card ${path.color}`}>
              <div className="path-icon">
                {getIcon(path.icon)}
              </div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          ))}
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
