import type { FoodStickerTemplate, LevelConfig } from '../types';

// 等级配置
export const levelConfigs: Record<number, LevelConfig> = {
  1: { color: 'text-green-600', bgColor: 'bg-green-100', label: '低' },
  2: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: '中' },
  3: { color: 'text-red-600', bgColor: 'bg-red-100', label: '高' },
};

// 食物emoji图标映射
export const foodEmojis: Record<string, string> = {
  coffee: '☕',
  milktea: '🧋',
  friedchicken: '🍗',
  salad: '🥗',
  beefnoodle: '🍜',
  sandwich: '🥪',
  hamburger: '🍔',
  pizza: '🍕',
  sushi: '🍣',
  cake: '🍰',
  icecream: '🍦',
  apple: '🍎',
  banana: '🍌',
  dumpling: '🥟',
  rice: '🍚',
  egg: '🍳',
  milk: '🥛',
  bread: '🍞',
  fries: '🍟',
  cookie: '🍪',
  chocolate: '🍫',
  strawberry: '🍓',
  watermelon: '🍉',
  baozi: '🥟',
  soymilk: '🥛',
  soup: '🍲',
  tea: '🍵',
  cola: '🥤',
  juice: '🧃',
  hotdog: '🌭',
  friedrice: '🍛',
  noodle: '🍜',
  grape: '🍇',
  orange: '🍊',
  carrot: '🥕',
  tomato: '🍅',
  cucumber: '🥒',
  potato: '🥔',
  lettuce: '🥬',
  cabbage: '🥬',
  durian: '🥭',
  kiwi: '🥝',
  tangerine: '🍊',
  malatang: '🍲',
  hotpot: '🍲',
  ricenoodle: '🍜',
};

