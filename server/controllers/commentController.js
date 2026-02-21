import { supabase } from '../config/supabase.js';
import { logActivity } from '../utils/logger.js';

// GET /api/comments/post/:postId
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(id, name, username, avatar_url),
        replies:comments(
           *,
           author:users(id, name, username, avatar_url)
        )
      `)
      .eq('post_id', postId)
      .is('parent_comment_id', null) // Fetch top-level comments; replies are fetched via relation or separate recursion if needed
      .order('created_at', { ascending: true }); // Oldest first for chronological discussion

    if (error) throw error;

    res.json(comments);

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// POST /api/comments
export const createComment = async (req, res) => {
  const { content, post_id, parent_comment_id } = req.body;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    // 1. Get User ID
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!user) return res.status(401).json({ message: 'User not found' });

    // 2. Insert Comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content,
        post_id,
        author_id: user.id,
        parent_comment_id: parent_comment_id || null
      })
      .select(`*, author:users(id, name, username, avatar_url)`)
      .single();

    if (error) throw error;

    await logActivity('CREATE_COMMENT', { commentId: comment.id, postId: post_id }, authUserId, req.ip);

    // 3. Increment post comment count (Trigger is better, but manual update for now)
    await supabase.rpc('increment_comments_count', { post_id_input: post_id }); 
    
    res.status(201).json(comment);

  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

// DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    // Check ownership
    const { data: comment } = await supabase.from('comments').select('author_id').eq('id', id).single();
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();

    if (!comment || !user || comment.author_id !== user.id) {
       // Also allow Admins to delete (logic to be added)
       return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data: commentData } = await supabase.from('comments').select('post_id').eq('id', id).single();
    
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;

    if (commentData?.post_id) {
       await supabase.rpc('decrement_comments_count', { post_id_input: commentData.post_id });
    }

    await logActivity('DELETE_COMMENT', { commentId: id }, authUserId, req.ip);


    res.json({ message: 'Comment deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

// PUT /api/comments/:id
export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    const { data: comment } = await supabase.from('comments').select('author_id').eq('id', id).single();

    if (!comment || !user || comment.author_id !== user.id) {
       return res.status(403).json({ message: 'Unauthorized' });
    }

    const { data: updated, error } = await supabase
       .from('comments')
       .update({ content, updated_at: new Date() })
       .eq('id', id)
       .select()
       .single();

    if (error) throw error;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment' });
  }
};

// POST /api/comments/:id/like
export const likeComment = async (req, res) => {
  const { id } = req.params;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Check existing like
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', id)
      .eq('user_id', user.id)
      .single();

    if (existing) return res.status(400).json({ message: 'Already liked' });

    await supabase.from('comment_likes').insert({ comment_id: id, user_id: user.id });
    // Should ideally increment likes_count on comments table via trigger
    res.json({ message: 'Liked' });

  } catch (error) {
    res.status(500).json({ message: 'Error liking comment' });
  }
};

// DELETE /api/comments/:id/like
export const unlikeComment = async (req, res) => {
  const { id } = req.params;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!user) return res.status(401).json({ message: 'User not found' });

    await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', id)
      .eq('user_id', user.id);

    res.json({ message: 'Unliked' });

  } catch (error) {
    res.status(500).json({ message: 'Error unliking comment' });
  }
};
