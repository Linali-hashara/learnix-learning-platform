import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah M.',
      rating: 5,
      text: 'This platform has transformed my career prospects. Highly recommend!',
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Jason R.',
      rating: 5,
      text: 'This platform has transformed my career prospects. Highly recommend!',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Lisa T.',
      rating: 5,
      text: 'This platform has transformed my career prospects. Highly recommend!',
      avatar: '👩'
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What our learners say</h2>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">{testimonial.avatar}</div>
                <div>
                  <h4>{testimonial.name}</h4>
                  <div className="stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="gold" color="gold" />
                    ))}
                  </div>
                </div>
              </div>
              <p>{testimonial.text}</p>
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
