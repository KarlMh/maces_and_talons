# Developer Guide - Maces & Talons

## Project Structure

```
maces_and_talons/
├── src/
│   ├── components/
│   │   ├── App.jsx               # Main app component
│   │   ├── TopBar.jsx            # Game info bar (NEW)
│   │   ├── Board.jsx             # Game board
│   │   ├── Cell.jsx              # Individual tile (enhanced)
│   │   ├── GameHUD.jsx           # Side panel (improved)
│   │   ├── MainMenu.jsx          # Game menu (NEW)
│   │   ├── SettingsScreen.jsx    # Settings modal (NEW)
│   │   ├── HelpModal.jsx         # Help/rules
│   │   ├── GameHUD.jsx           # Game info
│   │   └── VictoryOverlay (in App.jsx)
│   ├── ai/
│   │   └── bot.js
│   ├── game/
│   │   ├── constants.js
│   │   ├── gameModes.js
│   │   └── logic.js
│   ├── hooks/
│   │   └── useGameState.js
│   ├── assets/
│   ├── index.css                 # Global styles (enhanced)
│   ├── main.jsx
│   └── App.jsx                   # Root component
├── public/
│   ├── index.html
│   └── aiWorker.js
├── tailwind.config.js            # Extended with theme
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
├── package.json
├── REDESIGN_SUMMARY.md           # Detailed documentation
└── FEATURES.md                   # Feature guide

```

## Development Workflow

### Starting Development
```bash
npm run dev
# Open http://localhost:5174
```

### Building for Production
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## Component Development Guide

### Creating a New Component

1. **Location**: `src/components/ComponentName.jsx`

2. **Template**:
```jsx
export default function ComponentName({ prop1, prop2 }) {
  return (
    <div style={{
      /* Medieval themed styles */
      fontFamily: "'Cinzel Decorative', serif",
      color: '#e8c060',
      background: 'linear-gradient(180deg, #2a1a08, #1e1208)',
      border: '2px solid #5a3d1a',
      borderRadius: 6,
      padding: '16px 20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
    }}>
      {/* Content */}
    </div>
  );
}
```

3. **Styling Standards**:
   - Use inline styles with medieval theme colors
   - Reference colors from tailwind.config.js
   - Use animation classes from index.css
   - Add hover effects with onMouseEnter/Leave
   - Ensure mobile responsiveness

4. **Import in App.jsx**:
```jsx
import ComponentName from './components/ComponentName.jsx';
```

## Adding New Animations

### Step 1: Create Keyframe Animation
Edit `src/index.css`:
```css
@keyframes my-animation {
  0% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: scale(1.1);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
  }
}
```

### Step 2: Add to Tailwind Config
Edit `tailwind.config.js`:
```javascript
animation: {
  'my-animation': 'my-animation 1s ease-in-out infinite',
},
keyframes: {
  'my-animation': {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '50%': { opacity: '0.7', transform: 'scale(1.1)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
}
```

### Step 3: Use in Component
```jsx
<div style={{
  animation: 'my-animation 1s ease-in-out infinite',
}}>
  Content
</div>
```

## Color System

### Accessing Colors

From `tailwind.config.js`:
```javascript
// Use in inline styles:
color: '#e8c060'  // gold
background: '#4a7fa5'  // viking blue
border: '2px solid #c4922a'  // dark gold
```

### Color Categories

**Medieval/Primary**:
- Parchment: `#d4b896`, `#c8a870`
- Wood: `#6b5437`, `#8b6f47`
- Stone: `#4b4540`, `#6b6560`

**Faction Colors**:
- Viking: `#80c0ff`, `#4a7fa5`
- Marauder: `#ff8080`, `#cc3333`

**Accents**:
- Gold: `#e8c060`, `#c4922a`
- Water: `#1a3a5c`, `#4a8fd9`

## Styling Best Practices

### 1. Use Theme Colors
```jsx
// ✅ Good
color: '#e8c060'  // theme gold

// ❌ Avoid
color: '#ff0000'  // random color
```

### 2. Add Hover Effects
```jsx
<button
  style={{ /* base styles */ }}
  onMouseEnter={(e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.background = 'linear-gradient(180deg, #a07a1a, #6b4a18)';
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.background = 'linear-gradient(180deg, #8b6914, #5a3d10)';
  }}
>
  Click Me
</button>
```

### 3. Add Animations
```jsx
<div style={{
  animation: 'ember-glow 1.5s ease-in-out infinite',
  boxShadow: 'inset 0 0 8px #e85d0480, 0 0 12px #e85d0440',
}}>
  Glowing content
</div>
```

### 4. Mobile Responsive
```jsx
// Use media queries in CSS OR
style={{
  fontSize: 'clamp(14px, 2vw, 16px)',  // responsive font
  padding: 'max(10px, 2vw)',           // responsive padding
}}
```

## Game State Management

### useGameState Hook
From `hooks/useGameState.js`:

