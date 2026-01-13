import React, { useState, useEffect } from 'react';
import { 
  Activity, Utensils, Trophy, Target, Droplets, 
  Plus, Moon, AlertCircle, CheckCircle, Trash2, 
  ChevronLeft, ChevronRight, Dribbble, Sparkles, Loader2, Scale, Zap
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
  const [bodyGoal, setBodyGoal] = useState({ weight: 52, fat: 25 });

  // 預設每日任務模板
  const getDailyMissions = (date) => {
    const day = date.getDay();
    const list = [];
    switch(day) {
      case 1: list.push({id:'m1', name:'開週核心', detail:'死蟲式 3組x12下'}, {id:'m2', name:'清腸胃任務', detail:'全日無糖/無加工品'}, {id:'m3', name:'水分補給', detail:'喝足 2000ml'}); break;
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
  const currentData = logs[currentKey] || { 
    water: 0, weight: 58, fat: 30, basketball: false, meals: [], 
    workouts: getDailyMissions(selectedDate)
  };

  const updateLog = (updates) => {
    setLogs(prev => ({ ...prev, [currentKey]: { ...currentData, ...updates } }));
  };

  const totalProtein = currentData.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const proteinGoal = currentData.basketball ? 95 : 80;

  // --- 教練靈魂邏輯 (動態 Feedback) ---
  const getCoachMessage = () => {
    const isToday = currentKey === formatKey(new Date());
    if (!isToday) return "正在翻閱妳的歷史紀錄。當時的妳，對得起現在的努力嗎？";

    if (currentData.basketball && totalProtein < 40) return "打球日還只吃這點蛋白質？妳是想把肌肉燒掉嗎？快去補充蛋白質！";
    if (totalProtein >= proteinGoal && currentData.water >= 2000) return "不錯，現在的妳看起來像個贏家。保持節奏，今晚別破功！";
    if (currentData.water < 1000) return "妳渴得像片乾旱的土地，代謝都停工了！給我去喝水！現在！";
    if (totalProtein < 30) return "蛋白質進度慘不忍睹。妳以為靠喝空氣能長肌肉嗎？";
    if (selectedDate.getDay() === 2 && !currentData.workouts.find(w => w.id === 'm1')?.done) return "陶然亭烤鴨在等妳，但我的深蹲罰單也在等妳。記得餅皮上限！";
    
    return "盯著妳呢。每一片塞進嘴裡的鴨皮，都會變成明天體脂計上的眼淚。";
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 font-sans overflow-hidden">
      <header className="bg-white sticky top-0 z-30 border-b p-4 shadow-sm pt-8">
        <div className="flex justify-between items-center mb-6 px-2">
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
            return (
              <button key={i} onClick={() => setSelectedDate(new Date(d))} className={`flex flex-col items-center w-11 py-3 rounded-2xl transition-all ${isSelected ? 'bg-rose-500 text-white shadow-lg scale-105' : 'text-slate-400'}`}>
                <span className="text-[10px] font-black">{['日','一','二','三','四','五','六'][i]}</span>
                <span className="text-sm font-black mt-1">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 動態教練面板 */}
        <div className={`rounded-3xl p-5 text-white shadow-xl border-l-4 transition-all duration-500 ${totalProtein >= proteinGoal ? 'bg-emerald-900 border-emerald-500' : 'bg-slate-900 border-rose-500'}`}>
          <div className="flex gap-3">
            <div className={`p-2 rounded-xl h-fit shadow-lg ${totalProtein >= proteinGoal ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {totalProtein >= proteinGoal ? <Trophy size={20}/> : <AlertCircle size={20}/>}
            </div>
            <div>
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">前輩教官反饋</p>
              <p className="text-sm font-bold leading-relaxed italic">"{getCoachMessage()}"</p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden">
                <Flame className="absolute -right-2 -bottom-2 text-rose-500/10 w-16 h-16" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">蛋白質</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-3xl font-black ${totalProtein >= proteinGoal ? 'text-green-500' : ''}`}>{totalProtein}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {proteinGoal}g</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden">
                <Droplets className="absolute -right-2 -bottom-2 text-blue-500/10 w-16 h-16" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">飲水</span>
                <div className="text-2xl font-black mt-2 text-blue-500">{currentData.water} <span className="text-xs">ml</span></div>
                <button onClick={() => updateLog({water: currentData.water + 250})} className="mt-3 w-full py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl active:scale-95 transition-transform">+ 250ml</button>
              </div>
            </div>

            <button onClick={() => updateLog({ basketball: !currentData.basketball })} className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-500 ${currentData.basketball ? 'bg-orange-500 border-orange-600 text-white shadow-orange-200 shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${currentData.basketball ? 'bg-white/20' : 'bg-slate-100'}`}><Dribbble size={32} className={currentData.basketball ? 'animate-bounce' : ''} /></div>
                <div className="text-left"><h3 className="font-black text-lg italic tracking-tighter uppercase">Basketball Mode</h3><p className="text-[10px] font-bold opacity-70 tracking-widest uppercase">{currentData.basketball ? "啟動高代謝模式 (P:95g)" : "標準代謝模式"}</p></div>
              </div>
            </button>

            <section>
              <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="font-black text-lg italic uppercase tracking-tighter">Feeding Log</h2>
                <button onClick={() => setShowAddMeal(true)} className="bg-rose-500 text-white p-2 rounded-2xl shadow-lg active:scale-90"><Plus size={20}/></button>
              </div>
              <div className="space-y-3">
                {currentData.meals.length === 0 ? <p className="text-center py-10 text-slate-400 text-xs italic border-2 border-dashed border-slate-100 rounded-3xl">今日尚無回報...</p> : currentData.meals.map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border animate-in slide-in-from-left-4">
                    <div className="flex items-center gap-3"><span className="text-[10px] font-black text-slate-300">{m.time}</span><p className="text-sm font-bold">{m.content}</p></div>
                    <div className="flex items-center gap-3"><span className="text-sm font-black">+{m.protein}g</span><button onClick={() => updateLog({meals: currentData.meals.filter(x => x.id !== m.id)})} className="text-slate-200 hover:text-rose-500"><Trash2 size={16}/></button></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter">Triple Missions</h2>
            <div className="space-y-3">
              {currentData.workouts.map(w => (
                <div key={w.id} onClick={() => updateLog({ workouts: currentData.workouts.map(x => x.id === w.id ? {...x, done: !x.done} : x) })} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center active:scale-[0.98] ${w.done ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div><h4 className={`font-black text-lg ${w.done ? 'text-emerald-700 line-through opacity-50' : ''}`}>{w.name}</h4><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{w.detail}</p></div>
                  {w.done ? <CheckCircle className="text-emerald-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">任務每日自動更新，請準時完成</p>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="font-black text-2xl italic px-1 uppercase tracking-tighter text-slate-800">Body Analyzer</h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-3xl border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目前體重 (kg)</span>
                 <input type="number" step="0.1" value={currentData.weight} onChange={(e) => updateLog({ weight: parseFloat(e.target.value) || 0 })} className="text-3xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:border-rose-500 outline-none mt-1 py-1" />
               </div>
               <div className="bg-white p-6 rounded-3xl border shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目前體脂 (%)</span>
                 <input type="number" step="0.1" value={currentData.fat} onChange={(e) => updateLog({ fat: parseFloat(e.target.value) || 0 })} className="text-3xl font-black w-full bg-transparent border-b-2 border-slate-100 focus:border-rose-500 outline-none mt-1 py-1" />
               </div>
             </div>
             <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={120} /></div>
               <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-rose-500 italic">Target Progress</h3>
               <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-8">
                 <div className="bg-rose-500 h-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(0, Math.min(100, (30-currentData.fat)/(30-bodyGoal.fat)*100))}%` }} />
               </div>
               <div className="flex justify-around pt-6 border-t border-white/5">
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase mb-1">目前</p><p className="text-xl font-black">{currentData.fat}%</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase mb-1 text-rose-500">距離目標</p><p className="text-xl font-black text-rose-500 italic">{(currentData.fat - bodyGoal.fat).toFixed(1)}%</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-40 uppercase mb-1">目標</p><p className="text-xl font-black">{bodyGoal.weight}kg</p></div>
               </div>
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 pb-10 flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Activity size={26} /><span className="text-[10px] font-black uppercase tracking-widest">概覽</span></button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'workout' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Trophy size={26} /><span className="text-[10px] font-black uppercase tracking-widest">任務</span></button>
        <button onClick={() => setActiveTab('body')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'body' ? 'text-rose-500 scale-110 font-bold' : 'text-slate-400 opacity-60'}`}><Target size={26} /><span className="text-[10px] font-black uppercase tracking-widest">體組</span></button>
      </nav>

      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-7 rounded-[40px] shadow-2xl border border-white">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2 italic tracking-tighter"><Sparkles className="text-rose-500" /> 進食回報</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                if(!newMealContent) return;
                const p = newMealContent.includes('鴨') ? 25 : 15;
                updateLog({ meals: [...currentData.meals, { id: Date.now(), content: newMealContent, protein: p, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]});
                setNewMealContent('');
                setShowAddMeal(false);
            }} className="space-y-5">
              <input type="text" value={newMealContent} onChange={e => setNewMealContent(e.target.value)} placeholder="剛吃了什麼？" className="w-full p-6 bg-slate-50 rounded-3xl outline-none font-bold border-2 border-transparent focus:border-rose-500 transition-all text-lg" autoFocus />
              <button type="submit" className="w-full bg-rose-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-rose-500/20 text-lg">確認記錄</button>
              <button type="button" onClick={() => setShowAddMeal(false)} className="w-full text-slate-400 font-bold text-sm py-2">取消</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
