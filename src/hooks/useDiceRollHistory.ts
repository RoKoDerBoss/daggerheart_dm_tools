/**
 * Custom hook for managing dice roll history with session persistence
 * Provides functionality to store, retrieve, and manage dice roll results
 */

import { useState, useEffect, useCallback } from 'react';
import { DiceRollResult, RollHistoryEntry, UseDiceRollHistoryReturn } from '@/types/dice';

// Configuration constants
const STORAGE_KEY = 'daggerheart-dice-roll-history';
const MAX_HISTORY_ENTRIES = 50;
const STORAGE_VERSION = '1.0';

/**
 * Interface for the stored history data structure
 */
interface StoredHistoryData {
  version: string;
  entries: RollHistoryEntry[];
  lastUpdated: string;
}

/**
 * Generate a unique ID for roll history entries
 */
const generateRollId = (): string => {
  return `roll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safely parse JSON from sessionStorage with error handling
 */
const safeParseStoredData = (data: string | null): StoredHistoryData | null => {
  if (!data) return null;
  
  try {
    const parsed = JSON.parse(data) as StoredHistoryData;
    
    // Validate the structure
    if (!parsed.version || !Array.isArray(parsed.entries)) {
      console.warn('Invalid stored dice roll history format, resetting...');
      return null;
    }
    
    // Check version compatibility
    if (parsed.version !== STORAGE_VERSION) {
      console.info(`Dice roll history version mismatch (${parsed.version} vs ${STORAGE_VERSION}), resetting...`);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse stored dice roll history:', error);
    return null;
  }
};

/**
 * Convert stored entries back to proper objects with Date instances
 */
const deserializeHistoryEntries = (entries: any[]): RollHistoryEntry[] => {
  return entries.map(entry => ({
    ...entry,
    result: {
      ...entry.result,
      timestamp: new Date(entry.result.timestamp)
    }
  }));
};

/**
 * Load roll history from sessionStorage
 */
const loadHistoryFromStorage = (): RollHistoryEntry[] => {
  try {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    const parsedData = safeParseStoredData(storedData);
    
    if (!parsedData) return [];
    
    return deserializeHistoryEntries(parsedData.entries);
  } catch (error) {
    console.error('Failed to load dice roll history from storage:', error);
    return [];
  }
};

/**
 * Save roll history to sessionStorage
 */
const saveHistoryToStorage = (entries: RollHistoryEntry[]): void => {
  try {
    const dataToStore: StoredHistoryData = {
      version: STORAGE_VERSION,
      entries,
      lastUpdated: new Date().toISOString()
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Failed to save dice roll history to storage:', error);
    
    // If storage is full, try to clear some space by removing oldest entries
    if (error instanceof DOMException && error.code === 22) {
      console.warn('Storage quota exceeded, attempting to reduce history size...');
      try {
        const reducedEntries = entries.slice(-Math.floor(MAX_HISTORY_ENTRIES / 2));
        const reducedData: StoredHistoryData = {
          version: STORAGE_VERSION,
          entries: reducedEntries,
          lastUpdated: new Date().toISOString()
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reducedData));
      } catch (retryError) {
        console.error('Failed to save reduced history:', retryError);
      }
    }
  }
};

/**
 * Custom hook for managing dice roll history
 * 
 * Features:
 * - Session-based persistence using sessionStorage
 * - Automatic cleanup when history exceeds maximum entries
 * - Type-safe operations with full TypeScript support
 * - Error handling for storage operations
 * - Optimized performance with useCallback for stable references
 * 
 * @returns Object containing history state and management functions
 */
export const useDiceRollHistory = (): UseDiceRollHistoryReturn => {
  // Initialize state with data from sessionStorage
  const [history, setHistory] = useState<RollHistoryEntry[]>(() => {
    return loadHistoryFromStorage();
  });

  // Save to sessionStorage whenever history changes
  useEffect(() => {
    saveHistoryToStorage(history);
  }, [history]);

  /**
   * Add a new roll to the history
   * Automatically manages history size and generates unique IDs
   */
  const addRoll = useCallback((result: DiceRollResult, context?: string): void => {
    const newEntry: RollHistoryEntry = {
      id: generateRollId(),
      result,
      context
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory];
      
      // Trim history if it exceeds maximum entries
      if (updatedHistory.length > MAX_HISTORY_ENTRIES) {
        return updatedHistory.slice(0, MAX_HISTORY_ENTRIES);
      }
      
      return updatedHistory;
    });
  }, []);

  /**
   * Clear all roll history
   */
  const clearHistory = useCallback((): void => {
    setHistory([]);
  }, []);

  /**
   * Remove a specific roll from history by ID
   */
  const removeRoll = useCallback((id: string): void => {
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
  }, []);

  /**
   * Get a specific roll by ID
   */
  const getRoll = useCallback((id: string): RollHistoryEntry | undefined => {
    return history.find(entry => entry.id === id);
  }, [history]);

  /**
   * Check if history is at maximum capacity
   */
  const isHistoryFull = history.length >= MAX_HISTORY_ENTRIES;

  return {
    history,
    addRoll,
    clearHistory,
    removeRoll,
    getRoll,
    isHistoryFull
  };
}; 