import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/library/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const ratedAnime = data
            .filter(item => item.rating && item.rating > 0)
            .sort((a, b) => b.rating - a.rating);
          setRanking(ratedAnime);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const getRankColor = (index) => {
    if (index === 0) return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
    if (index === 1) return 'text-gray-300 border-gray-300/50 bg-gray-300/10';  
    if (index === 2) return 'text-orange-400 border-orange-400/50 bg-orange-400/10'; 
    return 'text-gray-500 border-white/10 bg-white/5';
  };

  return (
    <main className="relative min-h-[calc(100vh-73px)] bg-[#050505] py-10 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
             <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Hall of Fame</span>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">TOP LIST</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-bold animate-pulse">РАХУЄМО БАЛИ...</div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] rounded-3xl border border-white/5">
            <p className="text-gray-500 font-bold">Ви ще не поставили жодної оцінки аніме.</p>
            <Link to="/library" className="text-indigo-400 mt-4 inline-block hover:underline">Перейти до бібліотеки</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {ranking.map((anime, index) => (
              <Link 
                to={`/anime/${anime.id}`} 
                key={anime.id} 
                className="group relative flex items-center bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 hover:border-indigo-500/40 transition-all duration-300 hover:translate-x-2"
              >
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 font-black text-xl shrink-0 ${getRankColor(index)}`}>
                  {index + 1}
                </div>

                <div className="w-16 h-20 mx-6 rounded-lg overflow-hidden shrink-0 shadow-lg">
                  <img src={anime.image_url} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{anime.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{anime.genre} • {anime.releaseYear}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    <span className="text-yellow-500">⭐</span> {anime.rating}
                    <span className="text-gray-600 text-sm font-bold ml-1">/10</span>
                  </div>
                </div>

                {index < 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}