# Maces and Talons - HTTYD Board Game

A strategic medieval board game based on How to Train Your Dragon, featuring Vikings and Marauders battling for supremacy on the high seas.

## 🎮 Features

### Gameplay
- **13x13 strategic board** with land and water tiles
- **Multiple unit types**: Hunters, Kings, Longships, Kingships
- **Dynamic neutral pieces**: Dragon, Traitor, Accomplice, Mace
- **Ship placement phase** before main battle
- **Traitor ability** for special strategy moments
- **AI opponent** with intelligent decision-making

### Visual Design (NEW!)
- ✨ **Medieval Viking theme** with parchment aesthetics
- 🎨 **Professional color palette** (gold, wood, stone, sea blue)
- 🎭 **Faction colors** (blue Vikings, red Marauders)
- ⚡ **Smooth animations** for all interactions
- 📱 **Responsive design** for desktop and mobile
- 🎪 **Interactive UI** with hover effects and visual feedback

### User Interface (NEW!)
- 🏠 **Main menu** for game mode selection
- 📊 **Top bar** showing turn, phase, and player status
- 📋 **Side panel** with game information and controls
- ⚙️ **Settings screen** with sound/music/difficulty options
- 💬 **Game log** showing event history
- 🏆 **Victory screen** with play again button

## Quick Start

### Prerequisites
1. Install Node.js (v18+): https://nodejs.org/
2. Install VS Code: https://code.visualstudio.com/

### Run Locally
```bash
cd maces-and-talons
npm install
npm run dev
```
Open browser at http://localhost:5174

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure
```
src/
├── components/
│   ├── App.jsx              ← Main app with new layout
│   ├── TopBar.jsx           ← Game info bar (NEW)
│   ├── Board.jsx            ← Game board
│   ├── Cell.jsx             ← Individual tile (enhanced)
│   ├── GameHUD.jsx          ← Side panel (improved)
│   ├── MainMenu.jsx         ← Game menu (NEW)
│   ├── SettingsScreen.jsx   ← Settings modal (NEW)
│   └── HelpModal.jsx        ← Help/rules
├── game/
│   ├── constants.js         ← Board layout, piece types
│   ├── gameModes.js         ← Game mode definitions
│   └── logic.js             ← Movement, capture, win conditions
├── ai/
│   └── bot.js               ← Minimax AI with alpha-beta pruning
├── hooks/
│   └── useGameState.js      ← React state management
├── assets/                  ← Game assets
├── index.css                ← Styles + animations (enhanced)
└── main.jsx                 ← App entry point

```

## Game Modes

### Player vs Player
- Two players compete on the same machine
- Takes turns controlling Vikings (blue) and Marauders (red)

### Player vs Dragon AI
- Play as Vikings against AI Marauders
- Challenging naval combat with intelligent opponent

### Player vs Marauders
- Alternative AI opponent
- Different playstyle and strategy

## Configuration

### AI Difficulty
Edit `src/ai/bot.js`:
```javascript
const MAX_DEPTH = 4;  // Higher = harder (3 is default, 4 is hard)
```

The bot understands:
- Unit value (King > Mace carrier > Hunters)
- Safety (protects ships, water traversal)
- Offensive planning (2-3 moves ahead)
- Traitor/Accomplice synergy
- Board control and positioning

## UI/UX Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
theme.extend.colors = {
  gold: '#e8c060',
  viking: '#80c0ff',
  // ... more colors
}
```

### Add New Animations
1. Add @keyframes to `src/index.css`
2. Add animation to `tailwind.config.js`
3. Use in components with animation name

### Modify Button Styles
Edit `.btn-medieval` class in `src/index.css`

## Documentation

- 📖 **[REDESIGN_SUMMARY.md](./REDESIGN_SUMMARY.md)** - Comprehensive visual redesign documentation
- 🎯 **[FEATURES.md](./FEATURES.md)** - Feature guide and customization reference
- 👨‍💻 **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Developer guide for extending the game

## Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Responsive Design

- **Desktop** (1300px+): Full layout with side panel
- **Tablet** (768px-1299px): Adjusted spacing, mobile-optimized
- **Mobile** (480px-767px): Stacked layout, larger touch targets
- **Small Mobile** (<480px): Single column, minimalist UI

## Performance

- GPU-accelerated CSS animations
- Optimized React component rendering
- SVG sprites for game pieces
- Efficient state management
- Mobile-friendly code

## Technologies

- **React 18.3** - UI framework
- **Tailwind CSS 3.4** - Utility-first styling
- **Vite 7** - Build tool
- **JavaScript** - Game logic and AI
- **CSS3** - Advanced animations

## Game Rules

### Setup Phase
1. Vikings place Longship (2 cells) then Kingship (1 cell)
2. Marauders place ships on their side

### Playing Phase
1. Players move pieces (1 adjacent cell, orthogonal/diagonal)
2. Capture enemy pieces that are trapped
3. Pieces can use ships to cross water
4. Traitor can swap places with Accomplice
5. First to capture Enemy King wins

### Special Rules
- **Mace**: Grants special power when held
- **Dragon**: Neutral piece, can't be captured (blocks movement)
- **Traitor**: Can activate to replace enemy Hunter with Accomplice
- **Water**: Only ships (Longship, Kingship) and Dragon can traverse

## Known Issues

None currently known. **Please report bugs!**

## Future Enhancements

- 🔊 Sound effects and background music
- 🎬 Unit movement animations
- ✨ Particle effects
- 🎮 Advanced AI difficulty levels
- 📊 Game statistics and replay system
- 🌐 Online multiplayer
- ♿ Enhanced accessibility features
- 🎨 Custom themes and skins
- ⌨️ Full keyboard navigation
- 📱 Progressive web app support

## Development

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is based on How to Train Your Dragon universe.
Game mechanics are original.

## Credits

### Design
- Medieval theme and UI/UX design
- Component architecture
- Animation system

### Development
- React and Tailwind CSS implementation
- Game logic and AI
- State management

### Resources
- Google Fonts for medieval typography
- CSS innovations for medieval aesthetics
- Modern animation techniques

---

**Last Updated**: March 2026  
**Version**: 2.0 (Visual Redesign Complete)  
**Status**: Ready for playtesting ✅


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
