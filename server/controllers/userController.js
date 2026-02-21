import { supabase } from '../config/supabase.js';

// GET /api/users/:id
export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Try finding by internal ID or Clerk ID or Username
    // For now, let's assume 'id' can be either username or uuid
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);

    let query = supabase
      .from('users')
      .select('*');

    if (isUuid) {
      query = query.eq('id', id);
    } else if (isEmail) {
      query = query.eq('email', id);
    } else if (id.startsWith('user_')) {
      query = query.eq('clerk_id', id);
    } else {
      query = query.eq('username', id);
    }

    const { data: user, error } = await query.maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hide sensitive data if necessary (though most user data here is public)
    res.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// PUT /api/users/:id
// Protected route
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const authUserId = req.auth?.userId || 'user_demo_123'; // From Clerk

  try {
    // 1. Verify ownership: Get the user from DB to check Clerk ID
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('clerk_id')
      .eq('id', id)
      .single();

    if (fetchError || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.clerk_id !== authUserId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own profile' });
    }

    // 2. Perform Update
    // Whitelist allowed fields to prevent arbitrary column updates
    const allowedFields = ['name', 'bio', 'location', 'website', 'github_url', 'linkedin_url', 'twitter_url', 'theme', 'avatar_url', 'cover_image_url'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    filteredUpdates.updated_at = new Date();

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// GET /api/users/:id/stats
export const getUserStats = async (req, res) => {
  const { id } = req.params;
  // Implementation for fetching stats (could be aggregate queries)
  // For now, returning data from the user record wrapper or dedicated count queries
  
  try {
    // 1. Get the user's base stats
    const { data: userStats, error: statsError } = await supabase
      .from('users')
      .select('posts_count, views_count, followers_count, following_count')
      .eq('id', id)
      .single();
      
    if (statsError) throw statsError;

    // 2. Fetch the user's posts to calculate advanced stats
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('category_id, content, status')
      .eq('author_id', id);

    if (postsError) throw postsError;

    // Advanced stat calculations
    const publishedPosts = posts.filter(p => p.status === 'published');
    const topicsCovered = new Set(publishedPosts.map(p => p.category_id).filter(Boolean)).size;
    
    const totalReadingTime = publishedPosts.reduce((sum, p) => {
      const words = p.content?.split(/\s+/).length || 0;
      return sum + Math.ceil(words / 200);
    }, 0);

    const totalCodeSnippets = publishedPosts.reduce((sum, p) => {
      const snippets = (p.content?.match(/```/g) || []).length / 2;
      return sum + Math.floor(snippets);
    }, 0);
    
    res.json({
      ...userStats,
      posts_count: publishedPosts.length, // Override with real-time count
      topics_covered: topicsCovered,
      reading_time: totalReadingTime,
      code_snippets: totalCodeSnippets
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// POST /api/users/:id/follow
export const followUser = async (req, res) => {
  const targetUserId = req.params.id;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    const { data: follower } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!follower) return res.status(401).json({ message: 'User not found' });
    
    // Check if UUIDs are same
    if (follower.id === targetUserId) return res.status(400).json({ message: 'Cannot follow self' });

    const { error } = await supabase
      .from('followers')
      .insert({ follower_id: follower.id, following_id: targetUserId });

    if (error) {
        if (error.code === '23505') return res.status(400).json({ message: 'Already following' });
        throw error;
    }

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user' });
  }
};

// DELETE /api/users/:id/follow
export const unfollowUser = async (req, res) => {
  const targetUserId = req.params.id;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    const { data: follower } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!follower) return res.status(401).json({ message: 'User not found' });

    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', follower.id)
      .eq('following_id', targetUserId);

    if (error) throw error;

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user' });
  }
};

// GET /api/users/:id/followers
export const getUserFollowers = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('followers')
            .select('follower:users(id, name, username, avatar_url)')
            .eq('following_id', id);
        if (error) throw error;
        res.json(data.map(f => f.follower));
    } catch (e) { res.status(500).json({ message: 'Error fetching followers' }); }
};

// GET /api/users/:id/following
export const getUserFollowing = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('followers')
            .select('following:users(id, name, username, avatar_url)')
            .eq('follower_id', id);
        if (error) throw error;
        res.json(data.map(f => f.following));
    } catch (e) { res.status(500).json({ message: 'Error fetching following' }); }
};

// GET /api/users/:id/posts
export const getUserPosts = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', id)
            .eq('status', 'published')
            .order('published_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (e) { res.status(500).json({ message: 'Error fetching posts' }); }
};
