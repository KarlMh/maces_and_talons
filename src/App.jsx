import { useCallback, useState } from 'react';
import Board from './components/Board.jsx';
import GameHUD from './components/GameHUD.jsx';
import TopBar from './components/TopBar.jsx';
import HelpModal from './components/HelpModal.jsx';
import { useGameState } from './hooks/useGameState.js';
import { PLAYERS } from './game/constants.js';

function VictoryOverlay({ winner, onReset }) {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 100, 
      background: 'rgba(0,0,0,0.85)', 
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #d4b896 0%, #c8a870 50%, #a07840 100%)',
        border: '4px solid #3d2a10',
        borderRadius: 12, 
        padding: '56px 64px', 
        textAlign: 'center', 
        maxWidth: 420,
        boxShadow: '0 16px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)',
        animation: 'fade-in-up 0.4s ease-out forwards',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚔️</div>
        <div style={{ 
          fontFamily: "'Cinzel Decorative', serif", 
          fontSize: '2rem', 
          fontWeight: 700, 
          color: '#3a2000', 
          marginBottom: 12,
          letterSpacing: '0.1em',
        }}>
          {winner}
        </div>
        <div style={{ 
          fontFamily: "'Cinzel Decorative', serif", 
          fontSize: '1rem', 
          color: '#5a3800', 
          marginBottom: 24, 
          letterSpacing: '0.15em',
          fontWeight: 600,
        }}>
          VICTORIOUS
        </div>
        <div style={{ 
          color: '#c8922a', 
          fontSize: '0.9rem', 
          letterSpacing: '0.3em', 
          marginBottom: 32,
          fontFamily: 'serif',
        }}>
          ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ
        </div>
        <button 
          onClick={onReset} 
          style={{ 
            padding: '14px 40px', 
            background: 'linear-gradient(180deg, #8b6914 0%, #5a3d10 100%)', 
            border: '2px solid #3a2800', 
            borderRadius: 6, 
            color: '#e8c060', 
            fontFamily: "'Cinzel Decorative', serif", 
            fontSize: '0.85rem', 
            fontWeight: 600,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { state, playerSide, isAIThinking, handlePlacementClick, handleGameClick, resetGame, startTraitorSelection, activateTraitor, declineTraitor } = useGameState(PLAYERS.VIKING, false);
  const [showHelp, setShowHelp] = useState(false);

  const onCellClick = useCallback((row, col, piece) => {
    if (state.gamePhase === 'SHIP_PLACEMENT') {
      handlePlacementClick(row, col);
    } else {
      handleGameClick(row, col, piece);
    }
  }, [state.gamePhase, handlePlacementClick, handleGameClick]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0804 0%, #1a1208 50%, #0f0804 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambiance */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        pointerEvents: 'none', 
        background: 'radial-gradient(ellipse at 20% 0%, rgba(180,80,10,0.08), transparent 60%)',
        zIndex: 0,
      }}/>
      
      {/* Top Bar */}
      <TopBar state={state} playerSide={playerSide} isAIThinking={isAIThinking} />
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '24px 16px',
        gap: 24,
        position: 'relative',
        zIndex: 1,
        overflow: 'auto',
      }}>
        {/* Left spacer for balance */}
        <div style={{ flex: 0.3, minWidth: 0 }} />
        
        {/* Board Container */}
        <Board 
          state={state} 
          onCellClick={onCellClick} 
          onActivateTraitor={activateTraitor} 
          onDeclineTraitor={declineTraitor}
        />
        
        {/* Right Side Panel - GameHUD */}
        <div style={{ 
          flex: 0.4, 
          minWidth: 240,
          maxWidth: 280,
        }}>
          <GameHUD 
            state={state} 
            playerSide={playerSide} 
            isAIThinking={isAIThinking} 
            onReset={resetGame} 
            onHelp={() => setShowHelp(true)}
            onTriggerTraitor={startTraitorSelection}
            onDeclineTraitor={declineTraitor}
          />
        </div>
      </div>

      {/* Overlays */}
      {state.winner && <VictoryOverlay winner={state.winner} onReset={resetGame} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
