import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage('Успішно! Перенаправляємо...');
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        setMessage(data.message || 'Помилка реєстрації');
      }
    } catch (error) {
      setMessage('Помилка з\'єднання з сервером');
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-73px)] bg-[#050505] flex items-center justify-center px-6 overflow-hidden">
      
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-2xl animate-fade-in">
        
        <h2 className="text-4xl font-black mb-2 text-center text-white tracking-tight">JOIN US</h2>
        <p className="text-gray-500 text-center mb-10 text-sm font-semibold uppercase tracking-widest">Станьте частиною спільноти</p>
        
        {message && (
          <div className={`p-4 mb-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border ${isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Username</label>
            <input 
              type="text" name="username" required
              className="w-full px-5 py-4 rounded-xl bg-[#111] border border-white/5 focus:border-white/20 outline-none transition-all text-white placeholder-gray-800"
              placeholder="Torfinn"
              value={formData.username} onChange={handleChange}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
            <input 
              type="email" name="email" required
              className="w-full px-5 py-4 rounded-xl bg-[#111] border border-white/5 focus:border-white/20 outline-none transition-all text-white placeholder-gray-800"
              placeholder="mail@yal.com"
              value={formData.email} onChange={handleChange}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
            <input 
              type="password" name="password" required minLength="6"
              className="w-full px-5 py-4 rounded-xl bg-[#111] border border-white/5 focus:border-white/20 outline-none transition-all text-white placeholder-gray-800"
              placeholder="Min. 6 characters"
              value={formData.password} onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="mt-6 relative group overflow-hidden rounded-xl p-[1px]">
             <span className="absolute inset-0 bg-white transition-opacity"></span>
             <div className="relative bg-[#0a0a0a] group-hover:bg-transparent transition-all py-4 rounded-xl text-center">
               <span className="text-sm font-black text-white group-hover:text-black uppercase tracking-widest">Створити акаунт</span>
             </div>
          </button>
        </form>
        
        <p className="mt-10 text-center text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em]">
          Вже є профіль? <Link to="/login" className="text-white hover:text-indigo-400 transition-colors underline underline-offset-4">Увійти</Link>
        </p>
      </div>
    </main>
  );
}