import { useCallback } from 'react';
import Board from './components/Board.jsx';
import GameHUD from './components/GameHUD.jsx';
import { useGameState } from './hooks/useGameState.js';
import { PLAYERS } from './game/constants.js';

function VictoryOverlay({ winner, onReset }) {
  return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(3px)' }}>
      <div style={{ background:'radial-gradient(ellipse at 40% 30%,#c8a870,#a07840)', border:'4px solid #5a3d1a', borderRadius:8, padding:'48px 56px', textAlign:'center', maxWidth:380 }}>
        <div style={{ fontSize:'3rem', marginBottom:8 }}>⚔️</div>
        <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'1.8rem', fontWeight:700, color:'#3a2000', marginBottom:8 }}>{winner}</div>
        <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'1rem', color:'#5a3800', marginBottom:20, letterSpacing:'0.1em' }}>VICTORIOUS</div>
        <div style={{ color:'#c4922a', fontSize:'0.8rem', letterSpacing:'0.3em', marginBottom:20 }}>ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ</div>
        <button onClick={onReset} style={{ padding:'12px 32px', background:'linear-gradient(180deg,#8b6914,#5a3d10)', border:'2px solid #3a2800', borderRadius:4, color:'#e8c060', fontFamily:"'Cinzel Decorative',serif", fontSize:'0.75rem', cursor:'pointer' }}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { state, playerSide, isAIThinking, handlePlacementClick, handleGameClick, resetGame,
          startTraitorSelection, activateTraitor, declineTraitor } = useGameState(PLAYERS.VIKING, true);

  const onCellClick = useCallback((row, col, piece) => {
    if (state.gamePhase === 'SHIP_PLACEMENT') {
      handlePlacementClick(row, col);
    } else {
      handleGameClick(row, col, piece);
    }
  }, [state.gamePhase, handlePlacementClick, handleGameClick]);

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at 50% 20%,#1e1008,#0f0804,#050302)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 20% 0%,rgba(180,80,10,0.1),transparent 60%)', zIndex:0 }}/>
      {state.winner && <VictoryOverlay winner={state.winner} onReset={resetGame} />}
      <div style={{ display:'flex', gap:24, alignItems:'flex-start', justifyContent:'center', width:'100%', maxWidth:1300, position:'relative', zIndex:1, flexWrap:'wrap' }}>
        <Board state={state} onCellClick={onCellClick} onActivateTraitor={activateTraitor} />
        <GameHUD
          state={state}
          playerSide={playerSide}
          isAIThinking={isAIThinking}
          onReset={resetGame}
          onTriggerTraitor={startTraitorSelection}
          onDeclineTraitor={declineTraitor}
        />
      </div>
    </div>
  );
}
