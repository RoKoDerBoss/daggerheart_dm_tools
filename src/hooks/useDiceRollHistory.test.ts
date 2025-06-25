/**
 * Unit tests for useDiceRollHistory hook
 * Tests sessionStorage integration, roll management, and error handling
 */

import { renderHook, act } from '@testing-library/react';
import { useDiceRollHistory } from './useDiceRollHistory';
import { DiceRollResult } from '@/types/dice';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null)
  };
})();

// Replace global sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

// Mock console methods to avoid noise in tests
const originalConsole = {
  error: console.error,
  warn: console.warn,
  info: console.info
};

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
});

afterAll(() => {
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
});

// Helper function to create mock dice roll results
const createMockResult = (overrides?: Partial<DiceRollResult>): DiceRollResult => ({
  expression: {
    dice: [{ count: 2, sides: 6 }],
    modifier: 3,
    originalExpression: '2d6+3'
  },
  rolls: [
    { value: 4, sides: 6, isCritical: false },
    { value: 6, sides: 6, isCritical: true }
  ],
  modifier: 3,
  total: 13,
  breakdown: [
    {
      dieSpec: '2d6',
      values: [4, 6],
      subtotal: 10
    }
  ],
  timestamp: new Date('2023-01-01T12:00:00Z'),
  rollType: 'normal',
  ...overrides
});

