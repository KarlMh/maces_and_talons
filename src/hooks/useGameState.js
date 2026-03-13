import { useState, useCallback, useEffect, useRef } from 'react';
import { createInitialState, PLAYERS, PIECE_TYPES } from '../game/constants.js';
import { getValidMoves, applyMove, applyShipPlacement, getPlacementMoves, applyTraitorAbility } from '../game/logic.js';

export function useGameState(playerSide = PLAYERS.VIKING, vsAI = true) {

  const [state, setState] = useState(() => createInitialState());
  const workerRef = useRef(null);
  const thinkingRef = useRef(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const aiPlayer = playerSide === PLAYERS.VIKING
    ? PLAYERS.MARAUDER
    : PLAYERS.VIKING;

  useEffect(() => {

    workerRef.current = new Worker('/aiWorker.js');

    workerRef.current.onmessage = (e) => {

      thinkingRef.current = false;
      setIsAIThinking(false);

      const result = e.data;
      if (!result) return;

      if (result.traitor) {

        setState(prev => applyTraitorAbility(prev, result.targetId));

      } else if (result.type === 'SKIP_TRAITOR') {

        setState(prev => ({
          ...prev,
          pendingTraitor: null,
          currentPlayer:
            prev.currentPlayer === PLAYERS.VIKING
              ? PLAYERS.MARAUDER
              : PLAYERS.VIKING
        }));

      } else if (result.piece && result.move) {

        setState(prev =>
          applyMove(prev, result.piece, result.move.row, result.move.col, result.move.shipCells)
        );

      }

    };

    return () => workerRef.current?.terminate();

  }, []);

  useEffect(() => {

    if (!vsAI) return;

    if (state.gamePhase !== 'SHIP_PLACEMENT') return;

    if (state.placementTurn !== aiPlayer) return;

    const timer = setTimeout(() => {

      const moves = getPlacementMoves(
        state.pieces,
        state.placingShipType,
        aiPlayer
      );

      if (moves.length === 0) return;

      const pick = moves[Math.floor(Math.random() * moves.length)];

      setState(prev => applyShipPlacement(prev, pick.shipCells));

    }, 600);

    return () => clearTimeout(timer);

  }, [
    state.gamePhase,
    state.placementTurn,
    state.placingShipType,
    vsAI,
    aiPlayer
  ]);

  useEffect(() => {

    if (!vsAI) return;

    if (state.gamePhase !== 'PLAYING') return;

    if (state.currentPlayer !== aiPlayer) return;

    if (thinkingRef.current) return;

    thinkingRef.current = true;

    setIsAIThinking(true);

    workerRef.current?.postMessage({
      state,
      aiPlayer
    });

  }, [state.currentPlayer, state.gamePhase, vsAI, aiPlayer]);

  const startTraitorSelection = useCallback(() => {

    setState(prev => ({
      ...prev,
      pendingTraitorSelection: true
    }));

  }, []);

  const activateTraitor = useCallback((targetId) => {

    setState(prev => {

      let newState = applyTraitorAbility(prev, targetId);

      newState.pendingTraitorSelection = false;

      return newState;

    });

  }, []);

  const declineTraitor = useCallback(() => {

    setState(prev => ({
      ...prev,
      pendingTraitor: null,
      pendingTraitorSelection: false
    }));

  }, []);

  const handlePlacementClick = useCallback((row, col) => {

    if (state.gamePhase !== 'SHIP_PLACEMENT') return;

    if (vsAI && state.placementTurn === aiPlayer) return;

    const { pieces, placingShipType, placementTurn } = state;

    const moves = getPlacementMoves(
      pieces,
      placingShipType,
      placementTurn
    );

    if (placingShipType === PIECE_TYPES.KINGSHIP) {

      const move = moves.find(m => m.row === row && m.col === col);

      if (move)
        setState(prev =>
          applyShipPlacement(prev, move.shipCells)
        );

    } else {

      if (!state.selectedPiece?.isAnchor) {

        const anchored = moves.filter(
          m => m.row === row && m.col === col
        );

        if (anchored.length > 0) {

          setState(prev => ({
            ...prev,
            selectedPiece: {
              row,
              col,
              isAnchor: true
            },
            validMoves: anchored
          }));

        }

      } else {

        const move = state.validMoves.find(
          m =>
            m.shipCells.some(
              ([r, c]) => r === row && c === col
            ) &&
            !(
              row === state.selectedPiece.row &&
              col === state.selectedPiece.col
            )
        );

        if (move) {

          setState(prev =>
            applyShipPlacement(prev, move.shipCells)
          );

        } else {

          const anchored = moves.filter(
            m => m.row === row && m.col === col
          );

          if (anchored.length > 0) {

            setState(prev => ({
              ...prev,
              selectedPiece: {
                row,
                col,
                isAnchor: true
              },
              validMoves: anchored
            }));

          } else {

            setState(prev => ({
              ...prev,
              selectedPiece: null,
              validMoves: []
            }));

          }

        }

      }

    }

  }, [state, vsAI, aiPlayer]);

  const handleGameClick = useCallback((row, col, clickedPiece) => {

    if (state.gamePhase !== 'PLAYING') return;

    if (vsAI && state.currentPlayer === aiPlayer && isAIThinking) return;

    if (state.selectedPiece) {

      const isValidTarget =
        state.validMoves.some(
          m => m.row === row && m.col === col
        );

      if (isValidTarget) {

        const move =
          state.validMoves.find(
            m => m.row === row && m.col === col
          );

        setState(prev =>
          applyMove(
            prev,
            prev.selectedPiece,
            row,
            col,
            move.shipCells
          )
        );

        return;

      }

      if (
        clickedPiece &&
        clickedPiece.player === state.currentPlayer
      ) {

        const moves = getValidMoves(
          state,
          clickedPiece
        );

        setState(prev => ({
          ...prev,
          selectedPiece: clickedPiece,
          validMoves: moves
        }));

        return;

      }

      setState(prev => ({
        ...prev,
        selectedPiece: null,
        validMoves: []
      }));

      return;

    }

    if (
      clickedPiece &&
      clickedPiece.player === state.currentPlayer
    ) {

      const moves = getValidMoves(
        state,
        clickedPiece
      );

      setState(prev => ({
        ...prev,
        selectedPiece: clickedPiece,
        validMoves: moves
      }));

    }

  }, [state, isAIThinking, vsAI, aiPlayer]);

  const resetGame = useCallback(() => {

    thinkingRef.current = false;

    setIsAIThinking(false);

    setState(createInitialState());

  }, []);

  return {

    state,
    playerSide,
    aiPlayer,
    isAIThinking,

    handlePlacementClick,
    handleGameClick,
    resetGame,

    startTraitorSelection,
    activateTraitor,
    declineTraitor

  };

}