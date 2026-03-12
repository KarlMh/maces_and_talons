import { BOARD_LAYOUT, BOARD_SIZE, PIECE_TYPES, PLAYERS } from './constants.js';

export const HUNTER_TYPES = [PIECE_TYPES.HUNTER, PIECE_TYPES.TRAITOR, PIECE_TYPES.ACCOMPLICE];
export const CARRIER_TYPES = [...HUNTER_TYPES, PIECE_TYPES.KING];
const SHIP_TYPES = [PIECE_TYPES.LONGSHIP, PIECE_TYPES.KINGSHIP];

export function isWater(row, col) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;
  return BOARD_LAYOUT[row][col] === 1;
}
export function isInBounds(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}
export function getPieceAt(pieces, row, col) {
  return pieces.find(p =>
    p.row === row && p.col === col &&
    !p.isMaceObject && !p.unplaced &&
    !SHIP_TYPES.includes(p.type)
  ) || null;
}
export function getMaceAt(pieces, row, col) {
  return pieces.find(p => p.row === row && p.col === col && p.isMaceObject) || null;
}
export function getShipAt(pieces, row, col) {
  return pieces.find(p =>
    SHIP_TYPES.includes(p.type) && !p.unplaced &&
    p.shipCells?.some(([r,c]) => r === row && c === col)
  ) || null;
}

export function getValidMoves(state, piece) {
  if (!piece) return [];
  const { pieces } = state;
  if (HUNTER_TYPES.includes(piece.type)) return getHunterMoves(pieces, piece);
  if (piece.type === PIECE_TYPES.KING)   return getKingMoves(pieces, piece);
  if (piece.type === PIECE_TYPES.DRAGON) return getDragonMoves(pieces, piece);
  if (SHIP_TYPES.includes(piece.type))   return getShipMoves(pieces, piece);
  return [];
}

function getHunterMoves(pieces, piece) {
  const moves = [];
  for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    let r = piece.row + dr, c = piece.col + dc;
    while (isInBounds(r, c)) {
      const water = isWater(r, c);
      const ship  = getShipAt(pieces, r, c);
      if (water) {
        // hunters may only travel on longships; kingships (or any other ship)
        // block movement entirely.
        if (ship && ship.type === PIECE_TYPES.LONGSHIP) moves.push({ row: r, col: c });
        break; 
      }
      const occ = getPieceAt(pieces, r, c);
      // dragon square always blocks
      if (occ && occ.type === PIECE_TYPES.DRAGON) break;
      // allow move onto enemy king if carrier has mace
      if (occ) {
        if (occ.type === PIECE_TYPES.KING && occ.player !== piece.player && piece.hasMace) {
          moves.push({ row: r, col: c });
        }
        break;
      }
      moves.push({ row: r, col: c });
      r += dr; c += dc;
    }
  }
  return moves;
}

function getKingMoves(pieces, piece) {
  const moves = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const r = piece.row + dr, c = piece.col + dc;
      if (!isInBounds(r, c)) continue;
      
      const occ = getPieceAt(pieces, r, c);
      // never allow stepping onto a dragon square
      if (occ && occ.type === PIECE_TYPES.DRAGON) continue;
      // maces block king movement
      if (getMaceAt(pieces, r, c)) continue;
      // allow capture of enemy king only if this king/hunter has mace
      if (occ) {
        if (!(occ.type === PIECE_TYPES.KING && occ.player !== piece.player && piece.hasMace)) {
          continue;
        }
      }

      if (isWater(r, c)) {
        // kings may travel only on their own kingship; longships block them
        const ship = getShipAt(pieces, r, c);
        if (ship && ship.type === PIECE_TYPES.KINGSHIP && ship.player === piece.player) {
           moves.push({ row: r, col: c });
        }
        continue;
      }
      moves.push({ row: r, col: c });
    }
  }
  return moves;
}

