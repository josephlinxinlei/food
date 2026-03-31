// 食物记录
export interface FoodRecord {
  id: string;
  name: string;
  icon: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  date: string;
}

// 每日饮食记录
export interface DailyRecord {
  date: string;
  foods: FoodRecord[];
  mood?: 'happy' | 'normal' | 'sad' | 'excited';
}

// 贴纸
export interface Sticker {
  id: string;
  foodId: string;
  name: string;
  icon: string;
  category: string;
  date: string;
  collected: boolean;
}

// 等级类型: 1=低(绿色), 2=中(黄色), 3=高(红色)
export type Level = 1 | 2 | 3;

// 等级配置
export interface LevelConfig {
  color: string;
  bgColor: string;
  label: string;
}

// 食物贴纸模板
export interface FoodStickerTemplate {
  id: string;
  name: string;
  icon: string;
  category: string;
  tags: string[];
  glutenLevel: Level; // 麸质含量等级
  giLevel: Level; // 升糖指数等级
}

// 日历日期
export interface CalendarDay {
  date: number;
  fullDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasRecords: boolean;
  foodIcons: string[];
  foodCount: number;
}
