import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search, Filter, Grid3X3, Sparkles, X, Clock, Calendar } from 'lucide-react';
import { useRecordStore } from '../store/recordStore';
import { categoryLabels, foodTemplates, levelConfigs } from '../data/foodTemplates';
import { Wheat, Droplets } from 'lucide-react';

interface ExhibitionProps {
  onClose: () => void;
}

interface StickerWithPosition {
  id: string;
  name: string;
  icon: string;
  category: string;
  date: string;
  count: number;
  collected: boolean;
  glutenLevel: number;
  giLevel: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  rotation: number;
  targetX: number;
  targetY: number;
  targetRotation: number;
  targetScale: number;
  opacity: number;
  zIndex: number;
}

interface FoodHistory {
  date: string;
  time: string;
  category: string;
}

type ViewMode = 'gravity' | 'grid';

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

// 次数指示器组件 - 与等级指示器同样大小
function CountIndicator({ count }: { count: number }) {
  return (
    <div 
      className="w-4 h-4 rounded-full flex items-center justify-center bg-orange-400 text-white text-[10px] font-bold"
      title={`记录次数: ${count}`}
    >
      {count}
    </div>
  );
}

// 生成随机图形SVG
function RandomShape({ seed }: { seed: string }) {
  // 使用种子生成伪随机数
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star'];
  const shapeIndex = hash % shapes.length;
  const shape = shapes[shapeIndex];
  const colors = ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FFA07A', '#20B2AA', '#FF69B4'];
  const color = colors[hash % colors.length];
  
  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return <circle cx="32" cy="32" r="28" fill={color} />;
      case 'square':
        return <rect x="8" y="8" width="48" height="48" rx="8" fill={color} />;
      case 'triangle':
        return <polygon points="32,8 56,52 8,52" fill={color} />;
      case 'diamond':
        return <polygon points="32,8 56,32 32,56 8,32" fill={color} />;
      case 'hexagon':
        return <polygon points="32,8 52,20 52,44 32,56 12,44 12,20" fill={color} />;
      case 'star':
        return <polygon points="32,8 38,24 56,24 42,36 48,52 32,42 16,52 22,36 8,24 26,24" fill={color} />;
      default:
        return <circle cx="32" cy="32" r="28" fill={color} />;
    }
  };
  
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="opacity-60">
      {renderShape()}
    </svg>
  );
}

// 食物图片组件
function FoodImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  
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
      <span className={`flex items-center justify-center text-3xl ${className}`}>
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

