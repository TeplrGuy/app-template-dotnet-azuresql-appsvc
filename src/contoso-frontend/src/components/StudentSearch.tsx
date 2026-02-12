import { useState } from 'react';

interface StudentSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function StudentSearch({ onSearch, isLoading }: StudentSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students (e.g., 'students enrolled after 2020' or 'find Alexander')"
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#0066cc',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        💡 Use natural language to search students (powered by GitHub Copilot SDK)
      </p>
    </form>
  );
}
