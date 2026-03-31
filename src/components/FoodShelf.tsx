import { useState } from 'react';
import { Plus, X, Clock, Utensils, Wheat, Droplets } from 'lucide-react';
import type { FoodRecord } from '../types';
import { categoryLabels, foodTemplates, levelConfigs } from '../data/foodTemplates';

interface FoodShelfProps {
  foods: FoodRecord[];
  onAddFood: () => void;
  onRemoveFood: (foodId: string) => void;
}

// 等级指示器组件
function LevelIndicator({ level, type }: { level: number; type: 'gluten' | 'gi' }) {
  const config = levelConfigs[level];
  const Icon = type === 'gluten' ? Wheat : Droplets;
  
  return (
    <div 
      className={`w-4 h-4 rounded-full flex items-center justify-center ${config.bgColor}`}
      title={`${type === 'gluten' ? '麸质' : '升糖指数'}: ${config.label}`}
    >
      <Icon className={`w-2.5 h-2.5 ${config.color}`} />
    </div>
  );
}

// 食物图片组件 - 带错误处理的图片显示
function FoodImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  
  // 根据食物名称返回对应的emoji
  const getEmoji = (name: string) => {
    const emojiMap: Record<string, string> = {
      '咖啡': '☕', '奶茶': '🧋', '炸鸡': '🍗', '沙拉': '🥗',
      '牛肉面': '🍜', '三明治': '🥪', '汉堡': '🍔', '披萨': '🍕',
      '寿司': '🍣', '蛋糕': '🍰', '冰淇淋': '🍦', '苹果': '🍎',
      '香蕉': '🍌', '饺子': '🥟', '米饭': '🍚', '煎蛋': '🍳',
      '牛奶': '🥛', '面包': '🍞', '薯条': '🍟', '饼干': '🍪',
      '巧克力': '🍫', '草莓': '🍓', '西瓜': '🍉', '包子': '🥟',
      '豆浆': '🥛', '汤': '🍲', '茶': '🍵', '可乐': '🥤',
      '果汁': '🧃', '热狗': '🌭', '炒饭': '🍛', '面条': '🍜',
      '葡萄': '🍇', '橙子': '🍊', '胡萝卜': '🥕', '西红柿': '🍅',
      '黄瓜': '🥒', '土豆': '🥔', '生菜': '🥬', '白菜': '🥬',
      '榴莲': '🥭', '猕猴桃': '🥝', '橘子': '🍊', '麻辣烫': '🍲',
      '火锅': '🍲', '米线': '🍜'
    };
    return emojiMap[name] || '🍽️';
  };
  
  if (error) {
    return (
      <span className={`flex items-center justify-center text-2xl ${className}`}>
        {getEmoji(alt)}
      </span>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt}
      className={`w-full h-full object-contain ${className}`}
      style={{ 
        mixBlendMode: 'multiply',
        filter: 'contrast(1.1)' // 稍微增加对比度，帮助过滤掉浅灰色的杂色背景
      }}
      onError={() => setError(true)}
    />
  );
}

// 时间排序函数
function sortByTime(a: FoodRecord, b: FoodRecord) {
  return a.time.localeCompare(b.time);
}

