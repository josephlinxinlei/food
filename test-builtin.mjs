import https from 'https';

const url = `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=apple&image_size=square`;

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
