#!/usr/bin/env node

/**
 * GitHub Pages Status Checker
 */

const axios = require('axios');
require('dotenv').config();

async function checkGitHubPages() {
  try {
    const response = await axios.get('https://api.github.com/repos/aigestion/aigestion/pages', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    console.log('📄 Estado GitHub Pages:');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   URL: ${response.data.html_url}`);
    console.log(`   Custom Domain: ${response.data.cname || 'None'}`);
    console.log(`   HTTPS: ${response.data.https_enforced ? 'Enforced' : 'Not enforced'}`);
    console.log(`   Build Type: ${response.data.build_type || 'Automatic'}`);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
  }
}

checkGitHubPages();