export function FoodShelf({ foods, onAddFood, onRemoveFood }: FoodShelfProps) {
  const [selectedFood, setSelectedFood] = useState<FoodRecord | null>(null);

  // Check if icon is an image path (URL or local path) or emoji
  const isImagePath = (icon: string) => icon.startsWith('http') || icon.startsWith('/');

  // Get food template by name
  const getFoodTemplate = (foodName: string) => {
    return foodTemplates.find(t => t.name === foodName);
  };

  // 按餐别分组并排序
  const breakfastFoods = foods.filter(f => f.category === 'breakfast').sort(sortByTime);
  const lunchFoods = foods.filter(f => f.category === 'lunch').sort(sortByTime);
  const dinnerFoods = foods.filter(f => f.category === 'dinner').sort(sortByTime);
  const snackFoods = foods.filter(f => f.category === 'snack').sort(sortByTime);

  const columns = [
    { key: 'breakfast', label: '早餐', foods: breakfastFoods, icon: '🌅' },
    { key: 'lunch', label: '午餐', foods: lunchFoods, icon: '☀️' },
    { key: 'dinner', label: '晚餐', foods: dinnerFoods, icon: '🌙' },
    { key: 'snack', label: '加餐', foods: snackFoods, icon: '🍿' },
  ];

  const renderFoodItem = (food: FoodRecord) => {
    const template = getFoodTemplate(food.name);
    return (
      <button
        key={food.id}
        onClick={() => setSelectedFood(selectedFood?.id === food.id ? null : food)}
        className="relative group transition-transform hover:scale-110 w-full"
      >
        <div className="w-14 h-14 mx-auto flex items-center justify-center">
          {isImagePath(food.icon) ? (
            <FoodImage 
              src={food.icon}
              alt={food.name}
              className="w-12 h-12"
            />
          ) : (
            <span className="text-4xl filter drop-shadow-md">{food.icon}</span>
          )}
        </div>
        
        {/* Food Name */}
        <div className="text-center mt-1">
          <span className="text-xs text-amber-900 font-medium">{food.name}</span>
        </div>
        
        {/* Level Indicators Row */}
        {template && (
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <LevelIndicator level={template.glutenLevel} type="gluten" />
            <LevelIndicator level={template.giLevel} type="gi" />
          </div>
        )}
        
        {/* Time */}
        <div className="text-center mt-0.5">
          <span className="text-[10px] text-amber-700/60">{food.time}</span>
        </div>
        
        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFood(food.id);
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 text-white rounded-full 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     transition-opacity shadow-sm"
        >
          <X className="w-3 h-3" />
        </button>
      </button>
    );
  };

  return (
    <div className="relative">
      {/* Shelf Container */}
      <div 
        className="rounded-2xl p-4 shadow-inner"
        style={{ 
          backgroundColor: '#F5E6D3',
          boxShadow: 'inset 0 2px 8px rgba(139, 105, 20, 0.15)'
        }}
      >
        {foods.length === 0 ? (
          <div className="text-center py-12 text-amber-700/60">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-sm">货架空空如也</p>
            <p className="text-xs mt-1">点击下方 + 添加食物</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {columns.map((column) => (
              <div key={column.key} className="flex flex-col">
                {/* Column Header */}
                <div className="text-center mb-2 pb-2 border-b-2 border-amber-300/50">
                  <span className="text-lg">{column.icon}</span>
                  <div className="text-xs font-bold text-amber-800 mt-1">{column.label}</div>
                  <div className="text-[10px] text-amber-600/60">{column.foods.length} 个</div>
                </div>
                
                {/* Add Button - 放在上方 */}
                <button
                  onClick={onAddFood}
                  className="mb-2 w-full py-2 rounded-lg border-2 border-dashed border-amber-400 
                           flex flex-col items-center justify-center text-amber-600
                           hover:bg-amber-100/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">添加</span>
                </button>
                
                {/* Food Items - 限制高度，可滚动 */}
                <div 
                  className="flex-1 space-y-3 overflow-y-auto"
                  style={{ maxHeight: '320px' }}
                >
                  {column.foods.map(renderFoodItem)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Food Detail Popup */}
      {selectedFood && (
        <div 
          className="absolute z-20 bg-white rounded-xl shadow-xl p-3 min-w-[160px]"
          style={{ 
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 flex items-center justify-center">
              {isImagePath(selectedFood.icon) ? (
                <FoodImage 
                  src={selectedFood.icon}
                  alt={selectedFood.name}
                  className="w-8 h-8"
                />
              ) : (
                <span className="text-2xl">{selectedFood.icon}</span>
              )}
            </div>
            <span className="font-bold text-gray-800">{selectedFood.name}</span>
          </div>
          
          {/* Level Info */}
          {(() => {
            const template = getFoodTemplate(selectedFood.name);
            if (!template) return null;
            return (
              <div className="flex items-center gap-3 mb-2 px-1">
                <div className="flex items-center gap-1">
                  <LevelIndicator level={template.glutenLevel} type="gluten" />
                  <span className="text-xs text-gray-500">麸质</span>
                </div>
                <div className="flex items-center gap-1">
                  <LevelIndicator level={template.giLevel} type="gi" />
                  <span className="text-xs text-gray-500">升糖</span>
                </div>
              </div>
            );
          })()}
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Utensils className="w-3 h-3" />
              <span>{categoryLabels[selectedFood.category]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{selectedFood.time}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedFood(null)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 text-white rounded-full 
                     flex items-center justify-center hover:bg-gray-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
