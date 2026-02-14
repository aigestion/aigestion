try {
  console.log('Resolving ts-jest:', require.resolve('ts-jest'));
  console.log('ts-jest found successfully.');
} catch (e) {
  console.error('ts-jest NOT found:', e.message);
  process.exit(1);
}
