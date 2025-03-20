// /components/CommentForm.tsx

import { useState } from 'react';

interface CommentFormProps {
  postSlug: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ postSlug, onCommentAdded }: CommentFormProps) {
  // Use a default/fixed author name for every comment.
  const defaultAuthor = "Alif"; // This value can be changed or pulled from env vars if desired.
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Handle form submission to create a new comment.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      setError('Comment content is required.');
      return;
    }
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ postSlug, content, author: defaultAuthor }),
      });
      if (!res.ok) {
        throw new Error('Failed to add comment.');
      }
      setContent('');
      onCommentAdded();
    } catch (err: any) {
      setError(err.message || 'Error submitting comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h3>Add a Comment</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <textarea
        placeholder="Your comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ marginBottom: '0.5rem' }}
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
}
