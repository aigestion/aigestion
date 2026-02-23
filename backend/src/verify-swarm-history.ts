import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api/v1';

async function verifySwarmHistory() {
  console.log('🚀 Verifying Swarm History Integration...');

  try {
    // 1. Fetch current history
    console.log('Fetching current mission history...');
    const historyRes = await axios.get(`${BACKEND_URL}/swarm/history`);

    if (historyRes.data.success) {
      console.log('✅ Successfully fetched history.');
      console.log(`Current events count: ${historyRes.data.data.history?.length || 0}`);
    } else {
      console.error('❌ Failed to fetch history:', historyRes.data);
    }

    // 2. Trigger a small mission to generate a new event
    console.log('\nTriggering a test mission to generate a new event...');
    const triggerRes = await axios.post(`${BACKEND_URL}/ai/prompt`, {
      prompt: "SWARM_TEST: Just checking if you can hear me. Respond with 'Loud and clear'.",
    });

    if (triggerRes.data.success) {
      console.log('✅ Test prompt sent successfully.');

      // Wait a bit for persistence
      console.log('Waiting for event persistence (3s)...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 3. Fetch history again
      console.log('Fetching updated mission history...');
      const updatedHistoryRes = await axios.get(`${BACKEND_URL}/swarm/history`);

      if (updatedHistoryRes.data.success) {
        const history = updatedHistoryRes.data.data.history || [];
        console.log(`✅ Successfully fetched updated history. Events count: ${history.length}`);

        if (history.length > 0) {
          const latest = history[history.length - 1];
          console.log('\nLatest Event:');
          console.log(`- From: ${latest.sender}`);
          // console.log(`- To: ${latest.receiver}`);
          console.log(`- Type: ${latest.type}`);
          console.log(`- Content: ${latest.content.substring(0, 50)}...`);
        }
      }
    }
  } catch (error: any) {
    console.error('❌ Verification failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

verifySwarmHistory();
