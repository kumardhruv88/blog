import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import Card from '../common/Card';

const RelatedPosts = ({ currentPost, relatedPosts }) => {
  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <section className="mt-24 border-t border-white/10 pt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold mb-2">You Might Also Like</h2>
        <p className="text-slate-gray">Based on this post's topics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post, index) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-white/5 bg-[#112240]/40 hover:bg-[#112240]/60 transition-colors overflow-hidden group">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={post.cover_image_url || post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg leading-tight mb-2 group-hover:text-electric-cyan transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-gray mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-gray font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.views}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
