const https = require('https');

const token = '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';

const options = {
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'Authorization': `token ${token}`,
    'User-Agent': 'AIGestion-Verifier'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const user = JSON.parse(data);
      console.log(`✅ Token is VALID.`);
      console.log(`User: ${user.login}`);
      console.log(`Scopes: ${res.headers['x-oauth-scopes']}`);
    } else {
      console.log(`❌ Token is INVALID. Status: ${res.statusCode}`);
      console.log(`Message: ${data}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
