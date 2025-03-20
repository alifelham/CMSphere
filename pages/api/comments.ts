// /pages/api/comments.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../middleware/auth';
import fs from 'fs';
import path from 'path';

// Define the structure of a Comment.
interface Comment {
  id: number;
  postSlug: string;
  author: string;
  content: string;
  date: string;
}

// Define the file path for storing comments.
// Create a folder named "data" in your project root.
const filePath = path.join(process.cwd(), 'data', 'comments.json');

/**
 * Helper function to read comments from the JSON file.
 * Returns an array of comments; if the file doesn’t exist, returns an empty array.
 */
function readComments(): Comment[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData) || [];
  } catch (error) {
    console.error('Error reading comments:', error);
    return [];
  }
}

/**
 * Helper function to write the comments array to the JSON file.
 */
function writeComments(comments: Comment[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing comments:', error);
  }
}

/**
 * Main API handler for Comments.
 * Supports CRUD operations:
 * - POST: Create a new comment.
 * - GET: Read comments associated with a blog post (via query parameter postSlug).
 * - PUT: Update an existing comment (requires id and new content in the body).
 * - DELETE: Remove a comment (requires id as a query parameter).
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Read current comments from file.
  let comments = readComments();

  const { method } = req;

  if (method === 'POST') {
    // Create: Add a new comment.
    const { postSlug, author, content } = req.body;
    if (!postSlug || !author || !content) {
      res.status(400).json({ message: 'Missing required fields: postSlug, author, and content are required.' });
      return;
    }
    // Create new comment with a unique id.
    const newComment: Comment = {
      id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
      postSlug,
      author,
      content,
      date: new Date().toISOString(),
    };
    comments.push(newComment);
    writeComments(comments);
    res.status(201).json(newComment);
    return;
  }

  if (method === 'GET') {
    // Read: Fetch comments for a given blog post.
    const { postSlug } = req.query;
    if (!postSlug) {
      res.status(400).json({ message: 'postSlug query parameter is required.' });
      return;
    }
    const postComments = comments.filter(comment => comment.postSlug === postSlug);
    res.status(200).json(postComments);
    return;
  }

  if (method === 'PUT') {
    // Update: Edit an existing comment.
    const { id, content } = req.body;
    if (!id || !content) {
      res.status(400).json({ message: 'Missing required fields: id and new content are required.' });
      return;
    }
    const commentIndex = comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      res.status(404).json({ message: 'Comment not found.' });
      return;
    }
    // Update the comment's content and timestamp.
    comments[commentIndex].content = content;
    comments[commentIndex].date = new Date().toISOString();
    writeComments(comments);
    res.status(200).json(comments[commentIndex]);
    return;
  }

  if (method === 'DELETE') {
    // Delete: Remove a comment.
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ message: 'id query parameter is required.' });
      return;
    }
    const commentIndex = comments.findIndex(comment => comment.id === Number(id));
    if (commentIndex === -1) {
      res.status(404).json({ message: 'Comment not found.' });
      return;
    }
    const deletedComment = comments.splice(commentIndex, 1);
    writeComments(comments);
    res.status(200).json(deletedComment[0]);
    return;
  }

  // If the HTTP method is not supported, return a 405 error.
  res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
};

// Secure the endpoint with the API key middleware.
export default withAuth(handler);
