# Contoso University - React Frontend

A modern React TypeScript frontend for the Contoso University application, built with Vite.

## Features

- 🎓 **Student List View**: Display all students from the database
- 🔍 **Natural Language Search**: Search students using plain English queries powered by GitHub Copilot SDK
- ⚡ **Fast Development**: Built with Vite for instant HMR
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Type-Safe**: Full TypeScript support

## Prerequisites

- Node.js 18+ and npm
- Running backend API (either Node.js API or .NET API)

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

Edit `.env` and set the API base URL:

```env
# For Node.js API (default)
VITE_API_BASE_URL=http://localhost:3000

# For .NET API (alternative)
# VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm start` | Start production server (for Azure App Service) |
| `npm test` | Run tests |

## Deployment to Azure App Service

This app is configured to run on Azure App Service with Node.js runtime:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to Azure App Service**:
   - The `npm start` script serves the built files
   - Configure environment variable `VITE_API_BASE_URL` in Azure App Service settings
   - Use Node.js 18 LTS or later

3. **App Service Configuration**:
   - **Runtime**: Node 18 LTS
   - **Startup Command**: `npm start`
   - **Port**: 8080 (configured in package.json)

## API Integration

The frontend can work with two different backends:

### Option 1: Node.js API (Recommended for Copilot SDK features)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Option 2: .NET API (Legacy support)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Project Structure

```
src/
├── api/              # API client and service functions
│   ├── client.ts     # Base HTTP client
│   └── students.ts   # Student-specific API calls
├── components/       # React components
│   ├── StudentList.tsx    # Student table component
│   └── StudentSearch.tsx  # Search input component
├── types/            # TypeScript type definitions
│   └── student.ts    # Student-related types
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Natural Language Search Examples

The search feature uses GitHub Copilot SDK to understand natural language queries:

- "students enrolled after 2020"
- "find Alexander"
- "students with last name starting with S"
- "students enrolled in the last 6 months"
- "show students with enrollments"

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Just save your files and see changes immediately.

### TypeScript Checking
```bash
npm run build  # Includes type checking
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Cannot connect to API
- Ensure the backend API is running
- Check the `VITE_API_BASE_URL` in your `.env` file
- Verify CORS is enabled on the backend

### Build fails
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure you're using Node.js 18+

## Contributing

When making changes:
1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test with both development and production builds
4. Update this README if adding new features

## License

See the repository root for license information.
