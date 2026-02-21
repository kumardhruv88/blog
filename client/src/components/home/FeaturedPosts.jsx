import React from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import PostCard from '../blog/PostCard';

const DUMMY_POSTS = [
  {
    id: 1,
    title: "Understanding React Server Components",
    slug: "react-server-components",
    excerpt: "Deep dive into how RSCs work, their benefits for performance, and how they change the way we build React applications.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    category: "React",
    tags: ["Frontend", "Performance", "Architecture", "Next.js", "SSR"],
    readTime: "8 min",
    views: "1.2k",
    bookmarks: "15",
    publishedAt: "2026-01-28T10:00:00Z",
    author: {
      name: "Dhruv",
      avatar: "https://ui-avatars.com/api/?name=Dhruv&background=64FFDA&color=0A192F"
    }
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS Grid Layouts",
    slug: "tailwind-grid-mastery",
    excerpt: "Learn how to build complex, responsive grid layouts with Tailwind CSS using simple utility classes and grid-template-areas.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop",
    category: "CSS",
    tags: ["Design", "Responsive", "Grid", "UI/UX"],
    readTime: "5 min",
    views: "850",
    bookmarks: "7",
    publishedAt: "2026-01-25T14:30:00Z",
    author: {
      name: "Dhruv",
      avatar: "https://ui-avatars.com/api/?name=Dhruv&background=64FFDA&color=0A192F"
    }
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    slug: "scalable-nodejs-apis",
    excerpt: "Best practices for structuring Express applications, handling errors, and implementing caching for high-performance APIs.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop",
    category: "Backend",
    tags: ["Node.js", "API", "Express", "Microservices", "Performance"],
    readTime: "12 min",
    views: "2.1k",
    bookmarks: "23",
    publishedAt: "2026-01-20T09:15:00Z",
    author: {
      name: "Dhruv",
      avatar: "https://ui-avatars.com/api/?name=Dhruv&background=64FFDA&color=0A192F"
    }
  }
];

const FeaturedPosts = () => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-2 tracking-tight">
            Featured <span className="gradient-text">Posts</span>
          </h2>
          <p className="text-slate-gray font-medium">
            Hand-picked articles to boost your documentation journey.
          </p>
        </motion.div>
        
        <a href="/blog" className="text-electric-cyan font-black uppercase tracking-widest text-xs hover:underline hidden sm:block">
          View all posts →
        </a>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {DUMMY_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </Masonry>
      
      <div className="mt-8 text-center sm:hidden">
         <a href="/blog" className="text-electric-cyan font-bold uppercase tracking-widest text-xs">
          View all posts →
        </a>
      </div>
    </section>
  );
};

export default FeaturedPosts;
