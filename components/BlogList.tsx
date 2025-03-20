// /components/BlogList.tsx

import Link from 'next/link';

interface Post {
  title: string;
  author: string;
  date: string;
  slug: string;
}

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {posts.map((post) => (
        <li key={post.slug} className="blog-post">
          <Link href={`/${post.slug}`} >
            <>
              <h2>{post.title}</h2>
              <p>
                By {post.author} on {new Date(post.date).toLocaleDateString()}
              </p>
            </>
          </Link>
        </li>
      ))}
    </ul>
  );
}
