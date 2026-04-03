# Learnix Backend (.NET)

ASP.NET Core 7 backend for the Learnix Learning Platform with Entity Framework Core and SQL Server.

## Project Structure

```
LearnixBackend/
├── Controllers/
│   ├── AuthController.cs          # User registration and authentication
│   └── OnboardingController.cs     # User journey reasons
├── Models/
│   ├── User.cs                    # User model
│   └── UserJourneyReason.cs       # User journey reasons model
├── Data/
│   └── LearnixContext.cs          # Entity Framework DbContext
├── DTOs/
│   ├── AuthDTOs.cs               # Authentication request/response DTOs
│   └── OnboardingDTOs.cs         # Onboarding request/response DTOs
├── Services/
│   ├── AuthService.cs            # Authentication business logic
│   └── OnboardingService.cs      # Onboarding business logic
├── Program.cs                     # Application configuration
├── appsettings.json              # Production settings
└── appsettings.Development.json  # Development settings
```

## Prerequisites

- .NET 7 SDK ([Download](https://dotnet.microsoft.com/download/dotnet/7.0))
- SQL Server 2019+ or SQL Server Express 2019+
- (Optional) Visual Studio 2022 or Visual Studio Code

## Setup Instructions

### 1. Install .NET 7 SDK

```bash
# Check if .NET is installed
dotnet --version

# If not installed, download from https://dotnet.microsoft.com/download/dotnet/7.0
```

### 2. Configure Database Connection

Edit `appsettings.Development.json` to match your SQL Server instance:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LearnixDb_Dev;Trusted_Connection=true;"
  }
}
```

**Options:**
- **LocalDB** (default): `Server=(localdb)\\mssqllocaldb;Database=LearnixDb_Dev;Trusted_Connection=true;`
- **SQL Server Express**: `Server=.\SQLEXPRESS;Database=LearnixDb_Dev;Trusted_Connection=true;`
- **Named instance**: `Server=YOUR_SERVER\\INSTANCE;Database=LearnixDb_Dev;Trusted_Connection=true;`

### 3. Create Database and Run Migrations

```bash
# Navigate to backend directory
cd LearnixBackend

# Install EF Core CLI globally (if not already installed)
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### 4. Run the Backend

```bash
# Development mode
dotnet run

# Production mode
dotnet run --configuration Release
```

The backend will start at `http://localhost:5102`

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Register new user
  - Request body:
    ```json
    {
      "fullName": "John Doe",
      "email": "john@example.com",
      "password": "Password123!"
    }
    ```
  - Response:
    ```json
    {
      "userId": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "success": true,
      "message": "User registered successfully"
    }
    ```

- **GET** `/api/auth/validate-email?email=user@example.com` - Check if email is available
  - Response:
    ```json
    {
      "isAvailable": true
    }
    ```

### Onboarding
- **POST** `/api/onboarding/save-journey-reasons` - Save user journey reasons
  - Request body:
    ```json
    {
      "userId": 1,
      "selectedReasons": ["start_career", "gain_knowledge"]
    }
    ```
  - Response:
    ```json
    {
      "userId": 1,
      "savedReasons": ["start_career", "gain_knowledge"],
      "success": true,
      "message": "Journey reasons saved successfully"
    }
    ```

- **GET** `/api/onboarding/journey-reasons/{userId}` - Get user journey reasons
  - Response:
    ```json
    {
      "userId": 1,
      "savedReasons": ["start_career", "gain_knowledge"],
      "success": true,
      "message": "Journey reasons retrieved successfully"
    }
    ```

### Health Check
- **GET** `/api/health` - Check backend health
  - Response:
    ```json
    {
      "status": "Backend server is running!",
      "timestamp": "2024-04-03T10:30:00Z"
    }
    ```

## Swagger Documentation

When running in development mode, visit: `http://localhost:5102/swagger`

## Database Models

### User
- `Id` (int, Primary Key)
- `FullName` (string, max 100)
- `Email` (string, max 255, unique)
- `PasswordHash` (string)
- `CreatedAt` (DateTime)
- `UpdatedAt` (DateTime)

### UserJourneyReason
- `Id` (int, Primary Key)
- `UserId` (int, Foreign Key)
- `Reason` (string, max 50)
- `CreatedAt` (DateTime)

## CORS Configuration

Frontend is allowed from:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)

To modify, edit the CORS policy in `Program.cs`.

## Environment Configuration

### Development
- Runs with detailed logging
- Swagger documentation available
- LocalDB used by default

### Production
- Minimal logging
- No Swagger documentation
- Requires SQL Server instance

## Security Notes

⚠️ **Important for Production:**
1. Never commit sensitive data (connection strings, API keys) to version control
2. Use User Secrets for local development
3. Use environment variables or Key Vault for production
4. Passwords should be hashed with a stronger algorithm (consider bcrypt)
5. Implement proper authentication (JWT tokens recommended)
6. Add HTTPS enforcement in production
7. Validate and sanitize all user inputs

## Troubleshooting

### "Cannot connect to database"
- Verify SQL Server is running
- Check connection string in `appsettings.Development.json`
- Ensure LocalDB instance exists

### "Migrations not found"
- Run: `dotnet ef migrations add InitialCreate`
- Run: `dotnet ef database update`

### "Port 5102 already in use"
- Edit `appsettings.json` to change port
- Or: `dotnet run --urls=http://localhost:5103`

## Running Tests (Placeholder for future test setup)

```bash
# Note: Test project needs to be created
dotnet test
```

## License

ISC
