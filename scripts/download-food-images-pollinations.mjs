#!/usr/bin/env node

/**
 * 使用 Pollinations.ai 免费API下载食物图片，并使用AI去除背景
 * 确保生成的图片是矢量图风格，且没有背景
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { removeBackground } from '@imgly/background-removal-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 所有食物列表 (从 src/data/foodTemplates.ts 提取)
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
  { id: 'ricenoodle', name: '米线' },
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

// 输出目录
const outputDir = path.join(__dirname, '..', 'public', 'food-images');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成 Pollinations.ai URL (强调矢量图、纯白背景)
function generatePollinationsUrl(name, seed = Math.floor(Math.random() * 1000)) {
  const prompt = `Cute kawaii ${name} sticker, pure solid white background, flat vector illustration, 2D graphic design, clean lines, no shading, minimal, isolated on white`;
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true`;
}

// 下载单个图片
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// 去除图片背景
async function processBackground(filepath) {
  try {
    const blob = await removeBackground(filepath);
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch (err) {
    console.error(`  ✗ 背景去除失败:`, err);
    return false;
  }
}

// 主函数
async function main() {
  console.log('开始使用AI生成食物图片 (矢量图风格) 并去除背景...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const food of foods) {
    const filename = `${food.id}.png`;
    const filepath = path.join(outputDir, filename);
    
    // 如果文件已存在，先删除（因为我们要重新生成去背景的）
    // 为了节省时间，如果你只想生成缺失的，可以注释掉这行
    // if (fs.existsSync(filepath)) {
    //   fs.unlinkSync(filepath);
    // }
    
    if (fs.existsSync(filepath)) {
      console.log(`✓ [${food.name}] 已存在，跳过`);
      continue;
    }

    console.log(`正在生成 [${food.name}]...`);
    
    try {
      const url = generatePollinationsUrl(food.name);
      
      // 1. 下载带白底的图片
      await downloadImage(url, filepath);
      
      // 2. 去除背景
      console.log(`  正在去除 [${food.name}] 的背景...`);
      const bgSuccess = await processBackground(filepath);
      
      if (bgSuccess) {
        console.log(`  ✓ [${food.name}] 处理成功`);
        successCount++;
      } else {
        failCount++;
      }
      
    } catch (error) {
      failCount++;
      console.error(`  ✗ [${food.name}] 错误: ${error.message}`);
    }
  }
  
  console.log(`\n任务完成: ${successCount} 成功, ${failCount} 失败`);
  console.log(`图片保存在: ${outputDir}`);
}

main();
