import { config } from '../config';
import { StudentSearchFilter } from '../models/student';

export class CopilotService {
  /**
   * Transform natural language query into a strict JSON filter schema
   * Example: "students enrolled after 2020" -> { enrolledAfter: "2020-01-01" }
   * 
   * NOTE: This is currently using a simple fallback parser. 
   * Future enhancement: Integrate with GitHub Copilot SDK or OpenAI API for better NL understanding.
   */
  async parseSearchQuery(query: string): Promise<StudentSearchFilter> {
    // Use simple fallback parsing for now
    // TODO: Integrate with GitHub Copilot SDK when available
    return this.fallbackParse(query);
  }

  /**
   * Simple parser for natural language queries
   */
  private fallbackParse(query: string): StudentSearchFilter {
    const filter: StudentSearchFilter = {};
    const lowerQuery = query.toLowerCase();

    // Name search
    const nameMatch = lowerQuery.match(/(?:find|name|student)\s+(\w+)/i);
    if (nameMatch) {
      filter.nameContains = nameMatch[1];
    }

    // Date after
    const afterMatch = lowerQuery.match(/after\s+(\d{4})/);
    if (afterMatch) {
      filter.enrolledAfter = `${afterMatch[1]}-01-01`;
    }

    // Date before
    const beforeMatch = lowerQuery.match(/before\s+(\d{4})/);
    if (beforeMatch) {
      filter.enrolledBefore = `${beforeMatch[1]}-12-31`;
    }

    // Last N months
    const monthsMatch = lowerQuery.match(/last\s+(\d+)\s+months?/);
    if (monthsMatch) {
      const months = parseInt(monthsMatch[1], 10);
      filter.enrolledAfter = this.getDateMonthsAgo(months);
    }

    // Has enrollments
    if (lowerQuery.includes('with enrollments') || lowerQuery.includes('enrolled in')) {
      filter.hasEnrollments = true;
    }

    // Apply sanitization
    return this.sanitizeFilter(filter);
  }

  /**
   * Sanitize and validate filter to prevent SQL injection
   */
  private sanitizeFilter(filter: StudentSearchFilter): StudentSearchFilter {
    const sanitized: StudentSearchFilter = {};

    // Sanitize strings
    if (filter.nameContains) {
      sanitized.nameContains = filter.nameContains.substring(0, 100);
    }
    if (filter.firstNameContains) {
      sanitized.firstNameContains = filter.firstNameContains.substring(0, 50);
    }
    if (filter.lastNameContains) {
      sanitized.lastNameContains = filter.lastNameContains.substring(0, 50);
    }

    // Validate dates
    if (filter.enrolledAfter && this.isValidDate(filter.enrolledAfter)) {
      sanitized.enrolledAfter = filter.enrolledAfter;
    }
    if (filter.enrolledBefore && this.isValidDate(filter.enrolledBefore)) {
      sanitized.enrolledBefore = filter.enrolledBefore;
    }

    // Validate boolean
    if (typeof filter.hasEnrollments === 'boolean') {
      sanitized.hasEnrollments = filter.hasEnrollments;
    }

    // Pagination
    sanitized.page = Math.max(1, Math.min(filter.page || 1, 1000));
    sanitized.pageSize = Math.max(1, Math.min(filter.pageSize || 50, 100));

    return sanitized;
  }

  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private getDateMonthsAgo(months: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split('T')[0];
  }
}
