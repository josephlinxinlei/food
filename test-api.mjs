import https from 'https';
import fs from 'fs';

const prompt = encodeURIComponent("apple, flat vector style, pure white background, 2D");
const url = `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${prompt}&image_size=square`;

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  const file = fs.createWriteStream('test-apple.png');
  res.pipe(file);
  file.on('finish', () => {
    console.log('Done');
    file.close();
  });
});
