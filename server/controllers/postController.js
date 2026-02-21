import { supabase } from '../config/supabase.js';
import { logActivity } from '../utils/logger.js';

// GET /api/posts
// Params: page, limit, category, tag, author, search, status
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, author, search, status = 'published' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users(id, name, username, avatar_url),
        category:categories(id, name, slug, color),
        tags:post_tags(tag:tags(id, name, slug))
      `, { count: 'exact' });

    // Filters
    if (status !== 'all') query = query.eq('status', status);
    if (author) query = query.eq('author_id', author);
    if (category) query = query.eq('category_id', category); // category_id needs to be UUID
    if (search) query = query.ilike('title', `%${search}%`);

    // Pagination
    query = query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      posts: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(id, name, username, avatar_url, bio, twitter_url),
        category:categories(id, name, slug, color),
        tags:post_tags(tag:tags(id, name, slug))
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: 'Post not found' });
      throw error;
    }

    res.json(post);

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error fetching post' });
  }
};

// POST /api/posts
export const createPost = async (req, res) => {
  const { title, content, excerpt, cover_image_url, category_id, tags = [], status = 'draft' } = req.body;
  const authUserId = req.auth?.userId || 'user_demo_123'; 
  console.log('[CreatePost] Attempting to create post for user:', authUserId);

  try {

    // 1. Get internal user ID from Clerk ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', authUserId)
      .single();

    if (userError || !user) throw new Error('User not found');

    // 2. Generate Slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${slug}-${Date.now()}`; // Simple unique slug for now

    const { data: post, error: insertError } = await supabase
      .from('posts')
      .insert({
        title,
        slug: uniqueSlug,
        content,
        excerpt,
        cover_image_url,
        category_id: category_id || null,
        author_id: user.id,
        status,
        published_at: status === 'published' ? new Date() : null
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await logActivity('CREATE_POST', { postId: post.id, title }, authUserId, req.ip);

    res.status(201).json(post);

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    // Verify Author
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', id).single();
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();

    if (!post || !user || post.author_id !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    
    await logActivity('DELETE_POST', { postId: id }, authUserId, req.ip);

    res.json({ message: 'Post deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// PUT /api/posts/:id
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const authUserId = req.auth?.userId || 'user_demo_123';

  try {
    // Verify Author
    const { data: post } = await supabase.from('posts').select('author_id, slug').eq('id', id).single();
    const { data: user } = await supabase.from('users').select('id').eq('clerk_id', authUserId).single();

    if (!post || !user || post.author_id !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Filter updates
    const allowedFields = ['title', 'content', 'excerpt', 'cover_image_url', 'category_id', 'status'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        let value = updates[key];
        if (key === 'category_id' && value === '') value = null;
        obj[key] = value;
        return obj;
      }, {});
    
    filteredUpdates.updated_at = new Date();

    const { data: updatedPost, error } = await supabase
      .from('posts')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    await logActivity('UPDATE_POST', { postId: id }, authUserId, req.ip);

    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

// POST /api/posts/:id/view
export const incrementView = async (req, res) => {
  const { id } = req.params;
  try {
    await supabase.rpc('increment_post_view', { post_id_input: id });
    res.json({ message: 'View incremented' });
  } catch (error) {
    // Silent fail for stats often acceptable, but logging needed
    console.error(error);
    res.status(500).json({ message: 'Error incrementing view' });
  }
};

// GET /api/posts/:slug/related
export const getRelatedPosts = async (req, res) => {
  const { slug } = req.params; // This param can be ID or slug

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    let query = supabase.from('posts').select('category_id, id, slug');
    
    if (isUuid) {
      query = query.eq('id', slug);
    } else {
      query = query.eq('slug', slug);
    }

    const { data: current } = await query.single();
    if (!current) return res.status(404).json({ message: 'Post not found' });

    const { data: related } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(name, avatar_url),
        category:categories(name, slug, color)
      `)
      .eq('category_id', current.category_id)
      .neq('id', current.id)
      .eq('status', 'published')
      .limit(3);

    res.json(related);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).json({ message: 'Error fetching related posts' });
  }
};
// GET /api/posts/suggestions?q=...
export const getSearchSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug')
      .ilike('title', `%${q}%`)
      .eq('status', 'published')
      .limit(5);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
};
