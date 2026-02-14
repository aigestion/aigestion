const https = require('https');

const data = JSON.stringify({
  message: 'Hola Daniela, ¿estás operativa?',
  sessionId: 'debug-session-' + Date.now(),
  userId: 'debug-admin',
});

const dataBuffer = Buffer.from(data);

const options = {
  hostname: 'aigestion.net',
  port: 443,
  path: '/api/v1/daniela/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': dataBuffer.length,
  },
};

console.log('Testing Daniela API at https://aigestion.net/api/v1/daniela/chat...');

const req = https.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  let body = '';
  res.on('data', chunk => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', e => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
