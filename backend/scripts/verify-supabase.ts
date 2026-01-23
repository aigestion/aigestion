import { supabaseService } from '../src/services/supabase.service';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

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
