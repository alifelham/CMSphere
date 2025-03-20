// /pages/api/posts.ts

import { NextApiHandler } from 'next';
import { withAuth } from '../../middleware/auth';
import { getPosts } from '../../lib/contentful';

/**
 * Filter posts by the given author.
 * Returns posts whose author exactly matches the provided query (case-insensitive).
 */
function filterByAuthor(posts: any[], authorQuery?: string) {
  if (!authorQuery) return posts;
  return posts.filter(post => 
    post.author && post.author.toLowerCase() === authorQuery.toLowerCase()
  );
}

/**
 * Filter posts by a date range.
 * If startDate is provided, only posts on/after that date are returned.
 * If endDate is provided, only posts on/before that date are returned.
 */
function filterByDateRange(posts: any[], startDate?: string, endDate?: string) {
  return posts.filter(post => {
    const postDate = new Date(post.date);
    if (startDate && postDate < new Date(startDate)) {
      return false;
    }
    if (endDate && postDate > new Date(endDate)) {
      return false;
    }
    return true;
  });
}

/**
 * Main API handler that fetches posts and applies filtering.
 * It uses middleware (withAuth) to secure the endpoint.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // Retrieve all posts from the CMS
    const posts = await getPosts();

    // Extract query parameters from the request
    const { author, startDate, endDate } = req.query;

    // Apply filtering using helper functions
    let filteredPosts = filterByAuthor(posts, author as string | undefined);
    filteredPosts = filterByDateRange(filteredPosts, startDate as string | undefined, endDate as string | undefined);

    // Return the filtered posts as JSON
    res.status(200).json(filteredPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export default withAuth(handler);
