# LevelUp

A minimal full-stack playground for AI-assisted game discovery. The project now ships with:

- **Express API** that exposes game data, keyword search, rule-based chat responses, and simple personalization.
- **React + Vite frontend** styled with Tailwind for exploring games, chatting, and requesting recommendations.

## Getting Started

Install dependencies for both the API and client:

```bash
cd server && npm install
cd ../client && npm install
```

Run the API (default port `4000`):

```bash
npm run dev
```

Start the frontend in another shell (default port `5173` with `/api` proxied to the server):

```bash
npm run dev
```

Build commands are available via `npm run build` in each package.

## Running in VS Code

1. Install [Node.js 18+](https://nodejs.org/) and open the `LevelUp` folder in VS Code.
2. Use the integrated terminal to install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Start the API from `server` in one terminal:
   ```bash
   npm run dev
   ```
4. Start the frontend from `client` in a second terminal:
   ```bash
   npm run dev
   ```
   The Vite dev server will proxy `/api` requests to the API on port `4000`.
5. In VS Code, you can also use the **NPM Scripts** sidebar to run the same `dev` scripts without leaving the editor.