// 打乱数组顺序
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Exhibition({ onClose }: ExhibitionProps) {
  const records = useRecordStore((state) => state.records);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('gravity');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [foodHistory, setFoodHistory] = useState<FoodHistory[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const stickersRef = useRef<StickerWithPosition[]>([]);
  const [renderStickers, setRenderStickers] = useState<StickerWithPosition[]>([]);

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

  const isImagePath = (icon: string) => icon.startsWith('http') || icon.startsWith('/');

  const getFoodTemplate = (foodName: string) => {
    return foodTemplates.find(t => t.name === foodName);
  };

  // 计算平铺布局位置
  const calculateGridPositions = (containerWidth: number, containerHeight: number, count: number) => {
    const cardWidth = 120;
    const cardHeight = 160;
    const gap = 24;
    const cols = Math.floor((containerWidth - gap) / (cardWidth + gap));
    const rows = Math.ceil(count / Math.max(cols, 1));
    
    const startX = (containerWidth - (Math.min(cols, count) * (cardWidth + gap) - gap)) / 2 + cardWidth / 2;
    const startY = (containerHeight - (rows * (cardHeight + gap) - gap)) / 2 + cardHeight / 2;
    
    return { cols, cardWidth, cardHeight, gap, startX, startY };
  };

  // 获取已收集的食物名称集合
  const getCollectedFoodNames = () => {
    const collected = new Set<string>();
    records.forEach((record) => {
      record.foods.forEach((food) => {
        collected.add(food.name);
      });
    });
    return collected;
  };

  // 从所有记录生成贴纸（去重，按食物名称统计次数）
  const generateStickersFromRecords = () => {
    const collected = getCollectedFoodNames();
    const foodCountMap = new Map<string, { icon: string; category: string; count: number; glutenLevel: number; giLevel: number }>();
    
    records.forEach((record) => {
      record.foods.forEach((food) => {
        const existing = foodCountMap.get(food.name);
        if (existing) {
          existing.count += 1;
        } else {
          const template = getFoodTemplate(food.name);
          foodCountMap.set(food.name, {
            icon: food.icon,
            category: food.category,
            count: 1,
            glutenLevel: template?.glutenLevel || 1,
            giLevel: template?.giLevel || 1,
          });
        }
      });
    });
    
    const allStickers: StickerWithPosition[] = [];
    let index = 0;
    foodCountMap.forEach((data, name) => {
      allStickers.push({
        id: `sticker-${index++}`,
        name: name,
        icon: data.icon,
        category: data.category,
        date: '',
        count: data.count,
        collected: true,
        glutenLevel: data.glutenLevel,
        giLevel: data.giLevel,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        scale: 1,
        rotation: 0,
        targetX: 0,
        targetY: 0,
        targetRotation: 0,
        targetScale: 1,
        opacity: 1,
        zIndex: 0,
      });
    });
    
    return allStickers;
  };

  // 生成所有模板贴纸（用于平铺模式展示全部）
  const generateAllTemplateStickers = (): StickerWithPosition[] => {
    const collected = getCollectedFoodNames();
    
    return foodTemplates.map((template, index) => {
      const isCollected = collected.has(template.name);
      return {
        id: `template-${index}`,
        name: template.name,
        icon: template.icon,
        category: template.category,
        date: '',
        count: isCollected ? 1 : 0,
        collected: isCollected,
        glutenLevel: template.glutenLevel,
        giLevel: template.giLevel,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        scale: 1,
        rotation: 0,
        targetX: 0,
        targetY: 0,
        targetRotation: 0,
        targetScale: 1,
        opacity: isCollected ? 1 : 0.6,
        zIndex: 0,
      };
    });
  };

  // 获取食物的历史记录
  const getFoodHistory = (foodName: string): FoodHistory[] => {
    const history: FoodHistory[] = [];
    records.forEach((record) => {
      record.foods.forEach((food) => {
        if (food.name === foodName) {
          history.push({
            date: food.date,
            time: food.time,
            category: food.category,
          });
        }
      });
    });
    // 按日期和时间排序
    return history.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
  };

  // 处理卡片点击
  const handleCardClick = (foodName: string, collected: boolean) => {
    if (!collected) return; // 未收集的卡片不能点击
    const history = getFoodHistory(foodName);
    setFoodHistory(history);
    setSelectedFood(foodName);
  };

  // 关闭历史记录弹窗
  const closeHistoryModal = () => {
    setSelectedFood(null);
    setFoodHistory([]);
  };

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  // 初始化贴纸
  useEffect(() => {
    // 根据模式选择不同的贴纸生成方式
    const allStickers = viewMode === 'grid' 
      ? generateAllTemplateStickers()  // 平铺模式：展示全部
      : generateStickersFromRecords(); // 重力模式：只展示已收集的
    
    const filtered = allStickers.filter((sticker) => {
      const matchesSearch = sticker.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || sticker.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 随机打乱顺序
    const shuffled = shuffleArray(filtered);

    // 计算平铺位置
    const { cols, cardWidth, cardHeight, gap, startX, startY } = calculateGridPositions(
      rect.width, rect.height, shuffled.length
    );

    stickersRef.current = shuffled.map((sticker, index) => {
      const angle = (index / shuffled.length) * Math.PI * 2;
      const radius = 100 + Math.random() * 150;
      
      // 计算平铺目标位置
      const col = index % Math.max(cols, 1);
      const row = Math.floor(index / Math.max(cols, 1));
      const gridX = startX + col * (cardWidth + gap);
      const gridY = startY + row * (cardHeight + gap);
      
      return {
        ...sticker,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        scale: 1,
        rotation: (Math.random() - 0.5) * 20,
        targetX: gridX,
        targetY: gridY,
        targetRotation: 0,
        targetScale: 1,
        opacity: sticker.opacity,
        zIndex: shuffled.length - index,
      };
    });

    setRenderStickers([...stickersRef.current]);
  }, [records, searchTerm, selectedCategory, viewMode]);

  // 切换模式动画
  const toggleViewMode = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const newMode = viewMode === 'gravity' ? 'grid' : 'gravity';
    
    // 切换模式时会触发 useEffect 重新生成贴纸
    setViewMode(newMode);
    
    // 动画完成后重置状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  // 鼠标移动追踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 物理动画循环
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const animate = () => {
      const mouse = mouseRef.current;
      const stickerList = stickersRef.current;

      stickerList.forEach((sticker, i) => {
        if (viewMode === 'grid') {
          // 平铺模式：平滑移动到目标位置（发牌效果）
          const dx = sticker.targetX - sticker.x;
          const dy = sticker.targetY - sticker.y;
          const dRotation = sticker.targetRotation - sticker.rotation;
          const dScale = sticker.targetScale - sticker.scale;
          
          sticker.x += dx * 0.08;
          sticker.y += dy * 0.08;
          sticker.rotation += dRotation * 0.08;
          sticker.scale += dScale * 0.08;
          
          // 重置速度
          sticker.vx = 0;
          sticker.vy = 0;
        } else {
          // 重力模式
          // 计算到鼠标的距离和方向
          const dx = mouse.x - sticker.x;
          const dy = mouse.y - sticker.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // 引力参数
          const attractionRadius = 300;
          const attractionStrength = 0.0008;
          
          // 如果在吸引范围内，施加引力
          if (distance < attractionRadius && distance > 50) {
            const force = (attractionRadius - distance) / attractionRadius * attractionStrength;
            sticker.vx += dx * force;
            sticker.vy += dy * force;
          }

          // 贴纸之间的轻微排斥力（避免重叠）
          stickerList.forEach((other, j) => {
            if (i === j) return;
            const odx = sticker.x - other.x;
            const ody = sticker.y - other.y;
            const odist = Math.sqrt(odx * odx + ody * ody);
            
            if (odist < 80 && odist > 0) {
              const repelForce = 0.02;
              sticker.vx += (odx / odist) * repelForce;
              sticker.vy += (ody / odist) * repelForce;
            }
          });

          // 回归中心的微弱力（防止贴纸飞出屏幕）
          const centerDx = centerX - sticker.x;
          const centerDy = centerY - sticker.y;
          sticker.vx += centerDx * 0.0001;
          sticker.vy += centerDy * 0.0001;

          // 摩擦力（减速）
          sticker.vx *= 0.95;
          sticker.vy *= 0.95;

          // 更新位置
          sticker.x += sticker.vx;
          sticker.y += sticker.vy;

          // 边界限制
          const padding = 60;
          sticker.x = Math.max(padding, Math.min(rect.width - padding, sticker.x));
          sticker.y = Math.max(padding, Math.min(rect.height - padding, sticker.y));

          // 根据速度微调旋转角度
          sticker.rotation += sticker.vx * 0.1;
          sticker.rotation = Math.max(-30, Math.min(30, sticker.rotation));
          
          // 平滑缩放
          const dScale = sticker.targetScale - sticker.scale;
          sticker.scale += dScale * 0.05;
        }
      });

      setRenderStickers([...stickerList]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [viewMode]);

  // 计算已收集的贴纸数量
  const collectedCount = generateStickersFromRecords().length;
  const totalCount = foodTemplates.length;

  // 按类别分组（仅用于平铺模式）
  const groupByCategory = (stickers: StickerWithPosition[]) => {
    const grouped: Record<string, StickerWithPosition[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    stickers.forEach((sticker) => {
      if (grouped[sticker.category]) {
        grouped[sticker.category].push(sticker);
      }
    });
    return grouped;
  };

  // 渲染卡片内容
  const renderCardContent = (sticker: StickerWithPosition) => {
    const isCollected = sticker.collected;
    
    return (
      <>
        <div className="w-16 h-16 mx-auto mb-2">
          {isCollected ? (
            isImagePath(sticker.icon) ? (
              <FoodImage 
                src={sticker.icon}
                alt={sticker.name}
                className="w-16 h-16"
              />
            ) : (
              <span className="text-4xl">{sticker.icon}</span>
            )
          ) : (
            <RandomShape seed={sticker.name} />
          )}
        </div>
        <div className={`text-sm font-bold text-center truncate ${isCollected ? 'text-gray-800' : 'text-gray-400'}`}>
          {isCollected ? sticker.name : '???'}
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <LevelIndicator level={sticker.glutenLevel} type="gluten" />
          <LevelIndicator level={sticker.giLevel} type="gi" />
          {isCollected && sticker.count > 1 && <CountIndicator count={sticker.count} />}
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-orange-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <h1 className="font-bold text-gray-800">贴纸展馆</h1>
              <span className="text-sm text-gray-500">
                ({collectedCount}/{totalCount} 种)
              </span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={toggleViewMode}
                disabled={isTransitioning}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${viewMode === 'gravity'
                    ? 'bg-orange-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                  } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Sparkles className="w-4 h-4" />
                重力模式
              </button>
              <button
                onClick={toggleViewMode}
                disabled={isTransitioning}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${viewMode === 'grid'
                    ? 'bg-orange-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                  } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Grid3X3 className="w-4 h-4" />
                平铺模式
              </button>
            </div>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto px-4 pb-3 flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索贴纸..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm w-48"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-gray-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
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
      </header>

      {/* Exhibition Area */}
      <div 
        ref={containerRef}
        className={`flex-1 relative overflow-hidden ${viewMode === 'gravity' ? 'cursor-crosshair' : 'cursor-default'}`}
      >
        {renderStickers.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg">还没有收集到贴纸</p>
              <p className="text-sm mt-2">去记录饮食生成贴纸吧！</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          // 平铺模式：按类别分组展示
          <div className="absolute inset-0 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {Object.entries(groupByCategory(renderStickers)).map(([category, stickers]) => (
                stickers.length > 0 && (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                      {categoryLabels[category]}
                      <span className="text-sm font-normal text-gray-500">
                        ({stickers.filter(s => s.collected).length}/{stickers.length})
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {stickers.map((sticker) => (
                        <div
                          key={sticker.id}
                          onClick={() => handleCardClick(sticker.name, sticker.collected)}
                          className={`bg-white rounded-2xl shadow-xl border-2 p-4 w-28 transition-all
                            ${sticker.collected 
                              ? 'border-amber-100 hover:shadow-2xl cursor-pointer hover:scale-105' 
                              : 'border-gray-200 cursor-not-allowed'
                            }`}
                        >
                          {renderCardContent(sticker)}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          // 重力模式：浮动展示
          renderStickers.map((sticker) => (
            <div
              key={sticker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: sticker.x,
                top: sticker.y,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                zIndex: sticker.zIndex,
                opacity: sticker.opacity,
                transition: isTransitioning ? 'none' : undefined,
              }}
            >
              <div 
                onClick={() => handleCardClick(sticker.name, sticker.collected)}
                className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 p-4 w-28 hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
              >
                {renderCardContent(sticker)}
              </div>
            </div>
          ))
        )}

        {/* Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400 bg-white/80 backdrop-blur px-4 py-2 rounded-full">
          {viewMode === 'gravity' ? '移动鼠标吸引贴纸 ✨' : '点击已收集的卡片查看历史记录 🌟'}
        </div>
      </div>

      {/* History Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {(() => {
                    const sticker = renderStickers.find(s => s.name === selectedFood);
                    if (!sticker) return <span className="text-xl">🍽️</span>;
                    return isImagePath(sticker.icon) ? (
                      <FoodImage src={sticker.icon} alt={sticker.name} className="w-8 h-8" />
                    ) : (
                      <span className="text-2xl">{sticker.icon}</span>
                    );
                  })()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedFood}</h3>
                  <p className="text-white/80 text-sm">共记录 {foodHistory.length} 次</p>
                </div>
              </div>
              <button
                onClick={closeHistoryModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {foodHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">📭</div>
                  <p>暂无记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {foodHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {formatDate(record.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{record.time}</span>
                          <span className="text-gray-300">|</span>
                          <span>{categoryLabels[record.category]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
