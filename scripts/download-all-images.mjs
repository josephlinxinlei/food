import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 食物列表
const foods = [
  { id: 'sandwich', name: '三明治' },
  { id: 'milk', name: '牛奶' },
  { id: 'egg', name: '煎蛋' },
  { id: 'bread', name: '面包' },
  { id: 'soymilk', name: '豆浆' },
  { id: 'baozi', name: '包子' },
  { id: 'beefnoodle', name: '牛肉面' },
  { id: 'rice', name: '米饭' },
  { id: 'dumpling', name: '饺子' },
  { id: 'friedrice', name: '炒饭' },
  { id: 'hamburger', name: '汉堡' },
  { id: 'pizza', name: '披萨' },
  { id: 'sushi', name: '寿司' },
  { id: 'salad', name: '沙拉' },
  { id: 'friedchicken', name: '炸鸡' },
  { id: 'noodle', name: '面条' },
  { id: 'cake', name: '蛋糕' },
  { id: 'apple', name: '苹果' },
  { id: 'banana', name: '香蕉' },
  { id: 'coffee', name: '咖啡' },
  { id: 'milktea', name: '奶茶' },
  { id: 'icecream', name: '冰淇淋' },
  { id: 'cookie', name: '饼干' },
  { id: 'chocolate', name: '巧克力' },
  { id: 'fries', name: '薯条' },
  { id: 'hotdog', name: '热狗' },
  { id: 'carrot', name: '胡萝卜' },
  { id: 'tomato', name: '西红柿' },
  { id: 'grape', name: '葡萄' },
  { id: 'watermelon', name: '西瓜' },
  { id: 'strawberry', name: '草莓' },
  { id: 'orange', name: '橙子' },
  { id: 'cucumber', name: '黄瓜' },
  { id: 'potato', name: '土豆' },
  { id: 'lettuce', name: '生菜' },
  { id: 'cabbage', name: '白菜' },
  { id: 'durian', name: '榴莲' },
  { id: 'kiwi', name: '猕猴桃' },
  { id: 'tangerine', name: '橘子' },
  { id: 'pear', name: '梨' },
  { id: 'ricenoodle', name: '米线' },
  { id: 'potatonoodle', name: '土豆粉' },
  { id: 'malatang', name: '麻辣烫' },
  { id: 'hotpot', name: '火锅' },
  { id: 'soup', name: '汤' },
  { id: 'bbq', name: '烧烤' },
  { id: 'grilledfish', name: '烤鱼' },
  { id: 'stirfry', name: '炒菜' },
  { id: 'braised', name: '炖菜' },
  { id: 'congee', name: '砂锅粥' },
  { id: 'lamian', name: '拉面' },
  { id: 'juice', name: '果汁' },
  { id: 'tea', name: '茶' },
  { id: 'cola', name: '可乐' }
];

const outputDir = path.join(__dirname, '..', 'public', 'food-images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function getUrl(name) {
  const prompt = encodeURIComponent(`cute kawaii ${name}, natural realistic food colors, 8-bit pixel art style, minimal shading, tiny dot eyes and smiling mouth directly on the food or bowl, no extra head, simple rounded shapes, small brown feet, pure solid white background only, NO black background, NO dark background, retro video game aesthetic, jellycat style, isolated on white canvas`);
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${prompt}&image_size=square`;
}

function httpsGetFollowRedirects(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // 如果是重定向，自动跟随
        httpsGetFollowRedirects(response.headers.location).then(resolve).catch(reject);
      } else if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
      } else {
        resolve(response);
      }
    }).on('error', reject);
  });
}

async function downloadImage(url, filepath) {
  try {
    const response = await httpsGetFollowRedirects(url);
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlinkSync(filepath);
        reject(err);
      });
    });
  } catch (err) {
    throw err;
  }
}

async function main() {
  console.log('开始下载缺失的图片...');
  let successCount = 0;
  let failCount = 0;
  
  for (const food of foods) {
    const filepath = path.join(outputDir, `${food.id}.png`);
    // 检查文件是否存在且大小大于0
    let fileExists = false;
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 0) {
        fileExists = true;
      }
    }
    
    if (fileExists) {
      continue;
    }
    
    console.log(`正在下载 [${food.name}]...`);
    try {
      await downloadImage(getUrl(food.name), filepath);
      console.log(`  ✓ 成功`);
      successCount++;
      // 加点延迟避免触发限流
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error(`  ✗ 失败: ${err.message}`);
      failCount++;
    }
  }
  console.log(`\n全部完成！成功: ${successCount}, 失败: ${failCount}`);
}

main();
