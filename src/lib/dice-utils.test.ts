/**
 * Unit tests for dice utility functions
 * Tests parsing, validation, rolling, and error handling
 */

import {
  parseDiceExpression,
  validateDiceExpression,
  rollDiceExpression,
  rollWithAdvantage,
  rollWithDisadvantage,
  rollCritical,
  isDiceExpression,
  extractDiceExpressions,
  getDiceRange,
  getDiceAverage,
  isValidDiceExpression,
  getDiceExpressionError,
  formatDiceError,
  getDiceExpressionSuggestions,
  sanitizeDiceInput,
  checkDiceExpressionSafety,
  validateMultipleDiceExpressions,
  DEFAULT_DICE_CONFIG,
} from './dice-utils';

import { DiceError, DiceRollConfig } from '@/types/dice';

// Mock Math.random for predictable test results
const mockMath = Object.create(global.Math);
let mockRandomValue = 0.5;
mockMath.random = () => mockRandomValue;
global.Math = mockMath;

// Helper function to set mock random value
const setMockRandom = (value: number) => {
  mockRandomValue = value;
};

describe('parseDiceExpression', () => {
  test('parses simple dice expressions', () => {
    const result = parseDiceExpression('2d6');
    expect(result).toEqual({
      dice: [{ count: 2, sides: 6 }],
      modifier: 0,
      originalExpression: '2d6',
    });
  });

  test('parses dice with positive modifier', () => {
    const result = parseDiceExpression('1d20+5');
    expect(result).toEqual({
      dice: [{ count: 1, sides: 20 }],
      modifier: 5,
      originalExpression: '1d20+5',
    });
  });

  test('parses dice with negative modifier', () => {
    const result = parseDiceExpression('3d8-2');
    expect(result).toEqual({
      dice: [{ count: 3, sides: 8 }],
      modifier: -2,
      originalExpression: '3d8-2',
    });
  });

  test('parses implied 1 die', () => {
    const result = parseDiceExpression('d12');
    expect(result).toEqual({
      dice: [{ count: 1, sides: 12 }],
      modifier: 0,
      originalExpression: 'd12',
    });
  });

  test('parses modifier only', () => {
    const result = parseDiceExpression('+7');
    expect(result).toEqual({
      dice: [],
      modifier: 7,
      originalExpression: '+7',
    });
  });

  test('parses complex expressions with whitespace', () => {
    const result = parseDiceExpression(' 2d6 + 3 ');
    expect(result).toEqual({
      dice: [{ count: 2, sides: 6 }],
      modifier: 3,
      originalExpression: ' 2d6 + 3 ',
    });
  });

  test('throws error for invalid expressions', () => {
    expect(() => parseDiceExpression('')).toThrow();
    expect(() => parseDiceExpression('invalid')).toThrow();
    expect(() => parseDiceExpression('2d')).toThrow();
  });
});

describe('validateDiceExpression', () => {
  test('validates correct expressions', () => {
    const validExpressions = ['2d6', '1d20+5', 'd8-1', '+3', '4d4+2'];
    
    validExpressions.forEach(expr => {
      const result = validateDiceExpression(expr);
      expect(result.isValid).toBe(true);
      expect(result.expression).toBeDefined();
      expect(result.error).toBeUndefined();
    });
  });

  test('rejects invalid expressions', () => {
    const invalidExpressions = ['', 'invalid', '2d', 'd', '++5', '--3'];
    
    invalidExpressions.forEach(expr => {
      const result = validateDiceExpression(expr);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.expression).toBeUndefined();
    });
  });

  test('respects dice count limits', () => {
    const config: DiceRollConfig = { ...DEFAULT_DICE_CONFIG, maxDiceCount: 5 };
    
    const result = validateDiceExpression('10d6', config);
    expect(result.isValid).toBe(false);
    expect(result.error?.type).toBe('INVALID_DIE_COUNT');
  });

  test('respects die size limits', () => {
    const config: DiceRollConfig = { ...DEFAULT_DICE_CONFIG, maxDieSides: 20 };
    
    const result = validateDiceExpression('1d100', config);
    expect(result.isValid).toBe(false);
    expect(result.error?.type).toBe('INVALID_DIE_SIDES');
  });

  test('respects modifier limits', () => {
    const config: DiceRollConfig = { ...DEFAULT_DICE_CONFIG, maxModifier: 10 };
    
    const result = validateDiceExpression('2d6+50', config);
    expect(result.isValid).toBe(false);
    expect(result.error?.type).toBe('MODIFIER_TOO_LARGE');
  });
});

