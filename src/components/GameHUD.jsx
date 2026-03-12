import { PLAYERS } from '../game/constants.js';

function WoodDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, margin:'12px 0' }}>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg, transparent, rgba(196,146,42,0.4), transparent)' }}/>
      <span style={{ color:'#c4922a', fontSize:10, fontFamily:'serif' }}>✦</span>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg, transparent, rgba(196,146,42,0.4), transparent)' }}/>
    </div>
  );
}

function ScrollPanel({ title, children }) {
  return (
    <div style={{ position:'relative', borderRadius:4, background:'linear-gradient(180deg, #2a1a06 0%, #1e1106 100%)', border:'2px solid #5a3d1a', padding:'12px', boxShadow:'inset 0 1px 3px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)' }}>
      <div style={{ position:'absolute', top:-4, left:8, right:8, height:7, background:'linear-gradient(90deg, #7a5230, #c4922a, #7a5230)', borderRadius:'3px 3px 0 0' }}/>
      {title && <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:8, textAlign:'center', color:'#c4922a', fontFamily:'Georgia, serif' }}>{title}</div>}
      {children}
      <div style={{ position:'absolute', bottom:-4, left:8, right:8, height:7, background:'linear-gradient(90deg, #7a5230, #c4922a, #7a5230)', borderRadius:'0 0 3px 3px' }}/>
    </div>
  );
}

export default function GameHUD({ state, playerSide, isAIThinking, onReset, onHelp, onTriggerTraitor, onDeclineTraitor }) {
  const { currentPlayer, gamePhase, winner, log, pieces } = state;

  const vikingPieces = pieces.filter(p => p.player === PLAYERS.VIKING && !p.isMaceObject).length;
  const marauderPieces = pieces.filter(p => p.player === PLAYERS.MARAUDER && !p.isMaceObject).length;
  const vikingHasMace = pieces.some(p => p.player === PLAYERS.VIKING && p.hasMace);
  const marauderHasMace = pieces.some(p => p.player === PLAYERS.MARAUDER && p.hasMace);
  const isVikingTurn = currentPlayer === PLAYERS.VIKING;

  const titleStyle = { fontFamily:'Georgia, serif', fontSize:'1.4rem', fontWeight:700, color:'#e8c060', textShadow:'0 0 12px rgba(232,192,96,0.5), 2px 2px 4px rgba(0,0,0,0.8)', letterSpacing:'0.05em', lineHeight:1.2 };
  const btnBase = { width:'100%', padding:'10px', borderRadius:4, fontFamily:'Georgia, serif', fontSize:'0.7rem', letterSpacing:'0.1em', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.4)', transition:'all 0.15s' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, minWidth:220, maxWidth:260, color:'#e8d8b0' }}>

      <div style={{ textAlign:'center', padding:'8px 0' }}>
        <div style={titleStyle}>Maces<br/>&amp; Talons</div>
        <div style={{ fontFamily:'Georgia, serif', fontStyle:'italic', fontSize:'0.7rem', color:'#a08040', marginTop:4, letterSpacing:'0.1em' }}>of Berk — Est. 1010 AD</div>
        <WoodDivider/>
      </div>

      <ScrollPanel>
        {gamePhase === 'GAME_OVER' ? (
          <div style={{ textAlign:'center', padding:'4px 0' }}>
            <div style={{ fontSize:'2rem' }}>⚔️</div>
            <div style={{ fontFamily:'Georgia, serif', color:'#e8c060', fontSize:'0.9rem', marginTop:4 }}>{winner} Victory!</div>
          </div>
        ) : isAIThinking ? (
          <div style={{ textAlign:'center', padding:'4px 0' }}>
            <div style={{ fontSize:'1.2rem' }}>🐉</div>
            <div style={{ fontFamily:'Georgia, serif', color:'#80b0e0', fontSize:'0.75rem', fontStyle:'italic', marginTop:2 }}>The dragon ponders...</div>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'4px 0' }}>
            <div style={{ fontFamily:'Georgia, serif', fontSize:'0.65rem', color:'#806040', letterSpacing:'0.15em', marginBottom:4 }}>CURRENT TURN</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <span style={{ fontSize:'1.1rem' }}>{isVikingTurn ? '⚔️' : '🗡️'}</span>
              <span style={{ fontFamily:'Georgia, serif', fontSize:'0.85rem', color: isVikingTurn ? '#80c0ff' : '#ff8080' }}>
                {isVikingTurn ? 'Vikings' : 'Marauders'}
              </span>
            </div>
            <div style={{ color:'#806040', fontSize:'0.65rem', marginTop:3, fontStyle:'italic' }}>
              {currentPlayer === playerSide ? '— your move —' : '— enemy moves —'}
            </div>
          </div>
        )}
      </ScrollPanel>

      <ScrollPanel title="Forces">
        <div style={{ marginTop:4, marginBottom:4 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ color:'#80c0ff', fontSize:'0.8rem' }}>⚔️ Vikings</span>
            <span style={{ fontSize:'0.75rem', color:'#c8b080' }}>{vikingHasMace ? '✦ MACE  ' : ''}{vikingPieces}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#ff8080', fontSize:'0.8rem' }}>🗡️ Marauders</span>
            <span style={{ fontSize:'0.75rem', color:'#c8b080' }}>{marauderHasMace ? '✦ MACE  ' : ''}{marauderPieces}</span>
          </div>
        </div>
      </ScrollPanel>

      <ScrollPanel title="Chronicle">
        <div style={{ overflowY:'auto', maxHeight:100, marginTop:4, marginBottom:4 }}>
          {[...log].reverse().slice(0, 6).map((entry, i) => (
            <div key={i} style={{ fontFamily:'Georgia, serif', fontStyle:'italic', fontSize:'0.7rem', color: i === 0 ? '#c8b080' : '#7a6040', lineHeight:1.4, borderBottom: i < 5 ? '1px solid rgba(90,61,26,0.3)' : 'none', paddingBottom:2, marginBottom:2 }}>
              {entry}
            </div>
          ))}
        </div>
      </ScrollPanel>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {state.pendingTraitor && currentPlayer === playerSide && !state.pendingTraitorSelection && gamePhase==='PLAYING' && (
          <button onClick={onTriggerTraitor} style={{ ...btnBase, background:'linear-gradient(180deg, #4a0a0a 0%, #1a0000 100%)', border:'2px solid #8b0000', color:'#ff8080' }}>
            ⚔️ Activate Traitor
          </button>
        )}
        {state.pendingTraitorSelection && state.pendingTraitor && currentPlayer === playerSide && (
          <button onClick={onDeclineTraitor} style={{ ...btnBase, background:'transparent', border:'1px dashed #888', color:'#888' }}>
            Cancel Traitor
          </button>
        )}
        <button onClick={onHelp} style={{ ...btnBase, background:'linear-gradient(180deg, #1a2a0e 0%, #0e1a06 100%)', border:'2px solid #4a7a2a', color:'#90c060' }}>
          ? How to Play
        </button>
        <button onClick={onReset} style={{ ...btnBase, background:'linear-gradient(180deg, #2a1a08 0%, #1a0e04 100%)', border:'2px solid #5a3d1a', color:'#a07840' }}>
          ᛞ New Game
        </button>
      </div>

    </div>
  );
}
