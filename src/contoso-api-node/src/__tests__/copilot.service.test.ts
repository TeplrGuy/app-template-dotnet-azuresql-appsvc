import { CopilotService } from '../services/copilot.service';

describe('CopilotService', () => {
  let service: CopilotService;

  beforeEach(() => {
    service = new CopilotService();
  });

  describe('parseSearchQuery', () => {
    it('should parse simple name query', async () => {
      const filter = await service.parseSearchQuery('find Alexander');
      expect(filter.nameContains).toBeDefined();
      expect(filter.nameContains?.toLowerCase()).toContain('alexander');
    });

    it('should parse year after query', async () => {
      const filter = await service.parseSearchQuery('students enrolled after 2020');
      expect(filter.enrolledAfter).toBeDefined();
      expect(filter.enrolledAfter).toMatch(/2020/);
    });

    it('should parse year before query', async () => {
      const filter = await service.parseSearchQuery('students enrolled before 2019');
      expect(filter.enrolledBefore).toBeDefined();
      expect(filter.enrolledBefore).toMatch(/2019/);
    });

    it('should parse last N months query', async () => {
      const filter = await service.parseSearchQuery('students enrolled in the last 6 months');
      expect(filter.enrolledAfter).toBeDefined();
      
      // Check that date is approximately 6 months ago
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const filterDate = new Date(filter.enrolledAfter!);
      
      const daysDiff = Math.abs((filterDate.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBeLessThan(32); // Within a month tolerance
    });

    it('should handle empty query', async () => {
      const filter = await service.parseSearchQuery('');
      expect(filter).toBeDefined();
      expect(Object.keys(filter).length).toBeGreaterThanOrEqual(0);
    });

    it('should sanitize filter with pagination defaults', async () => {
      const filter = await service.parseSearchQuery('all students');
      expect(filter.page).toBeGreaterThanOrEqual(1);
      expect(filter.pageSize).toBeGreaterThanOrEqual(1);
      expect(filter.pageSize).toBeLessThanOrEqual(100);
    });
  });
});
