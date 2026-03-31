import { useState } from 'react';
import { Search, Filter, X, Calendar, Wheat, Droplets } from 'lucide-react';
import { useRecordStore } from '../store/recordStore';
import { categoryLabels, foodTemplates, levelConfigs } from '../data/foodTemplates';

interface StickerCollectionProps {
  onClose: () => void;
}

// 等级指示器组件
function LevelIndicator({ level, type }: { level: number; type: 'gluten' | 'gi' }) {
  const config = levelConfigs[level];
  const Icon = type === 'gluten' ? Wheat : Droplets;
  
  return (
    <div 
      className={`w-3 h-3 rounded-full flex items-center justify-center ${config.bgColor}`}
      title={`${type === 'gluten' ? '麸质' : '升糖指数'}: ${config.label}`}
    >
      <Icon className={`w-2 h-2 ${config.color}`} />
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
        filter: 'contrast(1.1)'
      }}
      onError={() => setError(true)}
    />
  );
}

export function StickerCollection({ onClose }: StickerCollectionProps) {
  const stickers = useRecordStore((state) => state.stickers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

  const filteredStickers = stickers.filter((sticker) => {
    const matchesSearch = sticker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sticker.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check if icon is an image path (URL or local path) or emoji
  const isImagePath = (icon: string) => icon.startsWith('http') || icon.startsWith('/');

  // Get food template by name
  const getFoodTemplate = (foodName: string) => {
    return foodTemplates.find(t => t.name === foodName);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <h3 className="text-lg font-bold text-gray-800">我的贴纸册</h3>
            <span className="text-sm text-gray-500">({stickers.length} 张)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索贴纸..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all
                  ${selectedCategory === cat
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat === 'all' ? '全部' : categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Sticker Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredStickers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p>还没有收集到贴纸</p>
              <p className="text-sm mt-1">去记录饮食生成贴纸吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {filteredStickers.map((sticker) => {
                const template = getFoodTemplate(sticker.name);
                return (
                  <div
                    key={sticker.id}
                    className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl 
                             border-2 border-amber-100 p-2 flex flex-col items-center justify-center
                             hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-1">
                      {isImagePath(sticker.icon) ? (
                        <FoodImage 
                          src={sticker.icon}
                          alt={sticker.name}
                          className="w-10 h-10"
                        />
                      ) : (
                        <span className="text-2xl">{sticker.icon}</span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-700 text-center truncate w-full">
                      {sticker.name}
                    </div>
                    {/* Level indicators */}
                    {template && (
                      <div className="flex items-center gap-1 mt-1">
                        <LevelIndicator level={template.glutenLevel} type="gluten" />
                        <LevelIndicator level={template.giLevel} type="gi" />
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(sticker.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          已收集 {filteredStickers.length} / {stickers.length} 张贴纸
        </div>
      </div>
    </div>
  );
}
