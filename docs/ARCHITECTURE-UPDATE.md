# Architecture Update - New Frontend and API

This document describes the updated architecture after adding React frontend and Node.js API.

## Updated Application Architecture

### Overview

Contoso University now consists of three main application components:

1. **React Frontend** (TypeScript, Vite) - Modern SPA for student management
2. **Node.js API** (TypeScript, Express) - New API with natural language search
3. **.NET Web App & API** (C#, Razor Pages/Web API) - Existing applications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Azure Resource Group (rg-{env})                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐          ┌──────────────────┐                         │
│  │  React Frontend  │          │  Node.js API     │          NEW            │
│  │  (App Service)   │──────────▶  (App Service)   │          ────           │
│  │  TypeScript/Vite │          │  Express + TS    │                         │
│  └────────┬─────────┘          └────────┬─────────┘                         │
│           │                             │                                    │
│           │ (alternative)               │                                    │
│           ▼                             ▼                                    │
│  ┌──────────────────┐          ┌──────────────────┐       EXISTING          │
│  │   .NET Web App   │──HTTP───▶│   .NET API       │       ────────          │
│  │   (Razor Pages)  │          │   (Web API)      │                         │
│  └────────┬─────────┘          └────────┬─────────┘                         │
│           │                             │                                    │
│           │                             │ VNet Integration                   │
│           ▼                             ▼                                    │
│  ┌──────────────────┐          ┌──────────────────┐                         │
│  │ Application      │          │ Virtual Network  │                         │
│  │ Insights         │          │ (vnet-{env})     │                         │
│  │ (appi-{env})     │          └────────┬─────────┘                         │
│  └────────┬─────────┘                   │                                   │
│           │                             │ Private Endpoint                   │
│           ▼                             ▼                                    │
│  ┌──────────────────┐          ┌──────────────────┐                         │
│  │ Log Analytics    │          │  Azure SQL       │                         │
│  │ (log-{env})      │          │  (sql-{env})     │                         │
│  └──────────────────┘          │  Database:       │                         │
│                                │  sqldb-{env}     │                         │
│  ┌──────────────────┐          └──────────────────┘                         │
│  │ Key Vault        │                                                       │
│  │ (kv-{env})       │          ┌──────────────────┐                         │
│  └──────────────────┘          │ Load Testing     │                         │
│                                │ (lt-{env})       │                         │
│                                └──────────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### React Frontend (`src/contoso-frontend/`)

**Technology Stack:**
- React 19 with TypeScript
- Vite for build tooling
- Hosted on Azure App Service (Node.js runtime)

**Features:**
- Student list view with pagination
- Natural language search interface
- Environment-based API configuration
- Responsive design

**API Integration:**
- Can connect to Node.js API (recommended for search features)
- Can connect to .NET API (alternative)
- Configuration via `VITE_API_BASE_URL` environment variable

**Local Development:**
```bash
cd src/contoso-frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

**Production Build:**
```bash
npm run build  # Outputs to dist/
npm start      # Serves production build on port 8080
```

### Node.js API (`src/contoso-api-node/`)

**Technology Stack:**
- Node.js 18+ with TypeScript
- Express framework
- mssql package for Azure SQL
- Jest for testing
- @github/copilot-sdk integration (for future enhancement)

**Features:**
- RESTful API for student management
- Natural language search with query parsing
- Parameterized SQL queries (SQL injection protection)
- Input validation and sanitization
- Comprehensive error handling
- CORS support

**Key Endpoints:**
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/search/students` - Natural language search
- `GET /health` - Health check

**Local Development:**
```bash
cd src/contoso-api-node
npm install
cp .env.example .env  # Configure database connection
npm run dev  # Runs on http://localhost:3000
```

**Testing:**
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

### Existing .NET Applications

The original .NET applications remain unchanged and fully functional:

- **Web App:** `src/ContosoUniversity.WebApplication/`
- **API:** `src/ContosoUniversity.API/`
- **Tests:** `src/ContosoUniversity.Test/`

## Data Flow Options

### Option 1: React → Node.js API → Azure SQL (Recommended)
```
User → React Frontend → Node.js API → Azure SQL Database
       (localhost:5173)  (localhost:3000)
```
- **Pros:** Natural language search, modern TypeScript stack
- **Use case:** New features, Copilot SDK integration

### Option 2: React → .NET API → Azure SQL (Legacy Support)
```
User → React Frontend → .NET Web API → Azure SQL Database
       (localhost:5173)  (localhost:5000)
```
- **Pros:** Existing API, well-tested
- **Use case:** Gradual migration, fallback option

### Option 3: .NET Web App → .NET API → Azure SQL (Original)
```
User → .NET Razor Pages → .NET Web API → Azure SQL Database
       (localhost:5000)    (localhost:5000)
```
- **Pros:** Original working solution
- **Use case:** Existing users, backward compatibility

## Database Schema

All APIs connect to the same Azure SQL database with the following key tables:

- `tbl_Student` - Student records (ID, FirstName, LastName, EnrollmentDate)
- `tbl_Course` - Course catalog
- `tbl_StudentCourse` - Student enrollments (junction table)
- `tbl_Instructor` - Instructor records
- `tbl_Department` - Department information

## Natural Language Search

The Node.js API implements natural language search using a query parser that transforms queries like:

- **"students enrolled after 2020"** → `{ enrolledAfter: "2020-01-01" }`
- **"find Alexander"** → `{ nameContains: "Alexander" }`
- **"students in last 6 months"** → `{ enrolledAfter: "2024-08-01" }`

The parser:
1. Accepts natural language input
2. Transforms to structured JSON filter
3. Validates and sanitizes input
4. Executes parameterized SQL query
5. Returns paginated results

Future enhancement: Integrate GitHub Copilot SDK for improved natural language understanding.

## Security Features

### Input Validation
- TypeScript type checking
- Runtime validation for all inputs
- String length limits
- Date format validation

### SQL Injection Protection
- All queries use parameterized inputs
- No string concatenation in SQL
- Input sanitization before database calls

### Secrets Management
- Environment variables for all sensitive data
- No credentials in source code
- Azure Key Vault integration (production)
- Different secrets per environment

### CORS Policy
- Configurable allowed origins
- Proper headers for cross-origin requests
- Protection against CSRF attacks

## CI/CD Pipeline

### Build and Test (ci-build-test.yml)

Runs on every PR and push to main:

1. **.NET Projects**
   - Restore dependencies
   - Build solution
   - Run unit tests
   - Generate test reports

2. **React Frontend**
   - Install npm dependencies
   - Lint TypeScript/React code
   - Build production bundle
   - Run tests

3. **Node.js API**
   - Install npm dependencies
   - Lint TypeScript code
   - Build TypeScript to JavaScript
   - Run unit and integration tests
   - Generate coverage reports

### Security Analysis (codeql-analysis.yml)

Runs weekly and on PRs:

- CodeQL analysis for C# code
- CodeQL analysis for JavaScript/TypeScript
- Security vulnerability scanning
- Quality rule checking

### Deployment (resilience-pipeline.yml)

**Updated deployment strategy:**

| Event | Target | Approval |
|-------|--------|----------|
| Push to `main` | Staging | ❌ Automatic |
| workflow_dispatch | QA | ✅ Required |
| workflow_dispatch | Production | ✅ Required |

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed instructions.

## Environment Configuration

### Staging
- Automatic deployment on merge to main
- Used for integration testing
- Load tests run automatically
- No manual approval required

### QA
- Manual deployment via workflow_dispatch
- Requires reviewer approval
- Used for acceptance testing
- Test data environment

### Production
- Manual deployment via workflow_dispatch
- Requires senior reviewer approval
- Slot swap for zero-downtime
- Automatic rollback on failure
- Full monitoring and alerting

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 6 SDK
- Azure SQL Database (or SQL Server)
- GitHub Copilot API key (optional, for future enhancements)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd app-template-dotnet-azuresql-appsvc
   ```

2. **Set up Node.js API:**
   ```bash
   cd src/contoso-api-node
   npm install
   cp .env.example .env
   # Edit .env with your database connection
   npm run dev
   ```

3. **Set up React Frontend:**
   ```bash
   cd src/contoso-frontend
   npm install
   cp .env.example .env
   # Edit .env with API URL (http://localhost:3000)
   npm run dev
   ```

4. **Open browser:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api
   - Health: http://localhost:3000/health

### Testing Locally

```bash
# Test Node.js API
cd src/contoso-api-node
npm test

# Test React Frontend
cd src/contoso-frontend
npm test

# Test .NET projects
cd src
dotnet test ContosoUniversity.Test/ContosoUniversity.Test.csproj
```

## Deployment to Azure

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for complete deployment instructions.

Quick summary:

1. Configure GitHub Environments (qa, staging, production)
2. Add required reviewers for qa and production
3. Merge PR to main → Deploys to staging automatically
4. Use workflow_dispatch to deploy to qa or production with approval

## Monitoring and Observability

- **Application Insights:** Performance and error tracking
- **Log Analytics:** Centralized logging
- **Health Endpoints:** `/health` for all APIs
- **Load Testing:** Azure Load Testing integration
- **Chaos Engineering:** Resilience testing in staging

## Documentation

- [Frontend README](./src/contoso-frontend/README.md)
- [Node API README](./src/contoso-api-node/README.md)
- [Deployment Guide](./docs/DEPLOYMENT-GUIDE.md)
- [SRE Knowledge Base](./docs/SRE-KNOWLEDGE-BASE.md)

## Contributing

1. Create feature branch from `main`
2. Make changes following code style
3. Add/update tests
4. Run linters and tests locally
5. Create PR with comprehensive description
6. Complete PR checklist
7. Address review feedback
8. PR merged → Auto-deploys to staging

## License

See [LICENSE](./LICENSE) file.
