// /components/BlogPost.tsx

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import React from 'react';

// Define the Post interface; note that content is typed as any since it is a rich text document.
interface Post {
  title: string;
  author: string;
  date: string;
  content: any; // Rich text JSON object from Contentful
  slug: string;
}

interface BlogPostProps {
  post: Post;
}

// BlogPost component to display the blog post content
export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article
      style={{
        backgroundColor: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
      }}
    >
      <h1>{post.title}</h1>
      <p>
        By {post.author} on {new Date(post.date).toLocaleDateString()}
      </p>
      <div style={{ lineHeight: '1.6' }}>
        {/* Convert rich text JSON to React elements */}
        {documentToReactComponents(post.content)}
      </div>
    </article>
  );
}
