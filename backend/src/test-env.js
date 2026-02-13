const dotenvSafe = require('dotenv-safe');
const path = require('path');

try {
  dotenvSafe.config({
    path: path.resolve(__dirname, '../../.env'),
    example: path.resolve(__dirname, '../../.env.example'),
    allowEmptyValues: true,
  });
  console.log('✅ .env validation passed!');
} catch (error) {
  console.error('❌ .env validation failed:');
  console.error(error.message);
  process.exit(1);
}
