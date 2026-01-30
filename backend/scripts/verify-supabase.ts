import { supabaseService } from '../src/services/supabase.service';
import { logger } from '../src/utils/logger';

async function verify() {
  logger.info('Testing Supabase Connection...');
  const success = await supabaseService.testConnection();
  if (success) {
    logger.info('✅ SUPABASE CONNECTION SUCCESSFUL');
    process.exit(0);
  } else {
    logger.error('❌ SUPABASE CONNECTION FAILED');
    process.exit(1);
  }
}

verify().catch(err => {
  logger.error('Unexpected error:', err);
  process.exit(1);
});
