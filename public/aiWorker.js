const PT={HUNTER:'HUNTER',KING:'KING',LONGSHIP:'LONGSHIP',KINGSHIP:'KINGSHIP',MACE:'MACE',TRAITOR:'TRAITOR',ACCOMPLICE:'ACCOMPLICE',DRAGON:'DRAGON'};
const PL={VIKING:'VIKING',MARAUDER:'MARAUDER'};
const HT=[PT.HUNTER,PT.TRAITOR,PT.ACCOMPLICE];
const CT=[...HT,PT.KING];
const ST=[PT.LONGSHIP,PT.KINGSHIP];
const BS=13;

// search depth (lower than main thread to keep responsiveness)
const MAX_DEPTH_WORKER = 2;

const PIECE_VALUES = {
  [PT.KING]:150,
  [PT.DRAGON]:60,
  [PT.TRAITOR]:40,
  [PT.ACCOMPLICE]:40,
  [PT.LONGSHIP]:30,
  [PT.KINGSHIP]:30,
  [PT.HUNTER]:10,
};
const BL=[[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,1,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,0,0,0,0,1,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,0,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,1,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1]];
const iW=(r,c)=>r>=0&&r<BS&&c>=0&&c<BS&&BL[r][c]===1;
const iB=(r,c)=>r>=0&&r<BS&&c>=0&&c<BS;
const gP=(ps,r,c)=>ps.find(p=>p.row===r&&p.col===c&&!p.isMaceObject&&!p.unplaced&&!ST.includes(p.type))||null;
const gS=(ps,r,c)=>ps.find(p=>ST.includes(p.type)&&!p.unplaced&&p.shipCells?.some(([sr,sc])=>sr===r&&sc===c))||null;

