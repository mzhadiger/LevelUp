import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Gamepad2,
  Search,
  Sparkles,
  MessageCircle,
  Send,
  Star,
  TrendingUp,
  User,
  UserPlus,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

type Game = {
  id: number;
  title: string;
  year: number;
  primaryGenre: string;
  secondaryGenres: string;
  thirdGenre: string;
  rating: number;
  platforms: string;
};

type ChatMessage = { role: 'assistant' | 'user'; content: string };

type Recommendation = { title: string; reason: string };

type AuthMode = 'signin' | 'signup' | 'guest';

type ApiSearchResponse = { query: string; results: Game[]; interpretation: string };

type ApiGamesResponse = { games: Game[] };

type ApiChatResponse = { message: string };

type ApiRecommendationsResponse = { recommendations: Recommendation[] };

const API_BASE = '/api';

function App() {
  const [user, setUser] = useState<{ username: string; isGuest?: boolean } | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchResult, setSearchResult] = useState<ApiSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your gaming companion. What are you in the mood for?" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/games`)
      .then((res) => res.json())
      .then((data: ApiGamesResponse) => setGames(data.games))
      .catch(() => setGames([]));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const genres = useMemo(() => ['all', ...new Set(games.map((g) => g.primaryGenre))], [games]);
  const platforms = useMemo(
    () => ['all', 'Steam', 'PlayStation Store', 'Epic Games Store', 'Xbox Game Pass', 'Nintendo eShop', 'Google Play / App Store'],
    []
  );

  const filteredGames = useMemo(() => {
    if (searchResult) return searchResult.results;

    return games.filter((game) => {
      const queryMatch = !searchQuery
        || game.title.toLowerCase().includes(searchQuery.toLowerCase())
        || game.primaryGenre.toLowerCase().includes(searchQuery.toLowerCase())
        || game.secondaryGenres.toLowerCase().includes(searchQuery.toLowerCase())
        || game.thirdGenre.toLowerCase().includes(searchQuery.toLowerCase());
      const genreMatch = selectedGenre === 'all' || game.primaryGenre === selectedGenre;
      const platformMatch = selectedPlatform === 'all' || game.platforms.includes(selectedPlatform);
      return queryMatch && genreMatch && platformMatch;
    });
  }, [games, searchResult, searchQuery, selectedGenre, selectedPlatform]);

  const handleAuth = () => {
    if (authMode === 'guest') {
      setUser({ username: 'Guest', isGuest: true });
      setShowAuth(false);
      return;
    }

    if (!authEmail || !authPassword) return alert('Please fill in all required fields');
    const username = authUsername || authEmail.split('@')[0];
    setUser({ username, isGuest: false });
    setShowAuth(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthUsername('');
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    setRecommendations([]);
    setChatMessages([{ role: 'assistant', content: "Hi! I'm your gaming companion. What are you in the mood for?" }]);
  };

  const runSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const params = new URLSearchParams({ query: searchQuery, genre: selectedGenre, platform: selectedPlatform });
      const res = await fetch(`${API_BASE}/search?${params.toString()}`);
      const data: ApiSearchResponse = await res.json();
      setSearchResult(data);
    } finally {
      setIsSearching(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMessage: ChatMessage = { role: 'user', content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMessage] }),
      });
      const data: ApiChatResponse = await res.json();
      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const fetchRecommendations = async () => {
    if (!favorites.length) return alert('Pick a few favorites first!');
    const res = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorites }),
    });
    if (!res.ok) return;
    const data: ApiRecommendationsResponse = await res.json();
    setRecommendations(data.recommendations);
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchQuery('');
  };

  const GameCard = ({ game }: { game: Game }) => (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">{game.title}</h3>
          <p className="text-sm text-slate-300">{game.year} • {game.primaryGenre}</p>
        </div>
        <button
          onClick={() => toggleFavorite(game.id)}
          className={`p-2 rounded-full ${favorites.includes(game.id) ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/5 text-white'}`}
        >
          <Star className="w-5 h-5" fill={favorites.includes(game.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-200">
        <span className="px-2 py-1 rounded-full bg-purple-500/20">{game.secondaryGenres}</span>
        <span className="px-2 py-1 rounded-full bg-blue-500/20">{game.thirdGenre}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Rating: {game.rating}</span>
        <span>{game.platforms}</span>
      </div>
    </div>
  );

  const accentClass = (accent: 'purple' | 'pink' | 'blue') => {
    switch (accent) {
      case 'pink':
        return 'border-pink-400/40 hover:border-pink-300/60';
      case 'blue':
        return 'border-blue-400/40 hover:border-blue-300/60';
      default:
        return 'border-purple-400/40 hover:border-purple-300/60';
    }
  };

  const Landing = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-14 h-14 text-purple-300" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">LevelUp</h1>
          </div>
          <p className="text-lg text-purple-100">Full-stack playground: try the API-backed search, chat, and recommendations.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <AuthCard
            title="Sign In"
            description="Use saved preferences"
            icon={<User className="w-10 h-10" />}
            accent="purple"
            onClick={() => { setAuthMode('signin'); setShowAuth(true); }}
          />
          <AuthCard
            title="Sign Up"
            description="Create an account"
            icon={<UserPlus className="w-10 h-10" />}
            accent="pink"
            onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
          />
          <AuthCard
            title="Guest Mode"
            description="Jump right in"
            icon={<Sparkles className="w-10 h-10" />}
            accent="blue"
            onClick={() => { setAuthMode('guest'); handleAuth(); }}
          />
        </div>
      </div>
      {showAuth && <AuthModal />}
    </div>
  );

  const AuthCard = ({ title, description, icon, accent, onClick }: { title: string; description: string; icon: React.ReactNode; accent: 'purple' | 'pink' | 'blue'; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 text-left transition ${accentClass(accent)}`}
    >
      <div className="text-white mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm text-slate-200">{description}</p>
    </button>
  );

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-md w-full rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-300">{authMode === 'signup' ? 'Create your account' : authMode === 'signin' ? 'Welcome back' : 'Try LevelUp instantly'}</p>
            <h2 className="text-2xl font-bold">{authMode === 'signup' ? 'Sign Up' : authMode === 'signin' ? 'Sign In' : 'Guest Mode'}</h2>
          </div>
          <button onClick={() => setShowAuth(false)} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        {authMode !== 'guest' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            </div>
            {authMode === 'signup' && (
              <div>
                <label className="text-sm text-slate-300">Username</label>
                <input className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input type="password" className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
            </div>
          </div>
        )}
        <button onClick={handleAuth} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> Continue
        </button>
      </div>
    </div>
  );

  if (!user) return <Landing />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <header className="flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-slate-950/70 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-7 h-7 text-purple-300" />
          <span className="font-semibold">LevelUp</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={fetchRecommendations} className="glass-card px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" /> Personalized picks
          </button>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-sm">{user.username}</span>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button className="md:hidden p-2" onClick={() => setShowAuth((prev) => !prev)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-6">
        <section className="glass-card rounded-2xl p-5 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <Search className="w-5 h-5 text-slate-300" />
                <input
                  className="bg-transparent flex-1 outline-none"
                  placeholder="Search by title, genre, or vibe"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                />
              </div>
              <button onClick={runSearch} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Search
              </button>
              {searchResult && (
                <button onClick={clearSearch} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">Clear</button>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4" />
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4" />
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              {searchResult && <span className="text-xs text-slate-300">{searchResult.interpretation}</span>}
              {isSearching && <span className="text-xs text-purple-200">Thinking...</span>}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2 font-semibold"><Sparkles className="w-4 h-4" /> How this works</div>
            <p>Search hits the local API, chat uses the same dataset, and recommendations blend your favorites by genre, platform, and rating.</p>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Discover games</h2>
              <span className="text-sm text-slate-300">{filteredGames.length} results</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Favorites</h3>
                <button onClick={fetchRecommendations} className="text-sm text-purple-200 hover:text-white">Get picks</button>
              </div>
              <div className="space-y-2 text-sm text-slate-200">
                {favorites.length === 0 && <p className="text-slate-400">Tap the star on a game to save it.</p>}
                {favorites.map((id) => {
                  const game = games.find((g) => g.id === id);
                  if (!game) return null;
                  return (
                    <div key={id} className="flex items-center justify-between">
                      <span>{game.title}</span>
                      <button onClick={() => toggleFavorite(id)} className="text-xs text-slate-400 hover:text-white">Remove</button>
                    </div>
                  );
                })}
              </div>
              {recommendations.length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="w-4 h-4" /> Recommended</div>
                  {recommendations.map((rec) => (
                    <div key={rec.title} className="text-sm text-slate-200">
                      <p className="font-semibold">{rec.title}</p>
                      <p className="text-slate-400">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-4 flex flex-col h-[420px]">
              <div className="flex items-center gap-2 mb-3"><MessageCircle className="w-5 h-5" /> Chatbot</div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`max-w-[90%] p-3 rounded-2xl ${msg.role === 'assistant' ? 'bg-white/10 text-white self-start' : 'bg-purple-600 text-white self-end ml-auto'}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                  placeholder="Ask for a recommendation..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                />
                <button onClick={sendChat} disabled={isChatLoading} className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
