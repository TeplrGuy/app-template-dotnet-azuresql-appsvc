import request from 'supertest';
import app from '../index';

// Mock database connection
jest.mock('../db/connection', () => {
  const mockRequest = () => {
    const mock = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    
    // Setup query mock to return different results for count vs data queries
    let callCount = 0;
    mock.query.mockImplementation((sql: string) => {
      callCount++;
      if (sql.includes('COUNT(*)')) {
        return Promise.resolve({
          recordset: [{ total: 2 }],
        });
      }
      return Promise.resolve({
        recordset: [
          {
            id: 1,
            firstName: 'Alexander',
            lastName: 'Carson',
            enrollmentDate: '2010-09-01',
          },
          {
            id: 2,
            firstName: 'Meredith',
            lastName: 'Alonso',
            enrollmentDate: '2012-09-01',
          },
        ],
      });
    });
    
    return mock;
  };

  return {
    getConnection: jest.fn().mockResolvedValue({
      request: jest.fn(mockRequest),
    }),
    closeConnection: jest.fn(),
  };
});

describe('Student Routes', () => {
  describe('GET /api/students', () => {
    it('should return list of students', async () => {
      const response = await request(app).get('/api/students');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/search/students', () => {
    it('should accept natural language query', async () => {
      const response = await request(app)
        .post('/api/search/students')
        .send({ query: 'find Alexander' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('students');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('parsedFilter');
    });

    it('should reject empty query', async () => {
      const response = await request(app)
        .post('/api/search/students')
        .send({ query: '' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing query', async () => {
      const response = await request(app)
        .post('/api/search/students')
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
