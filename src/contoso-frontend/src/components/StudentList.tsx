import type { Student } from '../types/student';

interface StudentListProps {
  students: Student[];
  isLoading: boolean;
  error?: string;
}

export function StudentList({ students, isLoading, error }: StudentListProps) {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading students...</div>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '4px',
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        No students found. Try searching with natural language queries!
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>First Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Last Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Enrollment Date</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              style={{
                borderBottom: '1px solid #eee',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <td style={{ padding: '12px' }}>{student.id}</td>
              <td style={{ padding: '12px' }}>{student.firstName}</td>
              <td style={{ padding: '12px' }}>{student.lastName}</td>
              <td style={{ padding: '12px' }}>
                {new Date(student.enrollmentDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
