#!/usr/bin/env node

/**
 * 食物图片下载脚本
 * 从AI图片服务下载所有食物图片并保存到本地
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 食物图片URL配置（使用透明背景提示词）
const foodImages = {
  coffee: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20coffee%20cup%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20brown%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  milktea: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20bubble%20tea%20cup%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20beige%20and%20brown%20colors%2C%20simple%20shapes%2C%20boba%20pearls%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  friedchicken: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20fried%20chicken%20drumstick%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20golden%20brown%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  salad: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20salad%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20green%20colors%2C%20simple%20shapes%2C%20fresh%20vegetables%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  beefnoodle: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20beef%20noodle%20soup%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20brown%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  sandwich: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20sandwich%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20colorful%20and%20vibrant%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  hamburger: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20hamburger%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20brown%20yellow%20and%20green%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  pizza: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20pizza%20slice%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20yellow%20red%20and%20green%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  sushi: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20sushi%20roll%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20white%20pink%20and%20black%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  cake: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20cake%20slice%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20pink%20and%20white%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  icecream: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20ice%20cream%20cone%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20pastel%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  apple: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20red%20apple%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  banana: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20banana%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20yellow%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  dumpling: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20dumplings%20jiaozi%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20white%20colors%2C%20simple%20shapes%2C%20happy%20faces%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  rice: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20rice%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20white%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  egg: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20fried%20egg%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20yellow%20and%20white%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  milk: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20milk%20carton%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20blue%20and%20white%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  bread: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20bread%20loaf%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20golden%20brown%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  fries: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20french%20fries%20box%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20yellow%20and%20red%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  cookie: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20cookie%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20brown%20colors%2C%20simple%20shapes%2C%20chocolate%20chips%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  chocolate: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20chocolate%20bar%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20brown%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  strawberry: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20strawberry%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20green%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  watermelon: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20watermelon%20slice%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20green%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  baozi: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20steamed%20bun%20baozi%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20white%20and%20pink%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  soymilk: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20soy%20milk%20cup%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20beige%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  soup: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20soup%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20warm%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  tea: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20tea%20cup%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20green%20and%20white%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  cola: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20soda%20can%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20silver%20colors%2C%20simple%20shapes%2C%20bubbles%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  juice: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20juice%20glass%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20orange%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  hotdog: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20hot%20dog%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20pink%20and%20brown%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  friedrice: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20fried%20rice%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20golden%20yellow%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  noodle: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20noodles%20in%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20yellow%20colors%2C%20simple%20shapes%2C%20chopsticks%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  grape: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20grapes%20bunch%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20purple%20colors%2C%20simple%20shapes%2C%20happy%20faces%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  orange: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20orange%20fruit%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20orange%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  carrot: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20carrot%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20orange%20and%20green%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  tomato: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20tomato%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20green%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  cucumber: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20cucumber%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20green%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  potato: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20potato%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20brown%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  lettuce: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20lettuce%20leaf%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20green%20colors%2C%20simple%20shapes%2C%20friendly%20smile%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  cabbage: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20chinese%20cabbage%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20white%20and%20green%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  durian: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20durian%20fruit%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20yellow%20and%20green%20colors%2C%20simple%20shapes%2C%20friendly%20expression%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  kiwi: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20kiwi%20fruit%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20brown%20and%20green%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  tangerine: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20tangerine%20mandarin%20orange%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20orange%20colors%2C%20simple%20shapes%2C%20happy%20face%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  malatang: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20malatang%20hot%20pot%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20colorful%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  hotpot: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20hot%20pot%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20red%20and%20colorful%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
  ricenoodle: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=Cute%20kawaii%20rice%20noodles%20bowl%20sticker%2C%20cartoon%20style%2C%20flat%20design%2C%20transparent%20background%2C%20PNG%20format%2C%20white%20and%20red%20colors%2C%20simple%20shapes%2C%20steam%20rising%2C%20food%20illustration%2C%20sticker%20art%2C%20minimalist&image_size=square',
};

// 输出目录
const outputDir = path.join(__dirname, '..', 'public', 'food-images');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 下载单个图片
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename);
    
    // 如果文件已存在，跳过
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${filename} 已存在，跳过`);
      resolve();
      return;
    }
    
    console.log(`下载 ${filename}...`);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ ${filename} 下载完成`);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // 处理重定向
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`  重定向到: ${redirectUrl}`);
          downloadImage(redirectUrl, filename).then(resolve).catch(reject);
        } else {
          reject(new Error(`重定向但没有location头`));
        }
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 主函数
async function main() {
  console.log('开始下载食物图片...\n');
  
  const entries = Object.entries(foodImages);
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < entries.length; i++) {
    const [name, url] = entries[i];
    const filename = `${name}.png`;
    
    try {
      await downloadImage(url, filename);
      success++;
    } catch (err) {
      console.error(`✗ ${filename} 下载失败:`, err.message);
      failed++;
    }
    
    // 添加延迟，避免请求过快
    if (i < entries.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  console.log(`\n下载完成: ${success} 成功, ${failed} 失败`);
  console.log(`图片保存在: ${outputDir}`);
}

main().catch(console.error);