// 内置 AI 图片生成辅助函数
const getAIImagePath = (name: string) => {
  const prompt = encodeURIComponent(`cute kawaii ${name}, natural realistic food colors, 8-bit pixel art style, minimal shading, tiny dot eyes and smiling mouth directly on the food or bowl, no extra head, simple rounded shapes, small brown feet, pure solid white background only, NO black background, NO dark background, retro video game aesthetic, jellycat style, isolated on white canvas`);
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${prompt}&image_size=square`;
};

export const foodTemplates: FoodStickerTemplate[] = [
  // 早餐
  { id: 'sandwich', name: '三明治', icon: getAIImagePath('三明治'), category: 'breakfast', tags: ['西式', '面包'], glutenLevel: 3, giLevel: 2 },
  { id: 'milk', name: '牛奶', icon: getAIImagePath('牛奶'), category: 'breakfast', tags: ['饮品'], glutenLevel: 1, giLevel: 2 },
  { id: 'egg', name: '煎蛋', icon: getAIImagePath('煎蛋'), category: 'breakfast', tags: ['蛋类'], glutenLevel: 1, giLevel: 1 },
  { id: 'bread', name: '面包', icon: getAIImagePath('面包'), category: 'breakfast', tags: ['烘焙'], glutenLevel: 3, giLevel: 2 },
  { id: 'soymilk', name: '豆浆', icon: getAIImagePath('豆浆'), category: 'breakfast', tags: ['中式', '饮品'], glutenLevel: 1, giLevel: 1 },
  { id: 'baozi', name: '包子', icon: getAIImagePath('包子'), category: 'breakfast', tags: ['中式', '面食'], glutenLevel: 3, giLevel: 2 },
  
  // 午餐/晚餐
  { id: 'beefnoodle', name: '牛肉面', icon: getAIImagePath('牛肉面'), category: 'lunch', tags: ['中式', '面食', '热食'], glutenLevel: 3, giLevel: 2 },
  { id: 'rice', name: '米饭', icon: getAIImagePath('米饭'), category: 'lunch', tags: ['主食'], glutenLevel: 1, giLevel: 3 },
  { id: 'dumpling', name: '饺子', icon: getAIImagePath('饺子'), category: 'lunch', tags: ['中式', '面食'], glutenLevel: 3, giLevel: 2 },
  { id: 'friedrice', name: '炒饭', icon: getAIImagePath('炒饭'), category: 'lunch', tags: ['中式', '主食'], glutenLevel: 2, giLevel: 3 },
  { id: 'hamburger', name: '汉堡', icon: getAIImagePath('汉堡'), category: 'lunch', tags: ['西式', '快餐'], glutenLevel: 3, giLevel: 2 },
  { id: 'pizza', name: '披萨', icon: getAIImagePath('披萨'), category: 'lunch', tags: ['西式', '烘焙'], glutenLevel: 3, giLevel: 2 },
  { id: 'sushi', name: '寿司', icon: getAIImagePath('寿司'), category: 'lunch', tags: ['日式'], glutenLevel: 2, giLevel: 2 },
  { id: 'salad', name: '沙拉', icon: getAIImagePath('沙拉'), category: 'lunch', tags: ['轻食', '蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'friedchicken', name: '炸鸡', icon: getAIImagePath('炸鸡'), category: 'lunch', tags: ['肉类', '油炸'], glutenLevel: 2, giLevel: 1 },
  { id: 'noodle', name: '面条', icon: getAIImagePath('面条'), category: 'lunch', tags: ['面食'], glutenLevel: 3, giLevel: 2 },
  
  // 加餐/零食
  { id: 'cake', name: '蛋糕', icon: getAIImagePath('蛋糕'), category: 'snack', tags: ['甜点', '烘焙'], glutenLevel: 3, giLevel: 3 },
  { id: 'apple', name: '苹果', icon: getAIImagePath('苹果'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  { id: 'banana', name: '香蕉', icon: getAIImagePath('香蕉'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 2 },
  { id: 'coffee', name: '咖啡', icon: getAIImagePath('咖啡'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 1 },
  { id: 'milktea', name: '奶茶', icon: getAIImagePath('奶茶'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 3 },
  { id: 'icecream', name: '冰淇淋', icon: getAIImagePath('冰淇淋'), category: 'snack', tags: ['甜点'], glutenLevel: 1, giLevel: 3 },
  { id: 'cookie', name: '饼干', icon: getAIImagePath('饼干'), category: 'snack', tags: ['烘焙'], glutenLevel: 3, giLevel: 3 },
  { id: 'chocolate', name: '巧克力', icon: getAIImagePath('巧克力'), category: 'snack', tags: ['甜点'], glutenLevel: 1, giLevel: 2 },
  { id: 'fries', name: '薯条', icon: getAIImagePath('薯条'), category: 'snack', tags: ['快餐', '油炸'], glutenLevel: 1, giLevel: 3 },
  { id: 'hotdog', name: '热狗', icon: getAIImagePath('热狗'), category: 'snack', tags: ['快餐'], glutenLevel: 3, giLevel: 2 },
  
  // 蔬菜水果
  { id: 'carrot', name: '胡萝卜', icon: getAIImagePath('胡萝卜'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 2 },
  { id: 'tomato', name: '西红柿', icon: getAIImagePath('西红柿'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'grape', name: '葡萄', icon: getAIImagePath('葡萄'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 2 },
  { id: 'watermelon', name: '西瓜', icon: getAIImagePath('西瓜'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 3 },
  { id: 'strawberry', name: '草莓', icon: getAIImagePath('草莓'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  { id: 'orange', name: '橙子', icon: getAIImagePath('橙子'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  
  // 新增蔬菜
  { id: 'cucumber', name: '黄瓜', icon: getAIImagePath('黄瓜'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'potato', name: '土豆', icon: getAIImagePath('土豆'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 3 },
  { id: 'lettuce', name: '生菜', icon: getAIImagePath('生菜'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'cabbage', name: '白菜', icon: getAIImagePath('白菜'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  
  // 新增水果
  { id: 'durian', name: '榴莲', icon: getAIImagePath('榴莲'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 3 },
  { id: 'kiwi', name: '猕猴桃', icon: getAIImagePath('猕猴桃'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  { id: 'tangerine', name: '橘子', icon: getAIImagePath('橘子'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 2 },
  { id: 'pear', name: '梨', icon: getAIImagePath('梨'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  
  // 新增主食
  { id: 'ricenoodle', name: '米线', icon: getAIImagePath('米线'), category: 'lunch', tags: ['中式', '面食'], glutenLevel: 2, giLevel: 2 },
  { id: 'potatonoodle', name: '土豆粉', icon: getAIImagePath('土豆粉'), category: 'lunch', tags: ['中式', '面食'], glutenLevel: 2, giLevel: 3 },
  
  // 晚餐
  { id: 'malatang', name: '麻辣烫', icon: getAIImagePath('麻辣烫'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'hotpot', name: '火锅', icon: getAIImagePath('火锅'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'soup', name: '汤', icon: getAIImagePath('汤'), category: 'dinner', tags: ['热食'], glutenLevel: 1, giLevel: 1 },
  { id: 'bbq', name: '烧烤', icon: getAIImagePath('烧烤'), category: 'dinner', tags: ['中式', '肉类'], glutenLevel: 1, giLevel: 1 },
  { id: 'grilledfish', name: '烤鱼', icon: getAIImagePath('烤鱼'), category: 'dinner', tags: ['中式', '鱼类'], glutenLevel: 1, giLevel: 1 },
  { id: 'stirfry', name: '炒菜', icon: getAIImagePath('炒菜'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'braised', name: '炖菜', icon: getAIImagePath('炖菜'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'congee', name: '砂锅粥', icon: getAIImagePath('砂锅粥'), category: 'dinner', tags: ['中式', '主食'], glutenLevel: 1, giLevel: 2 },
  { id: 'lamian', name: '拉面', icon: getAIImagePath('拉面'), category: 'dinner', tags: ['中式', '面食'], glutenLevel: 3, giLevel: 2 },
  
  // 饮品汤品
  { id: 'juice', name: '果汁', icon: getAIImagePath('果汁'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 3 },
  { id: 'tea', name: '茶', icon: getAIImagePath('茶'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 1 },
  { id: 'cola', name: '可乐', icon: getAIImagePath('可乐'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 3 },
];

export const categoryLabels: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

export const categoryColors: Record<string, string> = {
  breakfast: 'bg-yellow-400',
  lunch: 'bg-red-400',
  dinner: 'bg-teal-400',
  snack: 'bg-green-400',
};
