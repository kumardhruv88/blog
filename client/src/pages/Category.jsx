import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Eye, User, Filter, LayoutGrid, Calendar, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import PostCard from '../components/blog/PostCard';

// Mock Post Data (Reused)
const ALL_POSTS = [
  {
    id: 1,
    title: "Understanding React Server Components",
    slug: "react-server-components",
    excerpt: "Deep dive into how RSCs work, their benefits for performance, and how they change the way we build React applications.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    category: "React",
    tags: ["Frontend", "Performance", "Architecture"],
    readTime: "8 min",
    readTimeMin: 8,
    views: "1.2k",
    bookmarks: "15",
    publishedAt: "2024-02-01T10:00:00Z",
    author: { name: "Dhruv", avatar: "https://ui-avatars.com/api/?name=Dhruv&background=2563EB&color=1E293B" }
  },
  {
    id: 6,
    title: "Advanced TypeScript Patterns",
    slug: "advanced-typescript",
    excerpt: "Explore advanced TypeScript features like Generics, Utility Types, and Decorators to write cleaner and more robust code.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
    category: "React",
    tags: ["TypeScript", "JavaScript"],
    readTime: "7 min",
    readTimeMin: 7,
    views: "900",
    bookmarks: "8",
    publishedAt: "2024-01-10T16:00:00Z",
    author: { name: "Dhruv", avatar: "https://ui-avatars.com/api/?name=Dhruv&background=2563EB&color=1E293B" }
  },
];

const CATEGORY_META = {
  "React": { 
    icon: "⚛️", 
    color: "from-cyan-500 to-blue-600",
    description: "Deep dives into React, Server Components, and the modern React ecosystem.",
    stats: { posts: 24, views: "45k", contributor: "Dhruv" }
  },
  "AI & ML": { 
    icon: "🤖", 
    color: "from-purple-500 to-indigo-600",
    description: "Exploring artificial intelligence, neural networks, and modern machine learning patterns.",
    stats: { posts: 12, views: "28k", contributor: "Dhruv" }
  },
};

import { fetchCategoryBySlug, fetchPosts } from '../services/api';

