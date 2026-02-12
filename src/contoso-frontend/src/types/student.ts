export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  enrollmentDate: string;
}

export interface StudentSearchQuery {
  query: string;
}

export interface StudentSearchFilter {
  nameContains?: string;
  enrolledAfter?: string;
  enrolledBefore?: string;
  hasEnrollments?: boolean;
  page?: number;
  pageSize?: number;
}

export interface StudentSearchResponse {
  students: Student[];
  total: number;
  page: number;
  pageSize: number;
}
