import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AnimePage from './pages/AnimePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Library from './pages/Library';
import Ranking from './pages/Ranking';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; 
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
        
        <header className="sticky top-0 z-50 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link 
                to="/" 
                onClick={() => {
                    sessionStorage.removeItem('savedSearch');
                    sessionStorage.setItem('savedResults', '[]');
                }}
                className="flex items-center gap-3 group"
                >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                    <span className="text-white font-black text-xl tracking-tighter">YAL</span>
                </div>
                <span className="text-xl font-black text-white hidden sm:block">Your Anime Library</span>
                </Link>
            
            <nav className="flex items-center gap-6 font-medium">
              {user ? (
                <>
                  <Link to="/library" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Моя бібліотека
                  </Link>
                  
                    <Link to="/ranking" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Мій Топ
                    </Link>

                  <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center text-white font-bold text-sm group-hover:border-indigo-500/50 transition-colors">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-200 font-semibold group-hover:text-white transition-colors hidden md:block">
                        {user.username}
                      </span>
                    </div>
                    
                    <button 
                      onClick={handleLogout} 
                      className="text-xs font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 px-4 py-2.5 rounded-lg transition-all"
                    >
                      Вийти
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                    Увійти
                  </Link>
                  
                  <Link to="/register" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative text-sm font-bold text-white bg-[#050505] px-5 py-2.5 rounded-lg border border-white/10 flex items-center gap-2">
                      Реєстрація
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </div>
                  </Link>
                </>
              )}
            </nav>
            
          </div>
        </header>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/library" element={<Library />} />
            <Route path="/ranking" element={<Ranking />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;