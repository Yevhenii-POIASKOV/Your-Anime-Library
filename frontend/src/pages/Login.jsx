import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/'; 
      } else {
        setMessage(data.message || 'Помилка входу');
      }
    } catch (error) {
      setMessage('Помилка з\'єднання з сервером');
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-73px)] bg-[#050505] flex items-center justify-center px-6 overflow-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in">
        
        <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

        <h2 className="text-4xl font-black mb-2 text-center text-white tracking-tight">WELCOME</h2>
        <p className="text-gray-500 text-center mb-10 text-sm font-semibold uppercase tracking-widest">Увійдіть у свій акаунт</p>
        
        {message && (
          <div className="p-4 mb-6 rounded-xl text-xs font-black uppercase tracking-widest text-center bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
            <input 
              type="email" name="email" required
              className="w-full px-5 py-4 rounded-xl bg-[#111] border border-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder-gray-700"
              placeholder="name@example.com"
              value={formData.email} onChange={handleChange}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
            <input 
              type="password" name="password" required
              className="w-full px-5 py-4 rounded-xl bg-[#111] border border-white/5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder-gray-700"
              placeholder="••••••••"
              value={formData.password} onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="mt-4 relative group overflow-hidden rounded-xl p-[1px]">
             <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></span>
             <div className="relative bg-[#0a0a0a] group-hover:bg-transparent transition-all py-4 rounded-xl text-center">
               <span className="text-sm font-black text-white uppercase tracking-widest">Увійти</span>
             </div>
          </button>
        </form>
        
        <p className="mt-10 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">
          Немає акаунта? <Link to="/register" className="text-indigo-400 hover:text-white transition-colors underline-offset-4 underline">Створити</Link>
        </p>
      </div>
    </main>
  );
}