const { GoogleGenerativeAI } = require("@google/generative-ai");

const keys = [
    "AIzaSyBpVnT9h05o96lhDTOAEQtWKZfGJHRrTZ4", // From sovereign_snapshot
    "AIzaSyCim3MiOaI2Szx3IxqrWNX8igZ5XKMD06Q", // From legacy
    "AIzaSyC4r_moHyNm8gfSmyqR1CAUesgZUZwMZ78", // From .env
    "AIzaSyAAxAjBY1pH0dBYNFjdfMDygJVwi6KezVo"  // From .gemini backup
];

async function testKeys() {
    for (const key of keys) {
        console.log(`\nTesting Key: ${key.substring(0, 10)}...${key.substring(key.length - 4)}`);
        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Say 'Active'");
            console.log(`✅ SUCCESS: ${result.response.text()}`);
            process.exit(0); // Exit on first success
        } catch (e) {
            console.error(`❌ FAILED: ${e.message}`);
        }
    }
}

testKeys();
