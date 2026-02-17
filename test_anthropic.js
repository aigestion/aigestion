const axios = require("axios");

const key = "sk-ant-api03-K9unlKt7OacW18Or8glhqj4whvTfBmUoyPXT_9v-WPCConC0wXctE22VEoWycac0IU1S3ZecSyEc..";

async function testAnthropic() {
    console.log(`Testing Anthropic Key...`);
    try {
        const response = await axios.post("https://api.anthropic.com/v1/messages", {
            model: "claude-3-haiku-20240307",
            max_tokens: 10,
            messages: [{ role: "user", content: "Say 'Active'" }]
        }, {
            headers: {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
        });
        console.log(`✅ SUCCESS: ${response.data.content[0].text}`);
    } catch (e) {
        console.error(`❌ FAILED: ${e.response ? JSON.stringify(e.response.data) : e.message}`);
    }
}

testAnthropic();