function getDragonMoves(pieces, piece) {
  const moves = [];
  for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    let r = piece.row + dr, c = piece.col + dc;
    let jumped = false;
    while (isInBounds(r, c)) {
      const water = isWater(r, c);
      const ship  = getShipAt(pieces, r, c);
      if (water && !ship) {
        if (!jumped) { jumped = true; r += dr; c += dc; continue; }
        else break;
      }
      const occ = getPieceAt(pieces, r, c);
      if (occ) {
        if (occ.player !== piece.player && HUNTER_TYPES.includes(occ.type))
          moves.push({ row: r, col: c, dragonCapture: true });
        break;
      }
      moves.push({ row: r, col: c });
      r += dr; c += dc;
    }
  }
  return moves;
}

function getShipMoves(pieces, ship) {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!isWater(r, c)) continue;
      const existingShip = getShipAt(pieces, r, c);
      if (existingShip && existingShip.id !== ship.id) continue;

      if (ship.type === PIECE_TYPES.LONGSHIP) {
        for (const [r2, c2] of [[r, c + 1], [r, c - 1], [r + 1, c], [r - 1, c]]) {
          if (!isInBounds(r2, c2) || !isWater(r2, c2)) continue;
          const s2 = getShipAt(pieces, r2, c2);
          if (s2 && s2.id !== ship.id) continue;
          moves.push({ row: r, col: c, shipCells: [[r, c], [r2, c2]] });
        }
      } else {
        moves.push({ row: r, col: c, shipCells: [[r, c]] });
      }
    }
  }
  return moves;
}

export function getPlacementMoves(pieces, shipType, player) {
  const moves = [];
  const [minRow, maxRow] = player === PLAYERS.VIKING ? [7, 12] : [0, 5];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!isWater(r, c)) continue;
      if (getShipAt(pieces, r, c)) continue;
      if (shipType === PIECE_TYPES.LONGSHIP) {
        for (const [r2, c2] of [[r,c+1],[r,c-1],[r+1,c],[r-1,c]]) {
          if (!isInBounds(r2,c2) || !isWater(r2,c2) || r2 < minRow || r2 > maxRow || getShipAt(pieces, r2, c2)) continue;
          moves.push({ row: r, col: c, shipCells: [[r,c],[r2,c2]] });
        }
      } else {
        moves.push({ row: r, col: c, shipCells: [[r,c]] });
      }
    }
  }
  return moves;
}

export function checkWinCondition(state) {
  const { pieces } = state;
  const maceCarrier = pieces.find(p => p.hasMace);
  if (!maceCarrier) return null;
  const enemyKing = pieces.find(p => p.type === PIECE_TYPES.KING && p.player && p.player !== maceCarrier.player);
  if (enemyKing && enemyKing.row === maceCarrier.row && enemyKing.col === maceCarrier.col) {
    return maceCarrier.player;
  }
  return null;
}