```jsx
const { 
  state,              // Game state object
  playerSide,         // Which side the player is
  isAIThinking,       // AI is calculating
  handlePlacementClick,    // Ship placement handling
  handleGameClick,         // Game move handling
  resetGame,               // Reset game
  startTraitorSelection,   // Start traitor ability
  activateTraitor,         // Use traitor ability
  declineTraitor,          // Cancel traitor ability
} = useGameState(PLAYERS.VIKING, false);
```

### State Structure
```javascript
{
  pieces: [],              // All pieces on board
  currentPlayer,           // Whose turn
  selectedPiece,          // Currently selected
  validMoves: [],         // Possible moves
  gamePhase,              // 'SHIP_PLACEMENT' or 'PLAYING'
  placementTurn,          // Who's placing ships
  placingShipType,        // Which ship type
  winner,                 // Which side won
  capturedPieces: [],     // Captured units
  pendingTraitor,         // Traitor activation pending
  pendingTraitorSelection,// Choosing target
  log: [],                // Game events
}
```

## Constants

### Game Constants
From `game/constants.js`:

```javascript
// Piece types
PIECE_TYPES.HUNTER           // Regular unit
PIECE_TYPES.KING             // King unit
PIECE_TYPES.LONGSHIP         // 2-cell ship
PIECE_TYPES.KINGSHIP         // 1-cell ship
PIECE_TYPES.DRAGON           // Neutral piece
PIECE_TYPES.TRAITOR          // Neutral piece
PIECE_TYPES.ACCOMPLICE       // Neutral piece
PIECE_TYPES.MACE             // Objective

// Players
PLAYERS.VIKING               // Blue faction
PLAYERS.MARAUDER             // Red faction

// Board constants
BOARD_SIZE = 13              // 13x13 grid
BOARD_LAYOUT                 // Land/water layout

// Game phases
'SHIP_PLACEMENT'
'PLAYING'
'GAME_OVER'
```

## Adding Features

### Feature: New Game Mode

1. Add mode to MainMenu.jsx:
```jsx
<button onClick={() => onStartGame({ mode: 'my-mode' })}>
  My Game Mode
</button>
```

2. Handle in useGameState hook

3. Update game logic in `game/logic.js` if needed

### Feature: New Piece Type

1. Add to PIECE_TYPES in `game/constants.js`

2. Create SVG in Cell.jsx SVGS object:
```jsx
const SVGS = {
  [`${PIECE_TYPES.NEW_PIECE}_${PLAYERS.VIKING}`]: <svg>...</svg>,
  [`${PIECE_TYPES.NEW_PIECE}_${PLAYERS.MARAUDER}`]: <svg>...</svg>,
}
```

3. Add game logic in `game/logic.js`

4. Render in Board.jsx

### Feature: New Animation

1. Add @keyframes to index.css

2. Add to tailwind config animation

3. Use in component with animation name

4. Document in this file

## Testing

### Visual Testing
- Screenshot different screen sizes
- Compare with mock designs
- Check color accuracy
- Verify animations smooth

### Functional Testing
- All buttons clickable
- Game state updates correctly
- Pieces move properly
- Win conditions work

### Accessibility Testing
- Run axe devtools
- Test keyboard navigation
- Check color contrast
- Test with screen readers

## Performance Optimization

### Current Optimizations
- CSS animations (GPU accelerated)
- SVG sprites for pieces
- CSS Grid layout
- Memoized components
- Efficient state management

### Potential Improvements
- Code splitting
- Lazy loading
- Image optimization
- Service worker caching
- Virtualized scrolling for logs

## Deployment

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Production
```bash
# Deploy dist/ folder to your hosting
# Example: Vercel, Netlify, GitHub Pages
```

### Environment Variables
(None currently, but structure if needed)

```javascript
// .env
VITE_API_URL=http://localhost:3000
```

## Debugging

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Use Debugger for breakpoints
4. Check Network for assets
5. Use React DevTools extension

### Common Issues

**Port already in use**:
```bash
npx kill-port 5173
npm run dev
```

**Module not found**:
- Check import paths
- Verify file exists
- Check case sensitivity

**Styles not applying**:
- Check CSS specificity
- Verify class names
- Check for syntax errors

## Code Style Guide

### File Naming
- Components: PascalCase (Button.jsx)
- Utils: camelCase (helpers.js)
- Constants: UPPER_SNAKE_CASE (BOARD_SIZE)

### Component Structure
```jsx
// 1. Imports
import { useState } from 'react';

// 2. Sub-components
function SubComponent() { ... }

// 3. Main component
export default function MainComponent() {
  // Hooks first
  const [state, setState] = useState();

  // Methods
  const handleClick = () => { ... };

  // Render
  return (
    <div>Content</div>
  );
}
```

### CSS Naming
Use semantic names:
- `.btn-medieval` - Medieval button
- `.tile-hover` - Interactive tile
- `.panel-parchment` - Parchment panel

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Design Resources
- Medieval Design Patterns
- Color Theory
- Typography Best Practices

## Support

For questions or issues:
1. Check existing documentation
2. Review similar components
3. Test in isolation
4. Check browser console
5. Use React DevTools

---

Happy developing! 🚀

