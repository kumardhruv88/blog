import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing Supabase...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Missing Supabase Credentials in .env');
  throw new Error('Missing Supabase URL or Service Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
