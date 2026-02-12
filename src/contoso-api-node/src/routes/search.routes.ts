import { Router, Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { CopilotService } from '../services/copilot.service';
import { StudentSearchQuery } from '../models/student';

const router = Router();
const studentService = new StudentService();
const copilotService = new CopilotService();

/**
 * POST /api/search/students - Search students with natural language
 * Uses GitHub Copilot SDK to transform natural language to structured filters
 */
router.post('/students', async (req: Request, res: Response) => {
  try {
    const { query } = req.body as StudentSearchQuery;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required and must be a non-empty string' });
    }

    // Use Copilot SDK to parse natural language query into structured filter
    const filter = await copilotService.parseSearchQuery(query);

    console.log('🔍 Natural language query:', query);
    console.log('📊 Parsed filter:', filter);

    // Execute search with parsed filter
    const result = await studentService.search(filter);

    res.json({
      ...result,
      parsedFilter: filter, // Include parsed filter for transparency
    });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ error: 'Failed to search students' });
  }
});

export default router;
