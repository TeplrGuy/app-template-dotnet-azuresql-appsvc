import sql from 'mssql';
import { getConnection } from '../db/connection';
import { Student, StudentSearchFilter, StudentSearchResponse } from '../models/student';

export class StudentService {
  /**
   * Get all students with optional pagination
   */
  async getAll(page: number = 1, pageSize: number = 50): Promise<Student[]> {
    const pool = await getConnection();
    const offset = (page - 1) * pageSize;

    const result = await pool.request()
      .input('pageSize', sql.Int, pageSize)
      .input('offset', sql.Int, offset)
      .query(`
        SELECT 
          ID as id,
          FirstName as firstName,
          LastName as lastName,
          EnrollmentDate as enrollmentDate
        FROM tbl_Student
        ORDER BY ID
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    return result.recordset;
  }

  /**
   * Get student by ID
   */
  async getById(id: number): Promise<Student | null> {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          ID as id,
          FirstName as firstName,
          LastName as lastName,
          EnrollmentDate as enrollmentDate
        FROM tbl_Student
        WHERE ID = @id
      `);

    return result.recordset[0] || null;
  }

  /**
   * Search students with filters (supports Copilot SDK parsed filters)
   */
  async search(filter: StudentSearchFilter): Promise<StudentSearchResponse> {
    const pool = await getConnection();
    const page = filter.page || 1;
    const pageSize = Math.min(filter.pageSize || 50, 100);
    const offset = (page - 1) * pageSize;

    // Build dynamic WHERE clause
    const conditions: string[] = [];
    const request = pool.request();

    if (filter.nameContains) {
      conditions.push('(FirstName LIKE @nameContains OR LastName LIKE @nameContains)');
      request.input('nameContains', sql.NVarChar, `%${filter.nameContains}%`);
    }

    if (filter.firstNameContains) {
      conditions.push('FirstName LIKE @firstNameContains');
      request.input('firstNameContains', sql.NVarChar, `%${filter.firstNameContains}%`);
    }

    if (filter.lastNameContains) {
      conditions.push('LastName LIKE @lastNameContains');
      request.input('lastNameContains', sql.NVarChar, `%${filter.lastNameContains}%`);
    }

    if (filter.enrolledAfter) {
      conditions.push('EnrollmentDate >= @enrolledAfter');
      request.input('enrolledAfter', sql.Date, new Date(filter.enrolledAfter));
    }

    if (filter.enrolledBefore) {
      conditions.push('EnrollmentDate <= @enrolledBefore');
      request.input('enrolledBefore', sql.Date, new Date(filter.enrolledBefore));
    }

    if (filter.hasEnrollments !== undefined) {
      if (filter.hasEnrollments) {
        conditions.push('EXISTS (SELECT 1 FROM tbl_StudentCourse WHERE StudentID = tbl_Student.ID)');
      } else {
        conditions.push('NOT EXISTS (SELECT 1 FROM tbl_StudentCourse WHERE StudentID = tbl_Student.ID)');
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tbl_Student
      ${whereClause}
    `;

    const countResult = await request.query(countQuery);
    const total = countResult.recordset[0].total;

    // Get paginated results
    request.input('pageSize', sql.Int, pageSize);
    request.input('offset', sql.Int, offset);

    const dataQuery = `
      SELECT 
        ID as id,
        FirstName as firstName,
        LastName as lastName,
        EnrollmentDate as enrollmentDate
      FROM tbl_Student
      ${whereClause}
      ORDER BY ID
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `;

    const dataResult = await request.query(dataQuery);

    return {
      students: dataResult.recordset,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Get count of all students
   */
  async getCount(): Promise<number> {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT COUNT(*) as total FROM tbl_Student');
    return result.recordset[0].total;
  }
}
