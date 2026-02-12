import { useState, useEffect } from 'react';
import { studentApi } from './api/students';
import type { Student } from './types/student';
import { StudentSearch } from './components/StudentSearch';
import { StudentList } from './components/StudentList';
import './App.css';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searchMode, setSearchMode] = useState<'all' | 'search'>('all');

  const loadAllStudents = async () => {
    setIsLoading(true);
    setError(undefined);
    setSearchMode('all');
    try {
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(undefined);
    setSearchMode('search');
    try {
      const response = await studentApi.searchWithNaturalLanguage(query);
      setStudents(response.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllStudents();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#0066cc', marginBottom: '10px' }}>
          🎓 Contoso University - Students
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Search students using natural language queries powered by GitHub Copilot SDK
        </p>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <StudentSearch onSearch={handleSearch} isLoading={isLoading} />
        {searchMode === 'search' && (
          <button
            onClick={loadAllStudents}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            ← Back to All Students
          </button>
        )}
      </div>

      <StudentList students={students} isLoading={isLoading} error={error} />

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
        <p>
          Connected to: <code>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}</code>
        </p>
      </footer>
    </div>
  );
}

export default App;

