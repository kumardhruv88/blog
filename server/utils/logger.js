import { supabase } from '../config/supabase.js';

/**
 * Log an activity to the database.
 * @param {string} action - The action name (e.g., 'CREATE_POST', 'DELETE_USER')
 * @param {object} details - JSON details of the action
 * @param {string} clerkUserId - The Clerk ID of the user performing the action
 * @param {string} ip - IP address
 */
export const logActivity = async (action, details, clerkUserId = null, ip = null) => {
  try {
    let admin_id = null;
    if (clerkUserId) {
      const { data: user } = await supabase.from('users').select('id').eq('clerk_id', clerkUserId).single();
      admin_id = user?.id;
    }

    await supabase.from('activity_logs').insert({
      action,
      details,
      admin_id,
      ip_address: ip
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
