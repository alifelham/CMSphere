# CMSphere

### A Next.js Blog with CMS Integration, API Middleware & Responsive UI

This project is a full-stack Next.js application built with TypeScript. It demonstrates the integration of a headless CMS (Contentful) with a modern React-based front end. The application features:

- **CMS Integration:** Fetching blog posts from Contentful.
- **API Routes:** Two main endpoints:
  - `/api/posts`: Retrieves and filters blog posts from Contentful.
  - `/api/comments`: Provides full CRUD operations for comments using file-based persistence.
- **Middleware:** Custom API key middleware secures the API endpoints.
- **Frontend:** A responsive UI featuring server-side filtering (with a toggleable "Add Filters" button), client-side search, pagination, and complete comment management (create, edit, and delete).
- **Styling:** A dynamic animated purple gradient background and interactive hover effects for blog posts.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Contentful Setup](#contentful-setup)
- [Project Structure](#project-structure)
- [Middleware Logic and API Integration](#middleware-logic-and-api-integration)
- [Frontend Features](#frontend-features)
  - [Filtering & Search](#filtering--search)
  - [Comments CRUD Operations](#comments-crud-operations)
  - [Styling and Theming](#styling-and-theming)

---

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- A Contentful account (free plan is sufficient)

---

## Installation

1. **Clone the Repository:**

   ```
   git clone https://github.com/alifelham/CMSphere.git
   cd CMSphere
   ```

2. **Install Dependencies:**
```
npm install
```
or
```
yarn install
```

3. **Create a `.env.local` File:**

In the project root, create a file named `.env.local` with the following content (replace placeholder values):

```
# Contentful credentials

CONTENTFUL_SPACE_ID=your_contentful_space_id

CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

# API key for our endpoints (server-side, kept secret)

API_KEY=your_generated_secret_key

# API key exposed to the client (must match API_KEY)

NEXT_PUBLIC_API_KEY=your_generated_secret_key
```

4. **Set Up Contentful:**

    -   Create your Contentful space and content model as described above.
    -   Populate your space with sample blog posts.
    -   Update your `.env.local` file with your Contentful credentials.-

5. **Set Up File-Based Storage:**\
Create a `data` folder in the project root:
``` mkdir data ```

6. **Start the Development Server:**

    `npm run dev`

    or

    `yarn dev`

7.  **Open the Application:**\
    Navigate to <http://localhost:3000> in your browser.


## Environment Variables
---------------------

-   **CONTENTFUL_SPACE_ID & CONTENTFUL_ACCESS_TOKEN:**\
    These values connect your application to your Contentful space and enable fetching of blog posts.

-   **API_KEY:**\
    A secret key used by your API key middleware (server-side only) to verify incoming requests.

-   **NEXT_PUBLIC_API_KEY:**\
    Exposed to the client (via Next.js environment variables) so that the front end can include it in its API requests. It must match the server-side API_KEY.

* * * * *

## Contentful Setup
----------------

1.  **Sign Up & Create a Space:**\
    Sign up for Contentful and create a new space (e.g., "CMSphere").

2.  **Create a Content Model:**\
    Create a new content model named **Blog page** (Content Type ID: `blogPage`) with the following fields:

    -   **title:** Symbol
    -   **author:** Symbol
    -   **date:** Date
    -   **content:** Rich Text
    -   **slug:** Symbol (unique)

3.  **Populate Your Content:**\
    Create 3--5 entries (blog posts) using this content model. Ensure that each post has a unique slug.

4.  **Retrieve API Keys:**\
    Go to your space settings in Contentful, navigate to the API Keys section, and copy your **Space ID** and **Content Delivery API Access Token** into your `.env.local` file.

* * * * *

## Project Structure
-----------------

```
/CMSphere

├── /components

│   ├── BlogList.tsx         // Renders the list of blog posts with hover effects.

│   ├── BlogPost.tsx         // Displays a single blog post (full content).

│   ├── CommentForm.tsx      // Form for adding a new comment.

│   ├── CommentItem.tsx      // Displays a single comment with edit/delete options.

│   ├── CommentList.tsx      // Lists comments for a blog post.

│   ├── Header.tsx           // Contains the logo and site header.

│   └── Pagination.tsx       // Handles pagination of blog posts.

├── /data

│   └── comments.json        // JSON file storing comments (created automatically).

├── /lib

│   └── contentful.ts        // Functions for fetching blog posts from Contentful.

├── /middleware

│   └── auth.ts              // API key middleware to secure API endpoints.

├── /pages

│   ├── _app.tsx             // Custom App component; includes global CSS and Header.

│   ├── index.tsx            // Homepage with blog posts, search, and filter options.

│   ├── [slug].tsx           // Blog post detail page with full content and comments.

│   └── /api

│       ├── posts.ts         // API endpoint to fetch and filter blog posts.

│       └── comments.ts      // API endpoint for CRUD operations on comments.

├── /public

│   └── logo.png             // logo displayed in the header.

├── /styles

│   └── globals.css          // Global styling, including animated purple gradient background.

├── .env.local               // Environment variables (should not be committed to Git).

├── package.json

└── README.md
```

## Middleware Logic and API Integration
------------------------------------

### API Key Middleware

**Location:** `/middleware/auth.ts`

**Purpose & Justification:**

-   **Security:** The middleware ensures that only authorized requests reach your API endpoints. It checks for a custom header (`x-api-key`) in each request and compares it with the server-side secret (`API_KEY`).
-   **Reusability:** This middleware is applied to all sensitive API endpoints (e.g., `/api/posts` and `/api/comments`). This centralizes authentication logic, making it easier to manage and update.

**Code Snippet:**

```
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.API_KEY;

export function withAuth(handler: NextApiHandler): NextApiHandler {

  return async (req: NextApiRequest, res: NextApiResponse) => {

    const apiKey = req.headers['x-api-key'];

    if (apiKey !== API_KEY) {

      res.status(401).json({ message: 'Unauthorized: Invalid API key' });

      return;

    }

    return handler(req, res);

  };

}
```

-   **Explanation:**
    -   The middleware reads the `x-api-key` header from the request.
    -   If the key does not match `API_KEY` (stored securely in `.env.local`), the request is rejected with a 401 status.
    -   Otherwise, the request proceeds to the intended API handler.

### Blog Posts API

**Location:** `/pages/api/posts.ts`

**Functionality:**

-   Fetches blog posts from Contentful using the `getPosts` function in `/lib/contentful.ts`.
-   Implements server-side filtering by author and date range using helper functions.
-   Returns a JSON array of posts matching the criteria.

**Filtering Logic:**

The endpoint accepts query parameters (`author`, `startDate`, `endDate`). It uses helper functions such as `filterByAuthor` and `filterByDateRange` to narrow down results before sending the response. This modular design improves code clarity and maintainability.

### Comments API

**Location:** `/pages/api/comments.ts`

**Functionality:**

-   Provides full CRUD operations (Create, Read, Update, Delete) for comments.
-   Uses file-based storage (a JSON file in `/data/comments.json`) to persist comments across server restarts.
-   Associates comments with blog posts via the `postSlug` field.

**Security:**

-   The Comments API is secured using the same API key middleware (`withAuth`), ensuring that only requests with a valid `x-api-key` header are processed.

**Persistence & Justification:**

-   **File-Based Storage:**\
    While an in-memory store is simple, it does not persist across server restarts. By using a JSON file, comments remain saved even if the server is restarted. This is a simple approach without the overhead of setting up a database.

* * * * *

## Frontend Features
-----------------

### Filtering & Search

-   **Server-Side Filtering:**\
    A toggleable "Add Filters" button reveals inputs for author, start date, and end date. When applied, these values are sent as query parameters to the `/api/posts` endpoint.
-   **Client-Side Search:**\
    A search bar filters posts by title and content on the client side, providing immediate feedback.
-   **Combined Approach:**\
    Both server-side and client-side filtering work together to refine the list of posts.

### Comments CRUD Operations

-   **Adding Comments:**\
    The CommentForm component allows users to add new comments without having to enter their name each time---the author is set to a fixed value.
-   **Editing/Deleting Comments:**\
    Each comment displayed in CommentItem has small, transparent Edit and Delete buttons. Users can edit comments inline or delete them. Changes are sent to the Comments API (PUT/DELETE requests).
-   **Persistence:**\
    Comments are stored persistently using file-based storage, ensuring that data is not lost on page reloads.

### Styling and Theming

-   **Animated Background:**\
    The global CSS features a moving, animated purple gradient background.
-   **Header:**\
    A Header component displays the logo (from `/public/logo.png`) at the top left.
-   **Interactive Elements:**\
    Blog posts have hover effects that provide a subtle 3D zoom and change to a very light purple background for a modern look.

* * * * *

