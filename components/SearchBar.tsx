interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
      <div style={{ margin: '1rem 0' }}>
        {/* Input field for search text */}
        <input
          type="text"
          placeholder="Search posts..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
        />
      </div>
    );
  }
  