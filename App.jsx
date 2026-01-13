import React, { useState, useEffect } from 'react';
import { 
  User, Utensils, Activity, Droplets, Moon, 
  CheckCircle, AlertCircle, TrendingDown, Plus, 
  Info, Trash2, Trophy, Flame, Sparkles, Loader2, 
  Calendar, ChevronLeft, ChevronRight, Target, Scale, Zap, Dribbble
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMealContent, setNewMealContent] = useState('');

  // 身體目標
  const [bodyGoal, setBodyGoal] = useState({ weight: 52, fat: 25 });

  const formatKey = (date) => date.toISOString().split('T')[0];

  // --- 動態任務邏輯：根據星期幾給予不同任務 ---
  const getDailyMissions = (date) => {
    const day = date.getDay();
    const missions = [];
    
    // 基礎任務：每天都要喝水
    missions.push({ id: 'base-1', name: '水分補給', detail: '達成 2000ml 目標', done: false });

    // 專屬任務
    switch(day) {
      case 1: // 週一
        missions.push({ id: 'm-mon-1', name: '開週核心日', detail: '死蟲式 3組x12下', done: false });
        missions.push({ id: 'm-mon-2', name: '清腸胃日', detail: '澱粉攝取量再砍半', done: false });
        break;
      case 2: // 週二
        missions.push({ id: 'm-tue-1', name: '烤鴨生存戰', detail: '上限 2 片餅皮，去皮吃肉', done: false });
        missions.push({ id: 'm-tue-2', name: '大腿穩定訓練', detail: '靠牆蹲 45秒x3次', done: false });
        break;
      case 3: // 週三
        missions.push({ id: 'm-wed-1', name: '璞滿滿鰻魚飯戰', detail: '要求「飯少」，米飯僅吃 1/3', done: false });
        missions.push({ id: 'm-wed-2', name: '餐後消食', detail: '步行 4000 步', done: false });
        break;
      case 4: // 週四
        missions.push({ id: 'm-thu-1', name: '上肢塑形', detail: '跪姿伏地挺身 10下x3組', done: false });
        missions.push({ id: 'm-thu-2', name: '戒糖日', detail: '嚴禁任何含糖飲料/蛋白飲', done: false });
        break;
      case 5: // 週五
        missions.push({ id: 'm-fri-1', name: '週末備戰', detail: '核心穩定訓練 15 分鐘', done: false });
        missions.push({ id: 'm-fri-2', name: '高纖維日', detail: '蔬菜攝取需佔餐盤 1/2', done: false });
        break;
      case 6: // 週六
        missions.push({ id: 'm-sat-1', name: '籃球專項熱身', detail: '針對舊傷動態拉伸', done: false });
        missions.push({ id: 'm-sat-2', name: '賽後肌肉修復', detail: '滾筒放鬆大腿 15 分鐘', done: false });
        break;
      case 0: // 週日
        missions.push({ id: 'm-sun-1', name: '深度睡眠', detail: '晚上 12:00 前熄燈', done: false });
        missions.push({ id: 'm-sun-2', name: '主動式恢復', detail: '輕量快走 6000 步', done: false });
        break;
    }
    return missions;
  };

  // 數據庫儲存：初始化時直接調用 getDailyMissions，修復任務界面空洞問題
  const [logs, setLogs] = useState({
    [formatKey(new Date())]: {
      water: 1200, weight: 58, fat: 30, meals: [
        { id: 1, type: '早餐', content: '2 顆蛋', protein: 14, time: '08:30' },
        { id: 2, type: '午餐', content: 'Subway 嫩牛 + 豆漿', protein: 34, time: '12:15' }
      ],
      basketball: false,
      workouts: getDailyMissions(new Date()) // 修復點：初始化任務
    }
  });

  const apiKey = ""; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const currentKey = formatKey(selectedDate);

  // 獲取當前數據，若不存在則初始化
  const currentData = logs[currentKey] || { 
    water: 0, weight: 58, fat: 30, meals: [], basketball: false,
    workouts: getDailyMissions(selectedDate)
  };

  const updateLog = (updates) => {
    setLogs(prev => ({
      ...prev,
      [currentKey]: { ...currentData, ...updates }
    }));
  };

  const toggleBasketball = () => {
    const isBasketball = !currentData.basketball;
    let updatedWorkouts = [...currentData.workouts];
    
    if (isBasketball) {
      // 點擊打球後，額外增加運動後修復任務
      if (!updatedWorkouts.find(w => w.id === 'b-1')) {
        updatedWorkouts.push({ id: 'b-1', name: '球後冰敷/拉伸', detail: '針對大腿舊傷處理 15 分鐘', done: false });
      }
    } else {
      updatedWorkouts = updatedWorkouts.filter(w => w.id !== 'b-1');
    }

    updateLog({ basketball: isBasketball, workouts: updatedWorkouts });
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80; 

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMealContent || isCalculating) return;
    setIsCalculating(true);
    const prompt = `健身教練角度估算「${newMealContent}」的蛋白質克數。回傳JSON:{"protein":number,"name":"string"}`;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const result = await response.json();
      const aiData = JSON.parse(result.candidates[0].content.parts[0].text);
      updateLog({ meals: [...currentData.meals, { id: Date.now(), type: '飲食', content: aiData.name, protein: aiData.protein, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]});
    } catch (err) { console.error(err); }
    finally { setIsCalculating(false); setNewMealContent(''); setShowAddMeal(false); }
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-28 transition-colors">
      {/* 頂部導航 */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 pt-4 px-4 pb-4 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-black italic text-rose-500 tracking-tighter uppercase">PuffToFit <span className="text-xs text-slate-400 font-bold ml-1">Daily</span></h1>
            <div className="flex items-center gap-2">
               <button onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate()-7); setSelectedDate(d);}} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20}/></button>
               <span className="text-xs font-black bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                {selectedDate.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
               </span>
               <button onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate()+7); setSelectedDate(d);}} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight size={20}/></button>
            </div>
          </div>
          <div className="flex justify-between px-1">
            {getWeekDays().map((date, i) => {
              const isSelected = formatKey(date) === currentKey;
              const isToday = formatKey(date) === formatKey(new Date());
              return (
                <button key={i} onClick={() => setSelectedDate(date)} className={`flex flex-col items-center w-11 py-2 rounded-2xl transition-all ${isSelected ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                  <span className="text-[10px] font-black">{['日','一','二','三','四','五','六'][date.getDay()]}</span>
                  <span className="text-sm font-black mt-0.5">{date.getDate()}</span>
                  {isToday && !isSelected && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-0.5"></div>}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 教練指示板 */}
        <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl border-l-4 border-rose-500 relative overflow-hidden transition-all active:scale-[0.98]">
          <div className="flex gap-3">
            <div className="bg-rose-500 p-2 rounded-xl h-fit shadow-lg shadow-rose-500/20"><AlertCircle size={20}/></div>
            <div>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">前輩的每日叮嚀</p>
              <p className="text-sm font-bold mt-1 leading-relaxed">
                {currentData.basketball ? "打球日！蛋白質必須拉高，別拿體力消耗當藉口亂吃澱粉！" : 
                 formatKey(selectedDate) === formatKey(new Date()) ? "界面修復完成！現在給我看清楚妳今天的任務，一項都不能漏。" : 
                 "這天妳有做到我的要求嗎？數字不會騙人。"}
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* 核心進度 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">蛋白質進度</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-3xl font-black ${totalProtein >= proteinGoal ? 'text-green-500 transition-colors' : ''}`}>{totalProtein}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {proteinGoal}g</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className="bg-rose-500 h-full transition-all duration-700 ease-out" style={{width: `${Math.min(100, (totalProtein/proteinGoal)*100)}%`}}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">飲水進度</span>
                <div className="text-2xl font-black mt-1 text-blue-500">{currentData.water} <span className="text-xs">ml</span></div>
                <button onClick={() => updateLog({water: currentData.water + 250})} className="mt-3 w-full py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-xl active:scale-95 transition-transform">喝水 +250</button>
              </div>
            </div>

            {/* 籃球開關 */}
            <button 
              onClick={toggleBasketball}
              className={`w-full p-6 rounded-3xl flex items-center justify-between border-2 transition-all duration-300 ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-orange-200 shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${currentData.basketball ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-lg uppercase italic tracking-tighter">Basketball Day</h3>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">
                    {currentData.basketball ? "啟動運動員模式 (High-Pro)" : "非運動日模式 (Standard)"}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${currentData.basketball ? 'bg-orange-900/20' : 'bg-slate-200 dark:bg-slate-600'}`}>
                 <div className={`w-4 h-4 rounded-full transition-all ${currentData.basketball ? 'bg-white translate-x-6' : 'bg-white translate-x-0'}`}></div>
              </div>
            </button>

            {/* 飲食日誌 */}
            <section>
              <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="font-black text-lg italic uppercase tracking-tighter text-slate-800 dark:text-slate-200">Daily Feeding Log</h2>
                <button onClick={() => setShowAddMeal(true)} className="bg-rose-500 text-white p-2 rounded-2xl shadow-lg active:scale-90 transition-all hover:bg-rose-600"><Plus size={20}/></button>
              </div>
              <div className="space-y-3">
                {currentData.meals.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-xs text-slate-400 font-bold italic">這天還沒有進食回報...</p>
                  </div>
                ) : (
                  currentData.meals.map(m => (
                    <div key={m.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl flex justify-between items-center shadow-sm border border-slate-100 dark:border-slate-700 animate-in slide-in-from-left-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 w-10">{m.time}</span>
                        <div>
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">{m.type}</p>
                          <p className="text-sm font-bold">{m.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">+{m.protein}g</span>
                        <button onClick={() => updateLog({ meals: currentData.meals.filter(meal => meal.id !== m.id) })} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800 dark:text-slate-200">Daily Missions</h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div 
                  key={w.id} 
                  onClick={() => {
                    const updated = currentData.workouts.map(item => item.id === w.id ? {...item, done: !item.done} : item);
                    updateLog({workouts: updated});
                  }} 
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center group active:scale-[0.98] ${w.done ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                >
                  <div>
                    <h4 className={`font-black text-lg ${w.done ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-50' : 'text-slate-800 dark:text-slate-100'}`}>{w.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{w.detail}</p>
                  </div>
                  {w.done ? <CheckCircle className="text-emerald-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-rose-400 transition-colors"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800 dark:text-slate-200">Body Composition</h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">體重 (kg)</span>
                 <input type="number" step="0.1" value={currentData.weight} onChange={(e) => updateLog({weight: parseFloat(e.target.value)})} className="text-2xl font-black w-full bg-transparent border-b border-slate-200 dark:border-slate-700 focus:outline-none focus:border-rose-500 mt-1" />
               </div>
               <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">體脂率 (%)</span>
                 <input type="number" step="0.1" value={currentData.fat} onChange={(e) => updateLog({fat: parseFloat(e.target.value)})} className="text-2xl font-black w-full bg-transparent border-b border-slate-200 dark:border-slate-700 focus:outline-none focus:border-rose-500 mt-1" />
               </div>
             </div>
             
             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <Target className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
               <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-rose-500 italic">25.0% Fat Target Progress</h3>
               <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                 <div className="bg-rose-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{width: `${Math.max(0, Math.min(100, (30-currentData.fat)/(30-bodyGoal.fat)*100))}%`}}></div>
               </div>
               <div className="flex justify-around mt-8 pt-6 border-t border-white/5">
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase tracking-tighter">目前</p><p className="text-xl font-black">{currentData.fat}%</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase tracking-tighter text-rose-500">距離目標</p><p className="text-xl font-black text-rose-500">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase tracking-tighter">理想體重</p><p className="text-xl font-black">{bodyGoal.weight}kg</p></div>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* 新增飲食彈窗 */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 italic tracking-tighter"><Sparkles className="text-rose-500" /> 回報給前輩</h3>
            <form onSubmit={handleAddMeal} className="space-y-5">
              <input type="text" value={newMealContent} onChange={e => setNewMealContent(e.target.value)} placeholder="剛吃了什麼？例如：10片烤鴨肉、2片餅..." className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-rose-500 transition-all shadow-inner" disabled={isCalculating} autoFocus />
              <button type="submit" disabled={isCalculating || !newMealContent} className="w-full bg-rose-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl shadow-rose-500/20">
                {isCalculating ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />} {isCalculating ? "前輩分析中..." : "確認記錄"}
              </button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">先不要，我還在吃</button>
            </form>
          </div>
        </div>
      )}

      {/* 底部導航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-transform ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Activity size={24} /><span className="text-[10px] font-black uppercase tracking-widest">概覽</span>
        </button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1 transition-transform ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Trophy size={24} /><span className="text-[10px] font-black uppercase tracking-widest">任務</span>
        </button>
        <button onClick={() => setActiveTab('body')} className={`flex flex-col items-center gap-1 transition-transform ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Target size={24} /><span className="text-[10px] font-black uppercase tracking-widest">體組成</span>
        </button>
      </nav>
    </div>
  );
};

export default App;