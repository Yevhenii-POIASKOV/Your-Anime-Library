import { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';

function CustomSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}:</span>
      
      <div className="relative min-w-[160px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-black/60 border border-white/10 text-xs font-bold text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
        >
          {value}
          <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors ${value === opt ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Library() {
  const [library, setLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const [filterStatus, setFilterStatus] = useState('Всі');
  const [sortBy, setSortBy] = useState('Назва');

  const [filterGenre, setFilterGenre] = useState('Всі');
  const [filterYear, setFilterYear] = useState('Всі');

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/library/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setLibrary(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Помилка завантаження бібліотеки:", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleDelete = async (e, animeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Видалити це аніме з вашого списку?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/library/${user.id}/${animeId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLibrary(library.filter(item => item.id !== animeId));
      }
    } catch (err) {
      console.error("Помилка при видаленні:", err);
    }
  };

  if (!user) return <Navigate to="/login" />;

  const uniqueGenres = ['Всі', ...new Set(library.map(item => item.genre).filter(Boolean))].sort();
  const uniqueYears = ['Всі', ...new Set(library.map(item => item.releaseYear).filter(Boolean))].sort((a, b) => b - a);
  
  const processedLibrary = library
    .filter(item => filterStatus === 'Всі' ? true : item.status === filterStatus)
    .filter(item => filterGenre === 'Всі' ? true : item.genre === filterGenre)
    .filter(item => filterYear === 'Всі' ? true : item.releaseYear?.toString() === filterYear?.toString())
    .sort((a, b) => {
        if (sortBy === 'Рейтинг') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'Рік') return (b.releaseYear || 0) - (a.releaseYear || 0);
        return a.title.localeCompare(b.title);
    });

  const resetFilters = () => {
    setFilterStatus('Всі');
    setFilterGenre('Всі');
    setFilterYear('Всі');
    setSortBy('Назва');
  };

  const getBadgeStyle = (status) => {
    switch(status) {
      case 'Дивлюсь': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Завершено': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Кинув': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-73px)] bg-[#050505] overflow-hidden py-6 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/5 pb-6 gap-6">
          <h2 className="text-5xl font-black text-white tracking-tighter">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">LIBRARY</span>
          </h2>
          
          <div className="bg-[#0a0a0a] px-4 py-2 rounded-xl border border-white/5 shadow-xl flex items-center gap-3">
            <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Усього</span>
            <span className="text-lg font-black text-white leading-none">{library.length}</span>
          </div>
        </div>


        <div className="flex flex-wrap gap-6 mb-10 items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl relative z-40">
          <div className="flex flex-wrap gap-8 items-center">
            
            <CustomSelect 
              label="Статус" 
              value={filterStatus} 
              options={['Всі', 'Дивлюсь', 'Завершено', 'Планую глянути', 'Кинув']} 
              onChange={setFilterStatus} 
            />

            <CustomSelect 
              label="Жанр" 
              value={filterGenre} 
              options={uniqueGenres} 
              onChange={setFilterGenre} 
            />

            <CustomSelect 
              label="Рік" 
              value={filterYear} 
              options={uniqueYears.map(String)}
              onChange={setFilterYear} 
            />

            <CustomSelect 
              label="Сортувати" 
              value={sortBy} 
              options={['Назва', 'Рейтинг', 'Рік']} 
              onChange={setSortBy} 
            />

            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Скинути фільтри
            </button>
          </div>

          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            Знайдено: {processedLibrary.length}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-600 font-bold tracking-widest animate-pulse uppercase text-xs">Завантаження...</div>
        ) : processedLibrary.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center opacity-20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Нічого не знайдено</h3>
            <p className="text-gray-500 text-sm mb-8">Спробуйте змінити фільтри або додати нове аніме.</p>
            <Link to="/" className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-all underline underline-offset-8">
              Перейти до пошуку &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 animate-fade-in relative z-10">
            {processedLibrary.map(anime => (
              <div key={anime.id} className="group relative flex flex-col bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl">
                
                <button 
                  onClick={(e) => handleDelete(e, anime.id)}
                  className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-red-600/80 rounded-xl backdrop-blur-md border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <Link to={`/anime/${anime.id}`} className="flex flex-col h-full">
                  <div className="relative aspect-[2/3] w-full bg-[#111] overflow-hidden">
                    <img src={anime.image_url} alt={anime.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                    {anime.rating && (
                      <div className="absolute bottom-3 right-3 bg-indigo-500 px-2 py-1 rounded-lg text-[10px] font-black text-white shadow-lg">
                        ⭐ {anime.rating}/10
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow bg-[#0a0a0a]">
                    <span className={`self-start px-2 py-1 rounded-md text-[9px] font-black uppercase mb-3 border ${getBadgeStyle(anime.status)}`}>
                      {anime.status}
                    </span>
                    <h3 className="text-xs font-bold text-gray-200 line-clamp-2 leading-tight group-hover:text-white transition-colors mb-4">
                      {anime.title}
                    </h3>
                    <div className="mt-auto flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                       <span>{anime.releaseYear || 'N/A'}</span>
                       <span className="text-indigo-500 font-black group-hover:translate-x-1 transition-transform">EDIT &rarr;</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}