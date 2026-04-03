# Learnix Learning Platform - Full Setup Guide

## Project Overview

Learnix is a learning platform with a React frontend and .NET backend.

### Architecture
```
learnix-learning-platform/
├── frontend/               # React app (runs on port 3000/5173)
├── LearnixBackend/        # ASP.NET Core API (runs on port 5102)
└── backend/               # (Legacy Node.js - not used)
```

## Quick Start

### 1. Backend Setup (.NET)

```bash
cd LearnixBackend

# Install dependencies and run migrations
dotnet ef database update

# Start the backend server
dotnet run
```

Backend will be available at: `http://localhost:5102`

See [LearnixBackend/README.md](./LearnixBackend/README.md) for detailed instructions.

### 2. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be available at: `http://localhost:3000`

## API Base URL

The frontend is configured to communicate with the .NET backend at:
- `http://localhost:5102`

### API Endpoints

**Authentication:**
- `POST /api/auth/signup` - User registration
- `GET /api/auth/validate-email` - Email validation

**Onboarding:**
- `POST /api/onboarding/save-journey-reasons` - Save user journey reasons
- `GET /api/onboarding/journey-reasons/{userId}` - Retrieve user journey reasons

**Health:**
- `GET /api/health` - Backend health check

## Flow: Sign Up → Onboarding

1. **Sign Up Page** (`/signup`)
   - User enters: Full Name, Email, Password, Confirm Password
   - Calls: `POST /api/auth/signup`
   - On success: Navigate to `/onboarding` with userId and fullName

2. **Onboarding Page** (`/onboarding`)
   - Display: "Learning Journey Bus" questionnaire
   - User selects reasons from:
     - Start my career
     - Grow in my career
     - Change my career
     - Gain my knowledge
   - Calls: `POST /api/onboarding/save-journey-reasons`
   - On success: Navigate to `/dashboard`

## Database

### Database Type: SQL Server

**Default Configuration:**
- Server: LocalDB (local SQL Server instance)
- Database: LearnixDb_Dev (development) / LearnixDb (production)

**Tables:**
- `Users` - User accounts
- `UserJourneyReasons` - User journey reasons from onboarding

**Migrations:**
```bash
# Create database
dotnet ef database update

# Add new migration
dotnet ef migrations add MigrationName

# Revert last migration
dotnet ef database update PreviousMigrationName
```

## Development Tools

### Required
- Node.js 16+ (for React)
- .NET 7 SDK (for ASP.NET Core)
- SQL Server 2019+ or LocalDB

### Recommended
- Visual Studio Code
- Visual Studio 2022 Community (optional)
- Postman or Insomnia (for API testing)

### Optional
- Azure Data Studio (SQL Server management)
- DBeaver (database visualization)

## Debugging

### Frontend Debug
- Browser DevTools (F12)
- React Developer Tools extension
- Check: `http://localhost:3000` for React errors

### Backend Debug
- Console output during `dotnet run`
- Check port 5102 for API responses
- Swagger UI: `http://localhost:5102/swagger`

### API Testing
Use Postman/Insomnia to test endpoints:

**Test Sign Up:**
```
POST http://localhost:5102/api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Test Save Journey Reasons:**
```
POST http://localhost:5102/api/onboarding/save-journey-reasons
Content-Type: application/json

{
  "userId": 1,
  "selectedReasons": ["start_career", "gain_knowledge"]
}
```

## Environment Variables

### Frontend
- None required for basic setup
- Backend URL: Hardcoded as `http://localhost:5102`

### Backend
- `ConnectionString` in `appsettings.Development.json`
- Other config in same file

## TODO / Next Steps

- [ ] Create Dashboard page (`/dashboard`)
- [ ] Add JWT authentication
- [ ] Implement Login functionality
- [ ] Create password reset flow
- [ ] Add database encryption
- [ ] Set up automated tests
- [ ] Deploy to Azure/AWS
- [ ] Add email verification
- [ ] Implement role-based access control (RBAC)

## Support

For setup issues, check:
1. `.NET is installed: `dotnet --version`
2. SQL Server is running
3. Ports 3000 and 5102 are available
4. All dependencies are installed (`npm install`, `dotnet restore`)

## License

ISC
