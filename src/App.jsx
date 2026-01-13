import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Trophy, Target, Droplets, 
  Plus, Moon, AlertCircle, CheckCircle, Trash2, 
  ChevronLeft, ChevronRight, Dribbble, Sparkles, Loader2, Scale, Zap, Flame
} from 'lucide-react';

// 輔助函式：格式化日期作為 Key
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
  const [bodyGoal, setBodyGoal] = useState({ weight: 52, fat: 25 });

  // --- 任務模板生成器 ---
  const getDailyMissions = (date) => {
    const day = new Date(date).getDay();
    const list = [];
    switch(day) {
      case 1: list.push({id:'m1', name:'開週核心日', detail:'死蟲式 3組x12下'}, {id:'m2', name:'清腸胃任務', detail:'全日無糖/無加工品'}, {id:'m3', name:'水分補給', detail:'喝足 2000ml'}); break;
      case 2: list.push({id:'m1', name:'烤鴨生存戰', detail:'上限 2 片餅，不吃鴨皮'}, {id:'m2', name:'靠牆蹲訓練', detail:'45秒x3次，加強膝蓋'}, {id:'m3', name:'水分補給', detail:'喝足 2200ml'}); break;
      case 3: list.push({id:'m1', name:'鰻魚飯挑戰', detail:'飯量僅吃 1/3，避開甜醬'}, {id:'m2', name:'餐後消食', detail:'步行 5000 步'}, {id:'m3', name:'水分補給', detail:'喝足 2000ml'}); break;
      case 4: list.push({id:'m1', name:'上肢塑形', detail:'跪姿伏地挺身 10下x3'}, {id:'m2', name:'禁澱粉挑戰', detail:'晚餐零澱粉攝取'}, {id:'m3', name:'水分補給', detail:'喝足 2000ml'}); break;
      case 5: list.push({id:'m1', name:'核心穩定', detail:'棒式 1 分鐘x3次'}, {id:'m2', name:'高纖維挑戰', detail:'每餐蔬菜佔 1/2'}, {id:'m3', name:'水分補給', detail:'喝足 2000ml'}); break;
      case 6: list.push({id:'m1', name:'球場戰鬥', detail:'舊傷處動態熱身'}, {id:'m2', name:'賽後冰敷', detail:'針對膝蓋/大腿處理'}, {id:'m3', name:'水分補給', detail:'打球日喝足 2500ml'}); break;
      case 0: list.push({id:'m1', name:'主動恢復', detail:'滾筒放鬆全腿 15分'}, {id:'m2', name:'深度睡眠', detail:'12:00 前熄燈'}, {id:'m3', name:'下週備餐', detail:'準備明後天的高蛋白餐'}); break;
      default: list.push({id:'m1', name:'每日步行', detail:'8000 步'}, {id:'m2', name:'蛋白質達標', detail:'吃足 80g'}, {id:'m3', name:'水分補給', detail:'2000ml'});
    }
    return list.map(m => ({ ...m, done: false }));
  };

  // --- 數據庫初始化 ---
  const [logs, setLogs] = useState({
    [formatKey(new Date())]: {
      water: 1200, weight: 58, fat: 30, basketball: false,
      meals: [
        { id: 1, type: '早餐', content: '2 顆蛋', protein: 14, time: '08:30' },
        { id: 2, type: '午餐', content: 'Subway 嫩牛 + 豆漿', protein: 34, time: '12:15' }
      ],
      workouts: getDailyMissions(new Date())
    }
  });

  const currentKey = formatKey(selectedDate);
  
  // 獲取當前數據，若無則生成預設值
  const currentData = logs[currentKey] || { 
    water: 0, weight: 58, fat: 30, basketball: false, meals: [], 
    workouts: getDailyMissions(selectedDate)
  };

  // --- 數據更新核心 (修復 Stale Closure) ---
  const updateLog = (updates) => {
    setLogs(prev => {
      const existingDay = prev[currentKey] || { 
        water: 0, weight: 58, fat: 30, basketball: false, meals: [], 
        workouts: getDailyMissions(selectedDate)
      };
      return { 
        ...prev, 
        [currentKey]: { ...existingDay, ...updates } 
      };
    });
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80;

  // --- 動態教練反饋系統 ---
  const getCoachMessage = () => {
    const isToday = currentKey === formatKey(new Date());
    if (!isToday) return "正在翻閱妳的歷史。那時的妳，有對得起這雙球鞋嗎？";

    if (currentData.fat > 28) {
      if (totalProtein < 30) return "體脂還在 30% 邊緣，妳竟然只吃這點蛋白質？妳是想瘦成一片紙嗎？";
      if (currentData.water < 1000) return "水喝這麼少，代謝都停工了！給我去喝水，現在！";
    }
    
    if (currentData.basketball) {
      if (totalProtein < 50) return "打球日要吃肉！這是命令！不然妳只是在燃燒妳辛苦練出來的肌肉。";
      return "球場上的戰士，蛋白質就是妳的彈藥。補足它，然後贏下今晚。";
    }

    if (totalProtein >= proteinGoal) return "不錯，現在的妳看起來像個贏家。保持紀律，今晚準時熄燈。";
    
    return "盯著妳呢。每一口塞進嘴裡的精緻澱粉，都會變成明天體脂計上的眼淚。";
  };

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
    const p = newMealContent.includes('鴨') ? 25 : (newMealContent.includes('肉') ? 20 : 12);
    const newMeal = {
      id: Date.now(),
      content: newMealContent,
      protein: p,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateLog({ meals: [...currentData.meals, newMeal] });
    setNewMealContent('');
    setShowAddMeal(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 font-sans overflow-x-hidden transition-colors duration-500 selection:bg-rose-100">
      {/* 頂部日曆導航 */}
      <header className="bg-white sticky top-0 z-30 border-b p-4 shadow-sm pt-10">
        <div className="flex justify-between items-center mb-6 px-1">
          <h1 className="text-2xl font-black italic text-rose-500 tracking-tighter">PUFF-TO-FIT PRO</h1>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button onClick={() => setSelectedDate(d => new Date(d.setDate(d.getDate() - 7)))} className="p-1 active:scale-90 transition-transform"><ChevronLeft size={18}/></button>
            <span className="text-[10px] font-black uppercase tracking-widest">{selectedDate.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
            <button onClick={() => setSelectedDate(d => new Date(d.setDate(d.getDate() + 7)))} className="p-1 active:scale-90 transition-transform"><ChevronRight size={18}/></button>
          </div>
        </div>
        <div className="flex justify-between">
          {[0,1,2,3,4,5,6].map(i => {
            const d = new Date(selectedDate);
            d.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
            const isSelected = formatKey(d) === currentKey;
            const isToday = formatKey(d) === formatKey(new Date());
            return (
              <button 
                key={i} 
                onClick={() => setSelectedDate(new Date(d))} 
                className={`flex flex-col items-center w-11 py-3 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-rose-500 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <span className="text-[10px] font-bold uppercase">{['日','一','二','三','四','五','六'][i]}</span>
                <span className="text-sm font-black mt-1">{d.getDate()}</span>
                {isToday && !isSelected && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 animate-pulse"></div>}
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 動態教練反饋區 */}
        <div className={`rounded-3xl p-5 text-white shadow-xl border-l-4 transition-all duration-500 ${totalProtein >= proteinGoal ? 'bg-emerald-900 border-emerald-500' : 'bg-slate-900 border-rose-500'}`}>
          <div className="flex gap-4">
            <div className={`p-2.5 rounded-2xl h-fit shadow-lg ${totalProtein >= proteinGoal ? 'bg-emerald-500 animate-bounce' : 'bg-rose-500'}`}>
              {totalProtein >= proteinGoal ? <Trophy size={22}/> : <AlertCircle size={22}/>}
            </div>
            <div>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Coach's Live Feedback</p>
              <p className="text-sm font-bold leading-relaxed italic tracking-tight">"{getCoachMessage()}"</p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in">
            {/* 核心數據卡 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group">
                <Flame className="absolute -right-2 -bottom-2 text-rose-500/10 w-20 h-20 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">蛋白質</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-4xl font-black ${totalProtein >= proteinGoal ? 'text-green-500' : 'text-slate-800'}`}>{totalProtein}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {proteinGoal}g</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className="bg-rose-500 h-full transition-all duration-1000 ease-out" style={{width: `${Math.min(100, (totalProtein/proteinGoal)*100)}%`}}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group">
                <Droplets className="absolute -right-2 -bottom-2 text-blue-500/10 w-20 h-20 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">飲水量</span>
                <div className="text-3xl font-black mt-2 text-blue-500">{currentData.water} <span className="text-xs">ml</span></div>
                <button onClick={() => updateLog({water: currentData.water + 250})} className="mt-4 w-full py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl active:scale-95 transition-transform border border-blue-100 shadow-sm">+ 250ml</button>
              </div>
            </div>

            {/* 籃球開關 */}
            <button 
              onClick={() => updateLog({ basketball: !currentData.basketball })}
              className={`w-full p-6 rounded-[32px] border-2 flex items-center justify-between transition-all duration-500 ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-orange-200 shadow-xl' : 'bg-white border-slate-100 text-slate-400'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${currentData.basketball ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-xl italic tracking-tighter uppercase">Basketball Mode</h3>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">
                    {currentData.basketball ? "啟動高代謝模式 (P:95g)" : "標準代謝模式 (P:80g)"}
                  </p>
                </div>
              </div>
              <div className={`w-14 h-7 rounded-full p-1 transition-all ${currentData.basketball ? 'bg-orange-900/20' : 'bg-slate-200'}`}>
                 <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all ${currentData.basketball ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </button>

            {/* 飲食日誌 */}
            <section className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <h2 className="font-black text-xl italic uppercase tracking-tighter flex items-center gap-2">
                  <Utensils size={20} className="text-rose-500"/> Feeding Log
                </h2>
                <button onClick={() => setShowAddMeal(true)} className="bg-rose-500 text-white p-2.5 rounded-2xl shadow-lg active:scale-90 transition-all hover:bg-rose-600"><Plus size={24}/></button>
              </div>
              <div className="space-y-3">
                {currentData.meals.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[32px] bg-white/50">
                    <p className="text-xs text-slate-400 font-bold italic">這天還沒有進食回報...</p>
                  </div>
                ) : (
                  currentData.meals.map(m => (
                    <div key={m.id} className="bg-white p-5 rounded-[28px] flex justify-between items-center shadow-sm border border-slate-100 group animate-in slide-in-from-left-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-300 w-10">{m.time}</span>
                        <div>
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-0.5">Meal Log</p>
                          <p className="text-base font-bold text-slate-800">{m.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-slate-700">+{m.protein}g</span>
                        <button onClick={() => deleteMeal(m.id)} className="text-slate-200 hover:text-rose-500 transition-colors p-2"><Trash2 size={18}/></button>
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
            <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter flex items-center gap-2">
              <Trophy size={24} className="text-amber-500"/> Daily Triple Missions
            </h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div 
                  key={w.id} 
                  onClick={() => toggleWorkout(w.id)}
                  className={`p-7 rounded-[32px] border-2 transition-all cursor-pointer flex justify-between items-center active:scale-[0.98] ${w.done ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                  <div className="flex-1">
                    <h4 className={`font-black text-xl ${w.done ? 'text-emerald-700 line-through opacity-50 transition-all' : 'text-slate-800'}`}>{w.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{w.detail}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${w.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-slate-50'}`}>
                    {w.done && <CheckCircle size={20} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800 flex items-center gap-2">
               <Scale size={24} className="text-indigo-500"/> Body Analyzer
             </h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[32px] border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目前體重 (kg)</span>
                 <input 
                   type="number" 
                   step="0.1" 
                   value={currentData.weight} 
                   onChange={(e) => updateLog({ weight: parseFloat(e.target.value) || 0 })} 
                   className="text-4xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-rose-500 transition-colors py-2 mt-1" 
                 />
               </div>
               <div className="bg-white p-6 rounded-[32px] border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目前體脂 (%)</span>
                 <input 
                   type="number" 
                   step="0.1" 
                   value={currentData.fat} 
                   onChange={(e) => updateLog({ fat: parseFloat(e.target.value) || 0 })} 
                   className="text-4xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-rose-500 transition-colors py-2 mt-1" 
                 />
               </div>
             </div>
             
             <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={150} /></div>
               <div className="flex justify-between items-start mb-8 relative z-10">
                 <div>
                    <h3 className="text-base font-black uppercase tracking-tighter text-rose-500 italic">Body Goal Progress</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Targeting {bodyGoal.fat}% Body Fat</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black opacity-40 uppercase">距離目標</p>
                    <p className="text-3xl font-black text-rose-500 italic">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p>
                 </div>
               </div>
               
               <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-10 shadow-inner">
                 <div 
                   className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(244,63,94,0.6)]" 
                   style={{ width: `${Math.max(5, Math.min(100, (30-currentData.fat)/(30-bodyGoal.fat)*100))}%` }}
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5 relative z-10">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black opacity-40 uppercase mb-1">目標體重</p>
                    <input 
                      type="number" 
                      value={bodyGoal.weight} 
                      onChange={(e) => setBodyGoal(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                      className="text-xl font-black bg-transparent w-full outline-none text-rose-500"
                    />
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black opacity-40 uppercase mb-1">目標體脂</p>
                    <input 
                      type="number" 
                      value={bodyGoal.fat} 
                      onChange={(e) => setBodyGoal(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
                      className="text-xl font-black bg-transparent w-full outline-none text-rose-500"
                    />
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* 底部導航欄 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-5 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Activity size={28} /><span className="text-[10px] font-black uppercase tracking-widest">概覽</span>
        </button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Trophy size={28} /><span className="text-[10px] font-black uppercase tracking-widest">任務</span>
        </button>
        <button onClick={() => setActiveTab('body')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}>
          <Target size={28} /><span className="text-[10px] font-black uppercase tracking-widest">體組</span>
        </button>
      </nav>

      {/* 新增飲食彈窗 */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-2xl border border-white animate-in zoom-in-95">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-3 italic tracking-tighter">
              <Sparkles className="text-rose-500" /> 進食回報
            </h3>
            <form onSubmit={handleAddMeal} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">吃了什麼？ (教練會評估)</label>
                <input 
                  type="text" 
                  value={newMealContent} 
                  onChange={e => setNewMealContent(e.target.value)} 
                  placeholder="例如：6片烤鴨肉、2片餅皮..." 
                  className="w-full p-6 bg-slate-50 rounded-[28px] outline-none font-bold focus:ring-4 focus:ring-rose-500/10 border-2 border-transparent focus:border-rose-500 transition-all text-xl shadow-inner" 
                  autoFocus 
                />
              </div>
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-6 rounded-[28px] flex items-center justify-center gap-4 active:scale-95 shadow-2xl shadow-rose-500/30 text-xl transition-all hover:bg-rose-600">
                <CheckCircle size={28} /> 確認記錄
              </button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm py-2 hover:text-slate-600 transition-colors">先不要，我還在吃</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
