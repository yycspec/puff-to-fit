import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Trophy, Target, Droplets, 
  Plus, Moon, AlertCircle, CheckCircle, Trash2, 
  ChevronLeft, ChevronRight, Dribbble, Sparkles, Loader2, Flame
} from 'lucide-react';

// 輔助函式
const formatKey = (date) => date.toISOString().split('T')[0];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMealContent, setNewMealContent] = useState('');
  
  // 身體目標
  const bodyGoal = { weight: 52, fat: 25 };

  // 數據庫儲存
  const [logs, setLogs] = useState({
    [formatKey(new Date())]: {
      water: 1200, weight: 58, fat: 30, basketball: false,
      meals: [
        { id: 1, type: '早餐', content: '2 顆蛋', protein: 14, time: '08:30' },
        { id: 2, type: '午餐', content: 'Subway 嫩牛 + 豆漿', protein: 34, time: '12:15' }
      ],
      workouts: []
    }
  });

  const currentKey = formatKey(selectedDate);
  
  // 動態任務系統
  const getDailyMissions = (date) => {
    const day = date.getDay();
    const missions = [
      { id: 'w-1', name: '水分補給', detail: '達成 2000ml 目標', done: false }
    ];
    if (day === 2) missions.push({ id: 'm-tue-1', name: '烤鴨生存戰', detail: '上限 2 片餅，不准吃鴨皮', done: false });
    if (day === 3) missions.push({ id: 'm-wed-1', name: '鰻魚飯挑戰', detail: '要求「飯少」，避開甜醬', done: false });
    if (day === 6 || day === 0) missions.push({ id: 'm-ball', name: '賽後肌肉放鬆', detail: '滾筒按摩大腿 15 分鐘', done: false });
    return missions;
  };

  const currentData = logs[currentKey] || { 
    water: 0, weight: 58, fat: 30, meals: [], basketball: false,
    workouts: getDailyMissions(selectedDate)
  };

  const updateLog = (updates) => {
    setLogs(prev => ({ ...prev, [currentKey]: { ...currentData, ...updates } }));
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80;

  // 手機版全螢幕適配
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-28 font-sans selection:bg-rose-100">
      {/* Header & Calendar */}
      <header className="bg-white sticky top-0 z-30 border-b p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black italic text-rose-500 tracking-tighter">PuffToFit PRO</h1>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate()-7); setSelectedDate(d);}} className="p-1"><ChevronLeft size={16}/></button>
            <span className="text-[10px] font-black uppercase">{selectedDate.toLocaleDateString('zh-TW', { month: 'short' })}</span>
            <button onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate()+7); setSelectedDate(d);}} className="p-1"><ChevronRight size={16}/></button>
          </div>
        </div>
        <div className="flex justify-between">
          {[0,1,2,3,4,5,6].map(i => {
            const d = new Date(selectedDate); d.setDate(d.getDate() - d.getDay() + i);
            const isSelected = formatKey(d) === currentKey;
            return (
              <button key={i} onClick={() => setSelectedDate(d)} className={`flex flex-col items-center w-11 py-2 rounded-2xl transition-all ${isSelected ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400'}`}>
                <span className="text-[10px] font-bold">{['日','一','二','三','四','五','六'][i]}</span>
                <span className="text-sm font-black mt-1">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in">
            {/* 教練面板 */}
            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl border-l-4 border-rose-500">
              <div className="flex gap-3">
                <div className="bg-rose-500 p-2 rounded-xl"><AlertCircle size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">教練當日提示</p>
                  <p className="text-sm font-bold mt-1">
                    {currentData.basketball ? "打球日！蛋白質目標 95g。別讓汗水白流！" : "穩住！體脂 25% 需要的是精確的紀錄。"}
                  </p>
                </div>
              </div>
            </div>

            {/* 進度卡 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase">蛋白質進度</span>
                <div className="text-2xl font-black mt-1">{totalProtein} <span className="text-xs text-slate-400">/ {proteinGoal}g</span></div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-rose-500 h-full transition-all duration-700" style={{width: `${Math.min(100, (totalProtein/proteinGoal)*100)}%`}}></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase">飲水</span>
                <div className="text-2xl font-black mt-1 text-blue-500">{currentData.water} <span className="text-xs">ml</span></div>
                <button onClick={() => updateLog({water: currentData.water + 250})} className="mt-2 text-[10px] font-black text-blue-600 underline">+ 250ml</button>
              </div>
            </div>

            {/* 籃球按鈕 */}
            <button onClick={() => updateLog({basketball: !currentData.basketball})} className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>
              <div className="flex items-center gap-4">
                <Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''}/>
                <div className="text-left">
                  <h3 className="font-black text-lg italic tracking-tighter">BASKETBALL MODE</h3>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{currentData.basketball ? "運動員模式開啟" : "一般代謝模式"}</p>
                </div>
              </div>
            </button>

            {/* 進食日誌 */}
            <section>
              <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="font-black text-lg italic uppercase tracking-tighter">Feeding Log</h2>
                <button onClick={() => setShowAddMeal(true)} className="bg-rose-500 text-white p-2 rounded-2xl shadow-lg active:scale-90"><Plus size={20}/></button>
              </div>
              <div className="space-y-3">
                {currentData.meals.map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-300">{m.time}</span>
                      <p className="text-sm font-bold">{m.content}</p>
                    </div>
                    <span className="text-sm font-black">+{m.protein}g</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6 animate-in">
            <h2 className="font-black text-2xl italic px-1">DAILY MISSIONS</h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div key={w.id} onClick={() => {
                  const updated = currentData.workouts.map(item => item.id === w.id ? {...item, done: !item.done} : item);
                  updateLog({workouts: updated});
                }} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${w.done ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100'}`}>
                  <div><h4 className={`font-black text-lg ${w.done ? 'line-through opacity-50 text-emerald-700' : ''}`}>{w.name}</h4><p className="text-xs text-slate-400 font-bold uppercase">{w.detail}</p></div>
                  {w.done ? <CheckCircle className="text-emerald-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6 animate-in">
             <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter">Body Analyzer</h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase">體重 (kg)</span>
                 <input type="number" step="0.1" value={currentData.weight} onChange={(e) => updateLog({weight: parseFloat(e.target.value)})} className="text-2xl font-black w-full bg-transparent border-b border-slate-200 focus:outline-none focus:border-rose-500 mt-1" />
               </div>
               <div className="bg-white p-5 rounded-3xl border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase">體脂率 (%)</span>
                 <input type="number" step="0.1" value={currentData.fat} onChange={(e) => updateLog({fat: parseFloat(e.target.value)})} className="text-2xl font-black w-full bg-transparent border-b border-slate-200 focus:outline-none focus:border-rose-500 mt-1" />
               </div>
             </div>
             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <Target className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
               <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-rose-500 italic">Target 25.0% Progress</h3>
               <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                 <div className="bg-rose-500 h-full transition-all duration-1000" style={{width: `${Math.max(0, Math.min(100, (30-currentData.fat)/(30-bodyGoal.fat)*100))}%`}}></div>
               </div>
               <div className="flex justify-around mt-8 pt-6 border-t border-white/5">
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase">目前</p><p className="text-xl font-black">{currentData.fat}%</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase text-rose-500">距離目標</p><p className="text-xl font-black text-rose-500">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase">目標體重</p><p className="text-xl font-black">{bodyGoal.weight}kg</p></div>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* 新增飲食彈窗 */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 italic tracking-tighter"><Sparkles className="text-rose-500" /> 回報紀錄</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const p = newMealContent.includes('鴨') ? 25 : 15; // 簡易邏輯
              updateLog({meals: [...currentData.meals, {id: Date.now(), content: newMealContent, protein: p, time: "Now"}]});
              setNewMealContent('');
              setShowAddMeal(false);
            }} className="space-y-5">
              <input type="text" value={newMealContent} onChange={e => setNewMealContent(e.target.value)} placeholder="剛吃了什麼？" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" autoFocus />
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-rose-100">確認記錄</button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm">取消</button>
            </form>
          </div>
        </div>
      )}

      {/* 底部導航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 border-t p-4 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Activity size={24} /><span className="text-[10px] font-black uppercase">概覽</span></button>
        <button onClick={() => setTab('workout')} className={`flex flex-col items-center gap-1 ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Trophy size={24} /><span className="text-[10px] font-black uppercase">任務</span></button>
        <button onClick={() => setTab('body')} className={`flex flex-col items-center gap-1 ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Target size={24} /><span className="text-[10px] font-black uppercase">體組成</span></button>
      </nav>
    </div>
  );
};

export default App;