export function applyMove(state, piece, targetRow, targetCol, shipCells=null) {
  let pieces = state.pieces.map(p => ({...p}));
  let log = [...state.log];
  const moving = pieces.find(p => p.id === piece.id);
  const isShip = SHIP_TYPES.includes(moving?.type);

  if (!moving) return state;

  // dragon landing capture (move onto enemy hunter)
  if (moving.type === PIECE_TYPES.DRAGON) {
    const occ = pieces.find(p => p.row === targetRow && p.col === targetCol && p.player && HUNTER_TYPES.includes(p.type));
    if (occ && occ.player !== moving.player) {
      pieces = pieces.filter(p => p.id !== occ.id);
      if (occ.hasMace) {
        const nextId = pieces.reduce((m,p)=>Math.max(m,p.id),0) + 1;
        pieces.push({ id: nextId, type: PIECE_TYPES.MACE, row: targetRow, col: targetCol, isMaceObject:true });
      }
      log.push(`${moving.player}’s dragon snags a hunter!`);
    }
  }

  if (isShip) {
    const oldCells = moving.shipCells || [[moving.row, moving.col]];
    const newCells = shipCells || [[targetRow, targetCol]];
    pieces.forEach(p => {
      if (!SHIP_TYPES.includes(p.type) && !p.isMaceObject) {
        const cellIndex = oldCells.findIndex(([r,c]) => r === p.row && c === p.col);
        if (cellIndex !== -1) {
          p.row = newCells[cellIndex][0];
          p.col = newCells[cellIndex][1];
        }
      }
    });
  }

  const maceAtTarget = pieces.find(p => p.row === targetRow && p.col === targetCol && p.isMaceObject);
  // only hunters (including traitor/accomplice) may pick up the mace; kings cannot
  if (maceAtTarget && HUNTER_TYPES.includes(moving.type)) {
      moving.hasMace = true;
      pieces = pieces.filter(p => p.id !== maceAtTarget.id);
      log.push(`${moving.player} picked up the mace!`);
    }
  moving.row = targetRow;
  moving.col = targetCol;
  if (shipCells) moving.shipCells = shipCells;

  const currentPlayer = state.currentPlayer; // player who just moved

  // sandwich capture of enemy hunters **and any dragon that has been claimed**
  const toRemove = [];
  pieces.forEach(p => {
    if (p.player && p.player !== currentPlayer && (HUNTER_TYPES.includes(p.type) || p.type === PIECE_TYPES.DRAGON)) {
      const r = p.row, c = p.col;
      const friend = (dr,dc) => pieces.find(q=>q.row===r+dr&&q.col===c+dc&&q.player===currentPlayer && !SHIP_TYPES.includes(q.type));
      if (friend(0,-1) && friend(0,1)) toRemove.push(p);
      if (friend(-1,0) && friend(1,0)) toRemove.push(p);
    }
  });
  toRemove.forEach(p => {
    pieces = pieces.filter(q=>q.id!==p.id);
    if (p.hasMace) {
      const nextId = pieces.reduce((m,p)=>Math.max(m,p.id),0) + 1;
    pieces.push({ id: nextId, type: PIECE_TYPES.MACE, row: p.row, col: p.col, isMaceObject:true });
    }
    log.push(`${currentPlayer} captured a hunter at ${p.row},${p.col}`);
  });

  // trap capture of neutral pieces
  const neutralTypes = [PIECE_TYPES.DRAGON, PIECE_TYPES.TRAITOR, PIECE_TYPES.ACCOMPLICE];
  pieces.forEach(p => {
    if (neutralTypes.includes(p.type) && p.player !== currentPlayer) {
      const r = p.row, c = p.col;
      const at = (rr,cc,cond) => pieces.find(q=>q.row===rr&&q.col===cc&&cond(q));
      const checkDir = (dr,dc) => {
        const a = at(r+dr,c+dc,q=>q.player===currentPlayer && q.type===PIECE_TYPES.KING);
        const b = at(r-dr,c-dc,q=>q.player===currentPlayer && HUNTER_TYPES.includes(q.type));
        if (a && b) return b;
        const a2 = at(r-dr,c-dc,q=>q.player===currentPlayer && q.type===PIECE_TYPES.KING);
        const b2 = at(r+dr,c+dc,q=>q.player===currentPlayer && HUNTER_TYPES.includes(q.type));
        if (a2 && b2) return b2;
        return null;
      };
      let hunterToKill = null;
      for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const h = checkDir(dr,dc);
        if (h) { hunterToKill = h; break; }
      }
      if (hunterToKill) {
        pieces = pieces.filter(q=>q.id!==hunterToKill.id);
        if (hunterToKill.hasMace) {
          const nextId = pieces.reduce((m,p)=>Math.max(m,p.id),0) + 1;
        pieces.push({ id: nextId, type: PIECE_TYPES.MACE, row: hunterToKill.row, col: hunterToKill.col, isMaceObject:true });
        }
        p.player = currentPlayer;
        log.push(`${currentPlayer} captured ${p.type.toLowerCase()}!`);
      }
    }
  });

  // set up pending traitor ability for next player instead of auto-resolving
  let pendingTraitor = null;
  const nextPlayer = currentPlayer === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING;
  if (HUNTER_TYPES.includes(moving.type) && pieces.find(q=>q.id===moving.id)) {
    const traitor = pieces.find(q=>q.type===PIECE_TYPES.TRAITOR && q.player===nextPlayer);
    const accomplice = pieces.find(q=>q.type===PIECE_TYPES.ACCOMPLICE && q.player===nextPlayer);
    if (traitor && accomplice) {
      // record info so UI/AI can prompt for activation
      pendingTraitor = { player: nextPlayer, movedId: moving.id, row: moving.row, col: moving.col };
      log.push(`${nextPlayer} may activate Traitor ability`);
    }
  }

  const winner = checkWinCondition({ pieces });
  const gamePhase = winner ? 'GAME_OVER' : state.gamePhase;
  const newCurrent = nextPlayer;

  return { ...state, pieces, currentPlayer: newCurrent, selectedPiece: null, validMoves: [], winner, gamePhase, log, pendingTraitor, pendingTraitorSelection: false };
}

