// /components/CommentItem.tsx

import React, { useState } from 'react';

interface CommentItemProps {
  id: number;
  author: string;
  content: string;
  date: string;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newContent: string) => void;
}

export default function CommentItem({ id, author, content, date, onDelete, onUpdate }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  // Handle saving the updated comment.
  const handleUpdate = () => {
    onUpdate(id, editedContent);
    setIsEditing(false);
  };

  // Common style for small, transparent buttons.
  const smallButtonStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    background: 'transparent',
    border: 'none',
    color: '#0070f3',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '0.75rem',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      }}
    >
      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>
        {author}{' '}
        <span style={{ fontWeight: 'normal', color: '#6c757d' }}>
          {new Date(date).toLocaleString()}
        </span>
      </p>
      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <button onClick={handleUpdate} style={smallButtonStyle}>
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedContent(content);
            }}
            style={{ ...smallButtonStyle, marginLeft: '0.5rem' }}
          >
            Cancel
          </button>
        </>
      ) : (
        <p style={{ margin: 0 }}>{content}</p>
      )}
      <div style={{ marginTop: '0.5rem' }}>
        {!isEditing && (
          <>
            <button onClick={() => setIsEditing(true)} style={smallButtonStyle}>
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              style={{ ...smallButtonStyle, marginLeft: '0.5rem' }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
