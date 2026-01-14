import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Trophy, Target, Droplets, 
  Plus, Moon, AlertCircle, CheckCircle, Trash2, 
  ChevronLeft, ChevronRight, Dribbble, Sparkles, Loader2, Scale, Zap, Flame, Wind, HeartPulse, Dumbbell, BarChart3, TrendingDown, TrendingUp, Save
} from 'lucide-react';

// 輔助函式：格式化日期作為 Key
const formatKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showWeeklyInput, setShowWeeklyInput] = useState(false);
  const [newMealContent, setNewMealContent] = useState('');
  
  // 核心戰鬥目標：52.9kg / 25.0%
  const [bodyGoal] = useState({ weight: 52.9, fat: 25.0 });

  // --- 週紀錄載體 (由妳親手建立真實數據) ---
  const [weeklyWeights, setWeeklyWeights] = useState([]);

  // 週紀錄輸入暫存區
  const [weeklyInput, setWeeklyInput] = useState({
    week: '',
    weight: '',
    fat: ''
  });

  // --- 每日任務生成器 ---
  const getDailyMissions = (date, isBasketball = false) => {
    const day = new Date(date).getDay();
    let list = [
      {id:'m1', name:'蛋白質達標', detail: isBasketball ? '需吃足 95g (打球日)' : '需吃足 80g', done: false},
      {id:'m2', name:'蜜桃臀養成', detail:'累積 50 深蹲或單腿蹲', done: false},
      {id:'m3', name:'血管沖刷', detail:'喝足 2500ml 純水', done: false}
    ];
    if (day === 2) list.push({id:'m4', name:'烤鴨生存戰', detail:'餅皮上限 2 片', done: false});
    return list;
  };

  const [logs, setLogs] = useState({
    [formatKey(new Date())]: {
      water: 0, weight: 58.7, fat: 32.4, ldl: 145, 
      squats: 0, basketball: false, meals: [],
      workouts: getDailyMissions(new Date())
    }
  });

  const currentKey = formatKey(selectedDate);
  const currentData = logs[currentKey] || { 
    water: 0, weight: 58.7, fat: 32.4, ldl: 145, squats: 0, basketball: false, meals: [], 
    workouts: getDailyMissions(selectedDate)
  };

  const updateLog = (updates) => {
    setLogs(prev => {
      const existing = prev[currentKey] || { 
        water: 0, weight: 58.7, fat: 32.4, ldl: 145, squats: 0, basketball: false, meals: [], 
        workouts: getDailyMissions(selectedDate) 
      };
      const newData = { ...existing, ...updates };
      if (updates.hasOwnProperty('basketball')) {
        newData.workouts = getDailyMissions(selectedDate, updates.basketball);
      }
      return { ...prev, [currentKey]: newData };
    });
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80;

  // --- 教練真實反饋分析 ---
  const getCoachMessage = () => {
    const isToday = currentKey === formatKey(new Date());
    if (!isToday) return "歷史紀錄已封存，別想著改變過去，去改變明天。";

    if (weeklyWeights.length === 0) return "週紀錄是空的是什麼意思？不敢面對現實嗎？快去結算妳的第一筆戰績！";

    const lastWeekly = weeklyWeights[weeklyWeights.length - 1];
    const weightDiff = currentData.weight - lastWeekly.weight;

    if (currentData.weight > lastWeekly.weight) {
        return `妳重了 ${weightDiff.toFixed(1)}kg！那兩片餅皮難道重一公斤嗎？給我去喝水排水腫！`;
    }
    
    if (currentData.basketball) return "既然上場打了球，蛋白質就是妳的生命線。吃、足、它！";
    return "我在盯著妳。每一口塞進嘴裡的油脂，都在延後妳變強的時間。";
  };

  // --- 處理功能 ---
  const handleAddWeekly = (e) => {
    e.preventDefault();
    if (!weeklyInput.week || !weeklyInput.weight || !weeklyInput.fat) return;
    
    // 修復點：修正變數名稱錯誤
    setWeeklyWeights(prev => [...prev, { 
      week: weeklyInput.week, 
      weight: parseFloat(weeklyInput.weight), 
      fat: parseFloat(weeklyInput.fat) 
    }]);
    
    setWeeklyInput({ week: '', weight: '', fat: '' });
    setShowWeeklyInput(false);
  };

  const deleteMeal = (id) => {
    updateLog({ meals: currentData.meals.filter(m => m.id !== id) });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 font-sans overflow-x-hidden selection:bg-rose-100 transition-all">
      {/* 頂部日導航 */}
      <header className="bg-white sticky top-0 z-30 border-b p-4 pt-12 shadow-sm">
        <div className="flex justify-between items-center mb-6 px-1">
          <h1 className="text-2xl font-black italic text-rose-500 tracking-tighter uppercase leading-none">Elite Tracker</h1>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border">
            <button onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate()-1); return n; })} className="p-1 active:scale-75 transition-transform bg-white rounded-xl shadow-sm text-slate-600"><ChevronLeft size={20}/></button>
            <div className="px-2 text-center min-w-[80px]">
              <span className="text-[10px] font-black text-rose-500 block uppercase leading-none mb-1">{selectedDate.toLocaleDateString('zh-TW', { weekday: 'short' })}</span>
              <span className="text-sm font-black text-slate-800">{selectedDate.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
            </div>
            <button onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate()+1); return n; })} className="p-1 active:scale-75 transition-transform bg-white rounded-xl shadow-sm text-slate-600"><ChevronRight size={20}/></button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 教練戰情室 */}
        <div className={`rounded-[32px] p-6 text-white shadow-xl border-l-4 transition-all duration-500 ${weeklyWeights.length > 0 && currentData.weight <= weeklyWeights[weeklyWeights.length-1].weight ? 'bg-emerald-900 border-emerald-500' : 'bg-slate-900 border-rose-500'}`}>
          <div className="flex justify-between items-center mb-4">
             <div className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-2 text-rose-300">
                <BarChart3 size={14}/> REAL-TIME TREND
             </div>
             <div className="text-[10px] font-black text-rose-300 uppercase tracking-widest leading-none">Target: {bodyGoal.fat}%</div>
          </div>
          <div className="flex gap-4">
            <div className={`p-3 rounded-2xl h-fit shadow-lg ${currentData.basketball ? 'bg-orange-600 animate-pulse' : 'bg-rose-500'}`}>
              {currentData.basketball ? <Dribbble size={24}/> : <Zap size={24}/>}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1 leading-none">Senior's Strategy</p>
              <p className="text-sm font-bold leading-relaxed italic">"{getCoachMessage()}"</p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[32px] border shadow-sm relative overflow-hidden group">
                <Flame className="absolute -right-2 -bottom-2 text-rose-500/10 w-20 h-20" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">蛋白質進度</span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className={`text-4xl font-black ${totalProtein >= proteinGoal ? 'text-green-500' : 'text-slate-800'}`}>{totalProtein}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {proteinGoal}g</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">代謝沖刷</span>
                <div className="text-3xl font-black mt-3 text-blue-500">{currentData.water}</div>
                <button onClick={() => updateLog({water: currentData.water + 250})} className="mt-3 w-full py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl active:scale-95 border border-blue-100 shadow-sm transition-all">+ 250ml</button>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => updateLog({ basketball: !currentData.basketball })}
                className={`w-full p-6 rounded-[32px] border-2 flex items-center justify-between transition-all duration-500 ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400'}`}
              >
                <div className="flex items-center gap-4">
                  <Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''} />
                  <div className="text-left"><h3 className="font-black text-lg italic tracking-tighter uppercase leading-none">Basketball Mode</h3><p className="text-[10px] font-bold opacity-70 mt-1 uppercase">啟動高代謝運動日</p></div>
                </div>
                <div className={`w-12 h-6 rounded-full bg-black/10 p-1 relative transition-all`}>
                   <div className={`w-4 h-4 rounded-full bg-white transition-all ${currentData.basketball ? 'translate-x-6' : ''}`}></div>
                </div>
              </button>

              <div className="bg-white p-6 rounded-[32px] border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200 transition-transform active:rotate-12"><Dumbbell size={24}/></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">今日累積深蹲</p><p className="text-3xl font-black text-slate-800">{currentData.squats || 0}</p></div>
                </div>
                <button onClick={() => updateLog({squats: (currentData.squats || 0) + 10})} className="bg-rose-500 text-white px-6 py-4 rounded-2xl font-black shadow-xl active:scale-90 transition-transform">深蹲 +10</button>
              </div>
            </div>

            <section className="space-y-4 pb-4">
              <div className="flex justify-between items-end px-1">
                <h2 className="font-black text-xl italic uppercase tracking-tighter text-slate-800 flex items-center gap-2"><Utensils size={20} className="text-rose-500"/> Feeding Record</h2>
                <button onClick={() => setShowAddMeal(true)} className="bg-rose-500 text-white p-2.5 rounded-2xl shadow-lg active:scale-90 transition-all hover:bg-rose-600"><Plus size={24}/></button>
              </div>
              <div className="space-y-3">
                {currentData.meals.length === 0 ? (
                  <p className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[32px] text-xs text-slate-400 font-bold italic">等待誠實的回報...</p>
                ) : (
                  currentData.meals.map(m => (
                    <div key={m.id} className="bg-white p-5 rounded-[28px] flex justify-between items-center shadow-sm border border-slate-100 animate-in slide-in-from-left-4 transition-all">
                      <div><p className="text-[10px] font-black text-slate-300 mb-1 leading-none">{m.time}</p><p className="text-base font-bold text-slate-800">{m.content}</p></div>
                      <div className="flex items-center gap-4"><span className="font-black text-slate-700">+{m.protein}g</span><button onClick={() => deleteMeal(m.id)} className="text-slate-200 hover:text-rose-500 p-2 transition-colors"><Trash2 size={18}/></button></div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800">Survival Missions</h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div key={w.id} onClick={() => updateLog({workouts: currentData.workouts.map(x => x.id === w.id ? {...x, done: !x.done} : x)})} className={`p-7 rounded-[32px] border-2 transition-all cursor-pointer flex justify-between items-center ${w.done ? 'bg-emerald-50 border-emerald-500 shadow-emerald-50' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex-1"><h4 className={`font-black text-xl ${w.done ? 'text-emerald-700 line-through opacity-50' : ''}`}>{w.name}</h4><p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{w.detail}</p></div>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${w.done ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'border-slate-200'}`}>
                    {w.done && <CheckCircle size={24} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800">Body Composition</h2>
             {/* 每日輸入 */}
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[32px] border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">今日體重 (kg)</span>
                 <input type="number" step="0.1" value={currentData.weight} onChange={(e) => updateLog({ weight: parseFloat(e.target.value) || 0 })} className="text-4xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:border-rose-500 outline-none transition-colors py-2 mt-2" />
               </div>
               <div className="bg-white p-6 rounded-[32px] border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">今日體脂 (%)</span>
                 <input type="number" step="0.1" value={currentData.fat} onChange={(e) => updateLog({ fat: parseFloat(e.target.value) || 0 })} className="text-4xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:border-rose-500 outline-none transition-colors py-2 mt-2" />
               </div>
             </div>

             {/* 週紀錄區 */}
             <div className="bg-white p-6 rounded-[32px] border shadow-sm space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-black text-sm uppercase italic tracking-widest text-slate-800 flex items-center gap-2"><Scale size={18} className="text-rose-500"/> Weekly Battle History</h3>
                  <button onClick={() => setShowWeeklyInput(true)} className="text-[9px] font-black bg-rose-500 text-white px-3 py-1 rounded-full uppercase shadow-lg active:scale-95 transition-all">結算本週</button>
                </div>
                <div className="space-y-3">
                  {weeklyWeights.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                      <p className="text-xs text-slate-400 font-bold italic">目前尚無戰報...</p>
                      <p className="text-[9px] text-slate-300 mt-1 uppercase">點擊右上角按鈕開始誠實記錄</p>
                    </div>
                  ) : (
                    weeklyWeights.map((w, i) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="text-[10px] font-black text-slate-400 uppercase">{w.week}</div>
                        <div className="flex gap-6">
                          <div className="text-right"><p className="text-[9px] font-bold text-slate-400 uppercase">Weight</p><p className="font-black text-slate-800">{w.weight.toFixed(1)} <span className="text-[10px]">kg</span></p></div>
                          <div className="text-right"><p className="text-[9px] font-bold text-slate-400 uppercase">Body Fat</p><p className="font-black text-rose-500">{w.fat.toFixed(1)}%</p></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </div>
             
             {/* 90 天進度條 */}
             <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={150} /></div>
               <div className="flex justify-between items-start mb-10 relative z-10">
                 <div><h3 className="text-base font-black uppercase tracking-tighter text-rose-500 italic leading-none">90 Days Mission</h3><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-2">Targeting 52.9kg</p></div>
                 <div className="text-right"><p className="text-4xl font-black text-rose-500 italic leading-none">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p><p className="text-[10px] font-black opacity-40 uppercase mt-2">LEFT TO GO</p></div>
               </div>
               <div className="w-full bg-white/10 h-5 rounded-full overflow-hidden mb-10 shadow-inner">
                 <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(5, Math.min(100, (32.4-currentData.fat)/(32.4-bodyGoal.fat)*100))}%` }} />
               </div>
             </div>
          </div>
        )}
      </main>

      {/* 底部導航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-5 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Activity size={28} /><span className="text-[10px] font-black uppercase tracking-widest leading-none">概覽</span></button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Trophy size={28} /><span className="text-[10px] font-black uppercase tracking-widest leading-none">任務</span></button>
        <button onClick={() => setActiveTab('body')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Target size={28} /><span className="text-[10px] font-black uppercase tracking-widest leading-none">體組</span></button>
      </nav>

      {/* 每週結算彈窗 */}
      {showWeeklyInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black mb-6 italic tracking-tighter text-rose-500 flex items-center gap-2"><BarChart3 size={24}/>結算本週真實戰報</h3>
            <form onSubmit={handleAddWeekly} className="space-y-5">
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">日期區間 (例如: 01/12-01/18)</label>
                <input type="text" value={weeklyInput.week} onChange={e=>setWeeklyInput({...weeklyInput, week: e.target.value})} placeholder="MM/DD - MM/DD" className="w-full p-5 bg-slate-50 rounded-[28px] outline-none font-bold border-2 border-transparent focus:border-rose-500 transition-all text-lg shadow-inner" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">結算體重 (kg)</label>
                  <input type="number" step="0.1" value={weeklyInput.weight} onChange={e=>setWeeklyInput({...weeklyInput, weight: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[28px] outline-none font-bold border-2 border-transparent focus:border-rose-500 transition-all text-lg shadow-inner" required />
                </div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">結算體脂 (%)</label>
                  <input type="number" step="0.1" value={weeklyInput.fat} onChange={e=>setWeeklyInput({...weeklyInput, fat: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[28px] outline-none font-bold border-2 border-transparent focus:border-rose-500 transition-all text-lg shadow-inner" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-6 rounded-[32px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-lg"><Save size={24}/> 保存真實戰績</button>
              <button type="button" onClick={() => setShowWeeklyInput(false)} className="w-full text-slate-400 font-bold text-sm py-2">取消</button>
            </form>
          </div>
        </div>
      )}

      {/* 進食回報彈窗 */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-2xl border border-white animate-in zoom-in-95">
            <h3 className="text-3xl font-black mb-8 italic tracking-tighter text-rose-500">進食誠實回報</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const p = newMealContent.includes('鴨') ? 25 : (newMealContent.includes('肉') ? 20 : 12);
                updateLog({ meals: [...currentData.meals, { id: Date.now(), content: newMealContent, protein: p, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]});
                setNewMealContent('');
                setShowAddMeal(false);
            }} className="space-y-6">
              <input type="text" value={newMealContent} onChange={e => setNewMealContent(e.target.value)} placeholder="吃了什麼？老實交代" className="w-full p-7 bg-slate-50 rounded-[32px] outline-none font-bold border-2 border-transparent focus:border-rose-500 transition-all text-xl shadow-inner" autoFocus required />
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-6 rounded-[32px] shadow-2xl text-xl flex items-center justify-center gap-3 active:scale-95 transition-all"><CheckCircle size={28}/> 確認記錄</button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm py-2">取消</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
