// /lib/contentful.ts

import { createClient, Entry, EntryCollection } from 'contentful';

// Define an interface that describes the expected fields for a blog post.
interface BlogPostFields {
  title: string;
  author: string;
  date: string;
  content: string;
  slug: string;
}

// Create a Contentful client using credentials from environment variables.
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

/**
 * Fetch all blog posts from Contentful, ordered by date descending.
 */
export async function getPosts() {
  // Use generics to specify the type of the entries returned.
  const entries: EntryCollection<BlogPostFields> = await client.getEntries<BlogPostFields>({
    content_type: 'blogPage',
    order: '-fields.date',
  });

  // Map over the entries and return an array of blog post objects.
  return entries.items.map((item: Entry<BlogPostFields>) => ({
    title: item.fields.title,
    author: item.fields.author,
    date: item.fields.date,
    content: item.fields.content,
    slug: item.fields.slug,
  }));
}

/**
 * Fetch a single blog post from Contentful by its slug.
 */
export async function getPostBySlug(slug: string) {
  const entries: EntryCollection<BlogPostFields> = await client.getEntries<BlogPostFields>({
    content_type: 'blogPage',
    'fields.slug': slug,
  });

  if (entries.items.length > 0) {
    // The first item is our desired post.
    const item = entries.items[0] as Entry<BlogPostFields>;
    return {
      title: item.fields.title,
      author: item.fields.author,
      date: item.fields.date,
      content: item.fields.content,
      slug: item.fields.slug,
    };
  }
  return null;
}
