import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';

async function test() {
  console.log('Removing background...');
  try {
    const blob = await removeBackground('public/food-images/apple.png');
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('test-apple-nobg.png', buffer);
    console.log('Success!');
  } catch (err) {
    console.error('Failed:', err);
  }
}
test();
