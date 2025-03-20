// /middleware/auth.ts

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

// Retrieve the API key from environment variables
const API_KEY = process.env.API_KEY;

/**
 * Middleware to secure API endpoints.
 * Accepts a NextApiHandler and returns a NextApiHandler.
 */
export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Retrieve the API key from the request headers
    const apiKey = req.headers['x-api-key'];

    // If the API key is missing or incorrect, respond with 401 Unauthorized
    if (apiKey !== API_KEY) {
      res.status(401).json({ message: 'HTTP ERROR 401: Unauthorized' });
      return;
    }

    // If authorized, proceed with the original handler
    return handler(req, res);
  };
}
