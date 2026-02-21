import { supabase } from '../config/supabase.js';

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return defaults or create generic
        return res.json({
            site_name: 'TechScribe',
            site_tagline: 'A Modern Tech Blog',
            primary_color: '#64FFDA',
            accent_color: '#8B5CF6'
        });
      }
      throw error;
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// PUT /api/settings (Admin)
export const updateSettings = async (req, res) => {
  const updates = req.body;
  
  try {
    // Check if settings row exists, if not insert, else update
    // We assume single row for settings
    const { data: existing } = await supabase.from('settings').select('id').single();

    let result;
    if (existing) {
        result = await supabase
            .from('settings')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', existing.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from('settings')
            .insert([updates])
            .select()
            .single();
    }

    if (result.error) throw result.error;

    res.json(result.data);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};
