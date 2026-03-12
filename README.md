# Maces and Talons - HTTYD Board Game

## Quick Start (Windows)

### Prerequisites
1. Install Node.js (v18+): https://nodejs.org/
2. Install VS Code: https://code.visualstudio.com/

### Run Locally
```
cd maces-and-talons
npm install
npm run dev
```
Open browser at http://localhost:5173

## Project Structure
```
src/
├── game/
│   ├── constants.js     ← Board layout, piece types, initial state
│   └── logic.js         ← Movement, capture, win conditions  
├── ai/
│   └── bot.js           ← Minimax AI with alpha-beta pruning
├── hooks/
│   └── useGameState.js  ← React state + AI trigger
└── components/
    ├── Board.jsx         ← 10x10 game board
    ├── Cell.jsx          ← Individual cell
    └── GameHUD.jsx       ← Sidebar HUD
```

## AI Difficulty
Edit src/ai/bot.js:
```js
const MAX_DEPTH = 4; // Higher = harder (3 is default)
```

The bot now understands the complete rule set: it protects high‑value pieces
(Kings, mace carriers, Traitor/Accomplice, Dragon), hunts enemy Hunters/King,
and makes use of ships to traverse water safely.  It plans 2‑3 turns ahead,
orders moves by capture potential, and even chooses the best moment to trigger
Traitor+Accomplice.  The evaluation function balances offense and defense,
weights mobility, threats, and positioning around ships/dragons.  Feel free to
adjust `MAX_DEPTH` or the `evaluate` heuristics to tune behaviour.

## Build for Production
```
npm run build
```
Output in dist/ — deploy to Vercel/Netlify.

## Roadmap
- [x] Board rendering
- [x] Hunter/King movement
- [x] Sandwich capture
- [x] Mace pickup & win condition
- [x] Minimax AI bot
- [x] Ship placement UI
- [x] Traitor/Accomplice ability
- [x] Dragon trap capture
- [ ] Sound & animations
- [ ] Multiplayer (Socket.io)
- [ ] Mobile (Capacitor)
