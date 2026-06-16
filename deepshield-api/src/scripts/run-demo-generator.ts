import { generateDemoData } from '../utils/generateDemoData.js';

async function main() {
  try {
    await generateDemoData();
    process.exit(0);
  } catch (error) {
    console.error('Failed to generate demo data:', error);
    process.exit(1);
  }
}

main();