describe('rollDiceExpression', () => {
  beforeEach(() => {
    setMockRandom(0.5); // This will give us predictable middle values
  });

  test('rolls simple dice expression', () => {
    setMockRandom(0.5); // For d6, this gives us (0.5 * 6) + 1 = 4
    
    const result = rollDiceExpression('2d6');
    
    expect(result.total).toBe(8); // 4 + 4
    expect(result.rolls).toHaveLength(2);
    expect(result.rolls.every(roll => roll.value === 4)).toBe(true);
    expect(result.modifier).toBe(0);
    expect(result.rollType).toBe('normal');
  });

  test('includes modifiers in total', () => {
    setMockRandom(0.5);
    
    const result = rollDiceExpression('1d6+3');
    
    expect(result.total).toBe(7); // 4 + 3
    expect(result.modifier).toBe(3);
  });

  test('detects critical rolls', () => {
    setMockRandom(0.99); // This will give us maximum values
    
    const result = rollDiceExpression('1d6');
    
    expect(result.rolls[0].isCritical).toBe(true);
    expect(result.rolls[0].value).toBe(6);
  });

  test('provides detailed breakdown', () => {
    setMockRandom(0.5);
    
    const result = rollDiceExpression('2d6+1d8');
    
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0].dieSpec).toBe('2d6');
    expect(result.breakdown[1].dieSpec).toBe('1d8');
  });

  test('includes timestamp', () => {
    const before = new Date();
    const result = rollDiceExpression('1d6');
    const after = new Date();
    
    expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});

describe('rollWithAdvantage', () => {
  test('adds d6 to roll', () => {
    setMockRandom(0.5); // d6 gives 4, d6 advantage gives 4
    
    const result = rollWithAdvantage('2d6');
    
    expect(result.rollType).toBe('advantage');
    expect(result.rolls).toHaveLength(3); // 2d6 + 1d6 advantage
    expect(result.total).toBe(12); // 4 + 4 + 4
  });

  test('shows advantage in breakdown', () => {
    setMockRandom(0.5);
    
    const result = rollWithAdvantage('1d20');
    
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[1].dieSpec).toBe('advantage');
  });
});

describe('rollWithDisadvantage', () => {
  test('subtracts d6 from roll', () => {
    setMockRandom(0.5); // d20 gives 11, d6 disadvantage gives -4
    
    const result = rollWithDisadvantage('1d20');
    
    expect(result.rollType).toBe('disadvantage');
    expect(result.rolls).toHaveLength(2);
    expect(result.total).toBe(7); // 11 - 4
  });

  test('shows disadvantage in breakdown', () => {
    setMockRandom(0.5);
    
    const result = rollWithDisadvantage('1d20');
    
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[1].dieSpec).toBe('disadvantage');
    expect(result.breakdown[1].subtotal).toBeLessThan(0);
  });
});

describe('rollCritical', () => {
  test('adds maximum die value to each die', () => {
    setMockRandom(0.5); // d6 gives 4, critical adds 6 more
    
    const result = rollCritical('2d6');
    
    expect(result.rollType).toBe('critical');
    expect(result.rolls.every(roll => roll.isCritical)).toBe(true);
    expect(result.total).toBe(20); // (4+6) + (4+6) = 20
  });
});

