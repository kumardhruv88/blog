import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { 
  Calendar, Clock, Eye, Heart, Share2, Download, 
  ChevronRight, ChevronDown, ChevronUp, Link as LinkIcon, 
  ExternalLink, Tag, Book, FileText, Play, Code2, 
  Edit, Hash, MessageSquare, User, Check, Loader2, Github, Bookmark
} from 'lucide-react';
import { fetchPostBySlug, incrementPostViews, fetchRelatedPosts, toggleBookmark, setAuthToken } from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PostCard from '../components/blog/PostCard';
import CodeBlock from '../components/blog/CodeBlock';
import Lightbox from '../components/common/Lightbox';
import ShareModal from '../components/blog/ShareModal';
import MobileStickyBar from '../components/blog/MobileStickyBar';
import RelatedPosts from '../components/blog/RelatedPosts';
import CommentsSection from '../components/blog/CommentsSection';
import '../styles/markdown.css';
import Callout from '../components/blog/Callout';

const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const PostDetail = () => {
  const { slug } = useParams();
  const { getToken } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' });

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"]
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange(latest => setScrollPercentage(Math.round(latest * 100)));
  }, [scrollYProgress]);

  const { scrollYProgress: headerScroll } = useScroll({ target: headerRef, offset: ["start end", "end start"] });
  const yHeaderBg = useTransform(headerScroll, [0, 1], ["0%", "50%"]);

  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setShowMobileBar(latest > 350);
    });
  }, [scrollY]);

  useEffect(() => {
    const getPostData = async () => {
      try {
        setLoading(true);
        const data = await fetchPostBySlug(slug);
        
        // Calculate dynamic reading time if it's 0 or missing
        if (!data.reading_time || data.reading_time === 0) {
          const wordsPerMinute = 200;
          const textLength = data.content.split(/\s+/).length;
          data.reading_time = Math.ceil(textLength / wordsPerMinute);
        }

        setPost(data);
        
        try {
          const related = await fetchRelatedPosts(data.id);
          setRelatedPosts(related);
        } catch (e) { console.error("Related posts fetch failed", e); }
        
        try {
          await incrementPostViews(data.id);
          // Update local view count immediately for the UI
          setPost(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);
        } catch (e) { console.error("View increment failed", e); }
        
        window.scrollTo(0, 0);

        const headers = [];
        const lines = data.content.split('\n');
        lines.forEach(line => {
          const match = line.match(/^(#{2,3})\s+(.+)$/);
          if (match) {
            headers.push({
              id: slugify(match[2]),
              text: match[2],
              level: match[1].length
            });
          }
        });
        setToc(headers);
      } catch (error) {
        console.error('Error fetching post detail:', error);
      } finally {
        setLoading(false);
      }
    };
    getPostData();
  }, [slug]);

  const [expandedSection, setExpandedSection] = useState('docs');
  const toggleSection = (section) => setExpandedSection(expandedSection === section ? null : section);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );
    document.querySelectorAll('h2, h3').forEach(elem => observer.observe(elem));
    return () => observer.disconnect();
  }, [toc]);

  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePdfDownload = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      window.print();
      setIsGeneratingPdf(false);
    }, 1500);
  };

  const handleBookmark = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const { bookmarked } = await toggleBookmark(post.id);
      setIsBookmarked(bookmarked);
      setPost(prev => ({
        ...prev,
        bookmarks_count: bookmarked ? (prev.bookmarks_count || 0) + 1 : Math.max(0, (prev.bookmarks_count || 1) - 1)
      }));
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleImageClick = (src, alt) => {
    setLightboxImage({ src, alt });
    setLightboxOpen(true);
  };

  const MarkdownComponents = {
    code: ({ node, inline, className, children, metastring, ...props }) => (
      <CodeBlock inline={inline} className={className} metastring={metastring} {...props}>{children}</CodeBlock>
    ),
    h2: ({ children }) => {
      const id = slugify(String(children));
      return (
        <h2 id={id} className="group relative text-3xl font-heading font-bold mt-16 mb-8 text-[#1E293B] scroll-mt-24">
          <a href={`#${id}`} className="heading-anchor absolute -left-7 top-1/2 -translate-y-1/2">
            <Hash size={20} />
          </a>
          {children}
          <div className="h-1 w-16 bg-gradient-brand mt-4 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(String(children));
      return (
        <h3 id={id} className="group relative text-2xl font-heading font-bold mt-10 mb-6 text-[#1E293B] border-l-4 border-electric-cyan pl-4 scroll-mt-24">
          <a href={`#${id}`} className="heading-anchor absolute -left-10 top-1/2 -translate-y-1/2">
            <Hash size={18} />
          </a>
          {children}
        </h3>
      );
    },
    p: ({ children, node }) => {
      const isFirstParagraph = node.position.start.line <= 5;
      if (isFirstParagraph && typeof children[0] === 'string') {
        const text = children[0];
        const firstChar = text.charAt(0);
        const rest = text.slice(1);
        return (
          <p className="mb-8 leading-[1.8] text-ghost-white text-xl font-body tracking-wide relative">
            <span className="float-left text-7xl font-black gradient-text mr-4 mt-2 leading-[0.8] drop-shadow-xl select-none">{firstChar}</span>
            {rest}{children.slice(1)}
          </p>
        );
      }
      return <p className="mb-8 leading-[1.8] text-ghost-white/90 text-xl font-body tracking-wide">{children}</p>; 
    },
    blockquote: ({ children }) => {
      const content = children?.[1]?.props?.children?.[0] || "";
      const calloutMatch = typeof content === 'string' && content.match(/^\[!(INFO|WARNING|SUCCESS|ERROR)\]/i);
      
      if (calloutMatch) {
        const type = calloutMatch[1].toLowerCase();
        // Remove the [!TYPE] marker from the content
        const cleanChildren = React.Children.map(children, (child, i) => {
           if (i === 1) { // The paragraph containing the marker
             const text = child.props.children[0].replace(/^\[!(INFO|WARNING|SUCCESS|ERROR)\]\s*/i, '');
             return React.cloneElement(child, { children: [text, ...child.props.children.slice(1)] });
           }
           return child;
        });
        return <Callout type={type}>{cleanChildren}</Callout>;
      }

      return (
        <blockquote className="my-12 p-8 glass-card border-l-4 border-electric-cyan relative overflow-hidden group">
          <div className="absolute -top-10 -left-6 text-9xl text-electric-cyan opacity-5 select-none font-serif">"</div>
          <div className="relative z-10 italic text-2xl text-[#1E293B] font-medium leading-relaxed">{children}</div>
        </blockquote>
      );
    },
    img: ({ src, alt }) => (
      <div className="my-12 group cursor-pointer" onClick={() => handleImageClick(src, alt)}>
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-black/5 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-electric-cyan/30">
           <img src={src} alt={alt} className="w-full h-auto transition-all duration-700 group-hover:brightness-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0"><Eye className="text-[#1E293B]" size={20} /></div>
        </div>
        {alt && <p className="text-center text-sm text-slate-gray mt-6 font-medium italic opacity-60 tracking-wider">[{alt}]</p>}
      </div>
    ),
    ul: ({ children }) => <ul className="space-y-6 mb-12 list-none markdown-content">{children}</ul>,
    ol: ({ children }) => <ol className="space-y-6 mb-12 list-none counter-reset-list markdown-content">{children}</ol>,
    li: ({ children, node, checked, ordered }) => {
        if (checked !== null && checked !== undefined) {
          return (
            <li className="task-list-item flex items-start gap-4 mb-4">
              <input type="checkbox" checked={checked} readOnly className="mt-1 flex-shrink-0" />
              <div className={`flex-grow ${checked ? 'line-through opacity-50' : ''}`}>{children}</div>
            </li>
          );
        }
        return (
          <li className="flex gap-5 items-start group">
            <div className={`flex-shrink-0 ${ordered ? 'w-10 h-10 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center text-sm font-black text-electric-cyan group-hover:bg-electric-cyan group-hover:text-[#1E293B] transition-all duration-300 shadow-xl' : 'w-2 h-2 mt-3.5 rounded-full bg-gradient-brand shadow-[0_0_15px_rgba(100,255,218,0.6)] group-hover:scale-150 transition-all duration-300'}`}>
               {ordered && <span className="relative z-10">•</span>}
            </div>
            <div className="flex-grow text-ghost-white/90 leading-[1.8] text-xl font-body">{children}</div>
          </li>
        );
    },
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      if (href?.includes('figma.com') || href?.includes('docs.google.com/presentation')) {
        return (
          <div className="my-10 aspect-video rounded-3xl overflow-hidden border border-black/10 shadow-2xl bg-black/20">
            <iframe src={href} className="w-full h-full" allowFullScreen loading="lazy" />
            <div className="p-3 bg-black/5 text-[10px] text-slate-gray text-center font-bold uppercase tracking-widest">
              Embedded Content: {href?.includes('figma') ? 'Figma Design' : 'Google Slides'}
            </div>
          </div>
        );
      }
      return (
        <a href={href} target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : ""} className="font-bold text-electric-cyan hover:text-[#1E293B] transition-all underline decoration-electric-cyan/30 decoration-2 underline-offset-4 hover:decoration-white">
          {children}{isExternal && <ExternalLink size={14} className="inline ml-1 mb-1 opacity-50" />}
        </a>
      );
    }
  };

  if (loading) return <div className="min-h-screen pt-32 px-4 text-[#1E293B] uppercase font-black text-center">Reconstructing Article Matrix...</div>;
  if (!post) return <div className="min-h-screen pt-32 px-4 text-[#1E293B] uppercase font-black text-center">Article Not Found</div>;

  const formattedPublishedDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const isCompact = showMobileBar;

  return (
    <article className="min-h-screen pb-20 print:bg-white print:text-black">
      <Lightbox isOpen={lightboxOpen} imageSrc={lightboxImage.src} alt={lightboxImage.alt} onClose={() => setLightboxOpen(false)} />
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-brand z-[60] origin-left shadow-[0_0_15px_rgba(100,255,218,0.5)]" style={{ scaleX }} />

      <div className="fixed bottom-10 right-10 z-40 hidden lg:flex flex-col gap-4 group print:hidden">
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} 
            onClick={handleBookmark} 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-xl border transition-all duration-300 ${isBookmarked ? 'bg-gradient-brand text-[#1E293B] border-transparent' : 'bg-white/80 text-slate-gray border-black/10 hover:border-electric-cyan/50 hover:text-electric-cyan'}`}
            title="Bookmark Article"
          >
            <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} 
            onClick={handleCopyLink} 
            className={`w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-2xl backdrop-blur-xl border transition-all duration-300 ${isCopied ? 'text-electric-cyan border-electric-cyan' : 'text-slate-gray border-black/10 hover:border-electric-cyan/50 hover:text-[#1E293B]'}`}
            title="Copy Link"
          >
            {isCopied ? <Check size={24} /> : <LinkIcon size={24} />}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} 
            onClick={handlePdfDownload} 
            disabled={isGeneratingPdf}
            className={`w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-2xl backdrop-blur-xl border border-black/10 hover:border-electric-cyan/50 hover:text-[#1E293B] transition-all duration-300 ${isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Download PDF"
          >
            {isGeneratingPdf ? <Loader2 size={24} className="animate-spin text-electric-cyan" /> : <Download size={24} />}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} 
            onClick={() => setIsShareModalOpen(true)} 
            className="w-14 h-14 rounded-2xl bg-white/80 text-slate-gray flex items-center justify-center shadow-2xl backdrop-blur-xl border border-black/10 hover:border-electric-cyan/50 hover:text-[#1E293B] transition-all duration-300"
            title="More Options"
          >
            <Share2 size={24} />
          </motion.button>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} postTitle={post.title} postUrl={window.location.href} />
      <MobileStickyBar isVisible={showMobileBar} progress={scrollYProgress.get()} isBookmarked={isBookmarked} onBookmark={() => setIsBookmarked(!isBookmarked)} onShare={() => setIsShareModalOpen(true)} bookmarkCount={post.bookmarks_count || 0} />

      <div ref={headerRef} className="relative h-[300px] md:h-[450px] overflow-hidden print:hidden">
        <motion.img src={post.cover_image_url || post.image} alt={post.title} className="w-full h-full object-cover absolute top-0 left-0 brightness-75" style={{ y: yHeaderBg }} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-code-blue to-transparent opacity-60" />
        
        {/* Sticky Breadcrumb Bar */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <motion.div 
            style={{ 
              position: isCompact ? 'fixed' : 'absolute',
              top: isCompact ? '0' : '40px',
              left: isCompact ? '0' : 'auto',
              right: isCompact ? '0' : 'auto',
              width: isCompact ? '100%' : 'auto',
              background: isCompact ? 'rgba(10, 25, 47, 0.9)' : 'transparent',
              padding: isCompact ? '20px 40px' : '0',
            }}
            className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-gray z-[100] transition-all duration-500 ${isCompact ? 'border-b border-black/10 block backdrop-blur-xl' : 'glass-card-dark py-3 px-6 rounded-2xl border border-black/5 shadow-2xl'}`}
          >
             <Link to="/" className="hover:text-electric-cyan transition-colors">Home</Link>
             <ChevronRight size={14} className="opacity-30" />
             <Link to="/blog" className="hover:text-electric-cyan transition-colors">Blog</Link>
             <ChevronRight size={14} className="opacity-30" />
             <span className="text-[#1E293B] line-clamp-1 max-w-[200px]">{post.title}</span>
             {isCompact && <div className="ml-auto w-px h-6 bg-black/10 mx-4 hidden md:block" />}
             {isCompact && <div className="hidden md:flex items-center gap-4">
                <span className="text-electric-cyan">{scrollPercentage}%</span>
                <div className="w-32 h-1 bg-black/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-electric-cyan" style={{ width: `${scrollPercentage}%` }} />
                </div>
             </div>}
          </motion.div>
          <div className="max-w-[1000px]">
            <motion.div animate={{ y: isCompact ? -50 : 0, opacity: isCompact ? 0 : 1 }} transition={{ duration: 0.5 }}>
              <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-block px-4 py-1.5 rounded-lg bg-electric-cyan text-[#1E293B] font-black text-[10px] uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                {post.category?.name || "Uncategorized"}
              </motion.span>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-heading font-black mb-6 leading-[0.9] text-[#1E293B] tracking-tighter uppercase">{post.title}</h1>
              {post.subtitle && <p className="text-xl md:text-2xl text-ghost-white/80 mb-10 leading-relaxed max-w-3xl font-medium">{post.subtitle}</p>}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <Card className="w-full p-6 grid grid-cols-2 md:grid-cols-3 lg:flex lg:items-center justify-between gap-6 glass-card border-black/5">
               <div className="flex items-center gap-2">
                 <Calendar size={18} className="text-electric-cyan" />
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase tracking-wider text-slate-gray font-bold">Published</span>
                   <span className="text-xs text-ghost-white font-medium">{formattedPublishedDate}</span>
                 </div>
               </div>
               {/* Separator Dot */}
               <div className="w-px h-8 bg-black/10 hidden lg:block" />
               <div className="flex items-center gap-2">
                 <Clock size={18} className="text-vibrant-purple" />
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase tracking-wider text-slate-gray font-bold">Reading Time</span>
                   <span className="text-xs text-ghost-white font-medium">{post.reading_time || 0} min read</span>
                 </div>
               </div>
               <div className="w-px h-8 bg-black/10 hidden lg:block" />
               <div className="flex items-center gap-2">
                 <Eye size={18} className="text-neon-pink" />
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase tracking-wider text-slate-gray font-bold">Views</span>
                   <span className="text-xs text-ghost-white font-medium">{(post.views || 0).toLocaleString()} views</span>
                 </div>
               </div>
               <div className="w-px h-8 bg-black/10 hidden lg:block" />
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                 <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest whitespace-nowrap">Topics:</span>
                 {post.tags?.slice(0, 3).map(t => (<Badge key={t.tag.id} variant="outline" className="px-3 py-1 bg-black/5 border-black/10 text-[9px]">{t.tag.name}</Badge>))}
               </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 mt-12">
        <div className="lg:w-2/3" ref={contentRef}>
          <div className="prose prose-invert prose-lg max-w-none print:prose-black">
             <div className="drop-cap">
                <ReactMarkdown components={MarkdownComponents} rehypePlugins={[rehypeHighlight]}>{post.content}</ReactMarkdown>
             </div>
          </div>
          <div className="mt-16 pt-8 border-t border-black/10">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-slate-gray text-xs font-bold uppercase tracking-widest">
                  End of Article
               </div>
               <div className="flex gap-2">
                  {post.tags?.map(t => (<span key={t.tag.id} className="text-electric-cyan text-sm hover:underline cursor-pointer">#{t.tag.name}</span>))}
               </div>
             </div>
          </div>
          <RelatedPosts currentPost={post} relatedPosts={relatedPosts} />
          <CommentsSection postId={post.id} />
        </div>
        <div className="hidden lg:block lg:w-1/3 space-y-8 print:hidden">
           <div className="sticky top-28 space-y-8">
             <Button className="w-full justify-center" variant="outline" icon={Edit}>Edit Post</Button>
             <Card className="p-6 bg-[#112240]/50 backdrop-blur-sm border-black/5 group hover:border-electric-cyan/30 transition-all duration-500">
                <h3 className="font-heading font-bold mb-4 text-electric-cyan flex items-center gap-2">
                  <User size={18} /> About Author
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={post.author?.avatar_url || `https://ui-avatars.com/api/?name=${post.author?.name}&background=2563EB&color=1E293B`} className="w-16 h-16 rounded-2xl object-cover border border-black/10" />
                      <div className="absolute inset-0 rounded-2xl bg-electric-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#1E293B] group-hover:text-electric-cyan transition-colors">{post.author?.name}</h4>
                      <p className="text-xs text-slate-gray font-medium tracking-wider uppercase">Lead Architect</p>
                    </div>
                  </div>
                  <div className="relative">
                    <p className={`text-sm text-slate-gray leading-relaxed transition-all duration-500 ${!bioExpanded ? 'line-clamp-2' : ''}`}>
                      {post.author?.bio || "Technical writer and enthusiast specializing in cloud-native architectures and modern frontend patterns."}
                    </p>
                    {(post.author?.bio || "").length > 60 && (
                      <button 
                        onClick={() => setBioExpanded(!bioExpanded)}
                        className="mt-2 text-xs font-black uppercase tracking-widest text-electric-cyan hover:text-[#1E293B] transition-all flex items-center gap-1"
                      >
                        {bioExpanded ? 'Show Less' : 'Read More'} <ChevronDown size={14} className={`transition-transform duration-300 ${bioExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  <Link to={`/profile/${post.author?.id}`} className="w-full py-3 bg-black/5 border border-black/10 rounded-xl text-center text-xs font-black uppercase tracking-widest hover:bg-electric-cyan hover:text-[#1E293B] hover:border-transparent transition-all">
                    View Complete Profile
                  </Link>
                </div>
             </Card>
             {toc.length > 0 && (
               <Card className="p-6 border-black/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileText size={40} className="text-electric-cyan" />
                 </div>
                 <h3 className="font-heading font-bold mb-4 uppercase text-sm tracking-wider text-slate-gray">Table of Contents</h3>
                 <nav className="space-y-1 relative mb-6">
                   <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/10" />
                   {toc.map((item) => (
                     <a key={item.id} href={`#${item.id}`} className={`block pl-4 py-1.5 text-sm transition-all duration-300 border-l-2 -ml-[2px] ${activeId === item.id ? 'border-electric-cyan text-electric-cyan font-medium translate-x-1' : 'border-transparent text-slate-gray hover:text-[#1E293B] hover:border-white/30'} ${item.level === 3 ? 'ml-4' : ''}`} onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); setActiveId(item.id); }}>{item.text}</a>
                   ))}
                 </nav>

                 {/* Reading Progress Indicator */}
                 <div className="pt-6 border-t border-black/5">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray">Reading Progress</span>
                       <span className="text-xs font-bold text-electric-cyan">{scrollPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-gradient-brand" 
                         animate={{ width: `${scrollPercentage}%` }}
                         transition={{ type: "spring", damping: 20, stiffness: 100 }}
                       />
                    </div>
                 </div>
               </Card>
             )}
           </div>
        </div>
      </div>
      {/* Toasts / Notifications */}
      <AnimatePresence>
        {(isCopied || isGeneratingPdf) && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 glass-card border border-electric-cyan/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-electric-cyan/10 flex items-center justify-center">
              {isCopied ? <Check size={20} className="text-electric-cyan" /> : <Loader2 size={20} className="text-electric-cyan animate-spin" />}
            </div>
            <div>
              <p className="text-[#1E293B] font-bold text-sm">{isCopied ? 'Link Copied to Clipboard' : 'Preparing PDF Document'}</p>
              <p className="text-[10px] text-slate-gray uppercase tracking-widest mt-0.5">{isCopied ? 'Safe to share with your network' : 'This might take a few moments'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default PostDetail;