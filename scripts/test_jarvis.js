const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5005';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const API_KEY = process.env.ML_SERVICE_API_KEY || 'LOCAL_DEV_SECRET_KEY_REPLACE_ME';
console.log(`   🔑 Using API Key ending in: ...${API_KEY.slice(-5)}`);

async function testJarvisLoop() {
    console.log("🎤 Testing Voice of God (Jarvis Mode)...");

    // 1. Verify ML Service Transcription
    console.log("\n1️⃣  Testing ML Service /transcribe...");
    try {
        // Create a dummy wav file if not exists
        const dummyWavPath = path.join(__dirname, 'test_audio.wav');
        if (!fs.existsSync(dummyWavPath)) {
            console.log("   Creating dummy WAV file...");
            // minimal wav header + silence
            const wavHeader = Buffer.from([
                0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20,
                0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00,
                0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00
            ]);
            fs.writeFileSync(dummyWavPath, wavHeader);
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(dummyWavPath));

        const res = await axios.post(`${ML_SERVICE_URL}/transcribe`, formData, {
            headers: {
                ...formData.getHeaders(),
                'x-api-key': API_KEY
            }
        });

        console.log("   ✅ Transcription Response:", res.data);
    } catch (error) {
        console.error("   ❌ Transcription Failed:", error.message);
        if (error.response) console.error("      Response:", error.response.data);
    }

    // 2. Mock full loop (simulating what EnhancedVoiceService does)
    console.log("\n2️⃣  Simulating Full Voice Pipeline (Daniela)...");
    // Since we can't easily call the private service directly from here without DI setup,
    // we will rely on the unit verification of step 1 and the code review of the service.
    // However, if we had a route exposed, we would call it here.

    console.log("   ⚠️  Full loop test requires Backend API endpoint. Skipping direct call.");
    console.log("   ℹ️  Manual verification: Speak to the frontend or check logs for 'Daniela' response generation.");

}

testJarvisLoop();
