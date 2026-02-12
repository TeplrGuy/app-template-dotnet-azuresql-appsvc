import { Router, Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { CopilotService } from '../services/copilot.service';
import { StudentSearchQuery } from '../models/student';

const router = Router();
const studentService = new StudentService();
const copilotService = new CopilotService();

/**
 * GET /api/students - Get all students
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const students = await studentService.getAll(page, pageSize);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

/**
 * GET /api/students/:id - Get student by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await studentService.getById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

/**
 * GET /api/students/count - Get total count of students
 */
router.get('/stats/count', async (req: Request, res: Response) => {
  try {
    const count = await studentService.getCount();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

export default router;