// Applies the traitor ability assuming state.pendingTraitor exists and the
// caller supplies the id of the enemy hunter to replace with the accomplice.
export function applyTraitorAbility(state, targetHunterId) {
  let pieces = state.pieces.map(p => ({ ...p }));
  let log = [...state.log];
  const pending = state.pendingTraitor;
  if (!pending || state.currentPlayer !== pending.player) return state;

  const traitor = pieces.find(p => p.type === PIECE_TYPES.TRAITOR && p.player === pending.player);
  const accomplice = pieces.find(p => p.type === PIECE_TYPES.ACCOMPLICE && p.player === pending.player);
  const moved = pieces.find(p => p.id === pending.movedId);
  const victim = pieces.find(p => p.id === targetHunterId && p.player !== pending.player && HUNTER_TYPES.includes(p.type));
  if (!traitor || !accomplice || !moved || !victim) return state;

  // remove the two hunters and drop any maces
  [moved, victim].forEach(h => {
    if (h.hasMace) {
      const nextId = pieces.reduce((m,p) => Math.max(m,p.id), 0) + 1;
      pieces.push({ id: nextId, type: PIECE_TYPES.MACE, row: h.row, col: h.col, isMaceObject:true });
    }
  });
  pieces = pieces.filter(p => p.id !== moved.id && p.id !== victim.id);

  // move traitor & accomplice into those squares and assign to player
  traitor.player = pending.player;
  traitor.row = moved.row;
  traitor.col = moved.col;
  accomplice.player = pending.player;
  accomplice.row = victim.row;
  accomplice.col = victim.col;

  log.push(`${pending.player} triggers Traitor ability!`);
  return { ...state, pieces, log, pendingTraitor: null };
}


export function applyShipPlacement(state, shipCells) {
  let pieces = state.pieces.map(p => ({...p}));
  const ship = pieces.find(p => p.type===state.placingShipType && p.player===state.placementTurn && p.unplaced);
  if (!ship) return state;
  ship.unplaced = false;
  ship.shipCells = shipCells;
  ship.row = shipCells[0][0];
  ship.col = shipCells[0][1];
  
  let { placementTurn, placingShipType, gamePhase } = state;
  if (placementTurn === PLAYERS.VIKING && placingShipType === PIECE_TYPES.LONGSHIP) placingShipType = PIECE_TYPES.KINGSHIP;
  else if (placementTurn === PLAYERS.VIKING && placingShipType === PIECE_TYPES.KINGSHIP) { placementTurn = PLAYERS.MARAUDER; placingShipType = PIECE_TYPES.LONGSHIP; }
  else if (placementTurn === PLAYERS.MARAUDER && placingShipType === PIECE_TYPES.LONGSHIP) placingShipType = PIECE_TYPES.KINGSHIP;
  else gamePhase = 'PLAYING';

  return { ...state, pieces, gamePhase, placementTurn, placingShipType, selectedPiece: null, validMoves: [] };
}
