const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function verifySupabase() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  console.log('--- SUPABASE VERIFICATION ---');
  console.log('URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.log('Key:', supabaseKey ? 'SET' : 'MISSING');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Simple test: fetch one row from a common table or just auth check
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.warn(
        '⚠️ Fetch test failed (maybe users table does not exist), checking Auth connection...'
      );
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      console.log('✅ Auth connection successful');
    } else {
      console.log('✅ Database connectivity successful');
    }
  } catch (err) {
    console.error('❌ Supabase verification failed:', err.message);
  }
}

verifySupabase();
