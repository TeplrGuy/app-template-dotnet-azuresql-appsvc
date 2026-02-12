import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import { getConnection } from './db/connection';
import studentRoutes from './routes/students.routes';
import searchRoutes from './routes/search.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    name: 'Contoso University API (Node.js)',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      search: '/api/search/students',
      health: '/health',
    },
  });
});

app.use('/api/students', studentRoutes);
app.use('/api/search', searchRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

// Start server if this file is run directly
if (require.main === module) {
  const PORT = config.port;

  // Initialize database connection and start server
  getConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${config.nodeEnv}`);
        console.log(`🔗 API endpoints: http://localhost:${PORT}/api`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      });
    })
    .catch((error) => {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    });
}
