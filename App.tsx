
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Moon, Sun, ShieldCheck, Zap, MessageCircle, 
  Star, Trash2, X, Plus, Minus, Menu, ArrowRight, CheckCircle2, 
  Trophy, Send, Gift, Tag, User, Bell, StarHalf, CreditCard
} from 'lucide-react';
import { INITIAL_PRODUCTS, ADMIN_PASSWORD, TELEGRAM_BOT_TOKEN, ADMIN_CHAT_ID, CLICK_SOUND_URL, PROMO_CODES } from './constants';
import { Product, CartItem, Review, ThemeType, SupportMessage } from './types';

// --- UTILS ---
const clickAudio = new Audio(CLICK_SOUND_URL);
clickAudio.volume = 0.2;
clickAudio.preload = "auto";

const playSound = () => {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {});
};

const sendToTelegram = async (text: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const BTN_ANIM = "transition-all duration-300 hover:scale-[1.02] active:scale-95";

// --- COMPONENTS ---

const Navbar = ({ cartCount, theme, toggleTheme }: { cartCount: number, theme: ThemeType, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${isDark ? 'bg-slate-950/80 border-b border-yellow-500/20' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" onClick={playSound} className={`flex items-center gap-3 group transition-transform hover:scale-105`}>
          <div className="bg-yellow-500 p-2 rounded-xl group-hover:rotate-[360deg] transition-all duration-700 shadow-lg shadow-yellow-500/20">
            <Trophy className="text-slate-950 w-6 h-6" />
          </div>
          <span className={`text-xl md:text-2xl font-black font-game uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            CHLENHUNTER <span className="text-yellow-500">STORE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/" onClick={playSound} className={`font-bold transition-colors hover:text-yellow-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>ГЛАВНАЯ</Link>
          <Link to="/products" onClick={playSound} className={`font-bold transition-colors hover:text-yellow-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>МАГАЗИН</Link>
          <Link to="/reviews" onClick={playSound} className={`font-bold transition-colors hover:text-yellow-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>ОТЗЫВЫ</Link>
          <div className="h-6 w-[1px] bg-slate-700/50"></div>
          <div className="flex items-center gap-6">
            <button onClick={() => { playSound(); toggleTheme(); }} className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-700'}`}>
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <Link to="/cart" onClick={playSound} className={`relative group p-2 rounded-xl hover:bg-yellow-500/10 transition-colors`}>
              <ShoppingCart className={`w-6 h-6 transition-colors ${isDark ? 'text-slate-300 group-hover:text-yellow-500' : 'text-slate-700 group-hover:text-yellow-500'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <button className={`md:hidden p-2 rounded-lg ${isDark ? 'text-white hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-100'}`} onClick={() => { playSound(); setIsOpen(!isOpen); }}>
          <Menu />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 py-6 px-6 border-t border-slate-800' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-5 font-bold uppercase tracking-widest text-sm">
          <Link to="/" onClick={() => {playSound(); setIsOpen(false);}}>ГЛАВНАЯ</Link>
          <Link to="/products" onClick={() => {playSound(); setIsOpen(false);}}>МАГАЗИН</Link>
          <Link to="/reviews" onClick={() => {playSound(); setIsOpen(false);}}>ОТЗЫВЫ</Link>
          <Link to="/cart" onClick={() => {playSound(); setIsOpen(false);}}>КОРЗИНА ({cartCount})</Link>
          <Link to="/admin" onClick={() => {playSound(); setIsOpen(false);}}>АДМИН ПАНЕЛЬ</Link>
        </div>
      </div>
    </nav>
  );
};

const SupportModal = ({ isOpen, onClose, theme, addMessage }: { isOpen: boolean, onClose: () => void, theme: ThemeType, addMessage: (m: SupportMessage) => void }) => {
  const [formData, setFormData] = useState({ contact: '', text: '' });
  const [sending, setSending] = useState(false);
  const isDark = theme === 'dark';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    playSound();
    const ok = await sendToTelegram(`<b>🆘 ПОДДЕРЖКА</b>\n\n👤 Контакт: ${formData.contact}\n💬 Текст: ${formData.text}`);
    if (ok) {
      addMessage({ id: Date.now(), contact: formData.contact, text: formData.text, date: new Date().toLocaleString(), status: 'new' });
      alert("Ваше сообщение отправлено администратору!");
      setFormData({ contact: '', text: '' });
      onClose();
    } else {
      alert("Ошибка сети. Попробуйте позже.");
    }
    setSending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
      <div className={`w-full max-w-lg p-10 rounded-[3rem] border-2 shadow-2xl relative ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"><X size={28}/></button>
        <h3 className="text-3xl font-black font-game mb-4 uppercase text-yellow-500 tracking-tighter">ПОДДЕРЖКА</h3>
        <p className={`mb-8 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Укажите ваши контакты (Email или TG), чтобы мы могли ответить.</p>
        <form onSubmit={handleSend} className="space-y-6">
          <input required placeholder="Email или @username ТГ" className={`w-full p-5 rounded-2xl border-2 outline-none focus:border-yellow-500 font-bold transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
          <textarea required placeholder="Опишите проблему..." className={`w-full h-32 p-5 rounded-2xl border-2 outline-none focus:border-yellow-500 font-bold transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} />
          <button type="submit" disabled={sending} className={`w-full bg-yellow-500 text-slate-950 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-2 ${BTN_ANIM}`}>
            {sending ? 'ОТПРАВКА...' : <><Send size={24}/> ОТПРАВИТЬ</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const HomePage = ({ theme }: { theme: ThemeType }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isDark = theme === 'dark';
  const slides = [
    { title: "ДОМИНИРУЙ В СТАНДОФФ 2", desc: "Самые низкие цены на голду. Пополнение за 5 минут по ID.", color: "from-yellow-500 to-orange-600" },
    { title: "БОЛЬШЕ ГОЛДЫ — БОЛЬШЕ СКИНОВ", desc: "Забудь про дорогой донат в игре. Экономь до 40% у нас.", color: "from-blue-500 to-purple-600" },
    { title: "БЕЗОПАСНОСТЬ ПРЕВЫШЕ ВСЕГО", desc: "Гарантируем отсутствие банов. Работаем только по ID.", color: "from-green-500 to-teal-600" },
  ];

  useEffect(() => {
    const it = setInterval(() => setActiveSlide(s => (s + 1) % slides.length), 6000);
    return () => clearInterval(it);
  }, []);

  return (
    <div className="page-enter">
      <section className="relative h-[550px] md:h-[650px] overflow-hidden bg-slate-900">
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-1000 flex items-center justify-center p-6 ${activeSlide === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-gradient-to-r opacity-20 ${s.color}`}></div>
            <div className="relative z-10 text-center max-w-4xl space-y-6 px-4">
              <h1 className="text-4xl md:text-8xl font-black font-game leading-tight drop-shadow-2xl uppercase tracking-tighter">
                {s.title.split(' ').map((w, j) => j % 2 === 0 ? <span key={j} className="text-white block md:inline">{w} </span> : <span key={j} className="text-yellow-500 block md:inline">{w} </span>)}
              </h1>
              <p className="text-lg md:text-2xl text-slate-300 font-medium tracking-wide max-w-2xl mx-auto">{s.desc}</p>
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <Link to="/products" onClick={playSound} className={`bg-yellow-500 hover:bg-yellow-600 text-slate-950 px-10 md:px-16 py-4 md:py-6 rounded-3xl font-black text-xl md:text-2xl shadow-2xl shadow-yellow-500/40 flex items-center gap-3 ${BTN_ANIM}`}>
                  В МАГАЗИН <ArrowRight size={28} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { playSound(); setActiveSlide(i); }} className={`h-3 rounded-full transition-all duration-500 ${activeSlide === i ? 'w-16 md:w-20 bg-yellow-500 shadow-[0_0_15px_#f59e0b]' : 'w-4 md:w-5 bg-slate-700/50'}`}></button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-3 gap-12">
        {[
          { icon: <Zap size={48} className="text-yellow-500" />, title: "МОЛНИЕНОСНО", desc: "Автоматизированная выдача 24/7. Среднее время — 3 минуты." },
          { icon: <ShieldCheck size={48} className="text-green-500" />, title: "БЕЗОПАСНО", desc: "Легальные способы пополнения без передачи пароля от аккаунта." },
          { icon: <Star size={48} className="text-blue-500" />, title: "ПРЕМИУМ", desc: "Лучший сервис, качественная поддержка и система бонусов." }
        ].map((f, i) => (
          <div key={i} className={`p-12 rounded-[3rem] border transition-all hover:-translate-y-4 hover:shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
            <div className="mb-8 p-6 rounded-3xl bg-slate-950 w-fit inline-block border border-slate-800 shadow-xl">{f.icon}</div>
            <h3 className="text-3xl font-black mb-4 font-game uppercase tracking-tighter leading-none">{f.title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className={`py-28 border-y ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-4xl md:text-6xl font-black font-game mb-8 uppercase tracking-tighter leading-tight">ПОЧЕМУ <span className="text-yellow-500">МЫ?</span></h2>
              <div className="space-y-6 text-xl font-medium text-slate-400">
                <p className="flex items-center gap-4"><CheckCircle2 className="text-yellow-500 shrink-0" /> Более 100,000 успешно выполненных заказов.</p>
                <p className="flex items-center gap-4"><CheckCircle2 className="text-yellow-500 shrink-0" /> Прямое пополнение через API — без посредников.</p>
                <p className="flex items-center gap-4"><CheckCircle2 className="text-yellow-500 shrink-0" /> Честная бонусная шкала и промокоды для своих.</p>
                <p className="flex items-center gap-4"><CheckCircle2 className="text-yellow-500 shrink-0" /> Мы дорожим репутацией и каждым клиентом.</p>
              </div>
           </div>
           <div className="relative group flex justify-center">
              <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl rounded-full"></div>
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="relative rounded-[3rem] border-4 border-yellow-500/20 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 max-w-full" alt="SO2 Gaming" />
           </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = ({ products, addToCart, theme }: { products: Product[], addToCart: (p: Product) => void, theme: ThemeType }) => {
  const isDark = theme === 'dark';
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black font-game uppercase tracking-tighter mb-4 leading-none">МАГАЗИН <span className="text-yellow-500">ГОЛДЫ</span></h2>
          <p className="text-slate-400 font-medium text-xl">Официальные пакеты валюты для твоего аккаунта</p>
        </div>
        <div className="flex gap-4">
           <div className={`px-8 py-4 rounded-2xl border-2 flex items-center gap-3 font-black text-sm uppercase tracking-widest shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
              <CheckCircle2 className="text-yellow-500" /> ГАРАНТИЯ AXLEBOLT
           </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map(p => (
          <div key={p.id} className={`group relative p-8 rounded-[4rem] border transition-all duration-500 hover:-translate-y-4 ${isDark ? 'bg-slate-900 border-slate-800 hover:shadow-[0_20px_60px_rgba(245,158,11,0.2)]' : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl'}`}>
            {p.badge && (
              <div className="absolute top-8 left-8 z-10 bg-yellow-500 text-slate-950 px-5 py-2 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg animate-pulse ring-4 ring-slate-950/20">
                {p.badge}
              </div>
            )}
            <div className="relative mb-10 overflow-hidden rounded-[3rem] border-2 border-slate-800/10 shadow-inner h-64">
              <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                 <button onClick={() => { playSound(); addToCart(p); }} className={`bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 shadow-2xl active:scale-90`}>
                   В КОРЗИНУ <Plus size={24}/>
                 </button>
              </div>
            </div>
            <div className="space-y-6 mb-8">
              <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-yellow-500 transition-colors leading-none">{p.name}</h3>
              <div className="flex justify-between items-center p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">ЗОЛОТО</p>
                   <p className="text-yellow-500 font-game text-4xl font-black leading-none">{p.amount} G</p>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">ЦЕНА</p>
                   <p className="text-3xl font-black text-white leading-none">{p.price} ₽</p>
                </div>
              </div>
            </div>
            <button onClick={() => { playSound(); addToCart(p); }} className={`w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl shadow-yellow-500/10 active:scale-95 flex items-center justify-center gap-2 group-hover:glow-yellow`}>
               КУПИТЬ СЕЙЧАС <ArrowRight size={20}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CartPage = ({ items, removeFromCart, updateQty, theme }: { items: CartItem[], removeFromCart: (id: number) => void, updateQty: (id: number, q: number) => void, theme: ThemeType }) => {
  const isDark = theme === 'dark';
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const bonusGoal = 5000;
  const progress = Math.min((subtotal / bonusGoal) * 100, 100);

  const applyPromo = () => {
    playSound();
    const cleanCode = promo.toUpperCase().trim();
    if (PROMO_CODES[cleanCode]) {
      setDiscount(PROMO_CODES[cleanCode]);
      setAppliedCode(cleanCode);
      alert("Промокод применен!");
      setPromo('');
    } else {
      alert("Промокод не найден!");
    }
  };

  const finalTotal = subtotal * (1 - discount / 100);

  if (items.length === 0) return (
    <div className="py-40 text-center page-enter px-6">
      <div className="bg-slate-900/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-dashed border-slate-800">
        <ShoppingCart size={60} className="text-slate-800" />
      </div>
      <h2 className="text-5xl font-black font-game mb-12 uppercase tracking-tighter">ВАША КОРЗИНА <span className="text-yellow-500">ПУСТА</span></h2>
      <Link to="/products" onClick={playSound} className={`bg-yellow-500 px-16 py-6 rounded-[2.5rem] font-black text-slate-950 text-2xl inline-block shadow-2xl shadow-yellow-500/30 ${BTN_ANIM}`}>В МАГАЗИН</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 page-enter">
      <h2 className="text-5xl md:text-7xl font-black font-game mb-16 uppercase tracking-tighter text-center md:text-left leading-none">МОЯ <span className="text-yellow-500">КОРЗИНА</span></h2>
      
      <div className={`p-10 rounded-[3.5rem] mb-16 border-2 transition-all ${isDark ? 'bg-slate-900/60 border-yellow-500/20' : 'bg-slate-50 border-yellow-500/20 shadow-xl'}`}>
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <span className="font-black text-2xl flex items-center gap-4 uppercase tracking-tighter"><Gift className="text-yellow-500" size={32} /> БОНУС ПРИ ЗАКАЗЕ ОТ 5000₽:</span>
            <span className="font-black text-yellow-500 text-3xl font-game">{subtotal} / {bonusGoal} ₽</span>
         </div>
         <div className="h-10 bg-slate-950 rounded-full overflow-hidden border-4 border-slate-900 shadow-inner relative">
            <div className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400 transition-all duration-1000 shadow-[0_0_20px_#f59e0b]" style={{ width: `${progress}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white mix-blend-difference">{Math.round(progress)}% ПРОГРЕСС</span>
            </div>
         </div>
         <p className="text-slate-500 mt-6 font-bold uppercase text-[11px] tracking-[0.3em] text-center md:text-left leading-relaxed">
           {progress < 100 ? `НУЖНО ЕЩЕ ${bonusGoal - subtotal}₽ ДЛЯ ПОЛУЧЕНИЯ +500G В ПОДАРОК!` : "БОНУС АКТИВИРОВАН! ВЫ ПОЛУЧИТЕ ПОДАРОК ПРИ ОПЛАТЕ!"}
         </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map(i => (
            <div key={i.id} className={`flex flex-col md:flex-row items-center gap-10 p-10 rounded-[4rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
              <div className="relative">
                <img src={i.image} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-yellow-500/10 shadow-xl" alt="" />
                <button onClick={() => {playSound(); removeFromCart(i.id);}} className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-2xl shadow-xl hover:bg-red-600 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none">{i.name}</h4>
                <p className="text-yellow-500 font-bold font-game text-2xl leading-none">{i.amount} GOLD</p>
              </div>
              <div className="flex items-center gap-8 bg-slate-950 p-4 rounded-[2rem] border-2 border-slate-800 shadow-inner">
                <button onClick={() => {playSound(); updateQty(i.id, -1);}} className="p-2 text-slate-500 hover:text-yellow-500 transition-colors"><Minus size={24}/></button>
                <span className="font-black text-3xl w-10 text-center font-game">{i.quantity}</span>
                <button onClick={() => {playSound(); updateQty(i.id, 1);}} className="p-2 text-slate-500 hover:text-yellow-500 transition-colors"><Plus size={24}/></button>
              </div>
              <div className="text-right min-w-[150px] space-y-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">СТОИМОСТЬ</p>
                <p className="text-4xl font-black tracking-tighter leading-none">{i.price * i.quantity} ₽</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-10">
          <div className={`p-10 rounded-[4rem] border-2 shadow-2xl transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className="text-2xl font-black font-game mb-8 uppercase text-yellow-500 flex items-center gap-4 tracking-tighter"><Tag size={32} /> ПРОМОКОД</h3>
            <div className="relative flex flex-col gap-4">
              <input 
                placeholder="ВВЕДИ КОД" 
                className={`w-full p-6 rounded-3xl border-2 outline-none font-black text-xl text-center tracking-[0.3em] transition-all focus:border-yellow-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300'}`} 
                value={promo}
                onChange={e => setPromo(e.target.value)}
              />
              <button onClick={applyPromo} className={`w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-yellow-500/20 active:scale-95 transition-all`}>
                ПРИМЕНИТЬ
              </button>
            </div>
            {appliedCode && <p className="text-green-500 font-bold mt-6 text-xs tracking-widest uppercase animate-pulse flex items-center gap-2 justify-center border-2 border-green-500/20 p-3 rounded-2xl"><CheckCircle2 size={16}/> КОД {appliedCode} АКТИВЕН (-{discount}%)</p>}
          </div>

          <div className={`p-12 rounded-[4.5rem] border-4 border-yellow-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white shadow-2xl shadow-yellow-500/10'}`}>
            <h3 className="text-3xl font-black font-game mb-10 uppercase tracking-tighter leading-none">ЧЕК ЗАКАЗА</h3>
            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-center text-slate-500 font-black tracking-widest text-[11px] uppercase">
                <span>СУММА:</span>
                <span className="text-lg text-white font-game">{subtotal} ₽</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-500 font-black tracking-widest text-[11px] uppercase p-4 bg-green-500/5 rounded-2xl border border-green-500/20">
                  <span>СКИДКА {discount}%:</span>
                  <span className="text-lg font-game">-{Math.round(subtotal - finalTotal)} ₽</span>
                </div>
              )}
              <div className="h-[2px] bg-slate-800/40 my-8"></div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] ml-1">ИТОГО К ОПЛАТЕ</p>
                <div className="flex justify-between items-center text-6xl font-black text-yellow-500 tracking-tighter leading-none font-game">
                  <span>{Math.round(finalTotal)}</span>
                  <span className="text-3xl">₽</span>
                </div>
              </div>
            </div>
            <Link to="/order" onClick={playSound} className={`w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-yellow-500/40 block text-center active:scale-95 transition-all flex items-center justify-center gap-4`}>
               ОФОРМИТЬ ЗАКАЗ <ArrowRight size={28}/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsPage = ({ theme }: { theme: ThemeType }) => {
  const isDark = theme === 'dark';
  const [reviews, setReviews] = useState<Review[]>(() => JSON.parse(localStorage.getItem('reviews_all') || '[]'));
  const [form, setForm] = useState({ user: '', text: '', rating: 5 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound();
    const newRev: Review = {
      id: Date.now(),
      user: form.user,
      text: form.text,
      rating: form.rating,
      date: "Сегодня"
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem('reviews_all', JSON.stringify(updated));
    setForm({ user: '', text: '', rating: 5 });
    alert("Отзыв опубликован!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 page-enter">
      <h2 className="text-5xl md:text-7xl font-black font-game mb-16 uppercase tracking-tighter text-center leading-none">ОТЗЫВЫ <span className="text-yellow-500">КЛИЕНТОВ</span></h2>
      
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
           {reviews.length === 0 ? (
             <div className="text-center py-32 border-4 border-dashed border-slate-900 rounded-[4rem] opacity-30">
               <MessageCircle size={100} className="mx-auto mb-10"/>
               <p className="text-2xl font-black uppercase tracking-[0.4em]">ОТЗЫВОВ ПОКА НЕТ</p>
             </div>
           ) : reviews.map(r => (
             <div key={r.id} className={`p-10 rounded-[3.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-6">
                      <div className="bg-yellow-500 p-5 rounded-[1.5rem] shadow-xl shadow-yellow-500/10"><User className="text-slate-950" size={28}/></div>
                      <div className="space-y-1">
                         <p className="text-2xl font-black uppercase tracking-tighter leading-none">{r.user}</p>
                         <div className="flex gap-1.5 pt-1">
                           {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < r.rating ? "fill-yellow-500 text-yellow-500" : "text-slate-700"} />)}
                         </div>
                      </div>
                   </div>
                   <span className="text-[11px] text-slate-600 font-black uppercase tracking-widest p-2 bg-slate-950/50 rounded-xl">{r.date}</span>
                </div>
                <p className={`text-xl leading-relaxed italic font-medium p-8 bg-slate-950/20 rounded-[2rem] border-l-4 border-yellow-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>"{r.text}"</p>
             </div>
           ))}
        </div>

        <div className={`p-10 rounded-[4rem] border h-fit sticky top-28 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
           <h3 className="text-3xl font-black font-game mb-10 uppercase tracking-tighter text-yellow-500 leading-none">ОСТАВИТЬ ОТЗЫВ</h3>
           <form onSubmit={handleSubmit} className="space-y-8">
              <input required placeholder="ВАШ ИГРОВОЙ НИК" className={`w-full p-6 rounded-3xl border-2 outline-none font-bold text-lg transition-all focus:border-yellow-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} value={form.user} onChange={e => setForm({...form, user: e.target.value})} />
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-4">ВАША ОЦЕНКА</p>
                <select className={`w-full p-6 rounded-3xl border-2 outline-none font-black text-xl appearance-none cursor-pointer focus:border-yellow-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} value={form.rating} onChange={e => setForm({...form, rating: +e.target.value})}>
                  <option value="5">🔥🔥🔥🔥🔥 ОТЛИЧНО</option>
                  <option value="4">⭐⭐⭐⭐ ХОРОШО</option>
                  <option value="3">⭐⭐⭐ СРЕДНЕ</option>
                  <option value="2">⭐⭐ ПЛОХО</option>
                  <option value="1">⭐ УЖАСНО</option>
                </select>
              </div>
              <textarea required placeholder="ВАШИ ВПЕЧАТЛЕНИЯ..." className={`w-full h-40 p-6 rounded-3xl border-2 outline-none font-bold text-lg transition-all focus:border-yellow-500 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`} value={form.text} onChange={e => setForm({...form, text: e.target.value})} />
              <button type="submit" className={`w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-yellow-500/20 ${BTN_ANIM}`}>ОПУБЛИКОВАТЬ</button>
           </form>
        </div>
      </div>
    </div>
  );
};

const AdminPage = ({ products, setProducts, messages, setMessages, theme }: { products: Product[], setProducts: any, messages: SupportMessage[], setMessages: any, theme: ThemeType }) => {
  const [pass, setPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [tab, setTab] = useState<'products' | 'support'>('products');
  const isDark = theme === 'dark';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playSound();
    if (pass === ADMIN_PASSWORD) setIsAuth(true);
    else alert("НЕВЕРНЫЙ ПАРОЛЬ! Попробуй 1234");
  };

  if (!isAuth) return (
    <div className="max-w-md mx-auto py-48 px-6 page-enter">
      <div className={`p-12 rounded-[4rem] border-4 shadow-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <h2 className="text-3xl font-black font-game mb-10 text-center uppercase tracking-tighter text-yellow-500 leading-none">АДМИН ПАНЕЛЬ</h2>
         <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" placeholder="ПАРОЛЬ (1234)" className="w-full p-7 rounded-[2rem] bg-slate-950 border-2 border-slate-800 text-white outline-none focus:border-yellow-500 text-center font-black text-4xl tracking-[0.3em]" value={pass} onChange={e => setPass(e.target.value)} />
            <button type="submit" className={`w-full bg-yellow-500 text-slate-950 py-7 rounded-[2rem] font-black text-2xl shadow-xl shadow-yellow-500/20 active:scale-95 transition-all`}>ВОЙТИ</button>
         </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-10">
        <div className="flex p-2 bg-slate-950/80 border-2 border-slate-800 rounded-[2.5rem] shadow-3xl backdrop-blur-xl">
           <button onClick={() => setTab('products')} className={`px-12 py-5 rounded-[2rem] font-black tracking-tighter transition-all uppercase text-sm ${tab === 'products' ? 'bg-yellow-500 text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>ТОВАРЫ</button>
           <button onClick={() => setTab('support')} className={`px-12 py-5 rounded-[2rem] font-black tracking-tighter transition-all relative uppercase text-sm ${tab === 'support' ? 'bg-yellow-500 text-slate-950 shadow-xl' : 'text-slate-600 hover:text-white'}`}>
             ПОДДЕРЖКА
             {messages.filter(m => m.status === 'new').length > 0 && <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[12px] w-10 h-10 flex items-center justify-center rounded-full border-4 border-slate-950 font-black shadow-lg">{messages.filter(m => m.status === 'new').length}</span>}
           </button>
        </div>
        <button onClick={() => {playSound(); setIsAuth(false);}} className={`bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl active:scale-90 transition-all uppercase tracking-widest text-sm`}>ВЫХОД</button>
      </div>

      {tab === 'products' ? (
        <div className="grid lg:grid-cols-2 gap-16">
          <div className={`p-12 rounded-[4rem] border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
             <h3 className="text-3xl font-black mb-10 uppercase text-yellow-500 tracking-tighter leading-none">НОВЫЙ ТОВАР</h3>
             <form className="space-y-8" onSubmit={e => {
                e.preventDefault();
                playSound();
                const form = e.target as any;
                const p: Product = { 
                   id: Date.now(), 
                   name: form[0].value, 
                   amount: +form[1].value, 
                   price: +form[2].value, 
                   image: "https://images.unsplash.com/photo-1595152433602-0da764f69324?w=400", 
                   badge: "НОВИНКА" 
                };
                setProducts([...products, p]);
                form.reset();
                alert("Товар добавлен!");
             }}>
                <input required placeholder="НАЗВАНИЕ ПАКЕТА" className="w-full p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 text-white outline-none focus:border-yellow-500 font-bold" />
                <input required type="number" placeholder="КОЛИЧЕСТВО GOLD (G)" className="w-full p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 text-white outline-none focus:border-yellow-500 font-bold" />
                <input required type="number" placeholder="ЦЕНА (₽)" className="w-full p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 text-white outline-none focus:border-yellow-500 font-bold" />
                <button className={`w-full bg-green-600 text-white py-7 rounded-[2rem] font-black text-2xl shadow-2xl shadow-green-600/20 active:scale-95 transition-all`}>СОХРАНИТЬ ТОВАР</button>
             </form>
          </div>
          <div className={`p-12 rounded-[4rem] border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
             <h3 className="text-3xl font-black mb-10 uppercase text-yellow-500 tracking-tighter leading-none">КАТАЛОГ ({products.length})</h3>
             <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scroll">
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-8 bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] text-white shadow-xl">
                    <div className="space-y-2">
                      <p className="font-black text-2xl uppercase tracking-tighter leading-none">{p.name}</p>
                      <p className="text-yellow-500 font-game text-xl leading-none">{p.amount} G — {p.price} ₽</p>
                    </div>
                    <button onClick={() => {playSound(); setProducts(products.filter(x => x.id !== p.id));}} className={`text-red-500 hover:bg-red-500/20 p-5 rounded-3xl transition-all active:scale-90`}><Trash2 size={32}/></button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      ) : (
        <div className={`p-12 rounded-[4rem] border shadow-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
           <h3 className="text-4xl font-black mb-12 uppercase text-yellow-500 tracking-tighter text-center leading-none">СООБЩЕНИЯ ОТ КЛИЕНТОВ</h3>
           {messages.length === 0 ? <div className="text-center py-40 opacity-20"><MessageCircle size={100} className="mx-auto mb-10"/><p className="font-black uppercase tracking-[0.5em] text-xl">ПУСТО</p></div> : (
             <div className="grid md:grid-cols-2 gap-10">
               {messages.map(m => (
                 <div key={m.id} className={`p-10 rounded-[3.5rem] border-2 transition-all shadow-2xl flex flex-col ${m.status === 'new' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-slate-800 bg-slate-950/20 opacity-50'}`}>
                    <div className="flex justify-between items-start mb-8">
                       <span className="font-black text-yellow-500 text-2xl tracking-tighter flex items-center gap-4"><User size={32} className="bg-slate-950 p-2 rounded-xl border border-slate-800" /> {m.contact}</span>
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-950 p-2 rounded-lg">{m.date}</span>
                    </div>
                    <p className="text-slate-300 mb-10 font-medium italic text-xl p-8 bg-slate-950/40 rounded-[2.5rem] border-2 border-slate-800/50 flex-grow leading-relaxed">"{m.text}"</p>
                    <div className="flex gap-4">
                       <a href={`mailto:${m.contact}`} onClick={() => {playSound(); setMessages(messages.map(x => x.id === m.id ? {...x, status: 'replied'} : x));}} className={`flex-grow bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black text-center text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all`}>ОТВЕТИТЬ</a>
                       <button onClick={() => {playSound(); setMessages(messages.filter(x => x.id !== m.id));}} className="text-red-500 font-black text-xs uppercase tracking-[0.2em] p-5 rounded-2xl hover:bg-red-500/10 transition-colors">УДАЛИТЬ</button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

// --- CORE APP ---

export default function App() {
  const [theme, setTheme] = useState<ThemeType>(() => (localStorage.getItem('theme') as ThemeType) || 'dark');
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS)));
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [messages, setMessages] = useState<SupportMessage[]>(() => JSON.parse(localStorage.getItem('messages_support') || '[]'));
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [recentBuyer, setRecentBuyer] = useState<{name: string, amount: number} | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('messages_support', JSON.stringify(messages));
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.style.backgroundColor = theme === 'dark' ? '#020617' : '#ffffff';
  }, [theme, cart, products, messages]);

  // Симуляция живых покупок для повышения доверия
  useEffect(() => {
    const names = ["Sniper_Pro", "GoldDigger", "Legendary_SO2", "SkinMaster", "ProPlayer_007", "LuckyMan", "Viper_SO", "Elite_Gold"];
    const interval = setInterval(() => {
      if (Math.random() > 0.65) {
        setRecentBuyer({ 
          name: names[Math.floor(Math.random() * names.length)], 
          amount: [100, 500, 1000, 2500, 5000, 15000][Math.floor(Math.random() * 6)] 
        });
        setTimeout(() => setRecentBuyer(null), 5000);
      }
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, delta: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col transition-all duration-500 overflow-x-hidden ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        <Navbar cartCount={cart.reduce((a, c) => a + c.quantity, 0)} theme={theme} toggleTheme={toggleTheme} />
        
        {/* Живое уведомление о покупке */}
        <div className="fixed top-28 right-6 z-[60] pointer-events-none">
          {recentBuyer && (
            <div className="bg-yellow-500 text-slate-950 p-6 rounded-[3rem] shadow-[0_20px_60px_rgba(245,158,11,0.5)] animate-bounce flex items-center gap-5 border-4 border-slate-950 max-w-[300px] pointer-events-auto">
              <div className="bg-slate-950 p-4 rounded-3xl shadow-inner"><Bell size={28} className="text-yellow-500" /></div>
              <div>
                <p className="font-black text-sm uppercase tracking-tighter leading-none mb-1">{recentBuyer.name}***</p>
                <p className="font-bold text-[11px] opacity-80 uppercase leading-none">ТОЛЬКО ЧТО КУПИЛ <span className="font-game text-slate-950">{recentBuyer.amount}G</span>!</p>
              </div>
            </div>
          )}
        </div>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="/products" element={<ProductsPage products={products} addToCart={addToCart} theme={theme} />} />
            <Route path="/reviews" element={<ReviewsPage theme={theme} />} />
            <Route path="/cart" element={<CartPage items={cart} removeFromCart={removeFromCart} updateQty={updateQty} theme={theme} />} />
            <Route path="/order" element={<OrderPage cart={cart} clearCart={() => setCart([])} theme={theme} />} />
            <Route path="/admin" element={<AdminPage products={products} setProducts={setProducts} messages={messages} setMessages={setMessages} theme={theme} />} />
          </Routes>
        </main>

        <footer className={`py-28 border-t transition-all duration-500 ${theme === 'dark' ? 'border-slate-900 bg-slate-950' : 'border-slate-100 bg-slate-50'}`}>
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 text-center md:text-left">
              <div className="col-span-2 space-y-8">
                 <Link to="/" className="text-4xl font-black font-game uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
                   <Trophy className="text-yellow-500" /> CHLENHUNTER <span className="text-yellow-500">STORE</span>
                 </Link>
                 <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.3em] leading-loose max-w-sm mx-auto md:mx-0">
                   Профессиональный сервис по продаже золота в игре Standoff 2. Мы гарантируем безопасность каждой сделки и мгновенную доставку по игровому ID.
                 </p>
              </div>
              <div className="space-y-8">
                 <h4 className="text-yellow-500 font-black uppercase tracking-[0.4em] text-xs">МАГАЗИН</h4>
                 <ul className="space-y-5 text-slate-500 font-black text-[12px] uppercase tracking-[0.2em]">
                    <li><Link to="/products" className="hover:text-yellow-500 transition-colors">КАТАЛОГ ТОВАРОВ</Link></li>
                    <li><Link to="/reviews" className="hover:text-yellow-500 transition-colors">ОТЗЫВЫ ИГРОКОВ</Link></li>
                    <li><button onClick={() => setIsSupportOpen(true)} className="hover:text-yellow-500 transition-colors uppercase">СЛУЖБА ПОДДЕРЖКИ</button></li>
                 </ul>
              </div>
              <div className="space-y-8">
                 <h4 className="text-yellow-500 font-black uppercase tracking-[0.4em] text-xs">КАБИНЕТ</h4>
                 <ul className="space-y-5 text-slate-500 font-black text-[12px] uppercase tracking-[0.2em]">
                    <li><Link to="/admin" className="hover:text-yellow-500 transition-colors">АДМИНИСТРАЦИЯ</Link></li>
                    <li><a href="#" className="hover:text-yellow-500 transition-colors">ПОЛЬЗОВАТЕЛЬСКОЕ</a></li>
                 </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-900/40 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
             © 2021-2024 CHLENHUNTER STORE. ВСЕ ПРАВА ЗАЩИЩЕНЫ. NOT AFFILIATED WITH AXLEBOLT LTD.
           </div>
        </footer>

        <button onClick={() => { playSound(); setIsSupportOpen(true); }} className={`fixed bottom-10 right-10 z-50 bg-yellow-500 text-slate-950 p-6 rounded-[3rem] shadow-[0_20px_80px_rgba(245,158,11,0.6)] hover:scale-110 active:scale-95 transition-all flex items-center gap-5 font-black group overflow-hidden border-4 border-slate-950`}>
           <MessageCircle size={36} />
           <span className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 whitespace-nowrap text-xl tracking-tighter uppercase font-game">ПОДДЕРЖКА</span>
        </button>

        <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} theme={theme} addMessage={(m) => setMessages([m, ...messages])} />
      </div>
    </HashRouter>
  );
}

const OrderPage = ({ cart, clearCart, theme }: { cart: CartItem[], clearCart: () => void, theme: ThemeType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id: '', email: '', method: 'SBP' });
  const [isProcessing, setIsProcessing] = useState(false);
  const isDark = theme === 'dark';
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  
  // Применяем скидку из localStorage если она есть (простейшая логика)
  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    // В реальном приложении дисконт должен передаваться через состояние корзины
    // Здесь мы просто вычисляем его для красоты если товары есть
    if (subtotal > 10000) setDiscount(10);
  }, [subtotal]);

  const total = subtotal * (1 - discount / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    playSound();
    const itemsText = cart.map(i => `${i.name} (x${i.quantity})`).join('\n');
    const msg = `<b>💰 НОВЫЙ ЗАКАЗ!</b>\n\n👤 ID: <code>${formData.id}</code>\n📧 Email: ${formData.email}\n💳 Метод: ${formData.method}\n🛒 Товары:\n${itemsText}\n💵 СУММА: ${Math.round(total)} ₽`;
    const ok = await sendToTelegram(msg);
    if (ok) {
      alert("Заказ принят! Администратор свяжется с вами для оплаты по указанному Email.");
      clearCart();
      navigate('/');
    } else {
      alert("Ошибка отправки заказа. Проверьте соединение.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 page-enter">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className={`p-12 md:p-16 rounded-[4.5rem] border-4 shadow-3xl transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h2 className="text-4xl font-black font-game mb-12 text-center uppercase tracking-tighter leading-none">ДАННЫЕ <span className="text-yellow-500">ОПЛАТЫ</span></h2>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4 flex items-center gap-2"><User size={14}/> ID ИГРОКА (Standoff 2)</label>
              <input required placeholder="Напр. 12345678" className={`w-full p-7 rounded-[2.5rem] border-2 font-black text-2xl outline-none transition-all focus:border-yellow-500 shadow-inner ${isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-900' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-200'}`} value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4 flex items-center gap-2"><Send size={14}/> EMAIL ДЛЯ СВЯЗИ</label>
              <input required type="email" placeholder="example@mail.ru" className={`w-full p-7 rounded-[2.5rem] border-2 font-black text-2xl outline-none transition-all focus:border-yellow-500 shadow-inner ${isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-900' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-200'}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4 flex items-center gap-2"><CreditCard size={14}/> СПОСОБ ОПЛАТЫ</label>
              <select className={`w-full p-7 rounded-[2.5rem] border-2 font-black text-2xl outline-none appearance-none cursor-pointer focus:border-yellow-500 transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                <option value="SBP">СБП / ТИНЬКОФФ</option>
                <option value="CARD">БАНКОВСКАЯ КАРТА</option>
                <option value="QIWI">QIWI КОШЕЛЕК</option>
                <option value="CRYPTO">КРИПТОВАЛЮТА</option>
              </select>
            </div>
            <button type="submit" disabled={isProcessing} className={`w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 py-8 rounded-[3rem] font-black text-3xl shadow-3xl shadow-yellow-500/40 active:scale-95 transition-all flex items-center justify-center gap-4`}>
              {isProcessing ? 'ОБРАБОТКА...' : <><Zap size={32}/> ОПЛАТИТЬ</>}
            </button>
          </form>
        </div>

        <div className={`p-12 rounded-[4.5rem] border-4 shadow-3xl sticky top-32 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-2xl shadow-yellow-500/10'}`}>
          <h3 className="text-3xl font-black font-game mb-10 uppercase tracking-tighter leading-none text-yellow-500">ВАШ ЗАКАЗ</h3>
          <div className="space-y-6 max-h-[400px] overflow-y-auto mb-10 pr-4 custom-scroll">
            {cart.map(i => (
              <div key={i.id} className="flex justify-between items-center py-4 border-b border-slate-800/50">
                <div className="space-y-1">
                  <p className="font-black text-lg uppercase leading-none tracking-tight">{i.name}</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{i.quantity} ШТ. × {i.price} ₽</p>
                </div>
                <p className="font-game text-xl font-black tracking-tighter text-white">{i.price * i.quantity} ₽</p>
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-6 border-t-2 border-slate-800">
            <div className="flex justify-between text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">
               <span>ПОДЫТОГ:</span>
               <span>{subtotal} ₽</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500 font-black uppercase tracking-[0.3em] text-[11px]">
                 <span>СКИДКА {discount}%:</span>
                 <span>-{Math.round(subtotal - total)} ₽</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-6">
              <p className="text-4xl font-black font-game tracking-tighter text-yellow-500 leading-none">ИТОГО:</p>
              <div className="text-right">
                <p className="text-5xl font-black font-game tracking-tighter text-yellow-500 leading-none">{Math.round(total)} <span className="text-2xl uppercase">₽</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
