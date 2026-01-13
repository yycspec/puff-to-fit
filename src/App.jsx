import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Trophy, Target, Droplets, 
  Plus, Moon, AlertCircle, CheckCircle, Trash2, 
  ChevronLeft, ChevronRight, Dribbble, Sparkles, Loader2, Flame, Scale
} from 'lucide-react';

// 輔助函式：確保日期格式一致
const formatKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const App = () => {
  // --- 基礎狀態 ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMealContent, setNewMealContent] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // --- 身體目標 (固定的指標) ---
  const bodyGoal = { weight: 52, fat: 25 };

  // --- 核心數據庫 ---
  // 初始化今天的數據，包含預設任務
  const [logs, setLogs] = useState({
    [formatKey(new Date())]: {
      water: 1200,
      weight: 58,
      fat: 30,
      basketball: false,
      meals: [
        { id: 1, type: '早餐', content: '2 顆蛋', protein: 14, time: '08:30' },
        { id: 2, type: '午餐', content: 'Subway 嫩牛 + 豆漿', protein: 34, time: '12:15' }
      ],
      workouts: [
        { id: 'w1', name: '烤鴨生存戰', detail: '上限 2 片餅，不准吃鴨皮', done: false },
        { id: 'w2', name: '核心穩定訓練', detail: '死蟲式 3組x12下', done: false },
        { id: 'w3', name: '每日水分', detail: '喝足 2000ml', done: false }
      ]
    }
  });

  const currentKey = formatKey(selectedDate);
  
  // 獲取當前選擇日期的數據，若沒有則初始化預設模板
  const getCurrentData = () => {
    if (logs[currentKey]) return logs[currentKey];
    
    // 若該日無紀錄，自動生成該日的任務模板
    const day = selectedDate.getDay();
    const defaultMissions = [{ id: 'w3', name: '每日水分', detail: '喝足 2000ml', done: false }];
    if (day === 2) defaultMissions.push({ id: 'm-tue', name: '烤鴨減餅任務', detail: '上限 2 片餅', done: false });
    if (day === 3) defaultMissions.push({ id: 'm-wed', name: '鰻魚飯挑戰', detail: '白飯只能吃 1/3', done: false });
    if (day === 6 || day === 0) defaultMissions.push({ id: 'm-ball', name: '球後拉伸', detail: '針對大腿舊傷冰敷', done: false });

    return {
      water: 0,
      weight: 58,
      fat: 30,
      basketball: false,
      meals: [],
      workouts: defaultMissions
    };
  };

  const currentData = getCurrentData();

  // --- 數據更新引擎 (這部分修正了互動失效的問題) ---
  const updateLog = (updates) => {
    setLogs(prev => {
      const newData = { ...currentData, ...updates };
      return { ...prev, [currentKey]: newData };
    });
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80;

  // --- 動作處理 ---
  const toggleWorkout = (id) => {
    const updated = currentData.workouts.map(w => w.id === id ? { ...w, done: !w.done } : w);
    updateLog({ workouts: updated });
  };

  const deleteMeal = (id) => {
    const updated = currentData.meals.filter(m => m.id !== id);
    updateLog({ meals: updated });
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMealContent) return;
    
    // 模擬 AI 計算蛋白質
    const protein = newMealContent.includes('鴨') ? 25 : 15;
    const newMeal = {
      id: Date.now(),
      type: '進食回報',
      content: newMealContent,
      protein: protein,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    updateLog({ meals: [...currentData.meals, newMeal] });
    setNewMealContent('');
    setShowAddMeal(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 font-sans selection:bg-rose-100">
      {/* 頂部日曆 */}
      <header className="bg-white sticky top-0 z-30 border-b p-4 shadow-sm pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black italic text-rose-500 tracking-tighter">PUFF-TO-FIT PRO</h1>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate()-7); setSelectedDate(d);}} className="p-1"><ChevronLeft size={20}/></button>
            <span className="text-[10px] font-black uppercase tracking-widest">{selectedDate.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
            <button onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate()+7); setSelectedDate(d);}} className="p-1"><ChevronRight size={20}/></button>
          </div>
        </div>
        <div className="flex justify-between px-1">
          {[0,1,2,3,4,5,6].map(i => {
            const d = new Date(); d.setDate(new Date().getDate() - new Date().getDay() + i);
            const isSelected = formatKey(d) === currentKey;
            const isToday = formatKey(d) === formatKey(new Date());
            return (
              <button key={i} onClick={() => setSelectedDate(new Date(d))} className={`flex flex-col items-center w-11 py-3 rounded-2xl transition-all ${isSelected ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <span className="text-[10px] font-black">{['日','一','二','三','四','五','六'][i]}</span>
                <span className="text-sm font-black mt-1">{d.getDate()}</span>
                {isToday && !isSelected && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1"></div>}
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in">
            {/* 教練面板 */}
            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl border-l-4 border-rose-500 relative overflow-hidden">
              <div className="flex gap-3">
                <div className="bg-rose-500 p-2 rounded-xl h-fit shadow-lg shadow-rose-500/20"><AlertCircle size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">前輩指令</p>
                  <p className="text-sm font-bold mt-1 leading-relaxed">
                    {currentKey === formatKey(new Date()) ? "今晚陶然亭，餅皮上限 2 片。妳要是敢亂吃皮，明天就給我加練 100 下深蹲！" : "正在回顧歷史數據，當時妳有堅持住嗎？"}
                  </p>
                </div>
              </div>
            </div>

            {/* 核心數據 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">蛋白質</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-3xl font-black ${totalProtein >= proteinGoal ? 'text-green-500 transition-colors' : ''}`}>{totalProtein}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {proteinGoal}g</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className="bg-rose-500 h-full transition-all duration-700 ease-out" style={{width: `${Math.min(100, (totalProtein/proteinGoal)*100)}%`}}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">每日飲水</span>
                <div className="text-2xl font-black mt-2 text-blue-500">{currentData.water} <span className="text-xs">ml</span></div>
                <button onClick={() => updateLog({water: currentData.water + 250})} className="mt-3 w-full py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl active:scale-95 transition-transform">喝水 +250</button>
              </div>
            </div>

            {/* 籃球開關 */}
            <button 
              onClick={() => updateLog({ basketball: !currentData.basketball })}
              className={`w-full p-6 rounded-3xl flex items-center justify-between border-2 transition-all duration-300 ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-orange-200 shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${currentData.basketball ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-lg italic tracking-tighter uppercase">Basketball Mode</h3>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{currentData.basketball ? "啟動高代謝模式 (P:95g)" : "一般代謝模式 (P:80g)"}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${currentData.basketball ? 'bg-orange-900/20' : 'bg-slate-200'}`}>
                 <div className={`w-4 h-4 rounded-full bg-white transition-all ${currentData.basketball ? 'translate-x-6' : ''}`}></div>
              </div>
            </button>

            {/* 飲食日誌 */}
            <section>
              <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="font-black text-lg italic uppercase tracking-tighter">Feeding Log</h2>
                <button onClick={() => setShowAddMeal(true)} className="bg-rose-500 text-white p-2 rounded-2xl shadow-lg active:scale-90 hover:bg-rose-600"><Plus size={20}/></button>
              </div>
              <div className="space-y-3">
                {currentData.meals.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-xs text-slate-400 font-bold italic">這天還沒有進食回報...</p>
                  </div>
                ) : (
                  currentData.meals.map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-slate-100 animate-in slide-in-from-left-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-300 w-10">{m.time}</span>
                        <div>
                          <p className="text-[10px] font-black text-rose-500 uppercase">{m.type}</p>
                          <p className="text-sm font-bold">{m.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-slate-700">+{m.protein}g</span>
                        <button onClick={() => deleteMeal(m.id)} className="text-slate-200 hover:text-rose-500 transition-colors p-1"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter">Daily Missions</h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div 
                  key={w.id} 
                  onClick={() => toggleWorkout(w.id)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center active:scale-[0.98] ${w.done ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                  <div>
                    <h4 className={`font-black text-lg ${w.done ? 'text-emerald-700 line-through opacity-50 transition-all' : 'text-slate-800'}`}>{w.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{w.detail}</p>
                  </div>
                  {w.done ? <CheckCircle className="text-emerald-500 transition-all" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800">Body Analyzer</h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-3xl border shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                   <Scale size={14} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">體重 (kg)</span>
                 </div>
                 <input 
                   type="number" 
                   step="0.1" 
                   value={currentData.weight} 
                   onChange={(e) => updateLog({ weight: parseFloat(e.target.value) || 0 })} 
                   className="text-3xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-rose-500 transition-colors py-1" 
                 />
               </div>
               <div className="bg-white p-6 rounded-3xl border shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                   <Target size={14} className="text-rose-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">體脂率 (%)</span>
                 </div>
                 <input 
                   type="number" 
                   step="0.1" 
                   value={currentData.fat} 
                   onChange={(e) => updateLog({ fat: parseFloat(e.target.value) || 0 })} 
                   className="text-3xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-rose-500 transition-colors py-1" 
                 />
               </div>
             </div>
             
             <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={120} /></div>
               <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-rose-500 italic">25.0% Fat Target Progress</h3>
               <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-8">
                 <div 
                   className="bg-rose-500 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(244,63,94,0.6)]" 
                   style={{ width: `${Math.max(0, Math.min(100, (30-currentData.fat)/(30-bodyGoal.fat)*100))}%` }}
                 />
               </div>
               <div className="flex justify-around pt-6 border-t border-white/5">
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase mb-1">目前</p><p className="text-xl font-black">{currentData.fat}%</p></div>
                 <div className="text-center">
                    <p className="text-[10px] font-black opacity-40 uppercase mb-1 text-rose-500">距離目標</p>
                    <p className="text-xl font-black text-rose-500 italic">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p>
                 </div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase mb-1">目標體重</p><p className="text-xl font-black">{bodyGoal.weight}kg</p></div>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* 新增飲食彈窗 */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-7 rounded-[40px] shadow-2xl border border-white">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2 italic tracking-tighter">
              <Sparkles className="text-rose-500" /> 回報給教練
            </h3>
            <form onSubmit={handleAddMeal} className="space-y-5">
              <input 
                type="text" 
                value={newMealContent} 
                onChange={e => setNewMealContent(e.target.value)} 
                placeholder="剛吃了什麼？" 
                className="w-full p-6 bg-slate-50 rounded-3xl outline-none font-bold focus:ring-4 focus:ring-rose-500/10 border-2 border-transparent focus:border-rose-500 transition-all text-lg" 
                autoFocus 
              />
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-rose-500/20 text-lg">
                <CheckCircle size={24} /> 確認記錄
              </button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm py-2 hover:text-slate-600 transition-colors">先不要，我還在吃</button>
            </form>
          </div>
        </div>
      )}

      {/* 底部導航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Activity size={26} /><span className="text-[10px] font-black uppercase tracking-widest">概覽</span>
        </button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Trophy size={26} /><span className="text-[10px] font-black uppercase tracking-widest">任務</span>
        </button>
        <button onClick={() => setActiveTab('body')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Target size={26} /><span className="text-[10px] font-black uppercase tracking-widest">體組成</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
