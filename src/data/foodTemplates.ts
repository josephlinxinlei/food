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

// 本地图片路径辅助函数
const getLocalImagePath = (id: string) => `/food-images/${id}.png`;

export const foodTemplates: FoodStickerTemplate[] = [
  // 早餐
  { id: 'sandwich', name: '三明治', icon: getLocalImagePath('sandwich'), category: 'breakfast', tags: ['西式', '面包'], glutenLevel: 3, giLevel: 2 },
  { id: 'milk', name: '牛奶', icon: getLocalImagePath('milk'), category: 'breakfast', tags: ['饮品'], glutenLevel: 1, giLevel: 2 },
  { id: 'egg', name: '煎蛋', icon: getLocalImagePath('egg'), category: 'breakfast', tags: ['蛋类'], glutenLevel: 1, giLevel: 1 },
  { id: 'bread', name: '面包', icon: getLocalImagePath('bread'), category: 'breakfast', tags: ['烘焙'], glutenLevel: 3, giLevel: 2 },
  { id: 'soymilk', name: '豆浆', icon: getLocalImagePath('soymilk'), category: 'breakfast', tags: ['中式', '饮品'], glutenLevel: 1, giLevel: 1 },
  { id: 'baozi', name: '包子', icon: getLocalImagePath('baozi'), category: 'breakfast', tags: ['中式', '面食'], glutenLevel: 3, giLevel: 2 },
  
  // 午餐/晚餐
  { id: 'beefnoodle', name: '牛肉面', icon: getLocalImagePath('beefnoodle'), category: 'lunch', tags: ['中式', '面食', '热食'], glutenLevel: 3, giLevel: 2 },
  { id: 'rice', name: '米饭', icon: getLocalImagePath('rice'), category: 'lunch', tags: ['主食'], glutenLevel: 1, giLevel: 3 },
  { id: 'dumpling', name: '饺子', icon: getLocalImagePath('dumpling'), category: 'lunch', tags: ['中式', '面食'], glutenLevel: 3, giLevel: 2 },
  { id: 'friedrice', name: '炒饭', icon: getLocalImagePath('friedrice'), category: 'lunch', tags: ['中式', '主食'], glutenLevel: 2, giLevel: 3 },
  { id: 'hamburger', name: '汉堡', icon: getLocalImagePath('hamburger'), category: 'lunch', tags: ['西式', '快餐'], glutenLevel: 3, giLevel: 2 },
  { id: 'pizza', name: '披萨', icon: getLocalImagePath('pizza'), category: 'lunch', tags: ['西式', '烘焙'], glutenLevel: 3, giLevel: 2 },
  { id: 'sushi', name: '寿司', icon: getLocalImagePath('sushi'), category: 'lunch', tags: ['日式'], glutenLevel: 2, giLevel: 2 },
  { id: 'salad', name: '沙拉', icon: getLocalImagePath('salad'), category: 'lunch', tags: ['轻食', '蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'friedchicken', name: '炸鸡', icon: getLocalImagePath('friedchicken'), category: 'lunch', tags: ['肉类', '油炸'], glutenLevel: 2, giLevel: 1 },
  { id: 'noodle', name: '面条', icon: getLocalImagePath('noodle'), category: 'lunch', tags: ['面食'], glutenLevel: 3, giLevel: 2 },
  
  // 加餐/零食
  { id: 'cake', name: '蛋糕', icon: getLocalImagePath('cake'), category: 'snack', tags: ['甜点', '烘焙'], glutenLevel: 3, giLevel: 3 },
  { id: 'apple', name: '苹果', icon: getLocalImagePath('apple'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  { id: 'banana', name: '香蕉', icon: getLocalImagePath('banana'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 2 },
  { id: 'coffee', name: '咖啡', icon: getLocalImagePath('coffee'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 1 },
  { id: 'milktea', name: '奶茶', icon: getLocalImagePath('milktea'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 3 },
  { id: 'icecream', name: '冰淇淋', icon: getLocalImagePath('icecream'), category: 'snack', tags: ['甜点'], glutenLevel: 1, giLevel: 3 },
  { id: 'cookie', name: '饼干', icon: getLocalImagePath('cookie'), category: 'snack', tags: ['烘焙'], glutenLevel: 3, giLevel: 3 },
  { id: 'chocolate', name: '巧克力', icon: getLocalImagePath('chocolate'), category: 'snack', tags: ['甜点'], glutenLevel: 1, giLevel: 2 },
  { id: 'fries', name: '薯条', icon: getLocalImagePath('fries'), category: 'snack', tags: ['快餐', '油炸'], glutenLevel: 1, giLevel: 3 },
  { id: 'hotdog', name: '热狗', icon: getLocalImagePath('hotdog'), category: 'snack', tags: ['快餐'], glutenLevel: 3, giLevel: 2 },
  
  // 蔬菜水果
  { id: 'carrot', name: '胡萝卜', icon: getLocalImagePath('carrot'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 2 },
  { id: 'tomato', name: '西红柿', icon: getLocalImagePath('tomato'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'grape', name: '葡萄', icon: getLocalImagePath('grape'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 2 },
  { id: 'watermelon', name: '西瓜', icon: getLocalImagePath('watermelon'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 3 },
  { id: 'strawberry', name: '草莓', icon: getLocalImagePath('strawberry'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  { id: 'orange', name: '橙子', icon: getLocalImagePath('orange'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  
  // 新增蔬菜
  { id: 'cucumber', name: '黄瓜', icon: getLocalImagePath('cucumber'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'potato', name: '土豆', icon: getLocalImagePath('potato'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 3 },
  { id: 'lettuce', name: '生菜', icon: getLocalImagePath('lettuce'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  { id: 'cabbage', name: '白菜', icon: getLocalImagePath('cabbage'), category: 'snack', tags: ['蔬菜'], glutenLevel: 1, giLevel: 1 },
  
  // 新增水果
  { id: 'durian', name: '榴莲', icon: getLocalImagePath('durian'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 3 },
  { id: 'kiwi', name: '猕猴桃', icon: getLocalImagePath('kiwi'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  { id: 'tangerine', name: '橘子', icon: getLocalImagePath('tangerine'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 2 },
  { id: 'pear', name: '梨', icon: getLocalImagePath('pear'), category: 'snack', tags: ['水果'], glutenLevel: 1, giLevel: 1 },
  
  // 新增主食
  { id: 'ricenoodle', name: '米线', icon: getLocalImagePath('ricenoodle'), category: 'lunch', tags: ['中式', '面食'], glutenLevel: 2, giLevel: 2 },
  { id: 'potatonoodle', name: '土豆粉', icon: getLocalImagePath('potatonoodle'), category: 'lunch', tags: ['中式', '面食'], glutenLevel: 2, giLevel: 3 },
  
  // 晚餐
  { id: 'malatang', name: '麻辣烫', icon: getLocalImagePath('malatang'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'hotpot', name: '火锅', icon: getLocalImagePath('hotpot'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'soup', name: '汤', icon: getLocalImagePath('soup'), category: 'dinner', tags: ['热食'], glutenLevel: 1, giLevel: 1 },
  { id: 'bbq', name: '烧烤', icon: getLocalImagePath('bbq'), category: 'dinner', tags: ['中式', '肉类'], glutenLevel: 1, giLevel: 1 },
  { id: 'grilledfish', name: '烤鱼', icon: getLocalImagePath('grilledfish'), category: 'dinner', tags: ['中式', '鱼类'], glutenLevel: 1, giLevel: 1 },
  { id: 'stirfry', name: '炒菜', icon: getLocalImagePath('stirfry'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'braised', name: '炖菜', icon: getLocalImagePath('braised'), category: 'dinner', tags: ['中式', '热食'], glutenLevel: 2, giLevel: 2 },
  { id: 'congee', name: '砂锅粥', icon: getLocalImagePath('congee'), category: 'dinner', tags: ['中式', '主食'], glutenLevel: 1, giLevel: 2 },
  { id: 'lamian', name: '拉面', icon: getLocalImagePath('lamian'), category: 'dinner', tags: ['中式', '面食'], glutenLevel: 3, giLevel: 2 },
  
  // 饮品汤品
  { id: 'juice', name: '果汁', icon: getLocalImagePath('juice'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 3 },
  { id: 'tea', name: '茶', icon: getLocalImagePath('tea'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 1 },
  { id: 'cola', name: '可乐', icon: getLocalImagePath('cola'), category: 'snack', tags: ['饮品'], glutenLevel: 1, giLevel: 3 },
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
