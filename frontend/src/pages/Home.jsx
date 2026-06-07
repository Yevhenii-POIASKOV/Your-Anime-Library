import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('savedSearch') || '');
  const [animes, setAnimes] = useState(() => JSON.parse(sessionStorage.getItem('savedResults')) || []);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(searchTerm.length > 0);
  
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (sessionStorage.getItem('savedSearch') === null) {
      setSearchTerm('');
      setAnimes([]);
      setIsSearchMode(false);
    }
  }, [location]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      sessionStorage.setItem('savedSearch', searchTerm);
      sessionStorage.setItem('savedResults', JSON.stringify(animes));
      setIsSearchMode(true);
    } else {
      sessionStorage.removeItem('savedSearch');
      sessionStorage.removeItem('savedResults');
      const timeout = setTimeout(() => setIsSearchMode(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [searchTerm, animes]);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }

    if (searchTerm.length < 3) {
      setAnimes([]);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}&limit=24&sfw=true`)
        .then(res => res.json())
        .then(data => {
          setAnimes(data.data || []);
          setIsSearching(false);
        })
        .catch(err => { 
          console.error(err); 
          setIsSearching(false); 
        });
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <main className="relative min-h-[calc(100vh-80px)] flex flex-col items-center px-6 bg-[#050505] overflow-hidden transition-all duration-1000 ease-in-out">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

    <div 
    className={`relative z-10 w-full flex flex-col items-center transition-[padding,max-width] duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSearchMode ? 'pt-8 max-w-6xl' : 'pt-[25vh] max-w-3xl'
    }`}
    >
    
    <div className={`flex flex-col items-center transition-all duration-700 ease-in-out overflow-hidden ${
        isSearchMode 
        ? 'opacity-0 scale-95 pointer-events-none max-h-0 mb-0' 
        : 'opacity-100 scale-100 max-h-60 mb-10'
    }`}>
        <h2 className="text-6xl md:text-8xl font-black text-center text-white whitespace-nowrap leading-tight px-10 overflow-visible">
            WATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 inline-block pr-10">NEXT ?</span>
        </h2>
    </div>

    <div className="relative w-full group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <input 
        type="text" 
        placeholder="Search for anime..." 
        className="relative w-full px-10 py-6 rounded-2xl bg-[#0a0a0a] border border-white/5 focus:border-white/20 outline-none transition-all text-2xl text-white placeholder-gray-700 shadow-2xl"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>
    </div>

      {animes.length > 0 && isSearchMode && (
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-[1400px] mt-12 pb-20 animate-fade-in">
          {animes.map(anime => (
            <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300">
              <div className="aspect-[2/3] overflow-hidden">
                <img src={anime.images.webp.large_image_url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt={anime.title} />
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold text-gray-400 line-clamp-1 group-hover:text-white transition-colors">{anime.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