describe('useDiceRollHistory Hook', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    mockSessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('initializes with empty history when no stored data', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history).toEqual([]);
      expect(result.current.isHistoryFull).toBe(false);
    });

    test('loads existing history from sessionStorage on initialization', () => {
      const mockData = {
        version: '1.0',
        entries: [
          {
            id: 'test-1',
            result: createMockResult(),
            context: 'Test roll'
          }
        ],
        lastUpdated: new Date().toISOString()
      };
      
      mockSessionStorage.setItem('daggerheart-dice-roll-history', JSON.stringify(mockData));
      
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].id).toBe('test-1');
      expect(result.current.history[0].context).toBe('Test roll');
    });

    test('handles corrupted sessionStorage data gracefully', () => {
      mockSessionStorage.setItem('daggerheart-dice-roll-history', 'invalid-json');
      
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to parse stored dice roll history:',
        expect.any(Error)
      );
    });

    test('handles version mismatch by resetting history', () => {
      const mockData = {
        version: '0.9', // Old version
        entries: [{ id: 'test-1', result: createMockResult() }],
        lastUpdated: new Date().toISOString()
      };
      
      mockSessionStorage.setItem('daggerheart-dice-roll-history', JSON.stringify(mockData));
      
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history).toEqual([]);
      expect(console.info).toHaveBeenCalledWith(
        'Dice roll history version mismatch (0.9 vs 1.0), resetting...'
      );
    });

    test('handles invalid data structure by resetting history', () => {
      const invalidData = {
        version: '1.0',
        entries: 'not-an-array', // Invalid structure
        lastUpdated: new Date().toISOString()
      };
      
      mockSessionStorage.setItem('daggerheart-dice-roll-history', JSON.stringify(invalidData));
      
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        'Invalid stored dice roll history format, resetting...'
      );
    });
  });

  describe('Adding Rolls', () => {
    test('adds a new roll to history', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const mockResult = createMockResult();
      
      act(() => {
        result.current.addRoll(mockResult);
      });
      
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].result).toEqual(mockResult);
      expect(result.current.history[0].id).toMatch(/^roll_\d+_[a-z0-9]+$/);
    });

    test('adds roll with context', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const mockResult = createMockResult();
      
      act(() => {
        result.current.addRoll(mockResult, 'Attack roll');
      });
      
      expect(result.current.history[0].context).toBe('Attack roll');
    });

    test('adds new rolls to the beginning of history', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const firstRoll = createMockResult({ total: 10 });
      const secondRoll = createMockResult({ total: 15 });
      
      act(() => {
        result.current.addRoll(firstRoll);
      });
      
      act(() => {
        result.current.addRoll(secondRoll);
      });
      
      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].result.total).toBe(15); // Most recent first
      expect(result.current.history[1].result.total).toBe(10);
    });

    test('trims history when exceeding maximum entries', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      // Add 51 rolls (exceeding the 50 limit)
      act(() => {
        for (let i = 0; i < 51; i++) {
          result.current.addRoll(createMockResult({ total: i }));
        }
      });
      
      expect(result.current.history).toHaveLength(50);
      expect(result.current.isHistoryFull).toBe(true);
      // Most recent roll should be first
      expect(result.current.history[0].result.total).toBe(50);
      // Oldest roll should be removed
      expect(result.current.history.every(entry => entry.result.total !== 0)).toBe(true);
    });

    test('saves to sessionStorage after adding roll', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const mockResult = createMockResult();
      
      act(() => {
        result.current.addRoll(mockResult);
      });
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'daggerheart-dice-roll-history',
        expect.stringContaining('"version":"1.0"')
      );
    });
  });

  describe('Removing Rolls', () => {
    test('removes a specific roll by ID', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const mockResult = createMockResult();
      
      act(() => {
        result.current.addRoll(mockResult);
      });
      
      const rollId = result.current.history[0].id;
      
      act(() => {
        result.current.removeRoll(rollId);
      });
      
      expect(result.current.history).toHaveLength(0);
    });

    test('does nothing when removing non-existent roll', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const mockResult = createMockResult();
      
      act(() => {
        result.current.addRoll(mockResult);
      });
      
      const originalLength = result.current.history.length;
      
      act(() => {
        result.current.removeRoll('non-existent-id');
      });
      
      expect(result.current.history).toHaveLength(originalLength);
    });

    test('removes only the specified roll when multiple exist', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      act(() => {
        result.current.addRoll(createMockResult({ total: 10 }));
        result.current.addRoll(createMockResult({ total: 15 }));
        result.current.addRoll(createMockResult({ total: 20 }));
      });
      
      const middleRollId = result.current.history[1].id;
      
      act(() => {
        result.current.removeRoll(middleRollId);
      });
      
      expect(result.current.history).toHaveLength(2);
      expect(result.current.history.map(entry => entry.result.total)).toEqual([20, 10]);
    });
  });

  describe('Clearing History', () => {
    test('clears all history', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      act(() => {
        result.current.addRoll(createMockResult());
        result.current.addRoll(createMockResult());
      });
      
      expect(result.current.history).toHaveLength(2);
      
      act(() => {
        result.current.clearHistory();
      });
      
      expect(result.current.history).toHaveLength(0);
      expect(result.current.isHistoryFull).toBe(false);
    });

    test('saves empty state to sessionStorage after clearing', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      act(() => {
        result.current.addRoll(createMockResult());
      });
      
      act(() => {
        result.current.clearHistory();
      });
      
      expect(mockSessionStorage.setItem).toHaveBeenLastCalledWith(
        'daggerheart-dice-roll-history',
        expect.stringContaining('"entries":[]')
      );
    });
  });

  describe('Getting Rolls', () => {
    test('retrieves a specific roll by ID', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      const mockResult = createMockResult();
      
      act(() => {
        result.current.addRoll(mockResult, 'Test context');
      });
      
      const rollId = result.current.history[0].id;
      const retrievedRoll = result.current.getRoll(rollId);
      
      expect(retrievedRoll).toBeDefined();
      expect(retrievedRoll?.result).toEqual(mockResult);
      expect(retrievedRoll?.context).toBe('Test context');
    });

    test('returns undefined for non-existent roll ID', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      const retrievedRoll = result.current.getRoll('non-existent-id');
      
      expect(retrievedRoll).toBeUndefined();
    });
  });

  describe('History Full Status', () => {
    test('reports false when history is not full', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.addRoll(createMockResult());
        }
      });
      
      expect(result.current.isHistoryFull).toBe(false);
    });

    test('reports true when history reaches maximum capacity', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.addRoll(createMockResult());
        }
      });
      
      expect(result.current.isHistoryFull).toBe(true);
    });
  });

  describe('SessionStorage Error Handling', () => {
    test('handles sessionStorage setItem errors gracefully', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      // Mock setItem to throw an error
      mockSessionStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      act(() => {
        result.current.addRoll(createMockResult());
      });
      
      // Should still add to memory even if storage fails
      expect(result.current.history).toHaveLength(1);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save dice roll history to storage:',
        expect.any(Error)
      );
    });

    test('handles storage quota exceeded by reducing history size', () => {
      const { result } = renderHook(() => useDiceRollHistory());
      
      // Add some rolls first
      act(() => {
        for (let i = 0; i < 30; i++) {
          result.current.addRoll(createMockResult({ total: i }));
        }
      });
      
      // Mock setItem to throw quota exceeded error
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      Object.defineProperty(quotaError, 'code', { value: 22 });
      
      mockSessionStorage.setItem
        .mockImplementationOnce(() => { throw quotaError; })
        .mockImplementationOnce(() => {}); // Second call should succeed
      
      act(() => {
        result.current.addRoll(createMockResult({ total: 999 }));
      });
      
      expect(console.warn).toHaveBeenCalledWith(
        'Storage quota exceeded, attempting to reduce history size...'
      );
      
      // Should have attempted to save reduced data
      expect(mockSessionStorage.setItem).toHaveBeenCalledTimes(2);
    });

    test('handles getItem errors during initialization', () => {
      mockSessionStorage.getItem.mockImplementationOnce(() => {
        throw new Error('Storage read error');
      });
      
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load dice roll history from storage:',
        expect.any(Error)
      );
    });
  });

  describe('Date Deserialization', () => {
    test('properly deserializes Date objects from stored data', () => {
      const testDate = new Date('2023-06-15T14:30:00Z');
      const mockData = {
        version: '1.0',
        entries: [
          {
            id: 'test-1',
            result: {
              ...createMockResult(),
              timestamp: testDate.toISOString() // Stored as string
            }
          }
        ],
        lastUpdated: new Date().toISOString()
      };
      
      mockSessionStorage.setItem('daggerheart-dice-roll-history', JSON.stringify(mockData));
      
      const { result } = renderHook(() => useDiceRollHistory());
      
      expect(result.current.history[0].result.timestamp).toBeInstanceOf(Date);
      expect(result.current.history[0].result.timestamp.getTime()).toBe(testDate.getTime());
    });
  });

  describe('Function Stability', () => {
    test('functions maintain stable references across re-renders', () => {
      const { result, rerender } = renderHook(() => useDiceRollHistory());
      
      const initialFunctions = {
        addRoll: result.current.addRoll,
        clearHistory: result.current.clearHistory,
        removeRoll: result.current.removeRoll,
        getRoll: result.current.getRoll
      };
      
      // Trigger a re-render by adding a roll
      act(() => {
        result.current.addRoll(createMockResult());
      });
      
      rerender();
      
      // Functions should maintain the same references
      expect(result.current.addRoll).toBe(initialFunctions.addRoll);
      expect(result.current.clearHistory).toBe(initialFunctions.clearHistory);
      expect(result.current.removeRoll).toBe(initialFunctions.removeRoll);
      expect(result.current.getRoll).toBe(initialFunctions.getRoll);
    });
  });
}); 