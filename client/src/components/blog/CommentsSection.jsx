import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ThumbsUp, MoreHorizontal, User as UserIcon, Bold, Italic, Code, Link as LinkIcon, ChevronDown, Heart, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import ReactMarkdown from 'react-markdown';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';

const MOCK_COMMENTS = [
  {
    id: 1,
    user: { name: "Alice Dev", avatar: "https://ui-avatars.com/api/?name=Alice+Dev&background=random" },
    content: "This is a fantastic explanation! The part about flight payloads really clicked for me.",
    date: "2 hours ago",
    likes: 12,
    replies: []
  },
  {
    id: 2,
    user: { name: "Bob Smith", avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=random" },
    content: "Could you elaborate more on how this affects SEO? Does the crawler see the server HTML directly?",
    date: "5 hours ago",
    likes: 8,
    replies: [
      {
        id: 3,
        user: { name: "Dhruv", avatar: "https://ui-avatars.com/api/?name=Dhruv&background=2563EB&color=1E293B" },
        content: "Great question! Yes, since RSCs render on the server, the initial HTML sent to the client is fully populated, which is perfect for SEO.",
        date: "4 hours ago",
        likes: 5,
        isAuthor: true
      }
    ]
  }
];

const CommentForm = ({ user, onSubmit }) => {
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("write"); // write, preview
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${Math.max(80, textAreaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  const insertText = (before, after = "") => {
    const el = textAreaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end);
    const newText = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="mb-10">
      <div className="flex gap-4">
        <img src={user?.imageUrl || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full border border-black/10" alt="User" />
        <div className="flex-grow">
          <div className="glass-card-dark border-black/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-black/5 border-b border-black/5">
              <div className="flex gap-4">
                {['write', 'preview'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-black uppercase tracking-widest py-1 transition-all capitalize ${activeTab === tab ? 'text-electric-cyan border-b-2 border-electric-cyan' : 'text-slate-gray hover:text-[#1E293B]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === 'write' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => insertText('**', '**')} className="p-1.5 hover:bg-black/10 rounded-md text-slate-gray hover:text-[#1E293B] transition-all"><Bold size={14} /></button>
                  <button onClick={() => insertText('_', '_')} className="p-1.5 hover:bg-black/10 rounded-md text-slate-gray hover:text-[#1E293B] transition-all"><Italic size={14} /></button>
                  <button onClick={() => insertText('`', '`')} className="p-1.5 hover:bg-black/10 rounded-md text-slate-gray hover:text-[#1E293B] transition-all"><Code size={14} /></button>
                  <button onClick={() => insertText('[', '](url)')} className="p-1.5 hover:bg-black/10 rounded-md text-slate-gray hover:text-[#1E293B] transition-all"><LinkIcon size={14} /></button>
                </div>
              )}
            </div>
            <div className="p-4 bg-[#F5F0EB]/30">
              {activeTab === 'write' ? (
                <div className="relative">
                  <textarea
                    ref={textAreaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 1000))}
                    placeholder="What are your thoughts?"
                    className="w-full bg-transparent border-none outline-none text-[#1E293B] text-base leading-relaxed p-0 min-h-[80px] resize-none overflow-hidden"
                  />
                  <div className={`text-[10px] font-bold tracking-widest mt-4 text-right ${content.length > 900 ? 'text-neon-pink' : 'text-slate-gray/30'}`}>
                    {content.length} / 1000
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm min-h-[80px] text-slate-gray">
                  {content.trim() ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="italic opacity-50">Nothing to preview</p>}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <a href="https://commonmark.org/help/" target="_blank" rel="noreferrer" className="text-[10px] text-slate-gray hover:text-electric-cyan uppercase tracking-widest font-black transition-colors">Markdown Guide</a>
            <Button onClick={() => { onSubmit(content); setContent(""); }} disabled={!content.trim()} className="px-8">Post Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { fetchComments, createComment, likeComment, unlikeComment } from '../../services/api';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const getComments = async () => {
      if (!postId) return;
      try {
        setLoading(true);
        const data = await fetchComments(postId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };
    getComments();
  }, [postId]);

  const handleSubmit = async (content, parentId = null) => {
    try {
      const newComment = await createComment({
        post_id: postId,
        parent_id: parentId,
        content
      });
      
      if (parentId) {
        setComments(prev => prev.map(c => 
          c.id === parentId 
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        ));
      } else {
        setComments(prev => [newComment, ...prev]);
      }
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleLike = async (commentId) => {
    try {
      if (likedComments.has(commentId)) {
        await unlikeComment(commentId);
        setLikedComments(prev => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      } else {
        await likeComment(commentId);
        setLikedComments(prev => new Set(prev).add(commentId));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-3 text-[#1E293B]">
          Comments <span className="text-lg text-slate-gray font-normal">({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})</span>
        </h2>
        <select className="bg-transparent border border-black/10 rounded-lg px-3 py-1.5 text-sm text-slate-gray focus:border-electric-cyan outline-none">
          <option>Latest</option>
          <option>Top Rated</option>
          <option>Oldest</option>
        </select>
      </div>

      <Card className="p-8 bg-[#112240]/30 border-black/5 backdrop-blur-sm">
        <SignedIn>
          <CommentForm user={user} onSubmit={handleSubmit} />
        </SignedIn>

        <SignedOut>
          <div className="flex flex-col items-center justify-center p-8 bg-white/60 rounded-xl border border-black/10 text-center mb-10">
            <MessageSquare className="w-10 h-10 text-slate-gray mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-[#1E293B] mb-2">Join the conversation</h3>
            <p className="text-slate-gray mb-4">Sign in to leave a comment and interact with the community.</p>
            <SignInButton mode="modal">
              <Button>Sign In / Sign Up</Button>
            </SignInButton>
          </div>
        </SignedOut>

        <div className="space-y-8">
          {comments.map(comment => (
            <div key={comment.id} className="group">
              <div className="flex gap-4">
                <img src={comment.user.avatar} className="w-10 h-10 rounded-full border border-black/10" alt={comment.user.name} />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1E293B] hover:underline cursor-pointer transition-all">{comment.user.name}</span>
                      <span className="text-xs text-slate-gray">• {comment.date}</span>
                    </div>
                    <div className="relative group/menu">
                      <button className="text-slate-gray hover:text-[#1E293B] opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={16} /></button>
                      <div className="absolute right-0 top-full mt-2 w-32 bg-[#F5F0EB] border border-black/10 rounded-xl shadow-2xl py-2 z-30 hidden group-hover/menu:block">
                        <button onClick={() => { setDeletingComment(comment.id); setShowDeleteModal(true); }} className="w-full text-left px-4 py-2 text-xs font-bold text-neon-pink hover:bg-neon-pink/10 flex items-center gap-2">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-invert prose-sm text-slate-gray max-w-none mb-3">
                    <ReactMarkdown>{comment.content}</ReactMarkdown>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleLike(comment.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedComments.has(comment.id) ? 'text-neon-pink' : 'text-slate-gray hover:text-neon-pink'}`}
                    >
                      <motion.div whileTap={{ scale: 1.5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                        <Heart size={14} fill={likedComments.has(comment.id) ? "currentColor" : "none"} />
                      </motion.div>
                      {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className={`text-xs font-medium transition-colors font-bold uppercase tracking-widest ${replyingTo === comment.id ? 'text-electric-cyan' : 'text-slate-gray hover:text-[#1E293B]'}`}
                    >
                      Reply
                    </button>
                  </div>

                  {replyingTo === comment.id && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                      <CommentForm user={user} onSubmit={(content) => handleSubmit(content, comment.id)} />
                    </motion.div>
                  )}
                </div>
              </div>

              {comment.replies.length > 0 && (
                <div className="mt-6 ml-6 md:ml-14 space-y-6 relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-electric-cyan via-vibrant-purple to-transparent opacity-30" />
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex gap-4 group/reply">
                      <img src={reply.user.avatar} className="w-8 h-8 rounded-full border border-black/10" alt={reply.user.name} />
                      <div className="flex-grow">
                         <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-2">
                             <span className="font-bold text-[#1E293B] text-sm">{reply.user.name}</span>
                             {reply.isAuthor && <span className="px-1.5 py-0.5 gradient-brand text-[#1E293B] text-[9px] uppercase font-bold rounded shadow-[0_0_8px_rgba(100,255,218,0.4)]">Author</span>}
                             <span className="text-xs text-slate-gray">• {reply.date}</span>
                           </div>
                           <button onClick={() => { setDeletingComment(reply.id); setShowDeleteModal(true); }} className="text-slate-gray hover:text-neon-pink opacity-0 group-hover/reply:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                         </div>
                         <div className="prose prose-invert prose-sm text-slate-gray max-w-none"><ReactMarkdown>{reply.content}</ReactMarkdown></div>
                         <div className="flex items-center gap-4 mt-2">
                            <button 
                              onClick={() => toggleLike(reply.id)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedComments.has(reply.id) ? 'text-neon-pink' : 'text-slate-gray hover:text-neon-pink'}`}
                            >
                              <Heart size={12} fill={likedComments.has(reply.id) ? "currentColor" : "none"} /> 
                              {reply.likes + (likedComments.has(reply.id) ? 1 : 0)}
                            </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-10 pt-8 border-t border-black/5 flex justify-center">
             <Button variant="ghost" className="text-slate-gray hover:text-[#1E293B]">Load More Comments</Button>
          </div>
        </div>

        {/* Delete Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#F5F0EB] border border-black/10 p-8 rounded-3xl max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-heading font-black mb-4">Delete Comment?</h3>
                <p className="text-slate-gray mb-8">This action cannot be undone. Are you sure you want to permanently remove this comment?</p>
                <div className="flex gap-4">
                  <Button onClick={() => setShowDeleteModal(false)} variant="ghost" className="flex-grow">Cancel</Button>
                  <Button onClick={() => handleDelete(deletingComment)} className="flex-grow bg-neon-pink hover:bg-neon-pink/80 border-none">Delete</Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Card>
    </section>
  );
};

export default CommentsSection;
