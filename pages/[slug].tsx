// /pages/[slug].tsx

import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { getPostBySlug } from '../lib/contentful';
import BlogPost from '../components/BlogPost';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default function PostDetail({ post }: { post: any }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  // State to store comments for this post.
  const [comments, setComments] = useState<any[]>([]);

  // Function to fetch comments for this post.
  const fetchComments = () => {
    fetch(`/api/comments?postSlug=${post.slug}`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure that data is an array; if not, set to an empty array.
        setComments(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching comments:', error));
  };

  // Fetch comments when the component mounts or when post.slug changes.
  useEffect(() => {
    fetchComments();
  }, [post.slug]);

  // Handle deleting a comment by its id.
  const handleDeleteComment = async (id: number) => {
    try {
      const res = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete comment.');
      }
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle updating a comment by its id and new content.
  const handleUpdateComment = async (id: number, newContent: string) => {
    try {
      const res = await fetch(`/api/comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ id, content: newContent }),
      });
      if (!res.ok) {
        throw new Error('Failed to update comment.');
      }
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <BlogPost post={post} />

      <section>
        <h2>Comments</h2>
        <CommentList
          comments={comments}
          onDelete={handleDeleteComment}
          onUpdate={handleUpdateComment}
        />
        <CommentForm postSlug={post.slug} onCommentAdded={fetchComments} />
      </section>
    </div>
  );
}

// Fetch the blog post based on the slug.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const post = await getPostBySlug(slug as string);
  return {
    props: { post },
  };
};
