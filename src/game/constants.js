export const BOARD_SIZE = 13;
export const PIECE_TYPES = {
  HUNTER:'HUNTER', KING:'KING', LONGSHIP:'LONGSHIP', KINGSHIP:'KINGSHIP',
  MACE:'MACE', TRAITOR:'TRAITOR', ACCOMPLICE:'ACCOMPLICE', DRAGON:'DRAGON',
};
export const PLAYERS = { VIKING:'VIKING', MARAUDER:'MARAUDER' };

export const BOARD_LAYOUT = [
  [1,1,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,0,1,0,0,0,0,0,1,1,1],
  [1,1,1,1,1,1,0,0,0,0,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,0,0,0,0,0,1,1,0,0],
  [0,0,1,1,0,0,0,0,0,1,1,0,0],
  [0,0,1,1,0,0,0,0,0,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,0,0,0,0,1,1,1,1,1,1],
  [1,1,0,0,0,0,0,0,1,0,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1],
];

export function createInitialState() {
  const pieces = [];
  let n = 0;
  const uid = () => n++;

  for (const col of [2,3,4,5,7,8,9,10])
    pieces.push({ id:uid(), type:PIECE_TYPES.HUNTER, player:PLAYERS.VIKING, row:12, col, hasMace:false });
  pieces.push({ id:uid(), type:PIECE_TYPES.KING,    player:PLAYERS.VIKING, row:12, col:6, hasMace:false });
  pieces.push({ id:uid(), type:PIECE_TYPES.MACE,    player:PLAYERS.VIKING, row:11, col:6, isMaceObject:true });

  for (const col of [2,3,4,5,7,8,9,10])
    pieces.push({ id:uid(), type:PIECE_TYPES.HUNTER, player:PLAYERS.MARAUDER, row:0, col, hasMace:false });
  pieces.push({ id:uid(), type:PIECE_TYPES.KING,    player:PLAYERS.MARAUDER, row:0, col:6, hasMace:false });
  pieces.push({ id:uid(), type:PIECE_TYPES.MACE,    player:PLAYERS.MARAUDER, row:1, col:6, isMaceObject:true });

  pieces.push({ id:uid(), type:PIECE_TYPES.DRAGON,     player:null, row:6, col:6  });
  pieces.push({ id:uid(), type:PIECE_TYPES.TRAITOR,    player:null, row:6, col:1  });
  pieces.push({ id:uid(), type:PIECE_TYPES.ACCOMPLICE, player:null, row:6, col:11 });

  // Ships start unplaced
  pieces.push({ id:uid(), type:PIECE_TYPES.LONGSHIP, player:PLAYERS.VIKING,   row:-1, col:-1, shipCells:[], unplaced:true });
  pieces.push({ id:uid(), type:PIECE_TYPES.KINGSHIP, player:PLAYERS.VIKING,   row:-1, col:-1, shipCells:[], unplaced:true });
  pieces.push({ id:uid(), type:PIECE_TYPES.LONGSHIP, player:PLAYERS.MARAUDER, row:-1, col:-1, shipCells:[], unplaced:true });
  pieces.push({ id:uid(), type:PIECE_TYPES.KINGSHIP, player:PLAYERS.MARAUDER, row:-1, col:-1, shipCells:[], unplaced:true });

  return {
    pieces,
    currentPlayer: PLAYERS.VIKING,
    selectedPiece: null,
    validMoves: [],
    gamePhase: 'SHIP_PLACEMENT',
    placementTurn: PLAYERS.VIKING,
    placingShipType: PIECE_TYPES.LONGSHIP,
    winner: null,
    capturedPieces: [],
    pendingTraitor: null,    // { player, movedId, row, col } when ability may be used
    pendingTraitorSelection: false, // whether the player is choosing a target
    log: [
      '⚓ Vikings: click any 2 adjacent water squares on your side to place your Longship',
      'Trap neutral pieces with King+Hunter.  Traitor ability can be manually activated by the owner when eligible.'
    ],
  };
}
