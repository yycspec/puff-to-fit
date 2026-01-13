import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Trophy, Target, Droplets, 
  Plus, Moon, AlertCircle, CheckCircle, Trash2, 
  ChevronLeft, ChevronRight, Dribbble, Sparkles, Loader2, Scale, Zap, Flame, Wind, HeartPulse, Leaf, BarChart3, TrendingDown, TrendingUp
} from 'lucide-react';

const formatKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMealContent, setNewMealContent] = useState('');
  
  // --- 戰鬥目標設定 ---
  const [bodyGoal, setBodyGoal] = useState({ weight: 52.9, fat: 25.0 });

  // --- 每週歷史數據 (模擬過去三週的成果) ---
  const [weeklyHistory, setWeeklyHistory] = useState([
    { week: '12/22 - 12/28', fat: 33.5, weight: 59.5, status: 'bad' },
    { week: '12/29 - 01/04', fat: 33.0, weight: 59.2, status: 'good' },
    { week: '01/05 - 01/11', fat: 32.6, weight: 58.9, status: 'good' },
  ]);

  const getDailyMissions = (date) => {
    const day = new Date(date).getDay();
    const list = [
      {id:'m1', name:'核心/籃球', detail:'依當日狀況執行', done: false},
      {id:'m2', name:'纖維優先', detail:'餐前必先吃兩份蔬菜', done: false},
      {id:'m3', name:'水分沖刷', detail:'喝足 2500ml 純水', done: false}
    ];
    if (day === 2) list[0] = {id:'m1', name:'烤鴨生存戰', detail:'餅皮上限 2 片，去油吃肉', done: false};
    return list;
  };

  const [logs, setLogs] = useState({
    [formatKey(new Date())]: {
      water: 1500, weight: 58.7, fat: 32.4, ldl: 145, 
      energy: 4, basketball: false, meals: [
        { id: 1, type: '午餐', content: 'Subway 嫩牛(挖心) + 豆漿', protein: 34, time: '12:15', heartHealthy: true }
      ],
      workouts: getDailyMissions(new Date())
    }
  });

  const currentKey = formatKey(selectedDate);
  const currentData = logs[currentKey] || { 
    water: 0, weight: 58.7, fat: 32.4, ldl: 145, energy: 3, basketball: false, meals: [], 
    workouts: getDailyMissions(selectedDate)
  };

  const updateLog = (updates) => {
    setLogs(prev => ({ ...prev, [currentKey]: { ...currentData, ...updates } }));
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80;

  // --- 教練動態反饋 (新增週變動分析) ---
  const getCoachMessage = () => {
    const lastWeekFat = weeklyHistory[weeklyHistory.length - 1].fat;
    const fatDiff = currentData.fat - lastWeekFat;

    if (currentData.fat > lastWeekFat) return `妳這禮拜是在增脂嗎？體脂比上週平均高了 ${Math.abs(fatDiff).toFixed(1)}%！今晚陶然亭妳一片餅都別想吃！`;
    if (currentData.fat < lastWeekFat) return `看到那下降的 ${Math.abs(fatDiff).toFixed(1)}% 了嗎？這就是妳打球、喝水換來的獎勵。保持下去！`;
    
    return "體脂 32.4% 是妳的起跑點。不要只是路過，要徹底告別它。";
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 font-sans selection:bg-rose-100">
      {/* 頂部導航 */}
      <header className="bg-white sticky top-0 z-30 border-b p-4 pt-10 shadow-sm">
        <div className="flex justify-between items-center mb-6 px-1">
          <h1 className="text-2xl font-black italic text-rose-500 tracking-tighter">PUFF-TO-FIT <span className="text-slate-900 font-black">PRO</span></h1>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button onClick={() => setSelectedDate(d => new Date(d.setDate(d.getDate() - 7)))}><ChevronLeft size={18}/></button>
            <span className="text-[10px] font-black uppercase tracking-widest">{selectedDate.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
            <button onClick={() => setSelectedDate(d => new Date(d.setDate(d.getDate() + 7)))}><ChevronRight size={18}/></button>
          </div>
        </div>
        <div className="flex justify-between px-1">
          {[0,1,2,3,4,5,6].map(i => {
            const d = new Date(selectedDate); d.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
            const isSelected = formatKey(d) === currentKey;
            return (
              <button key={i} onClick={() => setSelectedDate(new Date(d))} className={`flex flex-col items-center w-11 py-3 rounded-2xl transition-all ${isSelected ? 'bg-rose-500 text-white shadow-lg scale-105' : 'text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase">{['日','一','二','三','四','五','六'][i]}</span>
                <span className="text-sm font-black mt-1">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 教練面板 */}
        <div className={`rounded-3xl p-6 text-white shadow-xl border-l-4 transition-all duration-500 ${currentData.fat < 32.6 ? 'bg-emerald-900 border-emerald-400' : 'bg-slate-900 border-rose-500'}`}>
          <div className="flex justify-between items-center mb-4">
             <div className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-2 text-rose-300">
                <BarChart3 size={14}/> 週趨勢分析: {currentData.fat < 32.6 ? 'DOWN' : 'STABLE'}
             </div>
             <div className="text-[10px] font-black opacity-60 uppercase tracking-widest">Accountability</div>
          </div>
          <div className="flex gap-4">
            <div className={`p-3 rounded-2xl h-fit shadow-lg ${currentData.fat < 32.6 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              <AlertCircle size={24}/>
            </div>
            <div>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1 leading-none">Senior's Weekly Review</p>
              <p className="text-sm font-bold leading-relaxed italic">"{getCoachMessage()}"</p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group">
                <Flame className="absolute -right-2 -bottom-2 text-rose-500/10 w-20 h-20" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">蛋白質</span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className={`text-4xl font-black ${totalProtein >= proteinGoal ? 'text-green-500' : ''}`}>{totalProtein}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {proteinGoal}g</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group">
                <Droplets className="absolute -right-2 -bottom-2 text-blue-500/10 w-20 h-20" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">今日飲水</span>
                <div className="text-3xl font-black mt-3 text-blue-500">{currentData.water}</div>
                <button onClick={()=>updateLog({water: currentData.water+250})} className="mt-4 w-full py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl active:scale-95 border border-blue-100">+ 250ml</button>
              </div>
            </div>

            <button onClick={() => updateLog({ basketball: !currentData.basketball })} className={`w-full p-6 rounded-[32px] border-2 flex items-center justify-between transition-all ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${currentData.basketball ? 'bg-white/20' : 'bg-slate-100'}`}><Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''} /></div>
                <h3 className="font-black text-xl italic tracking-tighter uppercase">Basketball Mode</h3>
              </div>
            </button>

            <section className="space-y-4">
               <h2 className="font-black text-lg italic uppercase tracking-tighter px-1">Feeding Log</h2>
               <div className="space-y-3">
                {currentData.meals.map(m => (
                  <div key={m.id} className="bg-white p-5 rounded-[28px] flex justify-between items-center shadow-sm border border-slate-100">
                    <div><p className="text-[10px] font-bold text-slate-300 mb-1">{m.time}</p><p className="text-base font-bold text-slate-800">{m.content}</p></div>
                    <div className="flex items-center gap-4"><span className="font-black text-slate-700">+{m.protein}g</span><button onClick={() => updateLog({meals: currentData.meals.filter(x => x.id !== m.id)})} className="text-slate-200 hover:text-rose-500 p-2"><Trash2 size={18}/></button></div>
                  </div>
                ))}
                <button onClick={() => setShowAddMeal(true)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[28px] text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-all"><Plus size={18}/> 記錄進食</button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800">Survival List</h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div key={w.id} onClick={() => updateLog({workouts: currentData.workouts.map(x => x.id === w.id ? {...x, done: !x.done} : x)})} className={`p-7 rounded-[32px] border-2 transition-all cursor-pointer flex justify-between items-center ${w.done ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex-1">
                    <h4 className={`font-black text-xl ${w.done ? 'text-emerald-700 line-through opacity-50' : 'text-slate-800'}`}>{w.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{w.detail}</p>
                  </div>
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

             {/* --- 每週體組成回報區 (新增) --- */}
             <div className="bg-white p-6 rounded-[32px] border shadow-sm space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-black text-sm uppercase italic tracking-widest text-slate-800 flex items-center gap-2">
                    <BarChart3 size={18} className="text-rose-500"/> 每週體脂回報牆
                  </h3>
                  <div className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-md text-[9px] font-black">SNAPSHOT</div>
                </div>
                <div className="space-y-2">
                   {weeklyHistory.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400">{item.week}</div>
                        <div className="flex gap-6">
                           <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Weight</p>
                              <p className="font-black text-slate-700">{item.weight}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Body Fat</p>
                              <p className={`font-black ${item.status === 'good' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {item.fat}%
                                {idx > 0 && item.fat < weeklyHistory[idx-1].fat ? <TrendingDown size={12} className="inline ml-1"/> : (idx > 0 && <TrendingUp size={12} className="inline ml-1"/>)}
                              </p>
                           </div>
                        </div>
                     </div>
                   ))}
                   <div className="p-4 bg-rose-50 rounded-2xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] font-black text-rose-500 uppercase mb-1">下週一回報日</p>
                      <p className="text-xs font-bold text-rose-400">目前週均預估: {currentData.fat}%</p>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={150} /></div>
               <div className="flex justify-between items-start mb-8 relative z-10">
                 <div><h3 className="text-base font-black uppercase tracking-tighter text-rose-500 italic leading-none">90 Days Mission</h3><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-2">Target: 52.9kg / 25%</p></div>
                 <div className="text-right">
                    <p className="text-4xl font-black text-rose-500 italic leading-none">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p>
                    <p className="text-[10px] font-black opacity-40 uppercase mt-2">LEFT TO GO</p>
                 </div>
               </div>
               <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-10 shadow-inner">
                 <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(5, Math.min(100, (32.4-currentData.fat)/(32.4-bodyGoal.fat)*100))}%` }} />
               </div>
               <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5 relative z-10 text-center">
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/5"><p className="text-[10px] font-black opacity-40 uppercase mb-2">目標體重</p><p className="text-2xl font-black text-rose-500">{bodyGoal.weight}</p></div>
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/5"><p className="text-[10px] font-black opacity-40 uppercase mb-2">目標體脂</p><p className="text-2xl font-black text-rose-500">{bodyGoal.fat}%</p></div>
               </div>
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-5 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Activity size={28} /><span className="text-[10px] font-black uppercase tracking-widest">概覽</span></button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Trophy size={28} /><span className="text-[10px] font-black uppercase tracking-widest">任務</span></button>
        <button onClick={() => setActiveTab('body')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Target size={28} /><span className="text-[10px] font-black uppercase tracking-widest">體組</span></button>
      </nav>

      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-2xl border border-white animate-in zoom-in-95">
            <h3 className="text-3xl font-black mb-8 italic tracking-tighter text-rose-500">Feeding Report</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const p = newMealContent.includes('鴨') ? 25 : (newMealContent.includes('肉') ? 20 : 12);
                updateLog({ meals: [...currentData.meals, { id: Date.now(), content: newMealContent, protein: p, time: "Now" }]});
                setNewMealContent('');
                setShowAddMeal(false);
            }} className="space-y-6">
              <input type="text" value={newMealContent} onChange={e => setNewMealContent(e.target.value)} placeholder="吃了什麼？" className="w-full p-7 bg-slate-50 rounded-[32px] outline-none font-bold border-2 border-transparent focus:border-rose-500 transition-all text-xl" autoFocus />
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-rose-500/30 text-xl flex items-center justify-center gap-3"><CheckCircle size={28}/>確認記錄</button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm py-2">取消</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
