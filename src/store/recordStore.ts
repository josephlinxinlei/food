import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FoodRecord, DailyRecord, Sticker } from '../types';

interface RecordState {
  records: DailyRecord[];
  stickers: Sticker[];
  addFood: (food: FoodRecord) => void;
  removeFood: (date: string, foodId: string) => void;
  getDayRecord: (date: string) => DailyRecord | undefined;
  generateStickers: (date: string) => void;
  getStickers: () => Sticker[];
  getStickersByCategory: (category: string) => Sticker[];
}

export const useRecordStore = create<RecordState>()(
  persist(
    (set, get) => ({
      records: [],
      stickers: [],

      addFood: (food) => {
        set((state) => {
          const existingRecord = state.records.find((r) => r.date === food.date);
          if (existingRecord) {
            return {
              records: state.records.map((r) =>
                r.date === food.date
                  ? { ...r, foods: [...r.foods, food] }
                  : r
              ),
            };
          }
          return {
            records: [...state.records, { date: food.date, foods: [food] }],
          };
        });
      },

      removeFood: (date, foodId) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.date === date
              ? { ...r, foods: r.foods.filter((f) => f.id !== foodId) }
              : r
          ),
        }));
      },

      getDayRecord: (date) => {
        return get().records.find((r) => r.date === date);
      },

      generateStickers: (date) => {
        const record = get().records.find((r) => r.date === date);
        if (!record) return;

        const newStickers: Sticker[] = record.foods.map((food) => ({
          id: `sticker-${food.id}`,
          foodId: food.id,
          name: food.name,
          icon: food.icon,
          category: food.category,
          date: food.date,
          collected: true,
        }));

        set((state) => {
          const existingStickerIds = new Set(state.stickers.map((s) => s.foodId));
          const uniqueNewStickers = newStickers.filter(
            (s) => !existingStickerIds.has(s.foodId)
          );
          return {
            stickers: [...state.stickers, ...uniqueNewStickers],
          };
        });
      },

      getStickers: () => get().stickers,

      getStickersByCategory: (category) => {
        if (category === 'all') return get().stickers;
        return get().stickers.filter((s) => s.category === category);
      },
    }),
    {
      name: 'diet-records',
    }
  )
);
