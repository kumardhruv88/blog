import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, ArrowRight, Bookmark, Calendar, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import Card from '../common/Card';

const PostCard = ({ post }) => {
  // Dummy data for publishedAt if not present
  const publishedAt = post.publishedAt || new Date().toISOString(); 
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const displayedTags = post.tags.slice(0, 5);
  const remainingTagsCount = post.tags.length - displayedTags.length;
  
  // Mock Bookmark State
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [bookmarkCount, setBookmarkCount] = React.useState(parseInt(post.bookmarks) || 0);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card navigation
    if (isBookmarked) {
      setBookmarkCount(prev => prev - 1);
    } else {
      setBookmarkCount(prev => prev + 1);
    }
    setIsBookmarked(!isBookmarked);
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const relativeDate = formatRelativeTime(publishedAt);

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col p-0 glass-card" hover={true}>
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-blur to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute top-4 left-4">
          <Badge variant="gradient" className="shadow-lg backdrop-blur-md">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          {displayedTags.map(tag => (
            <Badge key={tag} size="sm" variant="default" className="whitespace-nowrap">
              #{tag}
            </Badge>
          ))}
          {remainingTagsCount > 0 && (
            <Badge size="sm" variant="default" className="whitespace-nowrap">
              +{remainingTagsCount} more
            </Badge>
          )}
        </div>

        <Link to={`/blog/${post.slug}`} className="group-hover:text-electric-cyan transition-colors duration-300">
          <h3 className="text-2xl font-heading font-bold mb-3 line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-gray text-base line-clamp-3 mb-4 flex-grow font-body leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Footer */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-gray border-t border-black/5 pt-4">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full ring-1 ring-black/10" />
              <span className="font-medium text-[#1E293B]">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
              <span className="flex items-center gap-1" title={formattedDate}><Calendar size={12} /> {relativeDate}</span>
            </div>
          </div>

          {/* Hover Action */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <Link 
              to={`/blog/${post.slug}`} 
              className="w-full py-4 bg-gradient-brand text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-300 shadow-[0_-4px_20px_rgba(37,99,235,0.15)]"
            >
              Read Article 
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
