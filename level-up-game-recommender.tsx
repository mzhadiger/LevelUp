import React, { useState, useRef, useEffect } from 'react';
import { Search, Gamepad2, Star, User, LogOut, Sparkles, MessageCircle, Send, X, Menu, ChevronDown, TrendingUp, History, Settings, UserPlus, Mail } from 'lucide-react';

// Real game database from the provided CSV
const GAMES_DATABASE = [
  { id: 1, title: "The Last of Us", year: 2013, primaryGenre: "Action-Adventure", secondaryGenres: "Survival", thirdGenre: "Post-Apocalyptic", rating: 95, platforms: "PlayStation Store / Steam" },
  { id: 2, title: "Ghost of Tsushima", year: 2020, primaryGenre: "Action-Adventure", secondaryGenres: "Open-World/Sandbox", thirdGenre: "Stealth", rating: 87, platforms: "PlayStation Store / Steam" },
  { id: 3, title: "Detroit: Become Human", year: 2018, primaryGenre: "Choice-Driven", secondaryGenres: "Interactive Story", thirdGenre: "Multiple Endings", rating: 78, platforms: "PlayStation Store / Steam" },
  { id: 4, title: "Counter-Strike 2", year: 2023, primaryGenre: "FPS / Shooter", secondaryGenres: "Multiplayer", thirdGenre: "Competitive", rating: 80, platforms: "Steam" },
  { id: 5, title: "Call of Duty: Modern Warfare II", year: 2022, primaryGenre: "FPS / Shooter", secondaryGenres: "Multiplayer", thirdGenre: "Action", rating: 76, platforms: "Steam / Epic Games Store / Xbox Game Pass" },
  { id: 6, title: "Resident Evil Village", year: 2021, primaryGenre: "Survival", secondaryGenres: "Horror", thirdGenre: "Story-Driven", rating: 84, platforms: "Steam / PlayStation Store / Xbox Game Pass" },
  { id: 7, title: "GTA 5", year: 2013, primaryGenre: "Open-World / Sandbox", secondaryGenres: "Action", thirdGenre: "Crime", rating: 97, platforms: "Steam / Epic Games Store / PlayStation Store / Xbox Game Pass" },
  { id: 8, title: "Cyberpunk 2077", year: 2020, primaryGenre: "Open-World / Sandbox", secondaryGenres: "Action", thirdGenre: "Sci-Fi", rating: 86, platforms: "Steam / Epic Games Store / GOG" },
  { id: 9, title: "Black Myth: Wukong", year: 2024, primaryGenre: "Action-Adventure", secondaryGenres: "Open-World / Sandbox", thirdGenre: "Fantasy", rating: 81, platforms: "Steam / Epic Games Store / PlayStation Store / Xbox Game Pass" },
  { id: 10, title: "Pokémon Scarlet / Violet", year: 2022, primaryGenre: "Strategy", secondaryGenres: "Fantasy", thirdGenre: "Strategy", rating: 76, platforms: "Nintendo eShop" },
  { id: 11, title: "It Takes Two", year: 2021, primaryGenre: "Adventure", secondaryGenres: "Cooperative", thirdGenre: "Adventure", rating: 89, platforms: "Steam / PlayStation Store / Xbox Game Pass" },
  { id: 12, title: "Drive Beyond Horizons", year: 2025, primaryGenre: "Casual", secondaryGenres: "Multiplayer", thirdGenre: "Simulation", rating: 54, platforms: "Steam / Epic Games Store / PlayStation Store" },
  { id: 13, title: "Hogwarts Legacy", year: 2023, primaryGenre: "Open-World / Sandbox", secondaryGenres: "Action-Adventure", thirdGenre: "Fantasy", rating: 84, platforms: "Steam / Epic Games Store / PlayStation Store / Xbox Game Pass" },
  { id: 14, title: "Emissary Zero", year: 2025, primaryGenre: "Strategy", secondaryGenres: "Horror", thirdGenre: "Multiplayer", rating: 61, platforms: "Steam / PlayStation Store / Epic Games Store" },
  { id: 15, title: "Schedule 1", year: 2025, primaryGenre: "Casual", secondaryGenres: "Strategy", thirdGenre: "Simulation", rating: 54, platforms: "Steam / Epic Games Store / PlayStation Store" },
  { id: 16, title: "Clash Royale", year: 2016, primaryGenre: "Strategy", secondaryGenres: "Multiplayer", thirdGenre: "Competitive", rating: 85, platforms: "Google Play / App Store" },
  { id: 17, title: "Hay Day", year: 2012, primaryGenre: "Casual", secondaryGenres: "Simulation", thirdGenre: "Farming", rating: 80, platforms: "Google Play / App Store" },
];

