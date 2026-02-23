import axios from 'axios';

/**
 * Test Nested Swarm Mission
 * Verifies that a job can have a parent_job_id
 */
async function testNestedMission() {
    const API_URL = 'http://localhost:8000'; // Assume Python engine is here
    
    console.log('1. Creating Parent Mission...');
    const parentResponse = await axios.post(`${API_URL}/swarm/trigger`, {
        mission_description: "Parent Mission: Orchestrate Project Unification"
    });
    const parentJobId = parentResponse.data.job_id;
    console.log(`Parent Job ID: ${parentJobId}`);

    console.log('2. Creating Child Mission linked to Parent...');
    const childResponse = await axios.post(`${API_URL}/swarm/trigger`, {
        mission_description: "Child Mission: Audit website-epic videos",
        metadata: {
            parent_job_id: parentJobId
        }
    });
    const childJobId = childResponse.data.job_id;
    console.log(`Child Job ID: ${childJobId}`);

    console.log('3. Verifying Child Job hierarchy...');
    const statusResponse = await axios.get(`${API_URL}/jobs/${childJobId}`);
    const jobData = statusResponse.data;
    
    if (jobData.parent_job_id === parentJobId) {
        console.log('SUCCESS: Child job correctly linked to parent!');
    } else {
        console.error('FAILED: Child job NOT linked to parent. Found:', jobData.parent_job_id);
        process.exit(1);
    }
}

testNestedMission().catch(err => {
    console.error('Test Failed:', err.message);
    process.exit(1);
});
