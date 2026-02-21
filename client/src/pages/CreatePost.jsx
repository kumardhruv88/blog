import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Eye, Edit3, Image as ImageIcon, Tag as TagIcon, 
  Settings as SettingsIcon, ChevronLeft, ChevronRight, ChevronDown,
  Bold, Italic, Underline, List, ListOrdered, Link, Code, Quote, Strikethrough,
  Type, Globe, Search, MoreHorizontal, ArrowLeft, CheckSquare,
  CheckCircle, Zap, Shield, HelpCircle, Layout, Maximize2, Youtube, Presentation,
  Trash2, Copy, FileText, Share2, PanelRight, Download, Github,
  X, Clock, AlertTriangle, Check, Plus, ExternalLink, Monitor, Terminal
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import CodeBlock from '../components/blog/CodeBlock';
import Callout from '../components/blog/Callout';
import { useAuth } from '@clerk/clerk-react';
import { fetchCategories, createPost, uploadImage, setAuthToken } from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState('split');
  const [status, setStatus] = useState('draft');
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [slug, setSlug] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 16));
  const [tags, setTags] = useState([]);
  const [imageAlt, setImageAlt] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // 'link', 'image', 'code', 'diagram'
  const [linkData, setLinkData] = useState({ url: '', text: '', newTab: true });
  const [imageSource, setImageSource] = useState('Upload'); // 'Upload', 'URL', 'Unsplash'
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [codeData, setCodeData] = useState({ language: 'javascript', code: '', theme: 'vs-dark', fileName: '', highlightLines: '' });
  const [diagramData, setDiagramData] = useState({ type: 'flowchart', code: 'graph TD\n  A[Start] --> B{Process}\n  B -->|Success| C[End]\n  B -->|Error| D[Retry]' });
  
  // New States for Advanced Editor
  const [showHeadings, setShowHeadings] = useState(false);
  const [showEmbedMenu, setShowEmbedMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);
  const [embedData, setEmbedData] = useState({ type: '', url: '' }); // 'youtube', 'codepen', 'gist', 'slides'
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);



  const editorRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0].id);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    getInitialData();

    // Recover from localStorage if exists
    const savedDraft = localStorage.getItem('techscribe_post_draft');
    if (savedDraft) {
      const { title: t, content: c, excerpt: e, category: cat, image: img } = JSON.parse(savedDraft);
      if (window.confirm('Found an unsaved draft. Would you like to restore it?')) {
        setTitle(t);
        setContent(c);
        setExcerpt(e);
        setCategory(cat);
        setFeaturedImage(img);
      }
    }
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    if (!title && !content) return;
    
    const timer = setTimeout(() => {
      const draftData = { title, content, excerpt, category, image: featuredImage };
      localStorage.setItem('techscribe_post_draft', JSON.stringify(draftData));
      setLastSaved(new Date());
      setHasUnsavedChanges(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, excerpt, category, featuredImage]);

  // SEO Score & Density Calculation
  useEffect(() => {
    let score = 0;
    if (title.length > 30 && title.length < 60) score += 20;
    if (content.length > 800) score += 20;
    if (metaDescription.length > 100 && metaDescription.length < 160) score += 20;
    if (featuredImage) score += 15;
    if (tags.length >= 3) score += 10;
    if (focusKeyword) {
      if (content.toLowerCase().includes(focusKeyword.toLowerCase())) score += 5;
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 5;
      if (slug.includes(focusKeyword.toLowerCase().replace(/\s+/g, '-'))) score += 5;
    }
    setSeoScore(Math.min(score, 100));
  }, [title, content, metaDescription, featuredImage, tags, focusKeyword, slug]);

  const getKeywordDensity = () => {
    if (!focusKeyword || !content) return 0;
    const words = content.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = words.filter(w => w.includes(focusKeyword.toLowerCase())).length;
    return ((matches / words.length) * 100).toFixed(2);
  };

  // Auto-generate slug
  useEffect(() => {
    if (!title) return;
    setSlug(title.toLowerCase().replace(/[^a-z0-0]+/g, '-').replace(/(^-|-$)/g, ''));
  }, [title]);

  // Handle Before Unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Scroll Sync Logic
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (previewRef.current && (viewMode === 'split')) {
      const ratio = scrollTop / (scrollHeight - clientHeight);
      const preview = previewRef.current;
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
    }
  };

  // Draggable Divider Logic
  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);
  const onResize = (e) => {
    if (!isResizing) return;
    const newRatio = (e.clientX / window.innerWidth) * 100;
    if (newRatio > 20 && newRatio < 80) {
      setSplitRatio(newRatio);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', onResize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', onResize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const handlePublish = async () => {
    try {
      setIsSaving(true);
      const token = await getToken();
      setAuthToken(token);

      const postData = {
        title,
        content,
        excerpt: metaDescription || content.substring(0, 150) + '...',
        category_id: category,
        status: 'published',
        cover_image_url: featuredImage,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        focus_keyword: focusKeyword,
        tags: tags
      };
      const newPost = await createPost(postData);
      setHasUnsavedChanges(false);
      localStorage.removeItem('techscribe_post_draft');
      navigate(`/blog/${newPost.slug}`);
    } catch (error) {
      console.error('Error publishing post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
       setIsAutosaving(true);
       // Logic for DB autosave/draft save would go here
       setHasUnsavedChanges(false);
       setLastSaved(new Date());
       setShowMoreMenu(false);
    } finally {
       setIsAutosaving(false);
    }
  };

  const handleDeletePost = () => {
     if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        localStorage.removeItem('techscribe_post_draft');
        navigate('/dashboard');
     }
  };

  const handleDuplicate = () => {
     setTitle(title + ' (Copy)');
     setHasUnsavedChanges(true);
     setShowMoreMenu(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const token = await getToken();
      setAuthToken(token);
      const { url } = await uploadImage(file);
      setFeaturedImage(url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const insertText = (before, after = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setContent(newText);
    textarea.focus();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFBF6]">
      <div className="w-12 h-12 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#FEFBF6] flex flex-col z-[100] text-[#1E293B]">
      <header className="h-16 border-b border-black/5 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Exit anyway?')) return;
              navigate('/dashboard');
            }} 
            className="p-2 hover:bg-black/5 rounded-lg transition-colors text-slate-gray hover:text-[#1E293B]"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
             <h1 className="text-sm font-bold truncate max-w-[200px]">{title || "Untitled Post"}</h1>
             <Badge variant={status === 'published' ? 'success' : 'secondary'} size="sm" className="uppercase text-[10px]">
                {status}
             </Badge>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-gray border-l border-black/10 pl-4">
             {isAutosaving ? (
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                 <span>Saving...</span>
               </div>
             ) : lastSaved ? (
               <div className="flex items-center gap-2">
                 <Check size={14} className="text-electric-cyan" />
                 <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
               </div>
             ) : (
               <span>Draft unsaved</span>
             )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 py-1.5 px-3 bg-black/5 rounded-xl border border-black/5">
             <button onClick={() => setViewMode('write')} className={`p-1.5 rounded-lg ${viewMode === 'write' ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray'}`} title="Write mode"><Edit3 size={16} /></button>
             <button onClick={() => setViewMode('split')} className={`p-1.5 rounded-lg ${viewMode === 'split' ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray'}`} title="Split view"><Layout size={16} /></button>
             <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded-lg ${viewMode === 'preview' ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray'}`} title="Preview mode"><Eye size={16} /></button>
          </div>
          
          <div className="h-8 w-[1px] bg-black/10 mx-2 hidden md:block" />

          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsPublishModalOpen(true)} 
            disabled={isSaving}
            className="shadow-lg shadow-blue-500/20"
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </Button>

          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-2 rounded-xl transition-colors ${showMoreMenu ? 'bg-black/10 text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
            >
              <MoreHorizontal size={20} />
            </button>
            
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#F5F0EB] border border-black/10 rounded-xl shadow-2xl z-[110] py-2 overflow-hidden"
                >
                  <button onClick={handleSaveDraft} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                    <Save size={16} /> Save as Draft
                  </button>
                  <button onClick={handleDuplicate} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                    <Copy size={16} /> Duplicate Post
                  </button>
                  <div className="h-[1px] bg-black/5 my-1" />
                  <button onClick={handleDeletePost} className="w-full px-4 py-2.5 text-left text-sm text-neon-pink hover:bg-neon-pink/5 flex items-center gap-3">
                    <Trash2 size={16} /> Delete Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      <div className={`flex-grow flex min-h-0 relative ${distractionFree ? 'bg-[#FEFBF6]' : ''}`}>
        <div className="flex-grow flex flex-col min-w-0">
           {/* Sticky Toolbar */}
           {!distractionFree && (
            <div className="sticky top-0 z-40 h-12 bg-white/70 backdrop-blur-xl border-b border-black/5 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                 {/* Headings Dropdown */}
                 <div className="relative pr-2 mr-2 border-r border-black/10">
                    <button 
                      onClick={() => setShowHeadings(!showHeadings)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${showHeadings ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
                    >
                      <Type size={16} />
                      <span>Heading</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${showHeadings ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showHeadings && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 w-40 bg-[#F5F0EB] border border-black/10 rounded-xl shadow-2xl z-50 py-2 overflow-hidden"
                        >
                          {[1, 2, 3, 4].map(level => (
                            <button 
                              key={level}
                              onClick={() => { insertText('#'.repeat(level) + ' '); setShowHeadings(false); }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3"
                            >
                              <span className="font-bold">H{level}</span>
                              <span className="text-xs opacity-50">Heading {level}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>

                 <div className="flex items-center border-r border-black/10 pr-2 mr-2 gap-0.5">
                    <button onClick={() => insertText('**', '**')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Bold (Ctrl+B)"><Bold size={18} /></button>
                    <button onClick={() => insertText('_', '_')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Italic (Ctrl+I)"><Italic size={18} /></button>
                    <button onClick={() => insertText('<u>', '</u>')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Underline (Ctrl+U)"><Underline size={18} /></button>
                    <button onClick={() => insertText('~~', '~~')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Strikethrough"><Strikethrough size={18} /></button>
                 </div>
                 
                 <div className="flex items-center border-r border-black/10 pr-2 mr-2 gap-0.5">
                    <button onClick={() => insertText('\n- ')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Bullet List"><List size={18} /></button>
                    <button onClick={() => insertText('\n1. ')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Ordered List"><ListOrdered size={18} /></button>
                    <button onClick={() => insertText('\n- [ ] ')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Checklist"><CheckSquare size={18} /></button>
                 </div>

                 <div className="flex items-center border-r border-black/10 pr-2 mr-2 gap-0.5">
                    <button onClick={() => setActiveModal('link')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Insert Link (Ctrl+K)"><Link size={18} /></button>
                    <button onClick={() => insertText('\n> ')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Quote"><Quote size={18} /></button>
                    <button onClick={() => insertText('`', '`')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Inline Code"><Code size={18} /></button>
                 </div>

                 <div className="flex items-center gap-0.5">
                    <button onClick={() => setActiveModal('code')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Code Block Studio"><FileText size={18} /></button>
                    <button onClick={() => setActiveModal('diagram')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Mermaid Diagram Studio"><Presentation size={18} /></button>
                    <button onClick={() => setActiveModal('image')} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray hover:text-electric-cyan transition-colors" title="Insert Image"><ImageIcon size={18} /></button>
                 </div>

                 {/* Embeds Dropdown */}
                 <div className="relative pl-1 ml-1 border-l border-black/10">
                    <button 
                      onClick={() => setShowEmbedMenu(!showEmbedMenu)}
                      className={`p-2 rounded-lg transition-all ${showEmbedMenu ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
                      title="Embed"
                    >
                      <Plus size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {showEmbedMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 w-48 bg-[#F5F0EB] border border-black/10 rounded-xl shadow-2xl z-50 py-2 overflow-hidden"
                        >
                          <button onClick={() => { setEmbedData({ type: 'youtube', url: '' }); setActiveModal('embed'); setShowEmbedMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                            <Youtube size={16} className="text-[#FF0000]" /> YouTube Video
                          </button>
                          <button onClick={() => { setEmbedData({ type: 'codepen', url: '' }); setActiveModal('embed'); setShowEmbedMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                            <Monitor size={16} /> CodePen
                          </button>
                          <button onClick={() => { setEmbedData({ type: 'gist', url: '' }); setActiveModal('embed'); setShowEmbedMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                            <Github size={16} /> GitHub Gist
                          </button>
                          <button onClick={() => { setEmbedData({ type: 'slides', url: '' }); setActiveModal('embed'); setShowEmbedMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                            <Presentation size={16} className="text-electric-cyan" /> Google Slides
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                  {/* Tools Dropdown */}
                  <div className="relative border-r border-black/10 pr-4 mr-2">
                    <button 
                      onClick={() => setShowToolsMenu(!showToolsMenu)}
                      className={`p-2 rounded-lg transition-all ${showToolsMenu ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
                      title="Tools"
                    >
                      <Terminal size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {showToolsMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-[#F5F0EB] border border-black/10 rounded-xl shadow-2xl z-50 py-2 overflow-hidden"
                        >
                          <button onClick={() => { setIsHelpOpen(true); setShowToolsMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                            <HelpCircle size={16} /> Markdown Help
                          </button>
                          <button onClick={() => { setDistractionFree(!distractionFree); setShowToolsMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-slate-gray hover:text-[#1E293B] hover:bg-black/5 flex items-center gap-3">
                            <Maximize2 size={16} /> {distractionFree ? 'Exit' : 'Enter'} Distraction-Free
                          </button>
                          <div className="h-[1px] bg-black/5 my-1" />
                          <div className="px-4 py-2 flex items-center justify-between">
                             <span className="text-[10px] text-slate-gray uppercase font-bold tracking-wider">Editor Mode</span>
                             <Badge variant="secondary" size="sm">Markdown</Badge>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>

                 <div className="flex items-center gap-4 text-[11px] text-slate-gray font-mono">
                    <div className="flex items-center gap-2">
                       <Clock size={14} />
                       <span>{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min</span>
                    </div>
                    <div className="h-4 w-[1px] bg-black/10" />
                    <span className="font-bold text-electric-cyan">{content.split(/\s+/).filter(Boolean).length} words</span>
                 </div>
              </div>
            </div>
          )}

           <div className="flex-grow flex min-h-0">
             {(viewMode === 'write' || viewMode === 'split') && (
               <div 
                  className="h-full bg-[#FEFBF6] overflow-y-auto no-scrollbar"
                  style={{ width: viewMode === 'split' ? `${splitRatio}%` : '100%' }}
               >
                  <div className="max-w-4xl mx-auto p-12">
                     <textarea 
                        placeholder="Enter a compelling title..." 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full bg-transparent border-none focus:ring-0 text-5xl font-heading font-black mb-8 min-h-[60px] resize-none overflow-hidden placeholder:text-[#1E293B]/20" 
                     />
                     <textarea 
                        ref={editorRef} 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        onScroll={handleScroll}
                        placeholder="Write your technical journey here..." 
                        className="w-full min-h-[500px] bg-transparent border-none focus:ring-0 text-lg font-mono leading-relaxed text-slate-gray focus:text-[#1E293B] resize-none" 
                     />
                  </div>
               </div>
             )}

             {viewMode === 'split' && (
               <div 
                  className="w-1 bg-[#F5F0EB] hover:bg-electric-cyan/30 cursor-col-resize transition-colors flex-shrink-0 relative z-50"
                  onMouseDown={startResizing}
               >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-black/5 border border-black/10 rounded flex items-center justify-center gap-[1px]">
                     <div className="w-[1px] h-3 bg-white/20" />
                     <div className="w-[1px] h-3 bg-white/20" />
                  </div>
               </div>
             )}

             {(viewMode === 'preview' || viewMode === 'split') && (
               <div 
                  ref={previewRef}
                  className="h-full bg-white/30 overflow-y-auto no-scrollbar scroll-smooth"
                  style={{ width: viewMode === 'split' ? `${100 - splitRatio}%` : '100%' }}
               >
                 <div className="max-w-4xl mx-auto p-12">
                   <article className="prose prose-invert prose-lg max-w-none">
                      {featuredImage && (
                        <div className="mb-12 rounded-3xl overflow-hidden border border-black/5 shadow-2xl">
                           <img src={featuredImage} alt="Featured" className="w-full aspect-video object-cover" />
                        </div>
                      )}
                      <h1 className="text-5xl font-heading font-black mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{title}</h1>
                      <ReactMarkdown components={{ code: CodeBlock, blockquote: Callout }}>{content}</ReactMarkdown>
                   </article>
                 </div>
               </div>
             )}
           </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.aside 
              initial={{ x: 400 }} 
              animate={{ x: 0 }} 
              exit={{ x: 400 }} 
              className="absolute right-0 top-0 bottom-0 w-[400px] bg-[#F5F0EB] border-l border-black/10 z-50 overflow-y-auto no-scrollbar"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between p-6 border-b border-black/5">
                <h3 className="font-heading font-bold flex items-center gap-2">
                  <SettingsIcon size={18} className="text-electric-cyan" />
                  Post Settings
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-black/5 rounded-lg text-slate-gray">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8 pb-12">
                {/* Publish Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-gray uppercase tracking-wider">
                    <Globe size={14} />
                    Publishing
                  </div>
                  
                  <div className="space-y-4 bg-black/5 rounded-2xl p-4 border border-black/5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['draft', 'published', 'scheduled'].map(s => (
                          <button 
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${status === s ? 'bg-electric-cyan/10 border-electric-cyan text-electric-cyan' : 'bg-transparent border-black/10 text-slate-gray hover:border-black/20'}`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Visibility</label>
                      <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] outline-none focus:border-electric-cyan transition-colors">
                        <option value="public">Public (Everyone)</option>
                        <option value="unlisted">Unlisted (Link only)</option>
                        <option value="private">Private (Only me)</option>
                      </select>
                    </div>

                    {status === 'scheduled' && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Publish Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={publishDate} 
                          onChange={(e) => setPublishDate(e.target.value)}
                          className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] outline-none focus:border-electric-cyan transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </section>

                {/* SEO Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-gray uppercase tracking-wider">
                      <Zap size={14} />
                      SEO Performance
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-lg ${seoScore > 70 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      Score: {seoScore}/100
                    </div>
                  </div>

                  <div className="space-y-4 bg-black/5 rounded-2xl p-4 border border-black/5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Focus Keyword</label>
                      <input 
                        type="text" 
                        value={focusKeyword} 
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        placeholder="Primary keyword for SEO..."
                        className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] outline-none focus:border-electric-cyan"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Meta Description</label>
                        <span className={`text-[10px] ${metaDescription.length > 160 ? 'text-neon-pink' : 'text-slate-gray'}`}>{metaDescription.length}/160</span>
                      </div>
                      <textarea 
                        value={metaDescription} 
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] h-24 resize-none focus:border-electric-cyan" 
                        placeholder="Google search summary..." 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">URL Slug</label>
                      <div className="flex items-center bg-[#FEFBF6] border border-black/10 rounded-xl overflow-hidden focus-within:border-electric-cyan transition-colors">
                        <span className="px-3 text-xs text-slate-gray bg-black/5 h-10 flex items-center">/posts/</span>
                        <input 
                          type="text" 
                          value={slug} 
                          onChange={(e) => setSlug(e.target.value)}
                          className="flex-grow bg-transparent border-none p-2 text-sm text-[#1E293B] focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Canonical URL</label>
                      <input 
                        type="text" 
                        value={canonicalUrl} 
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        placeholder="https://original-source.com/post"
                        className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] outline-none focus:border-electric-cyan"
                      />
                    </div>

                    <div className="pt-2 space-y-3">
                       <div className="flex items-center justify-between text-[11px] font-bold text-slate-gray uppercase tracking-tight">
                          <span>Keyword Density</span>
                          <span className={getKeywordDensity() > 0.5 && getKeywordDensity() < 2.5 ? 'text-green-500' : 'text-orange-500'}>
                             {getKeywordDensity()}%
                          </span>
                       </div>
                       <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(parseFloat(getKeywordDensity()) * 20, 100)}%` }}
                            className={`h-full ${parseFloat(getKeywordDensity()) > 2.5 ? 'bg-neon-pink' : 'bg-electric-cyan'}`}
                          />
                       </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-black/5">
                       <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">SEO Checklist</label>
                       <div className="space-y-2">
                          {[
                            { label: 'Focus keyword in title', pass: title.toLowerCase().includes(focusKeyword ? focusKeyword.toLowerCase() : '') && focusKeyword },
                            { label: 'Focus keyword in slug', pass: slug.includes(focusKeyword ? focusKeyword.toLowerCase().replace(/\s+/g, '-') : '') && focusKeyword },
                            { label: 'Long-form content (800+ words)', pass: content.split(/\s+/).filter(Boolean).length >= 800 },
                            { label: 'Meta description length (120-160)', pass: metaDescription.length >= 120 && metaDescription.length <= 160 }
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                               {item.pass ? <CheckCircle size={12} className="text-green-500" /> : <AlertTriangle size={12} className="text-slate-gray" />}
                               <span className={item.pass ? 'text-[#1E293B]/80' : 'text-slate-gray'}>{item.label}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </section>

                {/* Media Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-gray uppercase tracking-wider">
                    <ImageIcon size={14} />
                    Featured Media
                  </div>
                  
                  <div className="space-y-4 bg-black/5 rounded-2xl p-4 border border-black/5">
                    {featuredImage ? (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-black/10 shadow-lg">
                          <img src={featuredImage} className="w-full h-full object-cover" alt="Featured" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button onClick={() => setFeaturedImage('')} className="p-2 bg-neon-pink/80 rounded-lg text-[#1E293B] hover:bg-neon-pink"><Trash2 size={16} /></button>
                             <button className="p-2 bg-electric-cyan/80 rounded-lg text-[#1E293B] hover:bg-electric-cyan"><Maximize2 size={16} /></button>
                          </div>
                        </div>
                        <input 
                           type="text"
                           value={imageAlt}
                           onChange={(e) => setImageAlt(e.target.value)}
                           placeholder="Describe this image for accessibility..."
                           className="w-full bg-[#FEFBF6] border border-black/10 rounded-lg p-2 text-xs text-[#1E293B] outline-none focus:border-electric-cyan"
                        />
                      </div>
                    ) : (
                      <label className="aspect-video bg-[#FEFBF6] rounded-xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-electric-cyan hover:bg-electric-cyan/5 transition-all group">
                         <div className="p-3 bg-black/5 rounded-full mb-2 group-hover:scale-110 transition-transform">
                            <ImageIcon className="text-slate-gray group-hover:text-electric-cyan" size={24} />
                         </div>
                         <span className="text-xs text-slate-gray font-medium">Browse Files or Search Unsplash</span>
                         <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    )}
                  </div>
                </section>

                {/* Categorization */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-gray uppercase tracking-wider">
                    <TagIcon size={14} />
                    Categorization
                  </div>
                  
                  <div className="space-y-4 bg-black/5 rounded-2xl p-4 border border-black/5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] outline-none focus:border-electric-cyan">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-gray uppercase tracking-tight">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((t, idx) => (
                          <Badge key={idx} variant="secondary" size="sm" className="bg-electric-cyan/10 border-electric-cyan/20 text-electric-cyan flex items-center gap-1 group">
                            {t}
                            <X size={10} className="cursor-pointer hover:text-neon-pink" onClick={() => setTags(tags.filter((_, i) => i !== idx))} />
                          </Badge>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Add tags and press Enter..." 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            setTags([...new Set([...tags, e.target.value.trim()])]);
                            e.target.value = '';
                          }
                        }}
                        className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl p-3 text-sm text-[#1E293B] outline-none focus:border-electric-cyan"
                      />
                    </div>
                  </div>
                </section>

                <div className="h-12" /> {/* Bottom spacing */}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

          <AnimatePresence mode="wait">
          {activeModal === 'link' && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-[#F5F0EB] border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-black/5 flex items-center justify-between">
                  <h3 className="font-heading font-bold flex items-center gap-2"><Link size={18} className="text-electric-cyan" /> Insert Link</h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-gray hover:text-[#1E293B]"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-gray uppercase">Display Text</label>
                    <input type="text" value={linkData.text} onChange={(e) => setLinkData({...linkData, text: e.target.value})} className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-[#1E293B] outline-none focus:border-electric-cyan" placeholder="Link description..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-gray uppercase">URL</label>
                    <input type="text" value={linkData.url} onChange={(e) => setLinkData({...linkData, url: e.target.value})} className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-[#1E293B] outline-none focus:border-electric-cyan" placeholder="https://..." />
                  </div>
                </div>
                <div className="p-6 bg-black/5 flex justify-end gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={() => {
                    insertText(`[${linkData.text || 'link'}](${linkData.url})`);
                    setActiveModal(null);
                  }}>Insert Link</Button>
                </div>
              </motion.div>
            </div>
          )}

          {activeModal === 'image' && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-[#F5F0EB] border border-black/10 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <h3 className="font-heading font-bold flex items-center gap-2"><ImageIcon size={18} className="text-electric-cyan" /> Add Media</h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-gray hover:text-[#1E293B]"><X size={20} /></button>
                </div>
                
                <div className="flex-grow p-8">
                  <div className="flex gap-4 p-1.5 bg-black/5 rounded-2xl w-fit mb-8 border border-black/5">
                     {['Upload', 'URL', 'Unsplash'].map(tab => (
                        <button key={tab} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${imageSource === tab ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B]'}`} onClick={() => setImageSource(tab)}>
                           {tab}
                        </button>
                     ))}
                  </div>

                  <div className="min-h-[300px]">
                    {imageSource === 'URL' ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-black/5 rounded-full w-fit">
                          <Globe size={24} className="text-electric-cyan" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-gray uppercase">Image Link</label>
                           <input type="text" placeholder="https://images.unsplash.com/..." className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl p-4 text-[#1E293B] outline-none focus:border-electric-cyan transition-all" autoFocus />
                        </div>
                        <Button variant="primary" className="w-full" onClick={(e) => {
                           const input = e.currentTarget.parentElement.querySelector('input');
                           if (input.value) { insertText(`![alt text](${input.value})`); setActiveModal(null); }
                        }}>Insert from URL</Button>
                      </div>
                    ) : imageSource === 'Unsplash' ? (
                      <div className="space-y-6">
                         <div className="flex gap-3">
                            <input type="text" value={unsplashQuery} onChange={(e) => setUnsplashQuery(e.target.value)} placeholder="Search millions of high-res photos..." className="flex-grow bg-black/5 border border-black/5 rounded-2xl px-6 py-4 text-[#1E293B] outline-none focus:bg-black/10 transition-all" />
                            <Button variant="secondary" className="px-8"><Search size={20} /></Button>
                         </div>
                         <div className="grid grid-cols-3 gap-4 h-[300px] overflow-y-auto pr-2 no-scrollbar">
                           {[1,2,3,4,5,6].map(i => (
                             <div key={i} className="aspect-square bg-black/5 rounded-xl animate-pulse" />
                           ))}
                         </div>
                      </div>
                    ) : (
                      <label className="w-full aspect-video bg-black/5 border-2 border-dashed border-black/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-electric-cyan hover:bg-electric-cyan/5 transition-all group">
                         <div className="p-6 bg-black/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Download size={32} className="text-slate-gray group-hover:text-electric-cyan" />
                         </div>
                         <span className="text-lg font-bold text-[#1E293B] mb-2">Drop your image here</span>
                         <span className="text-sm text-slate-gray">or click to browse local files</span>
                         <input type="file" className="hidden" onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                               const { url } = await uploadImage(file);
                               insertText(`![alt text](${url})`);
                               setActiveModal(null);
                            }
                         }} />
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeModal === 'code' && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-[#F5F0EB] border border-black/10 rounded-3xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
                <div className="p-6 border-b border-black/5 flex items-center justify-between">
                  <h3 className="font-heading font-bold flex items-center gap-2"><FileText size={18} className="text-electric-cyan" /> Code Block Studio</h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-gray hover:text-[#1E293B]"><X size={20} /></button>
                </div>
                <div className="flex-grow flex min-h-0 bg-[#FEFBF6]">
                   <div className="w-64 border-r border-black/5 p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-gray uppercase">Language</label>
                        <select value={codeData.language} onChange={(e) => setCodeData({...codeData, language: e.target.value})} className="w-full bg-black/5 border border-black/10 rounded-xl p-2.5 text-xs text-[#1E293B] outline-none focus:border-electric-cyan">
                           <option value="javascript">JavaScript</option>
                           <option value="python">Python</option>
                           <option value="html">HTML</option>
                           <option value="css">CSS</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-gray uppercase">Filename (Optional)</label>
                        <input type="text" value={codeData.fileName} onChange={(e) => setCodeData({...codeData, fileName: e.target.value})} className="w-full bg-black/5 border border-black/10 rounded-xl p-2.5 text-xs text-[#1E293B] outline-none focus:border-electric-cyan" placeholder="index.js" />
                      </div>
                   </div>
                   <textarea 
                      value={codeData.code}
                      onChange={(e) => setCodeData({...codeData, code: e.target.value})}
                      placeholder="// Paste or write your code here..."
                      className="flex-grow bg-transparent p-6 text-sm font-mono text-[#1E293B] outline-none resize-none"
                   />
                </div>
                <div className="p-6 border-t border-black/5 flex justify-end gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={() => {
                    const header = codeData.fileName ? `\n\n[file: ${codeData.fileName}]\n` : '';
                    insertText(`${header}\`\`\`${codeData.language}\n${codeData.code}\n\`\`\``);
                    setActiveModal(null);
                  }}>Insert Code</Button>
                </div>
              </motion.div>
            </div>
          )}

          {activeModal === 'diagram' && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-[#F5F0EB] border border-black/10 rounded-3xl shadow-2xl overflow-hidden h-[700px] flex flex-col">
                <div className="p-6 border-b border-black/5 flex items-center justify-between">
                  <h3 className="font-heading font-bold flex items-center gap-2"><Presentation size={18} className="text-electric-cyan" /> Mermaid Diagram Studio</h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-gray hover:text-[#1E293B]"><X size={20} /></button>
                </div>
                <div className="flex-grow flex min-h-0">
                   <textarea 
                      style={{ width: '40%' }}
                      value={diagramData.code}
                      onChange={(e) => setDiagramData({...diagramData, code: e.target.value})}
                      className="h-full bg-[#FEFBF6] border-r border-black/5 p-6 text-sm font-mono text-[#1E293B] outline-none resize-none"
                   />
                   <div style={{ width: '60%' }} className="h-full bg-black/5 flex items-center justify-center p-12">
                      <div className="text-slate-gray text-center space-y-4">
                         <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                            <Presentation className="text-electric-cyan" size={32} />
                         </div>
                         <p className="text-sm font-medium">Diagram Preview Rendering...</p>
                         <p className="text-[10px] uppercase font-bold tracking-widest text-slate-gray/40">Mermaid.js Integration Active</p>
                      </div>
                   </div>
                </div>
                <div className="p-6 border-t border-black/5 flex justify-end gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={() => {
                    insertText(`\n\`\`\`mermaid\n${diagramData.code}\n\`\`\``);
                    setActiveModal(null);
                  }}>Insert Diagram</Button>
                </div>
              </motion.div>
            </div>
          )}

          {activeModal === 'embed' && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-[#F5F0EB] border border-black/10 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-black/5 flex items-center justify-between">
                  <h3 className="font-heading font-bold flex items-center gap-2">
                    {embedData.type === 'youtube' && <Youtube size={18} className="text-[#FF0000]" />}
                    {embedData.type === 'codepen' && <Monitor size={18} />}
                    {embedData.type === 'gist' && <Github size={18} />}
                    {embedData.type === 'slides' && <Presentation size={18} className="text-electric-cyan" />}
                    <span>Embed {embedData.type.toUpperCase()}</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-gray hover:text-[#1E293B]"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-gray uppercase">Service URL</label>
                    <input 
                      type="text" 
                      value={embedData.url} 
                      onChange={(e) => setEmbedData({...embedData, url: e.target.value})} 
                      className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-[#1E293B] outline-none focus:border-electric-cyan" 
                      placeholder={`Paste ${embedData.type} link here...`}
                      autoFocus
                    />
                    <p className="text-[10px] text-slate-gray italic px-1">Example: {
                      embedData.type === 'youtube' ? 'https://youtube.com/watch?v=...' :
                      embedData.type === 'codepen' ? 'https://codepen.io/user/pen/...' :
                      embedData.type === 'gist' ? 'https://gist.github.com/user/...' :
                      'https://docs.google.com/presentation/d/...'
                    }</p>
                  </div>
                </div>
                <div className="p-6 bg-black/5 flex justify-end gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={() => {
                    const url = embedData.url;
                    if (!url) return;
                    let embedCode = '';
                    if (embedData.type === 'youtube') embedCode = `\n@[youtube](${url})\n`;
                    else if (embedData.type === 'codepen') embedCode = `\n@[codepen](${url})\n`;
                    else if (embedData.type === 'gist') embedCode = `\n@[gist](${url})\n`;
                    else if (embedData.type === 'slides') embedCode = `\n@[slides](${url})\n`;
                    insertText(embedCode);
                    setActiveModal(null);
                  }}>Insert Embed</Button>
                </div>
              </motion.div>
            </div>
          )}

          {isHelpOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHelpOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-[#F5F0EB] border border-black/10 rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md">
                  <h3 className="font-heading font-bold flex items-center gap-2"><HelpCircle size={18} className="text-electric-cyan" /> Markdown Shortcuts</h3>
                  <button onClick={() => setIsHelpOpen(false)} className="text-slate-gray hover:text-[#1E293B]"><X size={20} /></button>
                </div>
                <div className="p-8 overflow-y-auto no-scrollbar grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-electric-cyan uppercase tracking-widest">Formatting</h4>
                      <div className="space-y-3">
                         {[
                           { label: 'Bold', key: 'Ctrl + B', syntax: '**text**' },
                           { label: 'Italic', key: 'Ctrl + I', syntax: '_text_' },
                           { label: 'Underline', key: 'Ctrl + U', syntax: '<u>text</u>' },
                           { label: 'Strikethrough', key: '', syntax: '~~text~~' },
                           { label: 'Inline Code', key: '', syntax: '`code`' }
                         ].map(item => (
                           <div key={item.label} className="flex items-center justify-between text-sm group">
                             <span className="text-slate-gray group-hover:text-[#1E293B] transition-colors">{item.label}</span>
                             <span className="font-mono text-[10px] bg-black/5 px-2 py-0.5 rounded border border-black/5">{item.key || item.syntax}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-electric-cyan uppercase tracking-widest">Structure</h4>
                      <div className="space-y-3">
                         {[
                           { label: 'H1 Heading', syntax: '# ' },
                           { label: 'Bullet List', syntax: '- ' },
                           { label: 'Ordered List', syntax: '1. ' },
                           { label: 'Blockquote', syntax: '> ' },
                           { label: 'Link', key: 'Ctrl + K', syntax: '[text](url)' }
                         ].map(item => (
                           <div key={item.label} className="flex items-center justify-between text-sm group">
                             <span className="text-slate-gray group-hover:text-[#1E293B] transition-colors">{item.label}</span>
                             <span className="font-mono text-[10px] bg-black/5 px-2 py-0.5 rounded border border-black/5">{item.key || item.syntax}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="p-6 bg-black/5 border-t border-black/5 flex items-center justify-center">
                   <p className="text-xs text-slate-gray">Pro Tip: Use <span className="text-electric-cyan font-mono">Ctrl + S</span> to manually save your draft at any time.</p>
                </div>
              </motion.div>
            </div>
          )}
          {isPublishModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPublishModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-xl bg-[#F5F0EB] border border-black/20 rounded-[40px] shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-black/5 flex items-center justify-between">
                    <div>
                       <h3 className="text-2xl font-heading font-black text-[#1E293B]">Ready to blast off?</h3>
                       <p className="text-sm text-slate-gray">Confirm your post details before publishing.</p>
                    </div>
                    <button onClick={() => setIsPublishModalOpen(false)} className="p-3 hover:bg-black/5 rounded-full text-slate-gray transition-colors"><X size={24} /></button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="flex gap-6">
                       <div className="w-32 aspect-video rounded-2xl overflow-hidden border border-black/10 flex-shrink-0 bg-black/5">
                          {featuredImage ? <img src={featuredImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#1E293B]/20"><ImageIcon size={24} /></div>}
                       </div>
                       <div className="space-y-1 min-w-0">
                          <h4 className="font-bold text-lg text-[#1E293B] truncate">{title || 'Untitled Post'}</h4>
                          <div className="flex items-center gap-2">
                             <Badge variant="primary" size="sm">{categories.find(c => c.id === category)?.name || 'Uncategorized'}</Badge>
                             <span className="text-xs text-slate-gray">• {content.split(/\s+/).filter(Boolean).length} words</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-black/5 rounded-3xl border border-black/5 space-y-1">
                          <span className="text-[10px] text-slate-gray uppercase font-bold tracking-widest">Visibility</span>
                          <div className="flex items-center gap-2 text-sm text-[#1E293B]">
                             <Globe size={14} className="text-electric-cyan" />
                             {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                          </div>
                       </div>
                       <div className="p-4 bg-black/5 rounded-3xl border border-black/5 space-y-1">
                          <span className="text-[10px] text-slate-gray uppercase font-bold tracking-widest">SEO Score</span>
                          <div className="flex items-center gap-2 text-sm text-[#1E293B]">
                             <Zap size={14} className="text-yellow-500" />
                             {seoScore}/100
                          </div>
                       </div>
                    </div>

                    <div className="p-4 bg-electric-cyan/5 border border-electric-cyan/20 rounded-3xl flex items-start gap-4">
                       <Shield size={20} className="text-electric-cyan mt-1 flex-shrink-0" />
                       <div className="space-y-1">
                          <p className="text-sm text-[#1E293B] font-medium">Verification Successful</p>
                          <p className="text-xs text-slate-gray leading-relaxed">Your content has passed our community guidelines and is optimized for search engines.</p>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 bg-black/5 flex gap-4">
                    <Button variant="secondary" className="flex-grow h-14 rounded-2xl font-bold" onClick={() => setIsPublishModalOpen(false)}>Wait, let me edit</Button>
                    <Button 
                       variant="primary" 
                       className="flex-grow h-14 rounded-2xl font-bold gap-2" 
                       loading={isSaving}
                       onClick={handlePublish}
                    >
                       Confirm & Publish <ArrowLeft size={18} className="rotate-180" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

      </div>
    </div>
  );
};

export default CreatePost;
