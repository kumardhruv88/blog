import { supabase } from '../config/supabase.js';

// GET /api/tags
export const getTags = async (req, res) => {
  try {
    const { limit, search } = req.query;
    let query = supabase.from('tags').select('*');
    
    if (search) query = query.ilike('name', `%${search}%`);
    if (limit) query = query.limit(parseInt(limit));
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// GET /api/tags/:slug
export const getTagBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase.from('tags').select('*').eq('slug', slug).single();
        if (error) throw error;
        res.json(data);
    } catch (e) { res.status(404).json({ message: 'Tag not found' }); }
};

// GET /api/tags/popular
export const getPopularTags = async (req, res) => {
  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('posts_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular tags' });
  }
};

// POST /api/tags/merge (Admin)
export const mergeTags = async (req, res) => {
  const { sourceTagId, destinationTagId } = req.body;

  if (!sourceTagId || !destinationTagId) {
    return res.status(400).json({ message: 'Source and destination tag IDs are required' });
  }

  try {
    // 1. Move all post associations from source to destination
    // We use a transaction-like approach or just direct updates
    // Note: Some posts might already have the destination tag, so we might encounter unique constraint errors on primary key (post_id, tag_id)
    // We can handle this by deleting the source associations that would cause conflict first.
    
    // Get post IDs that already have the destination tag
    const { data: existingDestinationPosts } = await supabase
      .from('post_tags')
      .select('post_id')
      .eq('tag_id', destinationTagId);
    
    const postIdsToSkip = existingDestinationPosts?.map(p => p.post_id) || [];

    // Delete source associations for those posts (they already have the destination tag)
    if (postIdsToSkip.length > 0) {
      await supabase
        .from('post_tags')
        .delete()
        .eq('tag_id', sourceTagId)
        .in('post_id', postIdsToSkip);
    }

    // Update remaining source associations to destination
    const { error: updateError } = await supabase
      .from('post_tags')
      .update({ tag_id: destinationTagId })
      .eq('tag_id', sourceTagId);

    if (updateError) throw updateError;

    // 2. Delete the source tag
    const { error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('id', sourceTagId);

    if (deleteError) throw deleteError;

    // 3. Recalculate posts_count for destination tag
    const { count } = await supabase
      .from('post_tags')
      .select('post_id', { count: 'exact', head: true })
      .eq('tag_id', destinationTagId);

    await supabase
      .from('tags')
      .update({ posts_count: count || 0 })
      .eq('id', destinationTagId);

    res.json({ message: 'Tags merged successfully' });
  } catch (error) {
    console.error('Error merging tags:', error);
    res.status(500).json({ message: 'Error merging tags' });
  }
};


// PUT /api/tags/:id (Admin)
export const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    try {
        const { data, error } = await supabase.from('tags').update({ name, slug }).eq('id', id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (e) { res.status(500).json({ message: 'Error updating tag' }); }
};

// DELETE /api/tags/:id (Admin)
export const deleteTag = async (req, res) => {
    const { id } = req.params;
    try {
        await supabase.from('tags').delete().eq('id', id);
        res.json({ message: 'Tag deleted' });
    } catch (e) { res.status(500).json({ message: 'Error deleting tag' }); }
};
