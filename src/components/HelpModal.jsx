import { useState } from 'react';

const TABS = ['Goal', 'Pieces', 'Capture', 'Special'];

const PAGES = {
  Goal: <>
    <p style={{marginBottom:10}}>You are <strong style={{color:'#4a6fa5'}}>Vikings ⚔️</strong>. The AI plays <strong style={{color:'#8b2020'}}>Marauders 🗡️</strong>.</p>
    <p style={{marginBottom:10}}><strong style={{color:'#c4922a'}}>To win:</strong> Pick up your <strong style={{color:'#c4922a'}}>🔱 Mace</strong> with a Hunter, then move that Hunter onto the enemy King's square.</p>
    <p style={{marginBottom:10}}>Vikings always move first. You <em>must</em> move every turn — no passing.</p>
    <p>Click a piece to select it. Green dots show valid moves. Click a dot to move there.</p>
  </>,
  Pieces: <>
    {[
      ['Hunter ⚔️', 'Moves like a chess Rook — any number of squares along a row or column. Blocked by water unless a ship occupies that square.'],
      ['King 👑', 'Moves 1 square in any of 8 directions. Can only cross water using the Kingship. Kings cannot pick up the Mace (only Hunters/Trailer/Accomplice can).'],
      ['Mace 🔱', 'An object on the board. Walk a Hunter onto it to pick it up. That Hunter wins by reaching the enemy King.'],
      ['Longship 🛶', 'Sits on 2 water squares. Hunters can pass through or land on it.'],
      ['Kingship 🚢', 'Sits on 1 water square. Only the King can use it to cross water.'],
    ].map(([name, desc]) => (
      <p key={name} style={{marginBottom:10}}><strong style={{color:'#c4922a'}}>{name}</strong> — {desc}</p>
    ))}
  </>,
  Capture: <>
    <p style={{marginBottom:10}}>Capture an enemy Hunter by <strong style={{color:'#c4922a'}}>sandwiching</strong> it between two of your pieces along a row or column.</p>
    <p style={{marginBottom:10}}>The capture triggers when <em>you move</em> to complete the sandwich.</p>
    <p style={{marginBottom:10}}><strong style={{color:'#c4922a'}}>Safe rule:</strong> Moving <em>into</em> a gap between two enemies does NOT get you captured. Only the attacker's move triggers it.</p>
    <p>If a captured Hunter held the Mace, it drops on that square — either side can pick it up.</p>
  </>,
  Special: <>
    <p style={{marginBottom:10}}><strong style={{color:'#c4922a'}}>Dragon 🐉</strong> — neutral piece in the centre. Trap it between your King and a Hunter to capture it; once claimed it becomes yours, moves like a Hunter (with a one‑square water jump) and can be captured again by sandwiching just like any Hunter.</p>
    <p style={{marginBottom:10}}><strong style={{color:'#c4922a'}}>Traitor 🕵️</strong> — hidden among your Hunters. If you control both Traitor and Accomplice you can press the ⚔️ “Activate Traitor” button on your turn. After clicking it, choose an enemy Hunter as the second target; the Hunter you just moved becomes the Traitor and the selected Hunter becomes the Accomplice (both are sacrificed).</p>
    <p><strong style={{color:'#c4922a'}}>Accomplice 🎯</strong> — revealed with the Traitor. Moves exactly like a Hunter.</p>
  </>,
};

const ov = { position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(3px)' };
const bx = { background:'radial-gradient(ellipse at 40% 20%, #c8a870 0%, #9a7040 100%)', border:'4px solid #5a3d1a', borderRadius:8, padding:'32px 36px', maxWidth:500, width:'90%', maxHeight:'85vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.8)', position:'relative' };

export default function HelpModal({ onClose }) {
  const [tab, setTab] = useState('Goal');
  return (
    <div style={ov} onClick={onClose}>
      <div style={bx} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:12, right:16, background:'none', border:'none', fontSize:'1.2rem', color:'#7a5020', cursor:'pointer' }}>✕</button>
        <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'1.3rem', color:'#3a2000', textAlign:'center', marginBottom:4 }}>How to Play</div>
        <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:'italic', fontSize:'0.75rem', color:'#7a5020', textAlign:'center', marginBottom:20 }}>Maces &amp; Talons — Rules of Berk</div>
        <div style={{ display:'flex', gap:4, marginBottom:20, borderBottom:'2px solid #8a6030' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'0.65rem', padding:'6px 14px', background: tab===t ? '#8a6030' : 'transparent', color: tab===t ? '#e8c060' : '#7a5020', border:'none', cursor:'pointer', borderRadius:'4px 4px 0 0', letterSpacing:'0.1em' }}>{t}</button>
          ))}
        </div>
        <div style={{ fontFamily:"'IM Fell English',serif", fontSize:'0.85rem', color:'#3a2000', lineHeight:1.8 }}>{PAGES[tab]}</div>
        <div style={{ textAlign:'center', color:'#c4922a', fontSize:'0.75rem', letterSpacing:'0.3em', marginTop:16, opacity:0.7 }}>ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ</div>
      </div>
    </div>
  );
}