const Category = () => {
  const { name } = useParams(); // URL slug
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        // Fetch category metadata
        const catData = await fetchCategoryBySlug(name);
        setCategory(catData);

        // Fetch posts for this category
        const postsData = await fetchPosts({ category: catData.name });
        setPosts(postsData.posts || postsData);

      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [name]);

  const { featuredPost, otherPosts } = useMemo(() => {
    if (!posts.length) return { featuredPost: null, otherPosts: [] };
    const sorted = [...posts].sort((a,b) => (b.views || 0) - (a.views || 0));
    return {
      featuredPost: sorted[0],
      otherPosts: sorted.slice(1)
    };
  }, [posts]);

  const relatedTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(p => p.tags?.forEach(t => tags.add(t.tag.name)));
    return Array.from(tags).slice(0, 8);
  }, [posts]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-[#1E293B]">Synthesizing Category Matrix...</div>;
  if (!category) return <div className="min-h-screen pt-32 text-center text-[#1E293B]">Category Not Found</div>;

  const meta = {
    icon: category.icon || "📁",
    color: category.color || "from-slate-500 to-slate-700",
    description: category.description || `All posts in the ${category.name} category.`,
    stats: { 
      posts: posts.length, 
      views: posts.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString(), 
      contributor: "Dhruv" 
    }
  };

  return (
    <div className="min-h-screen">
      {/* Category Hero */}
      <section className={`relative h-[450px] flex items-center justify-center overflow-hidden bg-gradient-to-br ${meta.color}`}>
         <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
         
         {/* Parallax Background Pattern */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.1 }}
           className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
         />

         <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl mb-6 drop-shadow-2xl"
            >
              {meta.icon}
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-heading font-extrabold text-[#1E293B] mb-6 tracking-tight"
            >
              {category.name}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-[#1E293B]/90 font-medium leading-relaxed"
            >
              {meta.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex items-center justify-center gap-2 text-[#1E293B]/60 text-sm font-medium"
            >
               <Link to="/" className="hover:text-[#1E293B] transition-colors">Home</Link>
               <ChevronRight size={14} />
               <Link to="/blog" className="hover:text-[#1E293B] transition-colors">Blog</Link>
               <ChevronRight size={14} />
               <span className="text-[#1E293B]">{name}</span>
            </motion.div>
         </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="p-8 glass-card border-black/10 flex flex-col items-center text-center group hover:border-electric-cyan/50 transition-all">
              <FileText className="text-electric-cyan mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-3xl font-heading font-bold text-[#1E293B] mb-1">{meta.stats.posts}</p>
              <p className="text-sm font-bold text-slate-gray uppercase tracking-widest">Total Posts</p>
           </Card>
           <Card className="p-8 glass-card border-black/10 flex flex-col items-center text-center group hover:border-vibrant-purple/50 transition-all">
              <Eye className="text-vibrant-purple mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-3xl font-heading font-bold text-[#1E293B] mb-1">{meta.stats.views}</p>
              <p className="text-sm font-bold text-slate-gray uppercase tracking-widest">Total Views</p>
           </Card>
           <Card className="p-8 glass-card border-black/10 flex flex-col items-center text-center group hover:border-neon-pink/50 transition-all">
              <User className="text-neon-pink mb-4 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-3xl font-heading font-bold text-[#1E293B] mb-1">{meta.stats.contributor}</p>
              <p className="text-sm font-bold text-slate-gray uppercase tracking-widest">Top Contributor</p>
           </Card>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            {featuredPost && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-electric-cyan rounded-full shadow-[0_0_10px_#2563EB]" />
                  <h2 className="text-2xl font-black uppercase tracking-widest text-[#1E293B]">Featured Story</h2>
                </div>
                <div className="group relative rounded-3xl overflow-hidden glass-card border-black/10 hover:border-electric-cyan/30 transition-all duration-500">
                  <div className="md:flex">
                    <div className="md:w-1/2 h-64 md:h-80 overflow-hidden">
                       <img src={featuredPost.cover_image_url || featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                       <div className="flex items-center gap-4 text-xs font-bold text-electric-cyan uppercase tracking-[0.2em] mb-4">
                          <span>{featuredPost.category}</span>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                          <span className="flex items-center gap-1"><Clock size={12} /> {featuredPost.readTime}</span>
                       </div>
                       <h3 className="text-2xl font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors mb-4 leading-tight">{featuredPost.title}</h3>
                       <p className="text-slate-gray text-sm line-clamp-3 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                       <Link to={`/blog/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1E293B] hover:text-electric-cyan transition-colors">
                          Read More <ChevronRight size={14} />
                       </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-widest text-[#1E293B] flex items-center gap-3">
                  <div className="w-1 h-8 bg-vibrant-purple rounded-full shadow-[0_0_10px_#A855F7]" />
                  Feed
                </h2>
                <select className="bg-transparent border border-black/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-gray outline-none focus:border-electric-cyan">
                   <option>Newest</option>
                   <option>Trending</option>
                </select>
              </div>

              {otherPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherPosts.map((post, index) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center glass-card border-black/5 bg-white/[0.02] rounded-3xl">
                   <p className="text-slate-gray italic">{featuredPost ? "No more posts in this category." : "No posts found."}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <section className="glass-card-dark border-black/10 p-8 rounded-3xl">
               <div className="flex items-center gap-3 mb-6">
                  <LayoutGrid className="text-electric-cyan" size={18} />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1E293B]">Top Tags</h3>
               </div>
               <div className="flex flex-wrap gap-2">
                  {relatedTags.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/tag/${tag}`}
                      className="px-3 py-1.5 rounded-xl bg-black/5 border border-black/5 text-[11px] font-bold text-slate-gray hover:border-electric-cyan/40 hover:text-[#1E293B] transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
               </div>
            </section>
          </aside>
        </div>
      </section>

      {/* Related Categories (Placeholder for Carousel as per spec 2185) */}
      <section className="bg-white/[0.02] py-20 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h3 className="text-2xl font-heading font-bold text-[#1E293B] mb-8">Related Categories</h3>
           <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {Object.keys(CATEGORY_META).filter(c => c !== name).map(catName => (
                <Link key={catName} to={`/category/${catName}`}>
                  <Card className="min-w-[280px] p-6 glass-card-dark hover:border-electric-cyan/30 transition-all flex items-center gap-4">
                     <span className="text-4xl">{CATEGORY_META[catName].icon}</span>
                     <div>
                        <h4 className="font-bold text-[#1E293B]">{catName}</h4>
                        <p className="text-xs text-slate-gray">{CATEGORY_META[catName].stats.posts} Posts</p>
                     </div>
                  </Card>
                </Link>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
