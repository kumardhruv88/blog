import { supabase } from '../config/supabase.js';

// POST /api/newsletter/subscribe
export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already subscribed' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Successfully subscribed to newsletter', data });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Server error during subscription' });
  }
};
