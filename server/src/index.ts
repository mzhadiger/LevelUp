import express from 'express';
import cors from 'cors';
import { games, Game } from './data/games';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const normalize = (value: string) => value.trim().toLowerCase();

const scoreGame = (game: Game, query: string) => {
  if (!query) return 0;
  const tokens = normalize(query).split(/\s+/);
  const haystack = normalize(
    `${game.title} ${game.primaryGenre} ${game.secondaryGenres} ${game.thirdGenre}`
  );
  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
};

app.get('/api/games', (_req, res) => {
  res.json({ games });
});

app.get('/api/search', (req, res) => {
  const { query = '', genre = 'all', platform = 'all' } = req.query as Record<string, string>;

  const results = games
    .map((game) => ({
      game,
      score: scoreGame(game, query),
    }))
    .filter(({ game, score }) => {
      const matchesGenre = genre === 'all' || game.primaryGenre === genre;
      const matchesPlatform = platform === 'all' || game.platforms.includes(platform);
      const matchesQuery = query ? score > 0 : true;
      return matchesGenre && matchesPlatform && matchesQuery;
    })
    .sort((a, b) => b.score - a.score || b.game.rating - a.game.rating)
    .map(({ game }) => game);

  res.json({
    query,
    results,
    interpretation: results.length
      ? `Found ${results.length} game(s) matching "${query || 'any'}"`
      : 'No games match that description yet. Try a different phrase.',
  });
});

app.post('/api/recommendations', (req, res) => {
  const favorites: number[] = Array.isArray(req.body?.favorites) ? req.body.favorites : [];

  const favoriteGames = games.filter((game) => favorites.includes(game.id));

  if (!favoriteGames.length) {
    return res.status(400).json({ message: 'Select favorite games before asking for recommendations.' });
  }

  const preferredGenres = favoriteGames.map((game) => game.primaryGenre);
  const preferredPlatforms = favoriteGames.flatMap((game) => game.platforms.split(' / '));

  const ranked = games
    .filter((game) => !favorites.includes(game.id))
    .map((game) => {
      const genreScore = preferredGenres.includes(game.primaryGenre) ? 2 : 0;
      const platformScore = preferredPlatforms.some((p) => game.platforms.includes(p)) ? 1 : 0;
      const ratingScore = game.rating / 100;
      return { game, score: genreScore + platformScore + ratingScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ game }) => ({
      title: game.title,
      reason: `Fits your taste in ${game.primaryGenre} and is available on ${game.platforms.split(' / ')[0]}.`,
    }));

  res.json({ recommendations: ranked });
});

app.post('/api/chat', (req, res) => {
  const messages: { role: 'user' | 'assistant'; content: string }[] = req.body?.messages || [];
  const lastMessage = messages.filter((m) => m.role === 'user').pop()?.content || 'Tell me about games you like!';

  const suggestions = games
    .filter((game) => scoreGame(game, lastMessage) > 0)
    .slice(0, 2)
    .map((game) => `${game.title} (${game.primaryGenre}, rating ${game.rating})`);

  const reply = suggestions.length
    ? `Based on that, try ${suggestions.join(' or ')}. Want something different? Mention a genre or platform!`
    : "I didn't catch a strong preference. Share a genre, platform, or a game you've enjoyed.";

  res.json({ message: reply });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
