import { supabase } from '../config/supabase.js';

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// GET /api/categories/:slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    res.json(category);
  } catch (error) {
    res.status(404).json({ message: 'Category not found' });
  }
};

// POST /api/categories (Admin)
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, color, icon } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug, description, color, icon })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
};

// PUT /api/categories/reorder (Admin)
export const reorderCategories = async (req, res) => {
  try {
    const { items } = req.body; // e.g. [{id: 1, display_order: 1}, ...]
    
    // Supabase JS doesn't have bulk update easily for different values per row without RPC
    // Iterating for now (not atomic but functional)
    for (const item of items) {
       await supabase.from('categories').update({ display_order: item.display_order }).eq('id', item.id);
    }

    res.json({ message: 'Categories reordered' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering categories' });
  }
};

// DELETE /api/categories/:id (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// PUT /api/categories/:id (Admin)
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
        if (error) throw error;
        res.json(data);
    } catch (e) { res.status(500).json({ message: 'Error updating category' }); }
};
