import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function AnimePage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [anime, setAnime] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAddForm, setShowAddForm] = useState(false);
  const [libraryData, setLibraryData] = useState({ status: 'Планую глянути', rating: 0, comment: '' });
  const [message, setMessage] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then(res => res.json())
      .then(data => setAnime(data.data))
      .catch(err => console.error(err));

    if (user) {
      fetch(`http://localhost:5000/api/library/${user.id}/${id}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.inLibrary) {
            setIsEditing(true);
            setLibraryData({
              status: resData.data.status,
              rating: resData.data.rating || 0,
              comment: resData.data.comment || ''
            });
          }
        })
        .catch(err => console.error("Помилка перевірки бібліотеки:", err));
    }
  }, [id]);

  const handleSaveToLibrary = async () => {
    if (!user) return setMessage('Увійдіть у систему!');

    try {
        const response = await fetch('http://localhost:5000/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            anime_id: anime.mal_id,
            title: anime.title,
            image_url: anime.images.webp.large_image_url,
            genre: anime.genres[0]?.name || 'Unknown',
            releaseYear: anime.year || null,
            status: libraryData.status,
            rating: libraryData.rating || null,
            comment: libraryData.comment
        })
        });

        if (response.ok) {
        const wasEditing = isEditing;
        setIsEditing(true);
        setMessage(wasEditing ? '✅ Оновлено!' : '✅ Додано в бібліотеку!');
        
        setTimeout(() => {
            setMessage('');
            setShowAddForm(false);
        }, 1500);
        } else {
        setMessage('❌ Помилка збереження');
        }
    } catch (error) {
        setMessage('❌ Помилка сервера');
    }
    };

  if (!anime) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-indigo-500 text-xl font-bold animate-pulse tracking-widest">
      ЗАВАНТАЖЕННЯ...
    </div>
  );

  return (
    <main className="relative min-h-[calc(100vh-73px)] bg-[#050505] overflow-hidden py-12 px-6">
      
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-semibold uppercase tracking-wider text-sm">
          <span>&larr;</span> Назад до пошуку
        </Link>
        
        <div className="flex flex-col md:flex-row gap-12">
          
          <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <img src={anime.images.webp.large_image_url} alt={anime.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            
            {!showAddForm ? (
               <button 
                 onClick={() => user ? setShowAddForm(true) : navigate('/login')}
                 className="w-full relative group overflow-hidden rounded-xl p-[1px]"
               >
                 {/* НОВЕ: Колір фону кнопки змінюється, якщо ми редагуємо */}
                 <span className={`absolute inset-0 ${isEditing ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}></span>
                 <div className="relative bg-[#0a0a0a] px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-transparent">
                   <span className="font-bold text-white uppercase tracking-wider text-sm">
                     {isEditing ? '✎ Редагувати у списку' : '+ Додати в бібліотеку'}
                   </span>
                 </div>
               </button>
            ) : (
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                
                <div className="flex justify-between items-center mb-5 mt-1">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                    {isEditing ? 'Редагування' : 'Налаштування'}
                  </h3>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
                </div>
                
                <select className="w-full p-3 mb-4 rounded-xl bg-[#111] border border-white/5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                  value={libraryData.status} onChange={(e) => setLibraryData({...libraryData, status: e.target.value})}>
                  <option value="Планую глянути">Планую глянути</option>
                  <option value="Дивлюсь">Дивлюсь</option>
                  <option value="Завершено">Завершено</option>
                  <option value="Кинув">Кинув</option>
                </select>

                <input type="number" min="1" max="10" placeholder="Оцінка (1-10)"
                  className="w-full p-3 mb-4 rounded-xl bg-[#111] border border-white/5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder-gray-600"
                  value={libraryData.rating || ''} onChange={(e) => setLibraryData({...libraryData, rating: parseInt(e.target.value)})}
                />

                <textarea rows="2" placeholder="Ваші нотатки..."
                  className="w-full p-3 mb-5 rounded-xl bg-[#111] border border-white/5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm placeholder-gray-600 resize-none"
                  value={libraryData.comment} onChange={(e) => setLibraryData({...libraryData, comment: e.target.value})}
                ></textarea>

                <button onClick={handleSaveToLibrary} className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider">
                  {isEditing ? 'Оновити' : 'Зберегти'}
                </button>
                {message && <p className="text-center text-xs font-bold mt-4 text-indigo-400 animate-pulse">{message}</p>}
              </div>
            )}
          </div>
          
          <div className="flex flex-col text-gray-300 w-full md:w-2/3">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tight drop-shadow-md">
              {anime.title}
            </h1>
            <h2 className="text-xl text-gray-500 mb-8 font-semibold tracking-wide">
              {anime.title_english || anime.title_japanese}
            </h2>
            
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">{anime.type}</span>
              <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md flex items-center gap-1">⭐ {anime.score || 'N/A'}</span>
              <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">{anime.episodes || '?'} епізодів</span>
              <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">{anime.status}</span>
            </div>
            
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Синопсис
            </h3>
            <p className="leading-relaxed text-gray-400 text-base md:text-lg mb-10 font-medium">
              {anime.synopsis ? anime.synopsis : "Опис відсутній."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5 pt-8">
              <div><span className="block text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Студія</span> <span className="font-semibold text-white">{anime.studios[0]?.name || 'Невідомо'}</span></div>
              <div><span className="block text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Рік</span> <span className="font-semibold text-white">{anime.year || 'Невідомо'}</span></div>
              <div className="col-span-2"><span className="block text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Жанри</span> <span className="font-semibold text-white">{anime.genres.map(g => g.name).join(', ')}</span></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}