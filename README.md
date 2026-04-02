# 🎓 Learnix Learning Platform

A full-stack learning platform with React frontend and Express backend that connects learners with top universities and industry leaders.

## 📋 Features

- **Responsive Design**: Mobile-first React frontend
- **Modern Architecture**: Full-stack monorepo structure
- **RESTful API**: Express.js backend for data operations
- **Beautiful UI**: Clean, professional interface
- **Interactive Elements**: Carousels, hover effects, smooth transitions

## 🏗️ Project Structure

```
learnix-learning-platform/
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   ├── Hero.jsx           # Hero section with CTA
│   │   │   ├── LearningPaths.jsx  # Learning paths
│   │   │   ├── IndustryLeaders.jsx# Partners
│   │   │   ├── Testimonials.jsx   # Reviews
│   │   │   ├── Universities.jsx   # University carousel
│   │   │   └── Footer.jsx         # Footer
│   │   ├── App.jsx                # Main component
│   │   ├── App.css                # Global styles
│   │   └── index.js               # Entry point
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── backend/                       # Express.js API
│   ├── src/
│   │   └── server.js              # Main server file
│   ├── controllers/               # Business logic
│   ├── models/                    # Database models
│   ├── routes/                    # API routes
│   └── package.json
│
└── package.json                   # Root monorepo manager
```

## 🚀 Getting Started

### 1. Install All Dependencies

```bash
npm run install:all
```

### 2. Run Both Frontend & Backend

```bash
npm start
```

This will automatically start:
- **Frontend**: http://localhost:3000 (React dev server)
- **Backend**: http://localhost:5000 (Express API)

### 3. Access the Application

Open your browser and visit: **http://localhost:3000**

## 🎯 Available Commands

### Root Level (Monorepo)
```bash
npm start              # Run both frontend and backend
npm run start:frontend # Run React only
npm run start:backend  # Run Express only
npm run build          # Build React for production
npm test               # Run React tests
npm run install:all    # Install all dependencies
```

### Frontend Only
```bash
cd frontend
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
```

### Backend Only
```bash
cd backend
npm run dev            # Start with nodemon
npm start              # Start server
```

## 📦 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React DOM 18.2.0** - React renderer
- **Lucide React** - Icon library
- **React Scripts** - Build tools

### Backend
- **Express 4.18.2** - Web framework
- **CORS** - Cross-origin requests
- **Mongoose 7.0.0** - MongoDB ODM
- **Dotenv** - Environment variables
- **Nodemon** - Development auto-reload

## 🎨 Frontend Features

- Responsive CSS Grid/Flexbox layouts
- Vanilla CSS with no dependencies
- Mobile-first design approach
- Smooth animations and transitions
- Accessible semantic HTML

## 🔌 Backend Features

- RESTful API endpoints
- CORS enabled for frontend communication
- Environment configuration support
- MongoDB integration ready
- Error handling middleware

## ⚙️ Configuration

### Environment Variables (Backend)

Create `.env` file in `backend/` directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Open source - Available for educational purposes

---

**Happy Coding! 🚀**
