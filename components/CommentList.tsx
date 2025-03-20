// /components/CommentList.tsx

import React from 'react';
import CommentItem from './CommentItem';

interface Comment {
  id: number;
  postSlug: string;
  author: string;
  content: string;
  date: string;
}

interface CommentListProps {
  comments: Comment[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, newContent: string) => void;
}

export default function CommentList({ comments, onDelete, onUpdate }: CommentListProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            author={comment.author}
            content={comment.content}
            date={comment.date}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      )}
    </div>
  );
}
