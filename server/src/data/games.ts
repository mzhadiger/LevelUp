export type Game = {
  id: number;
  title: string;
  year: number;
  primaryGenre: string;
  secondaryGenres: string;
  thirdGenre: string;
  rating: number;
  platforms: string;
};

export const games: Game[] = [
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
