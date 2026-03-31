import { useState } from 'react';
import { X, Clock, Wheat, Droplets } from 'lucide-react';
import { foodTemplates, categoryLabels, levelConfigs } from '../data/foodTemplates';
import type { FoodRecord } from '../types';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: FoodRecord) => void;
  date: string;
}

// 等级指示器组件
function LevelIndicator({ level, type, showLabel = false }: { level: number; type: 'gluten' | 'gi'; showLabel?: boolean }) {
  const config = levelConfigs[level];
  const Icon = type === 'gluten' ? Wheat : Droplets;
  const label = type === 'gluten' ? '麸质' : '升糖';
  
  return (
    <div className="flex items-center gap-1">
      <div 
        className={`w-5 h-5 rounded-full flex items-center justify-center ${config.bgColor}`}
        title={`${label}: ${config.label}`}
      >
        <Icon className={`w-3 h-3 ${config.color}`} />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500">{label}</span>
      )}
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
      <span className={`flex items-center justify-center ${className}`}>
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
        filter: 'contrast(1.1)'
      }}
      onError={() => setError(true)}
    />
  );
}

export function AddFoodModal({ isOpen, onClose, onAdd, date }: AddFoodModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(foodTemplates[0]);
  const [customName, setCustomName] = useState('');
  const [category, setCategory] = useState<string>('breakfast');
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredTemplates = foodTemplates.filter(
    (t) =>
      t.name.includes(searchTerm) ||
      t.tags.some((tag) => tag.includes(searchTerm))
  );

  const handleSubmit = () => {
    const food: FoodRecord = {
      id: `food-${Date.now()}`,
      name: customName || selectedTemplate.name,
      icon: selectedTemplate.icon,
      category: category as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      time,
      date,
    };
    onAdd(food);
    onClose();
    // Reset form
    setCustomName('');
    setSearchTerm('');
  };

  const categories = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  // Check if icon is an image path (URL or local path) or emoji
  const isImagePath = (icon: string) => icon.startsWith('http') || icon.startsWith('/');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">添加食物</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              搜索食物
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="输入食物名称..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Food Icons Grid */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择图标
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setCategory(template.category);
                  }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all p-1
                    ${selectedTemplate.id === template.id
                      ? 'bg-orange-100 ring-2 ring-orange-400'
                      : 'hover:bg-white'
                    }`}
                  title={template.name}
                >
                  {isImagePath(template.icon) ? (
                    <FoodImage 
                      src={template.icon}
                      alt={template.name}
                      className="w-8 h-8 mb-1"
                    />
                  ) : (
                    <span className="text-xl mb-1">{template.icon}</span>
                  )}
                  {/* Level indicators */}
                  <div className="flex items-center gap-0.5">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${levelConfigs[template.glutenLevel].bgColor}`}>
                      <Wheat className={`w-2 h-2 ${levelConfigs[template.glutenLevel].color}`} />
                    </div>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${levelConfigs[template.giLevel].bgColor}`}>
                      <Droplets className={`w-2 h-2 ${levelConfigs[template.giLevel].color}`} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Preview */}
          <div className="mb-4 p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center bg-white rounded-lg shadow-sm">
                {isImagePath(selectedTemplate.icon) ? (
                  <FoodImage 
                    src={selectedTemplate.icon}
                    alt={selectedTemplate.name}
                    className="w-12 h-12"
                  />
                ) : (
                  <span className="text-3xl">{selectedTemplate.icon}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{selectedTemplate.name}</div>
                <div className="text-xs text-gray-500 mb-1">{categoryLabels[selectedTemplate.category]}</div>
                {/* Level indicators with labels */}
                <div className="flex items-center gap-3">
                  <LevelIndicator level={selectedTemplate.glutenLevel} type="gluten" showLabel />
                  <LevelIndicator level={selectedTemplate.giLevel} type="gi" showLabel />
                </div>
              </div>
            </div>
          </div>

          {/* Custom Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              食物名称
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={selectedTemplate.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              餐别
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${category === cat
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              时间
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-orange-400 text-white font-bold rounded-xl hover:bg-orange-500 transition-colors"
          >
            放到货架上
          </button>
        </div>
      </div>
    </div>
  );
}