describe('isDiceExpression', () => {
  test('recognizes valid dice expressions', () => {
    const validExpressions = ['2d6', 'd20', '1d8+3', '5', '+7', '-2'];
    
    validExpressions.forEach(expr => {
      expect(isDiceExpression(expr)).toBe(true);
    });
  });

  test('rejects non-dice expressions', () => {
    const invalidExpressions = ['hello', 'abc', '', 'not a die'];
    
    invalidExpressions.forEach(expr => {
      expect(isDiceExpression(expr)).toBe(false);
    });
  });

  test('handles non-string input', () => {
    expect(isDiceExpression(null as any)).toBe(false);
    expect(isDiceExpression(undefined as any)).toBe(false);
    expect(isDiceExpression(123 as any)).toBe(false);
  });
});

describe('extractDiceExpressions', () => {
  test('extracts dice expressions from text', () => {
    const text = 'Roll 2d6 for damage and 1d20 for attack, with a +3 bonus.';
    const expressions = extractDiceExpressions(text);
    
    expect(expressions).toContain('2d6');
    expect(expressions).toContain('1d20');
    expect(expressions).toContain('+3');
  });

  test('handles text with no dice expressions', () => {
    const text = 'This text has no dice expressions.';
    const expressions = extractDiceExpressions(text);
    
    expect(expressions).toHaveLength(0);
  });

  test('extracts from complex text', () => {
    const text = 'The goblin attacks with 1d8+2 damage. DC 15 save or take 3d6 poison damage.';
    const expressions = extractDiceExpressions(text);
    
    expect(expressions).toContain('1d8+2');
    expect(expressions).toContain('3d6');
    expect(expressions).toContain('15');
  });
});

describe('getDiceRange', () => {
  test('calculates range for simple dice', () => {
    const range = getDiceRange('2d6');
    expect(range).toEqual({ min: 2, max: 12 });
  });

  test('includes modifiers in range', () => {
    const range = getDiceRange('1d20+5');
    expect(range).toEqual({ min: 6, max: 25 });
  });

  test('handles negative modifiers', () => {
    const range = getDiceRange('2d6-3');
    expect(range).toEqual({ min: -1, max: 9 });
  });

  test('handles modifier-only expressions', () => {
    const range = getDiceRange('+5');
    expect(range).toEqual({ min: 5, max: 5 });
  });
});

describe('getDiceAverage', () => {
  test('calculates average for simple dice', () => {
    const average = getDiceAverage('2d6');
    expect(average).toBe(7); // (3.5 + 3.5)
  });

  test('includes modifiers in average', () => {
    const average = getDiceAverage('1d20+3');
    expect(average).toBe(13.5); // 10.5 + 3
  });

  test('handles different die types', () => {
    const average = getDiceAverage('1d4');
    expect(average).toBe(2.5); // (1+2+3+4)/4
  });
});

describe('isValidDiceExpression', () => {
  test('returns true for valid expressions', () => {
    expect(isValidDiceExpression('2d6')).toBe(true);
    expect(isValidDiceExpression('1d20+5')).toBe(true);
  });

  test('returns false for invalid expressions', () => {
    expect(isValidDiceExpression('')).toBe(false);
    expect(isValidDiceExpression('invalid')).toBe(false);
  });
});

describe('getDiceExpressionError', () => {
  test('returns null for valid expressions', () => {
    expect(getDiceExpressionError('2d6')).toBeNull();
  });

  test('returns error message for invalid expressions', () => {
    const error = getDiceExpressionError('invalid');
    expect(error).toBeTruthy();
    expect(typeof error).toBe('string');
  });
});

describe('formatDiceError', () => {
  test('formats invalid expression errors', () => {
    const error: DiceError = {
      type: 'INVALID_EXPRESSION',
      message: 'Invalid',
      expression: 'bad-expr',
    };
    
    const formatted = formatDiceError(error);
    expect(formatted).toContain('Invalid dice expression');
    expect(formatted).toContain('bad-expr');
  });

  test('formats die count errors', () => {
    const error: DiceError = {
      type: 'INVALID_DIE_COUNT',
      message: 'Too many dice',
      count: 50,
    };
    
    const formatted = formatDiceError(error);
    expect(formatted).toContain('Too many dice');
    expect(formatted).toContain('50');
  });

  test('formats modifier errors', () => {
    const error: DiceError = {
      type: 'MODIFIER_TOO_LARGE',
      message: 'Modifier too big',
      modifier: 1500,
    };
    
    const formatted = formatDiceError(error);
    expect(formatted).toContain('Modifier too large');
    expect(formatted).toContain('1500');
  });
});

