// /pages/index.tsx

import { useEffect, useState } from 'react';
import BlogList from '../components/BlogList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

export default function Home() {
  // State for posts fetched from the API.
  const [posts, setPosts] = useState<any[]>([]);
  // State for the client-side search query (filters title & content).
  const [searchQuery, setSearchQuery] = useState('');
  // State for current page number (pagination).
  const [currentPage, setCurrentPage] = useState(1);
  // State for storing any error messages.
  const [error, setError] = useState<string | null>(null);
  
  // State for controlling whether the filter options are visible.
  const [showFilters, setShowFilters] = useState(false);

  // Additional filter states for server-side filtering.
  const [authorFilter, setAuthorFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Define how many posts per page for pagination.
  const postsPerPage = 3;

  // Function to fetch posts from the API with the current filter values.
  async function fetchPosts() {
    try {
      // Build query parameters based on filter states.
      const queryParams = new URLSearchParams();
      if (authorFilter) queryParams.append('author', authorFilter);
      if (startDateFilter) queryParams.append('startDate', startDateFilter);
      if (endDateFilter) queryParams.append('endDate', endDateFilter);
      const queryString = queryParams.toString();
      const url = queryString ? `/api/posts?${queryString}` : '/api/posts';

      const res = await fetch(url, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      });
      // Handle any non-OK responses.
      if (!res.ok) {
        let data: any = null;
        try {
          data = await res.json();
        } catch (parseError) {
          // Parsing error fallback.
        }
        const message =
          data?.message ||
          `HTTP ${res.status} error: Something went wrong. Please contact the site owner if the problem continues.`;
        setError(message);
        return;
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'An unexpected error occurred.');
    }
  }

  // Fetch posts whenever the server-side filter values change.
  useEffect(() => {
    // Reset pagination when filters change.
    setCurrentPage(1);
    fetchPosts();
  }, [authorFilter, startDateFilter, endDateFilter]);

  // Client-side filtering on already fetched posts for title and content.
  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const contentText = post.content ? documentToPlainTextString(post.content) : '';
    const contentMatch = contentText.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch;
  });

  // Pagination calculations.
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // If there is an error, display a full-page error message.
  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          margin: '0 auto',
          maxWidth: '600px',
          padding: '1rem',
        }}
      >
        <h1>This page isn't working</h1>
        <p>{error}</p>
        <p>If the problem continues, contact the site owner.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Blog Posts</h1>
      
      {/* Client-side search bar for title/content */}
      <div style={{ marginBottom: '1rem' }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      
      {/* Button to toggle the display of server-side filter options */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Add Filters'}
        </button>
      </div>
      
      {/* Conditionally render filter options if "showFilters" is true */}
      {showFilters && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Filters are automatically applied via useEffect.
          }}
          style={{
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <div>
            <label htmlFor="author">Author:</label>
            <input
              id="author"
              type="text"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="Filter by author"
              style={{ padding: '0.5rem', marginRight: '0.5rem' }}
            />
          </div>
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              style={{ padding: '0.5rem',  marginLeft: '0.5rem' }}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              id="endDate"
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              style={{ padding: '0.5rem', marginLeft: '1rem'}}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 0.5rem' }}>
            Apply Filters
          </button>
        </form>
      )}

      {/* Render the blog list and pagination */}
      <BlogList posts={currentPosts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
