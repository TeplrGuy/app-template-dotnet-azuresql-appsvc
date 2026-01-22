---
description: Generate a JMeter load test for Azure Load Testing based on application endpoints
agent: agent
---

# Generate Load Test Prompt

You are helping create a load test for the Contoso University application.

## Context

The application has these key endpoints:
- `GET /` - Homepage
- `GET /Students` - List all students (paginated)
- `POST /Students/Create` - Create a new student
- `GET /Students/Details/{id}` - Get student details
- `GET /Courses` - List all courses
- `GET /Enrollments` - List enrollments

## Task

Generate a complete JMeter test plan (JMX file) and Azure Load Testing configuration that:

1. **Simulates realistic user behavior**
   - 70% browse operations (GET requests)
   - 20% search operations
   - 10% create operations (POST requests)

2. **Uses these load parameters**
   - Concurrent users: {CONCURRENT_USERS:100}
   - Ramp-up period: {RAMP_UP_SECONDS:60}
   - Test duration: {DURATION_SECONDS:300}

3. **Includes assertions**
   - Response time p95 < 2000ms
   - Error rate < 1%
   - All responses return 200 OK

4. **Configurable via environment**
   - Base URL as variable
   - Think time between requests (1-3 seconds)

## Output Files

Create these files:
1. `loadtests/contoso-load-test.jmx` - JMeter test plan
2. `loadtests/config.yaml` - Azure Load Testing configuration
3. `loadtests/README.md` - Instructions for running the test

## Variable Placeholders

Use these placeholders in the JMX that Azure Load Testing will substitute:
- `${BASE_URL}` - The application URL
- `${CONCURRENT_USERS}` - Number of threads
- `${DURATION}` - Test duration in seconds