describe('getDiceExpressionSuggestions', () => {
  test('suggests fixes for common mistakes', () => {
    const suggestions = getDiceExpressionSuggestions('2 dice');
    expect(suggestions.some(s => s.includes('2d6'))).toBe(true);
  });

  test('suggests fixes for multiplication notation', () => {
    const suggestions = getDiceExpressionSuggestions('2x6');
    expect(suggestions.some(s => s.includes('2d6'))).toBe(true);
  });

  test('provides general help for unclear input', () => {
    const suggestions = getDiceExpressionSuggestions('???');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.includes('2d6+3'))).toBe(true);
  });
});

describe('sanitizeDiceInput', () => {
  test('removes extra whitespace', () => {
    expect(sanitizeDiceInput(' 2 d 6 + 3 ')).toBe('2d6+3');
  });

  test('converts alternative notation', () => {
    expect(sanitizeDiceInput('2x6')).toBe('2d6');
    expect(sanitizeDiceInput('2X6')).toBe('2d6');
  });

  test('fixes double operators', () => {
    expect(sanitizeDiceInput('2d6++3')).toBe('2d6+3');
    expect(sanitizeDiceInput('2d6--3')).toBe('2d6-3');
  });

  test('handles non-string input', () => {
    expect(sanitizeDiceInput(null as any)).toBe('');
    expect(sanitizeDiceInput(undefined as any)).toBe('');
  });
});

describe('checkDiceExpressionSafety', () => {
  test('marks simple expressions as safe', () => {
    const safety = checkDiceExpressionSafety('2d6+3');
    expect(safety.isSafe).toBe(true);
    expect(safety.warnings).toHaveLength(0);
  });

  test('warns about large numbers', () => {
    const safety = checkDiceExpressionSafety('1d9999');
    expect(safety.isSafe).toBe(false);
    expect(safety.warnings.some(w => w.includes('large numbers'))).toBe(true);
  });

  test('warns about high dice counts', () => {
    const safety = checkDiceExpressionSafety('100d6');
    expect(safety.isSafe).toBe(false);
    expect(safety.warnings.some(w => w.includes('High dice count'))).toBe(true);
  });
});

describe('validateMultipleDiceExpressions', () => {
  test('validates multiple expressions', () => {
    const expressions = ['2d6', '1d20+5', 'invalid'];
    const results = validateMultipleDiceExpressions(expressions);
    
    expect(results).toHaveLength(3);
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(true);
    expect(results[2].isValid).toBe(false);
  });

  test('handles empty array', () => {
    const results = validateMultipleDiceExpressions([]);
    expect(results).toHaveLength(0);
  });
});

describe('Edge cases and error handling', () => {
  test('handles very large dice counts gracefully', () => {
    const config: DiceRollConfig = { ...DEFAULT_DICE_CONFIG, maxDiceCount: 1000 };
    expect(() => parseDiceExpression('999d6', config)).not.toThrow();
  });

  test('handles zero and negative values correctly', () => {
    expect(() => parseDiceExpression('0d6')).toThrow();
    expect(() => parseDiceExpression('2d0')).toThrow();
  });

  test('preserves original expression in parsed result', () => {
    const original = '  2D6 + 3  ';
    const result = parseDiceExpression(original);
    expect(result.originalExpression).toBe(original);
  });

  test('handles complex expressions with multiple dice types', () => {
    const result = parseDiceExpression('1d4+2d6+1d8+5');
    expect(result.dice).toHaveLength(3);
    expect(result.modifier).toBe(5);
  });
}); 