function App() {
  // User & Auth State
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', 'guest'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  
  // Navigation State
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'main', 'chatbot'
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your gaming companion. Tell me what kind of games you enjoy, and I'll help you discover your next favorite title! You can tell me about genres you like, specific games you've enjoyed, or even your mood right now." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // User Preferences & History
  const [userPreferences, setUserPreferences] = useState([]);
  const [playHistory, setPlayHistory] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Get unique genres and platforms
  const genres = ['all', ...new Set(GAMES_DATABASE.map(g => g.primaryGenre))];
  const platforms = ['all', 'Steam', 'PlayStation Store', 'Epic Games Store', 'Xbox Game Pass', 'Nintendo eShop', 'Google Play / App Store'];

  // Auth handlers
  const handleAuth = () => {
    if (authMode === 'guest') {
      setUser({ username: 'Guest', email: 'guest@levelup.com', isGuest: true });
      setCurrentPage('main');
      setShowAuth(false);
      return;
    }
    
    if (!authEmail || !authPassword) {
      alert('Please fill in all required fields');
      return;
    }
    
    const username = authUsername || authEmail.split('@')[0];
    setUser({ username, email: authEmail, isGuest: false });
    setCurrentPage('main');
    setShowAuth(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthUsername('');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setAiRecommendations([]);
    setUserPreferences([]);
    setPlayHistory([]);
    setChatMessages([
      { role: 'assistant', content: "Hi! I'm your gaming companion. Tell me what kind of games you enjoy, and I'll help you discover your next favorite title!" }
    ]);
  };

  // AI-Powered Search
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAISearching(true);
    try {
      const gamesData = GAMES_DATABASE.map(g => 
        `${g.title} (${g.year}) - ${g.primaryGenre}, ${g.secondaryGenres}, Rating: ${g.rating}`
      ).join('\n');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `You are a game recommendation assistant. Based on this search query: "${searchQuery}"
            
Available games:
${gamesData}

Analyze the user's search intent and recommend the most relevant games. Consider:
- Genre preferences
- Keywords about gameplay style
- Mood or themes
- Multiplayer preferences
- Platform preferences

Return a JSON array of game titles (just the titles) that match, ordered by relevance. Return 3-5 games maximum. Only return the JSON array with title strings, nothing else.`
          }]
        })
      });

      const data = await response.json();
      const textContent = data.content.find(c => c.type === 'text')?.text || '';
      const cleanJson = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const recommendedTitles = JSON.parse(cleanJson);
      
      const matchedGames = GAMES_DATABASE.filter(game => 
        recommendedTitles.includes(game.title)
      );
      
      setAiSearchResults({
        query: searchQuery,
        games: matchedGames,
        interpretation: `Found ${matchedGames.length} games matching your search`
      });
    } catch (error) {
      console.error('AI Search error:', error);
      setAiSearchResults({
        query: searchQuery,
        games: [],
        interpretation: 'Sorry, I had trouble understanding that search. Try being more specific!'
      });
    } finally {
      setIsAISearching(false);
    }
  };

  // Chatbot AI handler
  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);
    
    try {
      const gamesData = GAMES_DATABASE.map(g => 
        `${g.title} (${g.year}) - ${g.primaryGenre}/${g.secondaryGenres}/${g.thirdGenre}, Rating: ${g.rating}, Platforms: ${g.platforms}`
      ).join('\n');
      
      const conversationHistory = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          messages: [
            ...conversationHistory,
            {
              role: 'user',
              content: `${userMessage}

Available games database:
${gamesData}

You are a friendly gaming assistant for LevelUp. Help users discover games they'll love by:
1. Asking about their preferences (genres, gameplay style, mood)
2. Recommending specific games from the database with reasons
3. Being conversational and enthusiastic
4. Considering their platform preferences

Keep responses concise and engaging. When recommending games, mention the title, why it fits, and its rating.`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content.find(c => c.type === 'text')?.text || 'Sorry, I had trouble processing that.';
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Oops! I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filter games
  const getFilteredGames = () => {
    if (aiSearchResults) {
      return aiSearchResults.games;
    }
    
    return GAMES_DATABASE.filter(game => {
      const matchesSearch = searchQuery === '' || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.primaryGenre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.secondaryGenres.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.thirdGenre.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre === 'all' || game.primaryGenre === selectedGenre;
      const matchesPlatform = selectedPlatform === 'all' || game.platforms.includes(selectedPlatform);
      
      return matchesSearch && matchesGenre && matchesPlatform;
    });
  };

  const filteredGames = getFilteredGames();

  // Toggle preference
  const togglePreference = (game) => {
    setUserPreferences(prev => {
      const exists = prev.find(g => g.id === game.id);
      if (exists) {
        return prev.filter(g => g.id !== game.id);
      }
      return [...prev, game];
    });
  };

  // Add to play history
  const addToHistory = (game) => {
    setPlayHistory(prev => {
      const exists = prev.find(g => g.id === game.id);
      if (!exists) {
        return [{ ...game, addedAt: new Date() }, ...prev].slice(0, 10);
      }
      return prev;
    });
  };

  // Get personalized recommendations
  const getPersonalizedRecommendations = async () => {
    if (!user || userPreferences.length === 0) {
      alert('Please select some favorite games first!');
      return;
    }

    try {
      const preferencesList = userPreferences.map(g => 
        `${g.title} (${g.primaryGenre}/${g.secondaryGenres})`
      ).join(', ');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Based on these favorite games: ${preferencesList}

Recommend 3 games from this list that the user would enjoy:
${GAMES_DATABASE.map(g => g.title).join(', ')}

For each recommendation, provide: title, reason (one sentence). Format as JSON array with objects: [{title: "", reason: ""}]. Only return JSON.`
          }]
        })
      });

      const data = await response.json();
      const textContent = data.content.find(c => c.type === 'text')?.text || '';
      const cleanJson = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const recommendations = JSON.parse(cleanJson);
      
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Recommendation error:', error);
    }
  };

  // Clear AI search
  const clearAISearch = () => {
    setAiSearchResults(null);
    setSearchQuery('');
  };

  // LANDING PAGE
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Logo & Hero */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Gamepad2 className="w-16 h-16 text-purple-400" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                LevelUp
              </h1>
            </div>
            <p className="text-2xl text-purple-200 mb-4">Your AI-Powered Game Discovery Platform</p>
            <p className="text-lg text-purple-300">Find your next favorite game with intelligent recommendations</p>
          </div>

          {/* Sign In Options */}
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => {
                setAuthMode('signin');
                setShowAuth(true);
              }}
              className="bg-white/10 backdrop-blur-md border-2 border-purple-500/50 rounded-2xl p-8 hover:bg-white/20 hover:border-purple-400 transition group"
            >
              <User className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition" />
              <h3 className="text-xl font-bold mb-2">Sign In</h3>
              <p className="text-sm text-purple-300">Access your account and preferences</p>
            </button>

            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuth(true);
              }}
              className="bg-white/10 backdrop-blur-md border-2 border-pink-500/50 rounded-2xl p-8 hover:bg-white/20 hover:border-pink-400 transition group"
            >
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-pink-400 group-hover:scale-110 transition" />
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-sm text-purple-300">Create a new account and start discovering</p>
            </button>

            <button
              onClick={() => {
                setAuthMode('guest');
                handleAuth();
              }}
              className="bg-white/10 backdrop-blur-md border-2 border-blue-500/50 rounded-2xl p-8 hover:bg-white/20 hover:border-blue-400 transition group"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition" />
              <h3 className="text-xl font-bold mb-2">Continue as Guest</h3>
              <p className="text-sm text-purple-300">Explore without creating an account</p>
            </button>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <h4 className="font-bold mb-2">AI-Powered Search</h4>
              <p className="text-sm text-purple-300">Natural language search understands what you're looking for</p>
            </div>
            <div>
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <h4 className="font-bold mb-2">Smart Chatbot</h4>
              <p className="text-sm text-purple-300">Chat with our AI to get personalized recommendations</p>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h4 className="font-bold mb-2">Personalized</h4>
              <p className="text-sm text-purple-300">Recommendations based on your gaming history and preferences</p>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                <button onClick={() => setShowAuth(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm mb-2">Username</label>
                    <input
                      type="text"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Choose a username"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                </div>
                
                <button
                  onClick={handleAuth}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </div>
              
              <div className="mt-4 text-center text-sm">
                <button
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-purple-300 hover:text-purple-200"
                >
                  {authMode === 'signin' 
                    ? "Don't have an account? Sign Up" 
                    : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CHATBOT PAGE
  if (currentPage === 'chatbot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex flex-col">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentPage('main')} className="hover:opacity-80">
                  <Gamepad2 className="w-8 h-8 text-purple-400" />
                </button>
                <h1 className="text-xl font-bold">AI Game Assistant</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.username}</span>
                </div>
                <button onClick={handleLogout} className="text-sm hover:text-purple-300">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/20">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Ask me anything about games..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isChatLoading}
                />
                <button
                  onClick={handleChatSend}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP PAGE
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LevelUp
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('chatbot')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full hover:shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Chat</span>
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 space-y-2">
              <button
                onClick={() => {
                  setCurrentPage('chatbot');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">AI Chat</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with AI Search */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Favorite Game</h2>
          <p className="text-xl text-purple-200 mb-8">Powered by AI to understand exactly what you're looking for</p>
          
          {/* AI-Powered Search Bar */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="Try: 'fun multiplayer games', 'relaxing simulation', 'challenging action games'..."
                className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300"
              />
              <button
                onClick={handleAISearch}
                disabled={isAISearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {isAISearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">AI Search</span>
                  </>
                )}
              </button>
            </div>
            
            {aiSearchResults && (
              <div className="mt-4 bg-purple-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-purple-200">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    {aiSearchResults.interpretation}
                  </p>
                  <button
                    onClick={clearAISearch}
                    className="text-purple-300 hover:text-white text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">Genre:</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="bg-purple-900">
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">Platform:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform} className="bg-purple-900">
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {!user?.isGuest && userPreferences.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-bold">Your Personalized Recommendations</h3>
                </div>
                <button
                  onClick={getPersonalizedRecommendations}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  Generate
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-purple-200 mb-4">
                Based on your {userPreferences.length} favorite game{userPreferences.length > 1 ? 's' : ''}: {userPreferences.map(g => g.title).join(', ')}
              </p>

              {aiRecommendations.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  {aiRecommendations.map((rec, idx) => {
                    const game = GAMES_DATABASE.find(g => g.title === rec.title);
                    return (
                      <div key={idx} className="bg-black/30 rounded-lg p-4 border border-yellow-500/30">
                        <h4 className="font-bold text-lg mb-1">{rec.title}</h4>
                        {game && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-purple-500/30 rounded">{game.primaryGenre}</span>
                            <span className="text-yellow-400 text-sm flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              {game.rating}
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-purple-200">{rec.reason}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Games Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold">
                {aiSearchResults ? 'AI Search Results' : 'Game Library'}
                <span className="text-purple-400 ml-2">({filteredGames.length})</span>
              </h3>
            </div>
            
            {!user?.isGuest && (
              <div className="text-sm text-purple-300">
                <Star className="w-4 h-4 inline mr-1 fill-yellow-400 text-yellow-400" />
                {userPreferences.length} favorites
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <div
                key={game.id}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition hover:shadow-xl hover:shadow-purple-500/20 group cursor-pointer"
                onClick={() => addToHistory(game)}
              >
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-40 flex items-center justify-center relative">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white/90">{game.rating}</p>
                    <p className="text-xs text-white/70 mt-1">Rating</p>
                  </div>
                  {!user?.isGuest && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePreference(game);
                      }}
                      className="absolute top-3 right-3"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          userPreferences.find(g => g.id === game.id)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white/40 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition">
                    {game.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-purple-500/30 rounded text-xs">
                      {game.primaryGenre}
                    </span>
                    <span className="px-2 py-1 bg-pink-500/30 rounded text-xs">
                      {game.secondaryGenres}
                    </span>
                    {game.thirdGenre && (
                      <span className="px-2 py-1 bg-blue-500/30 rounded text-xs">
                        {game.thirdGenre}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-purple-200 mb-2">
                    <span className="font-semibold">Released:</span> {game.year}
                  </p>
                  
                  <p className="text-xs text-purple-300">
                    {game.platforms}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12 text-purple-300">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">No games found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {playHistory.length > 0 && !user?.isGuest && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold">Recently Viewed</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {playHistory.map(game => (
                <div
                  key={game.id}
                  className="flex-shrink-0 w-48 bg-white/10 rounded-lg p-3 border border-white/20 hover:border-purple-500/50 transition cursor-pointer"
                >
                  <p className="font-semibold text-sm mb-1">{game.title}</p>
                  <p className="text-xs text-purple-300">{game.primaryGenre}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{game.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <Gamepad2 className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-lg">LevelUp</span>
              </div>
              <p className="text-sm text-purple-300">
                AI-powered game discovery platform helping players find their perfect match
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-purple-300">
                <li>AI-Powered Search</li>
                <li>Smart Chatbot Assistant</li>
                <li>Personalized Recommendations</li>
                <li>Multi-Platform Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">Data Sources</h4>
              <p className="text-sm text-purple-300 mb-2">Powered by:</p>
              <ul className="space-y-1 text-sm text-purple-300">
                <li>IGDB Database</li>
                <li>SteamDB</li>
                <li>Claude AI</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-purple-400">
            <p>© 2025 LevelUp - CSCI 318 Project by Hardeek C, Mukhammedali Z, Alexander M, Emerald L, Rehman K</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;