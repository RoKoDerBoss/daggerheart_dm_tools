/**
 * DiceContext - Global state management for dice rolling across the application
 * Provides shared dice result card and persistent roll history
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { DiceRollResult, RollAction, RollHistoryEntry } from '@/types/dice';

interface DiceContextState {
  /** Current dice roll result being displayed */
  currentResult: DiceRollResult | null;
  /** Whether the dice card is currently expanded */
  isExpanded: boolean;
  /** Global roll history across all dice expressions */
  rollHistory: RollHistoryEntry[];
  /** Whether a roll is currently in progress */
  isRolling: boolean;
}

interface DiceContextValue extends DiceContextState {
  /** Set the current dice result and show the card */
  setCurrentResult: (result: DiceRollResult) => void;
  /** Handle roll actions (advantage, disadvantage, critical, etc.) */
  handleRollAction: (action: RollAction, expression: string) => void;
  /** Remove an entry from roll history */
  removeFromHistory: (id: string) => void;
  /** Clear all roll history */
  clearHistory: () => void;
  /** Set rolling state */
  setIsRolling: (rolling: boolean) => void;
  /** Set expanded state */
  setIsExpanded: (expanded: boolean) => void;
}

const DiceContext = createContext<DiceContextValue | null>(null);

// localStorage key for persisting roll history
const HISTORY_STORAGE_KEY = 'daggerheart-dice-history';
const MAX_HISTORY_ENTRIES = 20; // Store more in localStorage, but only show 5 in UI

/**
 * Load roll history from localStorage
 */
function loadHistoryFromStorage(): RollHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Convert timestamp strings back to Date objects
    return parsed.map((entry: any) => ({
      ...entry,
      result: {
        ...entry.result,
        timestamp: new Date(entry.result.timestamp)
      }
    }));
  } catch (error) {
    console.warn('Failed to load dice history from localStorage:', error);
    return [];
  }
}

/**
 * Save roll history to localStorage
 */
function saveHistoryToStorage(history: RollHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  
  try {
    // Only store the most recent entries to avoid localStorage bloat
    const toStore = history.slice(0, MAX_HISTORY_ENTRIES);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.warn('Failed to save dice history to localStorage:', error);
  }
}

export function DiceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DiceContextState>({
    currentResult: null,
    isExpanded: false,
    rollHistory: [],
    isRolling: false,
  });

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = loadHistoryFromStorage();
    setState(prev => ({
      ...prev,
      rollHistory: savedHistory
    }));
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (state.rollHistory.length > 0) {
      saveHistoryToStorage(state.rollHistory);
    }
  }, [state.rollHistory]);

  const setCurrentResult = useCallback((result: DiceRollResult) => {
    // Create unique ID for this result
    const resultId = `${result.timestamp.getTime()}-${result.total}-${result.expression.originalExpression}`;
    
    setState(prev => {
      // Check if this result is already in history
      const isAlreadyInHistory = prev.rollHistory.some(entry => {
        const entryId = `${entry.result.timestamp.getTime()}-${entry.result.total}-${entry.result.expression.originalExpression}`;
        return entryId === resultId;
      });

      const newHistory = isAlreadyInHistory 
        ? prev.rollHistory 
        : [
            { id: resultId, result },
            ...prev.rollHistory.slice(0, MAX_HISTORY_ENTRIES - 1)
          ];

      return {
        ...prev,
        currentResult: result,
        isExpanded: true,
        rollHistory: newHistory,
        isRolling: false,
      };
    });
  }, []);

  const handleRollAction = useCallback(async (action: RollAction, expression: string) => {
    if (!state.currentResult) return;

    try {
      setState(prev => ({ ...prev, isRolling: true }));

      switch (action) {
        case 'roll-again':
          // Roll new dice
          const { rollDiceExpression } = await import('@/lib/dice-utils');
          const newResult = rollDiceExpression(expression);
          setCurrentResult(newResult);
          break;
          
        case 'roll-reset':
          // Reset to original roll (no roll type modifications)
          const { rollDiceExpression: rollReset } = await import('@/lib/dice-utils');
          const resetResult = rollReset(expression);
          setCurrentResult(resetResult);
          break;
          
        case 'roll-advantage':
        case 'roll-disadvantage':
        case 'roll-critical':
          // Apply roll type to existing result
          const { applyRollTypeToExistingResult } = await import('@/lib/dice-utils');
          const rollType = action.replace('roll-', '') as 'advantage' | 'disadvantage' | 'critical';
          const modifiedResult = applyRollTypeToExistingResult(state.currentResult, rollType);
          setCurrentResult(modifiedResult);
          break;
          
        case 'edit-expression':
          // Roll with new expression
          const { rollDiceExpression: rollNewExpression } = await import('@/lib/dice-utils');
          const editResult = rollNewExpression(expression);
          setCurrentResult(editResult);
          break;
          
        case 'copy-result':
          // Copy result to clipboard
          const resultText = `${state.currentResult.expression.originalExpression}: ${state.currentResult.total}`;
          try {
            await navigator.clipboard.writeText(resultText);
          } catch (error) {
            console.error('Failed to copy to clipboard:', error);
          }
          setState(prev => ({ ...prev, isRolling: false }));
          break;
      }
    } catch (error) {
      console.error('Failed to handle roll action:', error);
      setState(prev => ({ ...prev, isRolling: false }));
    }
  }, [state.currentResult, setCurrentResult]);

  const removeFromHistory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      rollHistory: prev.rollHistory.filter(entry => entry.id !== id)
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      rollHistory: []
    }));
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  const setIsRolling = useCallback((rolling: boolean) => {
    setState(prev => ({ ...prev, isRolling: rolling }));
  }, []);

  const setIsExpanded = useCallback((expanded: boolean) => {
    setState(prev => ({ ...prev, isExpanded: expanded }));
  }, []);

  const contextValue: DiceContextValue = {
    ...state,
    setCurrentResult,
    handleRollAction,
    removeFromHistory,
    clearHistory,
    setIsRolling,
    setIsExpanded,
  };

  return (
    <DiceContext.Provider value={contextValue}>
      {children}
    </DiceContext.Provider>
  );
}

export function useDice() {
  const context = useContext(DiceContext);
  if (!context) {
    throw new Error('useDice must be used within a DiceProvider');
  }
  return context;
}

export default DiceContext; 