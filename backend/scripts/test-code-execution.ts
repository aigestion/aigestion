import axios from 'axios';

async function test() {
  const url = 'http://localhost:3000/api/v1/code-execution/run';
  console.log('Testing Code Execution at:', url);

  try {
    const res = await axios.post(url, {
      language: 'python',
      code: 'print(sum([i for i in range(10)]))', // 0+..+9 = 45
    });
    console.log('Success!', res.data);
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
