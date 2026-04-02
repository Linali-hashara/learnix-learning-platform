# Cadex Learning Platform - React Frontend

A modern, responsive React frontend for a learning platform that connects learners with top universities and industry leaders.

## 📋 Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Modern Components**: Reusable React components for each section
- **Beautiful UI**: Clean, professional interface matching the Cadex design
- **Interactive Elements**: Carousels, hover effects, and smooth transitions
- **Accessibility**: Semantic HTML and accessible components

## 🚀 Project Structure

```
src/
├── App.jsx                 # Main application component
├── App.css                 # Global styles
├── index.js               # React entry point
├── components/
│   ├── Header.jsx         # Navigation header
│   ├── Hero.jsx           # Hero section with CTA
│   ├── LearningPaths.jsx  # Learning paths cards
│   ├── IndustryLeaders.jsx# Partner companies section
│   ├── Testimonials.jsx   # Learner testimonials
│   ├── Universities.jsx   # Partner universities carousel
│   └── Footer.jsx         # Footer
└── public/
    └── index.html         # HTML template
```

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm build
   ```

## 📦 Dependencies

- **React 18.2.0**: UI library
- **React DOM 18.2.0**: React renderer
- **Lucide React**: Icon library
- **React Scripts**: Build tools

## 🎨 Styling

The project uses vanilla CSS for styling with:
- CSS Grid and Flexbox for layouts
- CSS variables for theming
- Media queries for responsive design
- Smooth transitions and hover effects

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## 🔧 Customization

### Colors
Update color values in `App.css`:
- Primary Blue: `#2563eb`
- Dark Gray: `#1f2937`
- Light Gray: `#f9fafb`

### Typography
- Font Family: System fonts (auto-loads best available)
- Heading Sizes: 36px (h2), 24px (h3), 16px (h4)
- Base Font Size: 16px

### Components
Each component in `src/components/` is self-contained and can be:
- Modified independently
- Reused elsewhere
- Extended with additional functionality

## 📶 Performance Optimization

- Lightweight component-based architecture
- CSS-based animations (GPU accelerated)
- Optimal image and asset loading
- Lazy loading ready

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve this project! 

---

**Happy Coding! 🚀**
