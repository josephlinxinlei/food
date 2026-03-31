import https from 'https';

const url = `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=apple&image_size=square`;

const options = {
  method: 'GET',
  headers: {
    'Origin': 'https://food-xxxx.vercel.app',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

const req = https.request(url, options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