// small helper for traitor activation used during search
function applyTraitorAbility(st,targetId){
  let ps=st.pieces.map(p=>({...p}));
  const pending=st.pendingTraitor;
  if(!pending) return st;
  const traitor=ps.find(p=>p.type===PT.TRAITOR&&p.player===pending.player);
  const accomplice=ps.find(p=>p.type===PT.ACCOMPLICE&&p.player===pending.player);
  const moved=ps.find(p=>p.id===pending.movedId);
  const victim=ps.find(p=>p.id===targetId&&p.player!==pending.player&&HT.includes(p.type));
  if(!traitor||!accomplice||!moved||!victim) return {...st,pendingTraitor:null};
  // remove hunters and drop any maces
  [moved,victim].forEach(h=>{if(h.hasMace){ps.push({id:'m'+Math.random(),type:PT.MACE,player:null,row:h.row,col:h.col,isMaceObject:true});}});
  ps=ps.filter(p=>p.id!==moved.id&&p.id!==victim.id);
  traitor.player=pending.player;traitor.row=moved.row;traitor.col=moved.col;
  accomplice.player=pending.player;accomplice.row=victim.row;accomplice.col=victim.col;
  return {...st,pieces:ps,pendingTraitor:null,log:[...(st.log||[]),`${pending.player} triggers Traitor ability!`]};
}
function hMoves(ps,pc){const mv=[];for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){let r=pc.row+dr,c=pc.col+dc;while(iB(r,c)){const w=iW(r,c),s=gS(ps,r,c);if(w&&!s)break;if(gP(ps,r,c))break;mv.push({row:r,col:c});r+=dr;c+=dc;}}return mv;}
function kMoves(ps,pc){const mv=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue;const r=pc.row+dr,c=pc.col+dc;if(!iB(r,c))continue;if(iW(r,c)){const s=gS(ps,r,c);if(!s||s.type!==PT.KINGSHIP||s.player!==pc.player)continue;}const o=gP(ps,r,c);if(o&&o.type===PT.KING)continue;mv.push({row:r,col:c});}return mv;}
function dMoves(ps,pc){const mv=[];for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){let r=pc.row+dr,c=pc.col+dc,j=false;while(iB(r,c)){const w=iW(r,c),s=gS(ps,r,c);if(w&&!s){if(!j){j=true;r+=dr;c+=dc;continue;}else break;}const o=gP(ps,r,c);if(o){if(o.player!==pc.player&&HT.includes(o.type))mv.push({row:r,col:c});break;}mv.push({row:r,col:c});r+=dr;c+=dc;}}return mv;}
function getVM(st,pc){if(!pc)return[];if(HT.includes(pc.type))return hMoves(st.pieces,pc);if(pc.type===PT.KING)return kMoves(st.pieces,pc);if(pc.type===PT.DRAGON)return dMoves(st.pieces,pc);return[];}
function sw(ps,t,ap){for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){const p1=gP(ps,t.row+dr,t.col+dc),p2=gP(ps,t.row-dr,t.col-dc);if(p1?.player===ap&&p2?.player===ap)return true;}return false;}
function applyMove(st,pc,tr,tc){
  let ps=st.pieces.map(p=>({...p}));const mv=ps.find(p=>p.id===pc.id);if(!mv)return st;
  mv.row=tr;mv.col=tc;
  if(CT.includes(mv.type)){const m=ps.find(p=>p.isMaceObject&&p.row===tr&&p.col===tc);if(m){mv.hasMace=true;ps=ps.filter(p=>p.id!==m.id);}}
  const ap=mv.player,opp=ap===PL.VIKING?PL.MARAUDER:PL.VIKING;
  const cap=ps.filter(p=>p.player===opp&&HT.includes(p.type)&&sw(ps,p,ap));
  for(const c of cap)if(c.hasMace)ps.push({id:'m'+Math.random(),type:PT.MACE,player:null,row:c.row,col:c.col,isMaceObject:true});
  ps=ps.filter(p=>!cap.find(c=>c.id===p.id));
  if(mv.type===PT.DRAGON){const v=ps.find(p=>p.id!==mv.id&&p.row===tr&&p.col===tc&&HT.includes(p.type));if(v){if(v.hasMace)ps.push({id:'m'+Math.random(),type:PT.MACE,player:null,row:v.row,col:v.col,isMaceObject:true});ps=ps.filter(p=>p.id!==v.id);}}
  let pending=null;
  // traitor pending logic
  if(HT.includes(mv.type)){
    const traitor=ps.find(p=>p.type===PT.TRAITOR&&p.player===opp);
    const accomplice=ps.find(p=>p.type===PT.ACCOMPLICE&&p.player===opp);
    if(traitor&&accomplice){
      pending={player:opp,movedId:mv.id,row:mv.row,col:mv.col};
    }
  }
  let winner=null;
  for(const p of ps){if(!p.hasMace||!CT.includes(p.type))continue;const ek=ps.find(k=>k.type===PT.KING&&k.player!==p.player&&k.player!==null);if(ek&&p.row===ek.row&&p.col===ek.col){winner=p.player;break;}}
  return{...st,pieces:ps,currentPlayer:winner?st.currentPlayer:(st.currentPlayer===PL.VIKING?PL.MARAUDER:PL.VIKING),winner,gamePhase:winner?'GAME_OVER':'PLAYING',pendingTraitor:pending};
}
function allMoves(st,pl){const mv=[];for(const pc of st.pieces.filter(p=>p.player===pl&&[...HT,PT.KING,PT.DRAGON].includes(p.type)&&!p.unplaced))for(const m of getVM(st,pc))mv.push({piece:pc,move:m});return mv;}
function evaluate(st,ai){
  if(st.winner===ai)return 100000;
  if(st.winner)return-100000;
  const hu=ai===PL.VIKING?PL.MARAUDER:PL.VIKING,ps=st.pieces;
  let s=0;
  // piece value
  ps.forEach(p=>{
    if(p.player===ai && !p.isMaceObject&&!p.unplaced) s+=PIECE_VALUES[p.type]||0;
    if(p.player===hu && !p.isMaceObject&&!p.unplaced) s-=PIECE_VALUES[p.type]||0;
  });
  // special bonuses
  ps.forEach(p=>{
    if(p.player===ai){
      if(p.type===PT.DRAGON) s+=20;
      if(p.type===PT.TRAITOR||p.type===PT.ACCOMPLICE) s+=15;
    }
    if(p.player===hu){
      if(p.type===PT.DRAGON) s-=20;
      if(p.type===PT.TRAITOR||p.type===PT.ACCOMPLICE) s-=15;
    }
  });
  // mace control
  const am=ps.find(p=>p.player===ai&&p.hasMace),hm=ps.find(p=>p.player===hu&&p.hasMace);
  if(am)s+=60; if(hm)s-=60;
  // mobility
  ps.filter(p=>p.player===ai&&!p.isMaceObject&&!p.unplaced).forEach(p=>{s+=getVM(st,p).length*0.5;});
  ps.filter(p=>p.player===hu&&!p.isMaceObject&&!p.unplaced).forEach(p=>{s-=getVM(st,p).length*0.5;});
  // king safety
  const hk=ps.find(p=>p.type===PT.KING&&p.player===hu),ak=ps.find(p=>p.type===PT.KING&&p.player===ai);
  function threatened(piece){
    if(!piece) return false;
    const opp = piece.player===PL.VIKING?PL.MARAUDER:PL.VIKING;
    const enemies = ps.filter(p=>p.player===opp&&HT.includes(p.type));
    for(const e of enemies){
      const moves = getVM(st,e);
      if(moves.some(m=>m.row===piece.row&&m.col===piece.col)) return true;
    }
    return false;
  }
  if(threatened(ak)) s-=80;
  if(threatened(hk)) s+=80;
  // dragon proximity to hunters
  ps.filter(p=>p.type===PT.DRAGON&&p.player===ai).forEach(d=>{
    const dists=ps.filter(h=>h.player===hu&&HT.includes(h.type))
      .map(h=>Math.abs(h.row-d.row)+Math.abs(h.col-d.col));
    if(dists.length) s+=(20-Math.min(...dists))*1.5;
  });
  ps.filter(p=>p.type===PT.DRAGON&&p.player===hu).forEach(d=>{
    const dists=ps.filter(h=>h.player===ai&&HT.includes(h.type))
      .map(h=>Math.abs(h.row-d.row)+Math.abs(h.col-d.col));
    if(dists.length) s-=(20-Math.min(...dists))*1.5;
  });
  return s;
}
function mm(st,d,a,b,max,ai){
  if(st.winner||d===0)return evaluate(st,ai);
  // pending traitor handling
  if(st.pendingTraitor && st.pendingTraitor.player === (max?ai:(ai===PL.VIKING?PL.MARAUDER:PL.VIKING))){
    const cur = max?ai:(ai===PL.VIKING?PL.MARAUDER:PL.VIKING);
    const opp = cur===PL.VIKING?PL.MARAUDER:PL.VIKING;
    const enemyHunters = st.pieces.filter(p=>p.player===opp&&HT.includes(p.type));
    let bestVal = max?-Infinity:Infinity;
    const skip = {...st,pendingTraitor:null};
    const skipEval = mm(skip,d,a,b,max,ai);
    bestVal = max?Math.max(bestVal,skipEval):Math.min(bestVal,skipEval);
    if(max) a=Math.max(a,skipEval); else b=Math.min(b,skipEval);
    for(const t of enemyHunters){
      const next = applyTraitorAbility(st,t.id);
      const val = mm(next,d,a,b,max,ai);
      bestVal = max?Math.max(bestVal,val):Math.min(bestVal,val);
      if(max) a=Math.max(a,val); else b=Math.min(b,val);
      if(b<=a) break;
    }
    return bestVal;
  }
  const pl=max?ai:(ai===PL.VIKING?PL.MARAUDER:PL.VIKING);
  let mv=allMoves(st,pl);
  if(!mv.length)return evaluate(st,ai);
  // order moves
  mv.sort((a,b)=>{
    const va=evaluate(applyMove(st,a.piece,a.move.row,a.move.col),ai);
    const vb=evaluate(applyMove(st,b.piece,b.move.row,b.move.col),ai);
    return max?vb-va:va-vb;
  });
  if(max){let best=-Infinity;for(const{piece,move}of mv){best=Math.max(best,mm(applyMove(st,piece,move.row,move.col),d-1,a,b,false,ai));a=Math.max(a,best);if(b<=a)break;}return best;}
  let best=Infinity;for(const{piece,move}of mv){best=Math.min(best,mm(applyMove(st,piece,move.row,move.col),d-1,a,b,true,ai));b=Math.min(b,best);if(b<=a)break;}return best;
}
self.onmessage=function(e){
  const startTime=Date.now();
  const{state,aiPlayer}=e.data;
  if(state.gamePhase!=='PLAYING'){self.postMessage(null);return;}

  // pending traitor ability
  if(state.pendingTraitor && state.pendingTraitor.player===aiPlayer){
    const opponent = aiPlayer===PL.VIKING?PL.MARAUDER:PL.VIKING;
    const enemyHunters = state.pieces.filter(p=>p.player===opponent&&HT.includes(p.type));
    let bestScore=-Infinity;
    let bestAction={type:'SKIP'};
    const skipEval = mm({...state,pendingTraitor:null},1,-Infinity,Infinity,false,aiPlayer);
    bestScore = skipEval;
    for(const target of enemyHunters){
      const sc = mm(applyTraitorAbility(state,target.id),1,-Infinity,Infinity,false,aiPlayer);
      if(sc>bestScore){bestScore=sc;bestAction={type:'TRAITOR',targetId:target.id};}
    }
    if(bestAction.type==='TRAITOR'){
      self.postMessage({traitor:true,targetId:bestAction.targetId});
      return;
    }
    self.postMessage({type:'SKIP_TRAITOR'});
    return;
  }

  let mv=allMoves(state,aiPlayer);
  if(!mv.length){self.postMessage(null);return;}
  // immediate win check
  for(const {piece,move} of mv){
    const ns=applyMove(state,piece,move.row,move.col);
    if(ns.winner===aiPlayer){self.postMessage({piece,move});return;}
  }
  
  // Iterative deepening with time limit
  const TIME_LIMIT_MS=800;
  let bestMove=null;
  let bestScore=-Infinity;
  
  for(let depth=1;depth<=4;depth++){
    if(Date.now()-startTime>TIME_LIMIT_MS && bestMove) break;
    
    let depthBestMove=null;
    let depthBestScore=-Infinity;
    const sh=[...mv].sort(()=>Math.random()-0.5);
    
    for(const{piece,move}of sh){
      if(Date.now()-startTime>TIME_LIMIT_MS && bestMove) break;
      const sc=mm(applyMove(state,piece,move.row,move.col),depth-1,-Infinity,Infinity,false,aiPlayer);
      if(sc>depthBestScore){depthBestScore=sc;depthBestMove={piece,move};}
    }
    
    if(depthBestMove){
      bestMove=depthBestMove;
      bestScore=depthBestScore;
    }
  }
  
  self.postMessage(bestMove);
};
