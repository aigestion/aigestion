import axios from 'axios';

async function verifyTwiML() {
  console.log('🌌 [GOD LEVEL] Verifying Twilio Webhook Implementation...');

  try {
    const response = await axios.post('http://localhost:5000/api/v1/twilio/call-handler', {
      From: '+1234567890',
    });

    console.log('\nStatus:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('\nResponse Data:');
    console.log(response.data);

    if (response.data.includes('language="es-ES"') && response.data.includes('Say')) {
      console.log('\n✅ SUCCESS: TwiML is in Spanish and correctly formatted.');
    } else {
      console.log('\n❌ FAILURE: TwiML format or language is incorrect.');
    }
  } catch (error) {
    console.error('\n❌ ERROR: Could not connect to backend. Make sure it is running.');
  }
}

verifyTwiML();
