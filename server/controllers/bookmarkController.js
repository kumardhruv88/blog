import { supabase } from '../config/supabase.js';

// GET /api/bookmarks
export const getBookmarks = async (req, res) => {
  const authUserId = req.auth.userId;
  try {
     // Get internal ID
     const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
     if (!user) return res.status(401).json({ message: 'User not found' });

     const { data: bookmarks, error } = await supabase
       .from('bookmarks')
       .select(`
         created_at,
         post:posts(*)
       `)
       .eq('user_id', user.id)
       .order('created_at', { ascending: false });

     if (error) throw error;
     res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
};

// POST /api/bookmarks/:postId (Toggle)
export const toggleBookmark = async (req, res) => {
  const { postId } = req.params;
  const authUserId = req.auth.userId;

  try {
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Check if exists
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();

    if (existing) {
      // Remove
      await supabase.from('bookmarks').delete().eq('id', existing.id);
      await supabase.rpc('decrement_bookmarks_count', { post_id_input: postId });
      res.json({ message: 'Bookmark removed', bookmarked: false });
    } else {
      // Add
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: postId });
      await supabase.rpc('increment_bookmarks_count', { post_id_input: postId });
      res.json({ message: 'Bookmark added', bookmarked: true });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error toggling bookmark' });
  }
};
