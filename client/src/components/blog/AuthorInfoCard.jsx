import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Link as LinkIcon, UserPlus, UserCheck } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const AuthorInfoCard = ({ author, publishedAt }) => {
  const [isFollowing, setIsFollowing] = useState(false); // Mock state for follow button

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: author.github_url },
    { name: 'LinkedIn', icon: Linkedin, url: author.linkedin_url },
    { name: 'Twitter', icon: Twitter, url: author.twitter_url },
    { name: 'Dev.to', icon: Code, url: author.devto_url }, // Assuming Code icon for Dev.to
    { name: 'Email', icon: Mail, url: `mailto:${author.email}` }, // Assuming email exists
  ].filter(link => link.url);

  const joinDate = new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  return (
    <Card className="p-6 glass-card-dark flex flex-col md:flex-row items-center md:items-start gap-6 relative">
      <div className="relative flex-shrink-0">
        <motion.img 
          src={author.avatar}
          alt={author.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-electric-cyan/30 shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Optional: Online status indicator */}
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-deep-code-blue" title="Online" />
      </div>

      <div className="flex-grow text-center md:text-left">
        <h3 className="text-2xl font-heading font-bold text-white group-hover:text-electric-cyan transition-colors">
          <Link to={`/author/${author.name.toLowerCase().replace(/ /g, '-')}`}>{author.name}</Link>
        </h3>
        <p className="text-sm text-slate-gray mb-3 line-clamp-2">{author.bio || "No bio provided."}</p>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-slate-gray mb-4">
          {author.location && (
            <span className="flex items-center gap-1">
              <LinkIcon size={14} className="text-electric-cyan" /> {author.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-electric-cyan" /> Joined {joinDate}
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
          {socialLinks.map(link => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/5 rounded-full text-slate-gray hover:text-electric-cyan transition-colors"
              title={link.name}
            >
              <link.icon size={18} />
            </motion.a>
          ))}
        </div>

        <Button 
          variant={isFollowing ? "secondary" : "primary"}
          size="sm"
          icon={isFollowing ? UserCheck : UserPlus}
          onClick={() => setIsFollowing(!isFollowing)}
          className="w-full md:w-auto mt-4"
        >
          {isFollowing ? "Following" : "Follow Author"}
        </Button>
      </div>
    </Card>
  );
};

export default AuthorInfoCard;