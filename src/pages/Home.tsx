import { useState } from 'react';
import { CalendarDays, BookMarked, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '../components/Calendar';
import { FoodShelf } from '../components/FoodShelf';
import { AddFoodModal } from '../components/AddFoodModal';
import { Exhibition } from './Exhibition';
import { useRecordStore } from '../store/recordStore';

export function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'calendar' | 'shelf'>('calendar');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  
  const { addFood, removeFood, getDayRecord } = useRecordStore();
  const dayRecord = getDayRecord(selectedDate);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setView('shelf');
  };

  const handleAddFood = (food: import('../types').FoodRecord) => {
    addFood(food);
  };

  const handleRemoveFood = (foodId: string) => {
    removeFood(selectedDate, foodId);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return {
      date: `${date.getMonth() + 1}月${date.getDate()}日`,
      weekday: weekdays[date.getDay()],
    };
  };

  const { date, weekday } = formatDate(selectedDate);

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <h1 className="font-bold text-gray-800">每天吃了啥</h1>
          </div>
          <button className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {view === 'calendar' ? (
          <div className="space-y-4">
            <Calendar onSelectDate={handleSelectDate} />

            {/* Quick Action */}
            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setView('shelf');
              }}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >记录今天</button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Date Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{date}</div>
                <div className="text-sm text-gray-500">{weekday}</div>
              </div>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Food Shelf */}
            <FoodShelf
              foods={dayRecord?.foods || []}
              onAddFood={() => setIsAddModalOpen(true)}
              onRemoveFood={handleRemoveFood}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <button
            onClick={() => setView('calendar')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors
              ${view === 'calendar' ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`}
          >
            <CalendarDays className="w-6 h-6" />
            <span className="text-xs">日历</span>
          </button>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-orange-500"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg -mt-6">
              <span className="text-2xl text-white">+</span>
            </div>
            <span className="text-xs">记录</span>
          </button>
          
          <button
            onClick={() => setIsStickerModalOpen(true)}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors
              ${isStickerModalOpen ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`}
          >
            <BookMarked className="w-6 h-6" />
            <span className="text-xs">展馆</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddFood}
        date={selectedDate}
      />

      {isStickerModalOpen && (
        <Exhibition onClose={() => setIsStickerModalOpen(false)} />
      )}
    </div>
  );
}
