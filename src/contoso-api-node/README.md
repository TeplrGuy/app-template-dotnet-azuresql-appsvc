# Contoso University - Node.js API

A modern Node.js TypeScript API for Contoso University with GitHub Copilot SDK integration for natural language student search.

## Features

- 🎓 **Student Management**: REST API for managing students
- 🔍 **Natural Language Search**: Search students using plain English queries powered by GitHub Copilot SDK
- 🗄️ **Azure SQL Integration**: Connects to Azure SQL Database with parameterized queries
- 🔒 **Type-Safe**: Full TypeScript support
- ✅ **Tested**: Unit and integration tests with Jest
- 📊 **Production-Ready**: Error handling, CORS, health checks

## Prerequisites

- Node.js 18+ and npm
- Azure SQL Database (or SQL Server with compatible schema)
- GitHub Copilot API key (optional, fallback parser available)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root of this directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Azure SQL Database
DB_SERVER=your-server.database.windows.net
DB_DATABASE=ContosoUniversity
DB_USER=your-username
DB_PASSWORD=your-password
DB_PORT=1433
DB_ENCRYPT=true

# GitHub Copilot SDK (optional)
COPILOT_API_KEY=your-api-key
COPILOT_MODEL=gpt-4o-mini

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 3. Build the Project

```bash
npm run build
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at http://localhost:3000

### 5. Run Tests

```bash
npm test
```

### 6. Run in Production Mode

```bash
npm run build
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run linter (placeholder) |

## API Endpoints

### Base Information

```
GET /api
```

Returns API information and available endpoints.

**Response:**
```json
{
  "name": "Contoso University API (Node.js)",
  "version": "1.0.0",
  "endpoints": {
    "students": "/api/students",
    "search": "/api/search/students",
    "health": "/health"
  }
}
```

### Health Check

```
GET /health
```

Returns health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-12T10:00:00.000Z"
}
```

### Get All Students

```
GET /api/students?page=1&pageSize=50
```

Get paginated list of students.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Results per page (default: 50, max: 100)

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "Alexander",
    "lastName": "Carson",
    "enrollmentDate": "2010-09-01"
  }
]
```

### Get Student by ID

```
GET /api/students/:id
```

Get a specific student by ID.

**Response:**
```json
{
  "id": 1,
  "firstName": "Alexander",
  "lastName": "Carson",
  "enrollmentDate": "2010-09-01"
}
```

### Search Students (Natural Language)

```
POST /api/search/students
Content-Type: application/json

{
  "query": "students enrolled after 2020"
}
```

Search students using natural language queries. The GitHub Copilot SDK transforms the query into a structured filter.

**Request Body:**
```json
{
  "query": "string (required)"
}
```

**Response:**
```json
{
  "students": [
    {
      "id": 15,
      "firstName": "John",
      "lastName": "Doe",
      "enrollmentDate": "2021-09-01"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 50,
  "parsedFilter": {
    "enrolledAfter": "2020-01-01",
    "page": 1,
    "pageSize": 50
  }
}
```

### Natural Language Query Examples

- `"students enrolled after 2020"`
- `"find Alexander"`
- `"students with last name starting with S"`
- `"students enrolled in the last 6 months"`
- `"show students with enrollments"`

## Project Structure

```
src/
├── config/            # Configuration and environment variables
│   └── index.ts
├── db/                # Database connection and utilities
│   └── connection.ts
├── models/            # TypeScript type definitions
│   └── student.ts
├── routes/            # API route handlers
│   └── students.routes.ts
├── services/          # Business logic services
│   ├── copilot.service.ts  # Copilot SDK integration
│   └── student.service.ts  # Student database operations
├── middleware/        # Express middleware
│   └── error.middleware.ts
├── __tests__/         # Test files
│   ├── copilot.service.test.ts
│   └── students.routes.test.ts
└── index.ts           # Application entry point
```

## GitHub Copilot SDK Integration

The API uses `@github/copilot-sdk` to transform natural language queries into structured database filters.

### How It Works

1. User sends natural language query: `"students enrolled after 2020"`
2. Copilot SDK parses query into structured filter: `{ enrolledAfter: "2020-01-01" }`
3. Filter is sanitized and validated
4. Parameterized SQL query executes with filter
5. Results returned to user

### Fallback Behavior

If `COPILOT_API_KEY` is not configured, the service falls back to a simple regex-based parser. This ensures the API works without Copilot, but with reduced natural language understanding.

## Database Schema

The API expects the following tables in Azure SQL:

### tbl_Student
- `ID` (int, PK)
- `FirstName` (nvarchar)
- `LastName` (nvarchar)
- `EnrollmentDate` (date)

### tbl_StudentCourse (for hasEnrollments filter)
- `StudentID` (int, FK)
- `CourseID` (int, FK)

## Security

- **Parameterized Queries**: All SQL queries use parameterized inputs to prevent SQL injection
- **Input Validation**: All user inputs are validated and sanitized
- **CORS**: Configurable CORS policy
- **Environment Variables**: Sensitive data in `.env` file (never committed)

## Deployment to Azure App Service

This API is designed to run on Azure App Service with Node.js runtime:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Configure environment variables in Azure App Service**:
   - Set all variables from `.env.example`
   - Ensure `DB_*` variables point to your Azure SQL instance
   - Add `COPILOT_API_KEY` if using Copilot SDK

3. **App Service Configuration**:
   - **Runtime**: Node 18 LTS
   - **Startup Command**: `npm start`
   - **Port**: 3000 (or use `PORT` env variable)

## Testing

### Unit Tests

Tests for individual services:

```bash
npm test
```

### Integration Tests

Tests for API endpoints (with mocked database):

```bash
npm test students.routes.test.ts
```

### Manual Testing

Use curl or Postman to test endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Get students
curl http://localhost:3000/api/students

# Search with natural language
curl -X POST http://localhost:3000/api/search/students \
  -H "Content-Type: application/json" \
  -d '{"query": "students enrolled after 2020"}'
```

## Troubleshooting

### Database Connection Fails

- Check `DB_SERVER`, `DB_USER`, `DB_PASSWORD` in `.env`
- Ensure your IP is allowed in Azure SQL firewall
- Verify `DB_ENCRYPT=true` for Azure SQL

### Copilot SDK Not Working

- Check `COPILOT_API_KEY` is set correctly
- API will fallback to simple parser if key is missing
- Check logs for Copilot SDK errors

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

## Contributing

When making changes:
1. Follow existing code style
2. Add tests for new features
3. Run `npm test` before committing
4. Update this README if adding new features

## License

See the repository root for license information.
