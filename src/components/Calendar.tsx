import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarDay } from '../types';
import { useRecordStore } from '../store/recordStore';

interface CalendarProps {
  onSelectDate: (date: string) => void;
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

export function Calendar({ onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const records = useRecordStore((state) => state.records);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // Check if icon is an image path (URL or local path) or emoji
  const isImagePath = (icon: string) => icon.startsWith('http') || icon.startsWith('/');

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = prevLastDay.getDate() - i;
      const fullDate = `${prevLastDay.getFullYear()}-${String(prevLastDay.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const record = records.find((r) => r.date === fullDate);
      days.push({
        date,
        fullDate,
        isCurrentMonth: false,
        isToday: false,
        hasRecords: !!record,
        foodIcons: record?.foods.slice(0, 2).map((f) => f.icon) || [],
        foodCount: record?.foods.length || 0,
      });
    }
    
    // Current month days
    const today = new Date();
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const record = records.find((r) => r.date === fullDate);
      days.push({
        date,
        fullDate,
        isCurrentMonth: true,
        isToday: year === today.getFullYear() && month === today.getMonth() && date === today.getDate(),
        hasRecords: !!record,
        foodIcons: record?.foods.slice(0, 2).map((f) => f.icon) || [],
        foodCount: record?.foods.length || 0,
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let date = 1; date <= remainingDays; date++) {
      const fullDate = `${year}-${String(month + 2).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const record = records.find((r) => r.date === fullDate);
      days.push({
        date,
        fullDate,
        isCurrentMonth: false,
        isToday: false,
        hasRecords: !!record,
        foodIcons: record?.foods.slice(0, 2).map((f) => f.icon) || [],
        foodCount: record?.foods.length || 0,
      });
    }
    
    return days;
  }, [currentDate, records]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthYear = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-orange-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">{monthYear}</h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-orange-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-orange-500" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => onSelectDate(day.fullDate)}
            className={`
              relative aspect-square rounded-xl p-1 transition-all
              ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              ${day.isToday ? 'ring-2 ring-orange-400' : ''}
              ${day.hasRecords ? 'hover:bg-orange-50' : 'hover:bg-gray-100'}
            `}
          >
            {/* 红色气泡 - 显示食物数量 */}
            {day.foodCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center z-10 shadow-sm">
                {day.foodCount}
              </span>
            )}
            <span
              className={`
                text-sm font-medium block
                ${day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                ${day.isToday ? 'text-orange-500' : ''}
              `}
            >
              {day.date}
            </span>
            {day.foodIcons.length > 0 && (
              <div className="flex justify-center gap-0.5 mt-1">
                {day.foodIcons.map((icon, i) => (
                  <div key={i} className="w-4 h-4 flex items-center justify-center">
                    {isImagePath(icon) ? (
                      <FoodImage 
                        src={icon}
                        alt="food"
                        className="w-4 h-4"
                      />
                    ) : (
                      <span className="text-xs">{icon}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
