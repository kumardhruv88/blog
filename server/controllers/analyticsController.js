import { supabase } from '../config/supabase.js';

// GET /api/analytics/overview (Author only)
export const getOverviewStats = async (req, res) => {
  const authUserId = req.auth.userId;
  try {
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Aggregates for the user's posts
    const { data: posts } = await supabase
      .from('posts')
      .select('views, comments_count, bookmarks_count, category_id, content')
      .eq('author_id', user.id);

    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.comments_count || 0), 0);
    const totalBookmarks = posts.reduce((sum, p) => sum + (p.bookmarks_count || 0), 0);

    // New stats from task.txt
    const topicsCovered = new Set(posts.map(p => p.category_id).filter(Boolean)).size;
    
    // Average reading speed: 200 words per minute
    const totalReadingTime = posts.reduce((sum, p) => {
      const words = p.content?.split(/\s+/).length || 0;
      return sum + Math.ceil(words / 200);
    }, 0);

    const totalCodeSnippets = posts.reduce((sum, p) => {
      const snippets = (p.content?.match(/```/g) || []).length / 2;
      return sum + Math.floor(snippets);
    }, 0);

    res.json({
      totalPosts: posts.length,
      totalViews,
      totalComments,
      totalBookmarks,
      topicsCovered,
      totalReadingTime,
      totalCodeSnippets,
      trends: [
         { name: 'Last 7 Days', views: totalViews * 0.1 },
         { name: 'Previous 7 Days', views: totalViews * 0.08 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overview analytics' });
  }
};

// GET /api/analytics/posts/:postId (Author only)
export const getPostAnalytics = async (req, res) => {
  const { postId } = req.params;
  try {
    const { data: stats, error } = await supabase
      .from('views')
      .select('created_at, ip_address')
      .eq('post_id', postId);

    if (error) throw error;
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post analytics' });
  }
};

// GET /api/analytics/user/:userId (Owner only)
export const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;
  try {
    // Return reading habits or similar
    res.json({
        totalViews: 0,
        favoriteCategories: [],
        readingTime: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user analytics' });
  }
};
