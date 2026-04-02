import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import LearningPaths from './components/LearningPaths';
import IndustryLeaders from './components/IndustryLeaders';
import Testimonials from './components/Testimonials';
import Universities from './components/Universities';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <LearningPaths />
      <IndustryLeaders />
      <Testimonials />
      <Universities />
      <Footer />
    </div>
  );
}

export default App;
