/**
 * Dice utility functions for parsing, validating, and rolling dice expressions
 * Supports Daggerheart RPG dice mechanics
 */

import { 
  DiceExpression, 
  DiceError, 
  DiceValidationResult, 
  Die,
  DiceRollConfig,
  DiceRollResult,
  SingleRoll,
  DiceBreakdown
} from '@/types/dice';

/**
 * Default configuration for dice rolling
 */
export const DEFAULT_DICE_CONFIG: DiceRollConfig = {
  highlightCriticals: true,
  maxDiceCount: 20,
  maxDieSides: 100,
  maxModifier: 999,
};

/**
 * Standard die types and common Daggerheart rolls
 * Migrated from data/utilities/dice.ts
 */
export interface DieType {
  sides: number;
  name: string;
  common: boolean;
}

export const STANDARD_DICE: DieType[] = [
  { sides: 4, name: 'd4', common: true },
  { sides: 6, name: 'd6', common: true },
  { sides: 8, name: 'd8', common: true },
  { sides: 10, name: 'd10', common: true },
  { sides: 12, name: 'd12', common: true },
  { sides: 20, name: 'd20', common: true },
  { sides: 100, name: 'd100', common: false }
];

export const COMMON_DAGGERHEART_ROLLS = [
  { name: 'Action Roll', expression: '2d12', description: 'Standard action roll with dual d12s' },
  { name: 'Hope Die', expression: '1d20', description: 'Hope die for adding to action rolls' },
  { name: 'Damage (Light)', expression: '1d4', description: 'Light weapon damage' },
  { name: 'Damage (Medium)', expression: '1d6', description: 'Medium weapon damage' },
  { name: 'Damage (Heavy)', expression: '1d8', description: 'Heavy weapon damage' },
  { name: 'Damage (Very Heavy)', expression: '1d10', description: 'Very heavy weapon damage' },
  { name: 'Magic Damage', expression: '1d20', description: 'Spell damage roll' }
];

/**
 * Regular expression patterns for dice notation parsing
 */
const DICE_PATTERNS = {
  // Matches full dice expressions like "2d6+3", "1d20-2", "d8+1", "+5", "2d6+2+1d4"
  FULL_EXPRESSION: /^([+-]?)(?:(\d*)d(\d+))?([+-]\d+)?$/i,
  // Matches individual dice components
  DICE_COMPONENT: /(\d*)d(\d+)/gi,
  // Matches modifiers
  MODIFIER: /([+-])(\d+)/g,
  // Validates clean expression format - now supports multiple dice and modifiers
  CLEAN_FORMAT: /^[+-]?(?:(?:\d*d\d+)|(?:\d+))(?:[+-](?:(?:\d*d\d+)|(?:\d+)))*$/i,
  // Matches complete complex expressions with multiple dice types and modifiers
  COMPLEX_EXPRESSION: /^[+-]?(?:(?:\d*d\d+)|(?:\d+))(?:[+-](?:(?:\d*d\d+)|(?:\d+)))*$/i,
  // Matches individual terms (dice or numbers) in complex expressions
  TERM: /([+-]?)(?:(\d*)d(\d+)|(\d+))/g,
};

/**
 * Parse a dice expression string into a structured DiceExpression object
 * 
 * Supported formats:
 * - "2d6+3" - 2 six-sided dice plus 3
 * - "d20-1" - 1 twenty-sided die minus 1 (implied 1)
 * - "3d8" - 3 eight-sided dice with no modifier
 * - "+5" - modifier only, no dice
 * - "2d6+2+1d4" - complex expressions with multiple dice types and modifiers
 * - "1d20+1d4+3-1d6" - complex expressions with positive and negative dice
 * - "3d6+1+2d8+5" - multiple dice types with multiple modifiers
 * 
 * @param expression - The dice expression string to parse
 * @param config - Optional configuration for validation limits
 * @returns Parsed DiceExpression object
 * @throws DiceError if expression is invalid
 */
export function parseDiceExpression(
  expression: string, 
  config: DiceRollConfig = DEFAULT_DICE_CONFIG
): DiceExpression {
  const validationResult = validateDiceExpression(expression, config);
  
  if (!validationResult.isValid || !validationResult.expression) {
    throw validationResult.error!;
  }
  
  return validationResult.expression;
}

/**
 * Validate and parse a dice expression without throwing errors
 * 
 * @param expression - The dice expression string to validate
 * @param config - Optional configuration for validation limits
 * @returns Validation result with parsed expression or error details
 */
export function validateDiceExpression(
  expression: string,
  config: DiceRollConfig = DEFAULT_DICE_CONFIG
): DiceValidationResult {
  try {
    // Clean and normalize the expression
    const cleanExpression = normalizeExpression(expression);
    
    if (!cleanExpression) {
      return {
        isValid: false,
        error: {
          type: 'INVALID_EXPRESSION',
          message: 'Empty or invalid dice expression',
          expression: expression,
        },
      };
    }

    // Parse dice components and modifiers
    const dice = parseDiceComponents(cleanExpression, config);
    const modifier = parseModifier(cleanExpression);
    
    // Validate parsed components
    const validationError = validateComponents(dice, modifier, config);
    if (validationError) {
      return {
        isValid: false,
        error: validationError,
      };
    }

    // Create the dice expression object
    const diceExpression: DiceExpression = {
      dice,
      modifier,
      originalExpression: expression,
    };

    return {
      isValid: true,
      expression: diceExpression,
    };

  } catch (error) {
    // If it's already a DiceError, return it directly
    if (error && typeof error === 'object' && 'type' in error) {
      return {
        isValid: false,
        error: error as DiceError,
      };
    }
    
    return {
      isValid: false,
      error: {
        type: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown parsing error',
      },
    };
  }
}

/**
 * Normalize a dice expression by removing whitespace and standardizing format
 * Supports complex expressions like "2d6+2+1d4"
 * 
 * @param expression - Raw dice expression
 * @returns Cleaned expression string or null if invalid
 */
function normalizeExpression(expression: string): string | null {
  if (typeof expression !== 'string') {
    return null;
  }

  // Remove all whitespace and convert to lowercase
  let cleaned = expression.replace(/\s+/g, '').toLowerCase();
  
  // Handle edge cases
  if (!cleaned || cleaned === '+' || cleaned === '-') {
    return null;
  }
  
  // Add leading + if expression starts with a digit or 'd' but only if it doesn't already start with + or -
  if (/^[0-9d]/.test(cleaned) && !/^[+-]/.test(cleaned)) {
    cleaned = '+' + cleaned;
  }
  
  // Validate basic format using the complex expression pattern
  if (!DICE_PATTERNS.COMPLEX_EXPRESSION.test(cleaned)) {
    return null;
  }
  
  return cleaned;
}

/**
 * Parse dice components from a normalized expression
 * Supports complex expressions like "2d6+2+1d4" with multiple dice types
 * 
 * @param expression - Normalized dice expression
 * @param config - Dice configuration for validation
 * @returns Array of Die objects
 */
function parseDiceComponents(expression: string, config: DiceRollConfig): Die[] {
  const dice: Die[] = [];
  
  // For simple expressions, try the old method first for backwards compatibility
  const simpleMatches = Array.from(expression.matchAll(DICE_PATTERNS.DICE_COMPONENT));
  
  // If we have a simple expression (one dice type), use the old logic
  // Simple expressions have only one dice component and no additional + or - operations
  const hasOnlyOneDiceComponent = simpleMatches.length === 1;
  const hasNoAdditionalOperations = (expression.match(/[+-]/g) || []).length <= 1;
  
  if (hasOnlyOneDiceComponent && hasNoAdditionalOperations) {
    const match = simpleMatches[0];
    const countStr = match[1];
    const sidesStr = match[2];
    
    // Handle implied 1 for expressions like "d20"
    const count = countStr === '' ? 1 : parseInt(countStr, 10);
    const sides = parseInt(sidesStr, 10);
    
    // Validate individual die specification
    if (isNaN(count) || count < 1) {
      throw {
        type: 'INVALID_DIE_COUNT',
        message: `Invalid die count: ${countStr || '(empty)'}`,
        count: count,
      } as DiceError;
    }
    
    if (isNaN(sides) || sides < 2) {
      throw {
        type: 'INVALID_DIE_SIDES',
        message: `Invalid die sides: ${sidesStr}. Must be at least 2.`,
        sides: sides,
      } as DiceError;
    }
    
    if (sides > config.maxDieSides) {
      throw {
        type: 'INVALID_DIE_SIDES',
        message: `Die sides ${sides} exceeds maximum allowed ${config.maxDieSides}`,
        sides: sides,
      } as DiceError;
    }
    
    dice.push({ count, sides });
    return dice;
  }
  
  // For complex expressions, use the new logic
  const diceMap = new Map<string, number>(); // Map die type to total count
  
  // Use the TERM pattern to match all terms in the expression
  const matches = Array.from(expression.matchAll(DICE_PATTERNS.TERM));
  
  for (const match of matches) {
    const sign = match[1] || '+'; // Default to positive if no sign
    const countStr = match[2]; // Dice count (empty for "d20")
    const sidesStr = match[3]; // Die sides
    const numberStr = match[4]; // Plain number (modifier)
    
    // Skip plain numbers - they're handled as modifiers
    if (numberStr) {
      continue;
    }
    
    // Handle dice terms
    if (sidesStr) {
      // Handle implied 1 for expressions like "d20"
      const count = countStr === '' ? 1 : parseInt(countStr, 10);
      const sides = parseInt(sidesStr, 10);
      
      // Validate individual die specification
      if (isNaN(count) || count < 1) {
        throw {
          type: 'INVALID_DIE_COUNT',
          message: `Invalid die count: ${countStr || '(empty)'}`,
          count: count,
        } as DiceError;
      }
      
      if (isNaN(sides) || sides < 2) {
        throw {
          type: 'INVALID_DIE_SIDES',
          message: `Invalid die sides: ${sidesStr}. Must be at least 2.`,
          sides: sides,
        } as DiceError;
      }
      
      if (sides > config.maxDieSides) {
        throw {
          type: 'INVALID_DIE_SIDES',
          message: `Die sides ${sides} exceeds maximum allowed ${config.maxDieSides}`,
          sides: sides,
        } as DiceError;
      }
      
      // Apply sign and accumulate dice of the same type
      const effectiveCount = sign === '-' ? -count : count;
      const dieKey = `d${sides}`;
      
      const currentCount = diceMap.get(dieKey) || 0;
      const newCount = currentCount + effectiveCount;
      
      if (newCount <= 0) {
        diceMap.delete(dieKey);
      } else {
        diceMap.set(dieKey, newCount);
      }
    }
  }
  
  // Convert map to Die array
  diceMap.forEach((count, dieKey) => {
    const sides = parseInt(dieKey.substring(1), 10);
    dice.push({ count, sides });
  });
  
  return dice;
}

/**
 * Parse modifier from a normalized expression
 * Supports complex expressions like "2d6+2+1d4" with multiple modifiers
 * 
 * @param expression - Normalized dice expression
 * @returns Modifier value (positive or negative)
 */
function parseModifier(expression: string): number {
  let totalModifier = 0;
  
  // Use the TERM pattern to match all terms and filter for numbers (modifiers)
  const matches = Array.from(expression.matchAll(DICE_PATTERNS.TERM));
  
  for (const match of matches) {
    const sign = match[1] || '+'; // Default to positive if no sign
    const numberStr = match[4]; // Plain number (modifier)
    
    // Only process plain numbers as modifiers
    if (numberStr) {
      const value = parseInt(numberStr, 10);
      
      if (isNaN(value)) {
        continue;
      }
      
      totalModifier += sign === '+' ? value : -value;
    }
  }
  
  return totalModifier;
}

/**
 * Validate parsed dice components and modifier
 * 
 * @param dice - Array of parsed dice
 * @param modifier - Parsed modifier value
 * @param config - Dice configuration for limits
 * @returns DiceError if validation fails, null if valid
 */
function validateComponents(
  dice: Die[], 
  modifier: number, 
  config: DiceRollConfig
): DiceError | null {
  // Check total dice count
  const totalDiceCount = dice.reduce((sum, die) => sum + die.count, 0);
  
  if (totalDiceCount > config.maxDiceCount) {
    return {
      type: 'INVALID_DIE_COUNT',
      message: `Total dice count ${totalDiceCount} exceeds maximum allowed ${config.maxDiceCount}`,
      count: totalDiceCount,
    };
  }
  
  // Check modifier limits
  if (Math.abs(modifier) > config.maxModifier) {
    return {
      type: 'MODIFIER_TOO_LARGE',
      message: `Modifier ${modifier} exceeds maximum allowed ±${config.maxModifier}`,
      modifier: modifier,
    };
  }
  
  // Check complexity (combination of dice types and total dice)
  // Use a more reasonable complexity calculation that doesn't penalize simple large dice counts
  const complexityScore = dice.length * 5 + Math.min(totalDiceCount, 100);
  if (complexityScore > 200) {
    return {
      type: 'EXPRESSION_TOO_COMPLEX',
      message: `Dice expression is too complex (score: ${complexityScore})`,
      complexity: complexityScore,
    };
  }
  
  // Must have at least dice or a modifier
  if (dice.length === 0 && modifier === 0) {
    return {
      type: 'INVALID_EXPRESSION',
      message: 'Expression must contain at least dice or a modifier',
      expression: 'empty',
    };
  }
  
  return null;
}

/**
 * Check if a string looks like a dice expression
 * Useful for quick validation before full parsing
 * Supports complex expressions like "2d6+2+1d4"
 * 
 * @param text - Text to check
 * @returns True if text appears to be a dice expression
 */
export function isDiceExpression(text: string): boolean {
  if (typeof text !== 'string') {
    return false;
  }
  
  const cleaned = text.replace(/\s+/g, '').toLowerCase();
  
  // Check for dice patterns or standalone modifiers using the complex expression pattern
  return DICE_PATTERNS.COMPLEX_EXPRESSION.test(cleaned) && (
    /d\d+/.test(cleaned) || // Contains dice notation
    /^[+-]?\d+$/.test(cleaned) // Is a standalone number/modifier
  );
}

/**
 * Extract dice expressions from text content
 * Useful for finding rollable expressions within larger text blocks
 * Supports complex expressions like "2d6+2+1d4"
 * 
 * @param text - Text to search for dice expressions
 * @returns Array of found dice expression strings
 */
export function extractDiceExpressions(text: string): string[] {
  const expressions: string[] = [];
  
  // Enhanced pattern to match complex dice expressions in text
  // Matches sequences like "2d6+2+1d4", "1d20-1", "3d8", "+5", etc.
  const extractPattern = /(?:^|\s|[(\[{])((?:[+-]?(?:(?:\d*d\d+)|(?:\d+))(?:[+-](?:(?:\d*d\d+)|(?:\d+)))*))(?=\s|$|[)\]}.,;!?])/gi;
  
  let match;
  while ((match = extractPattern.exec(text)) !== null) {
    const candidate = match[1].trim();
    if (isDiceExpression(candidate)) {
      expressions.push(candidate);
    }
  }
  
  return expressions;
}

/**
 * Roll a dice expression and return the complete result
 * 
 * @param expression - Dice expression string or parsed DiceExpression object
 * @param rollType - Type of roll (normal, advantage, disadvantage, critical)
 * @param config - Optional configuration for dice limits
 * @returns Complete dice roll result
 */
export function rollDiceExpression(
  expression: string | DiceExpression,
  rollType: 'normal' | 'advantage' | 'disadvantage' | 'critical' = 'normal',
  config: DiceRollConfig = DEFAULT_DICE_CONFIG
): DiceRollResult {
  // Parse expression if it's a string
  const diceExpression = typeof expression === 'string' 
    ? parseDiceExpression(expression, config)
    : expression;

  // Roll all dice
  const rolls = rollAllDice(diceExpression.dice);
  
  // Apply roll type modifications
  const modifiedRolls = applyRollTypeModifications(rolls, rollType, diceExpression.dice);
  
  // Calculate breakdown by die type
  const breakdown = calculateBreakdown(diceExpression.dice, modifiedRolls);
  
  // Calculate total
  const diceTotal = modifiedRolls.reduce((sum, roll) => sum + roll.value, 0);
  const total = diceTotal + diceExpression.modifier;
  
  return {
    expression: diceExpression,
    rolls: modifiedRolls,
    modifier: diceExpression.modifier,
    total,
    breakdown,
    timestamp: new Date(),
    rollType,
  };
}

/**
 * Roll all dice in a dice expression
 * 
 * @param dice - Array of dice to roll
 * @returns Array of individual roll results
 */
function rollAllDice(dice: Die[]): SingleRoll[] {
  const rolls: SingleRoll[] = [];
  
  for (const die of dice) {
    for (let i = 0; i < die.count; i++) {
      const roll = rollSingleDie(die.sides);
      rolls.push(roll);
    }
  }
  
  return rolls;
}

/**
 * Roll a single die with the specified number of sides
 * 
 * @param sides - Number of sides on the die
 * @returns Single roll result
 */
function rollSingleDie(sides: number): SingleRoll {
  const value = Math.floor(Math.random() * sides) + 1;
  
  return {
    value,
    sides,
    isCritical: value === sides,
  };
}

/**
 * Apply roll type modifications (advantage, disadvantage, critical)
 * 
 * @param rolls - Original roll results
 * @param rollType - Type of modification to apply
 * @param dice - Original dice specification for critical calculations
 * @returns Modified roll results with advantage/disadvantage d6 or critical bonus as separate roll
 */
function applyRollTypeModifications(
  rolls: SingleRoll[], 
  rollType: 'normal' | 'advantage' | 'disadvantage' | 'critical',
  dice?: Die[]
): SingleRoll[] {
  let modifiedRolls = [...rolls];
  
  switch (rollType) {
    case 'advantage':
      // Add d6 to the roll (Daggerheart mechanics)
      const advantageRoll = rollSingleDie(6);
      modifiedRolls.push({
        ...advantageRoll,
        // Mark as advantage roll for breakdown identification
        sides: -6, // Use negative sides to identify as advantage d6
      });
      break;
      
    case 'disadvantage':
      // Subtract d6 from the roll (Daggerheart mechanics)
      const disadvantageRoll = rollSingleDie(6);
      modifiedRolls.push({
        ...disadvantageRoll,
        value: -disadvantageRoll.value, // Negative value for subtraction
        // Mark as disadvantage roll for breakdown identification
        sides: -6, // Use negative sides to identify as disadvantage d6
      });
      break;
      
    case 'critical':
      // Mark all existing rolls as critical and add maximum value of base die for each base die rolled (Daggerheart mechanics)
      if (dice && dice.length > 0) {
        const baseDie = dice[0]; // First die type is the base die
        
        // Mark all base dice rolls as critical
        for (let i = 0; i < modifiedRolls.length; i++) {
          if (modifiedRolls[i].sides === baseDie.sides) {
            modifiedRolls[i] = { ...modifiedRolls[i], isCritical: true };
          }
        }
        
        // Add one critical bonus roll for each base die
        for (let i = 0; i < baseDie.count; i++) {
          modifiedRolls.push({
            value: baseDie.sides, // Max value of the die
            sides: -baseDie.sides, // Use negative sides to identify as critical bonus
            isCritical: true,
          });
        }
      }
      break;
      
    case 'normal':
    default:
      // No modifications
      break;
  }
  
  return modifiedRolls;
}

/**
 * Calculate breakdown of rolls by die type
 * 
 * @param dice - Original dice specification
 * @param rolls - All roll results
 * @returns Breakdown by die type with separate advantage/disadvantage entries
 */
function calculateBreakdown(dice: Die[], rolls: SingleRoll[]): DiceBreakdown[] {
  const breakdown: DiceBreakdown[] = [];
  let rollIndex = 0;
  
  // Process regular dice from the original expression
  for (const die of dice) {
    const dieRolls = rolls.slice(rollIndex, rollIndex + die.count);
    const values = dieRolls.map(roll => roll.value);
    const subtotal = values.reduce((sum, value) => sum + value, 0);
    
    breakdown.push({
      dieSpec: `${die.count}d${die.sides}`,
      values,
      subtotal,
    });
    
    rollIndex += die.count;
  }
  
  // Handle advantage/disadvantage/critical dice (identified by negative sides)
  const extraRolls = rolls.slice(rollIndex);
  
  // Group critical rolls and other special rolls
  const criticalRolls: SingleRoll[] = [];
  const otherExtraRolls: SingleRoll[] = [];
  
  for (const extraRoll of extraRolls) {
    if (extraRoll.isCritical) {
      criticalRolls.push(extraRoll);
    } else if (extraRoll.sides === -6) {
      otherExtraRolls.push(extraRoll);
    }
  }
  
  // Process advantage/disadvantage
  for (const extraRoll of otherExtraRolls) {
    const isAdvantage = extraRoll.value > 0;
    
    breakdown.push({
      dieSpec: isAdvantage ? 'advantage' : 'disadvantage',
      values: [Math.abs(extraRoll.value)], // Show absolute value in breakdown
      subtotal: extraRoll.value, // Keep actual value (positive/negative) for subtotal
    });
  }
  
  // Process critical rolls (group them together)
  if (criticalRolls.length > 0) {
    const baseDieSides = Math.abs(criticalRolls[0].sides);
    const criticalValues = criticalRolls.map(roll => roll.value);
    const criticalSubtotal = criticalValues.reduce((sum, value) => sum + value, 0);
    
    breakdown.push({
      dieSpec: 'critical',
      values: criticalValues, // Show all individual max values
      subtotal: criticalSubtotal,
    });
  }
  
  return breakdown;
}

/**
 * Check if a dice expression can have critical applied
 * 
 * @param expression - Dice expression or result to check
 * @returns True if critical can be applied (base die is not d20)
 */
export function canApplyCritical(expression: string | DiceExpression | DiceRollResult): boolean {
  let diceExpression: DiceExpression;
  
  if (typeof expression === 'string') {
    diceExpression = parseDiceExpression(expression);
  } else if ('expression' in expression) {
    // It's a DiceRollResult
    diceExpression = expression.expression;
  } else {
    // It's already a DiceExpression
    diceExpression = expression;
  }
  
  // Check if the first (base) die is a d20
  if (diceExpression.dice.length === 0) {
    return false;
  }
  
  const baseDie = diceExpression.dice[0];
  return baseDie.sides !== 20;
}

/**
 * Apply advantage/disadvantage/critical to an existing roll result
 * 
 * @param existingResult - The existing roll result to modify
 * @param rollType - The type of modification to apply ('advantage', 'disadvantage', or 'critical')
 * @returns New roll result with roll type applied to existing rolls
 */
export function applyRollTypeToExistingResult(
  existingResult: DiceRollResult,
  rollType: 'advantage' | 'disadvantage' | 'critical'
): DiceRollResult {
  // Don't modify if it's already the same roll type
  if (existingResult.rollType === rollType) {
    return existingResult;
  }

  // Check for exclusivity - only critical is exclusive with advantage/disadvantage
  if (existingResult.rollType && existingResult.rollType !== 'normal' && existingResult.rollType !== rollType) {
    // Allow switching between advantage and disadvantage
    if ((existingResult.rollType === 'advantage' && rollType === 'disadvantage') ||
        (existingResult.rollType === 'disadvantage' && rollType === 'advantage')) {
      // Continue to apply the new roll type
    } else if (rollType === 'critical' || existingResult.rollType === 'critical') {
      // Critical is exclusive with advantage/disadvantage
      return existingResult;
    } else {
      // Other combinations are not allowed
      return existingResult;
    }
  }

  // For critical, also check if it's applicable (not d20 base die)
  if (rollType === 'critical' && !canApplyCritical(existingResult)) {
    return existingResult;
  }

  // Remove any existing advantage/disadvantage/critical modifications
  const originalRolls = existingResult.rolls.filter(roll => roll.sides > 0);
  
  // Apply new roll type modifications to the original rolls
  const modifiedRolls = applyRollTypeModifications(originalRolls, rollType, existingResult.expression.dice);
  
  // Calculate new breakdown
  const breakdown = calculateBreakdown(existingResult.expression.dice, modifiedRolls);
  
  // Calculate new total
  const diceTotal = modifiedRolls.reduce((sum, roll) => sum + roll.value, 0);
  const total = diceTotal + existingResult.modifier;
  
  return {
    ...existingResult,
    rolls: modifiedRolls,
    total,
    breakdown,
    rollType,
    timestamp: new Date(),
  };
}

/**
 * Roll with advantage - adds d6 to the result
 * 
 * @param expression - Dice expression to roll
 * @param config - Optional configuration
 * @returns Roll result with advantage applied
 */
export function rollWithAdvantage(
  expression: string | DiceExpression,
  config?: DiceRollConfig
): DiceRollResult {
  return rollDiceExpression(expression, 'advantage', config);
}

/**
 * Roll with disadvantage - subtracts d6 from the result
 * 
 * @param expression - Dice expression to roll
 * @param config - Optional configuration
 * @returns Roll result with disadvantage applied
 */
export function rollWithDisadvantage(
  expression: string | DiceExpression,
  config?: DiceRollConfig
): DiceRollResult {
  return rollDiceExpression(expression, 'disadvantage', config);
}

/**
 * Roll critical - adds maximum die value to each die rolled
 * 
 * @param expression - Dice expression to roll
 * @param config - Optional configuration
 * @returns Roll result with critical applied
 */
export function rollCritical(
  expression: string | DiceExpression,
  config?: DiceRollConfig
): DiceRollResult {
  return rollDiceExpression(expression, 'critical', config);
}

/**
 * Get the theoretical minimum and maximum values for a dice expression
 * 
 * @param expression - Dice expression to analyze
 * @returns Object with min and max possible values
 */
export function getDiceRange(expression: string | DiceExpression): { min: number; max: number } {
  const diceExpression = typeof expression === 'string' 
    ? parseDiceExpression(expression)
    : expression;
  
  let min = 0;
  let max = 0;
  
  // Calculate min/max for each die type
  for (const die of diceExpression.dice) {
    min += die.count * 1; // Minimum roll is 1 per die
    max += die.count * die.sides; // Maximum roll is die sides per die
  }
  
  // Add modifier
  min += diceExpression.modifier;
  max += diceExpression.modifier;
  
  return { min, max };
}

/**
 * Get the average expected value for a dice expression
 * 
 * @param expression - Dice expression to analyze
 * @returns Expected average value
 */
export function getDiceAverage(expression: string | DiceExpression): number {
  const diceExpression = typeof expression === 'string' 
    ? parseDiceExpression(expression)
    : expression;
  
  let average = 0;
  
  // Calculate average for each die type
  for (const die of diceExpression.dice) {
    const dieAverage = (die.sides + 1) / 2; // Average of 1 to N
    average += die.count * dieAverage;
  }
  
  // Add modifier
  average += diceExpression.modifier;
  
  return average;
}

/**
 * Quick validation check - returns true if expression is valid
 * Useful for UI validation without needing full error details
 * 
 * @param expression - Dice expression to validate
 * @param config - Optional configuration for limits
 * @returns True if valid, false if invalid
 */
export function isValidDiceExpression(
  expression: string,
  config: DiceRollConfig = DEFAULT_DICE_CONFIG
): boolean {
  return validateDiceExpression(expression, config).isValid;
}

/**
 * Get a user-friendly error message for a dice expression
 * 
 * @param expression - Dice expression to validate
 * @param config - Optional configuration for limits
 * @returns User-friendly error message or null if valid
 */
export function getDiceExpressionError(
  expression: string,
  config: DiceRollConfig = DEFAULT_DICE_CONFIG
): string | null {
  const validation = validateDiceExpression(expression, config);
  
  if (validation.isValid) {
    return null;
  }
  
  return formatDiceError(validation.error!);
}

/**
 * Format a DiceError into a user-friendly message
 * 
 * @param error - The dice error to format
 * @returns Formatted error message
 */
export function formatDiceError(error: DiceError): string {
  switch (error.type) {
    case 'INVALID_EXPRESSION':
      if (error.expression === 'empty') {
        return 'Please enter a dice expression (e.g., "2d6+3", "d20", or "+5")';
      }
      return `Invalid dice expression: "${error.expression}". Try formats like "2d6+3", "d20-1", or "+5"`;
      
    case 'INVALID_DIE_COUNT':
      if (error.count > DEFAULT_DICE_CONFIG.maxDiceCount) {
        return `Too many dice (${error.count}). Maximum allowed is ${DEFAULT_DICE_CONFIG.maxDiceCount}`;
      }
      return `Invalid number of dice: ${error.count}. Must be at least 1`;
      
    case 'INVALID_DIE_SIDES':
      if (error.sides > DEFAULT_DICE_CONFIG.maxDieSides) {
        return `Die too large (d${error.sides}). Maximum allowed is d${DEFAULT_DICE_CONFIG.maxDieSides}`;
      }
      return `Invalid die size: d${error.sides}. Dice must have at least 2 sides`;
      
    case 'MODIFIER_TOO_LARGE':
      return `Modifier too large (${error.modifier >= 0 ? '+' : ''}${error.modifier}). Maximum allowed is ±${DEFAULT_DICE_CONFIG.maxModifier}`;
      
    case 'EXPRESSION_TOO_COMPLEX':
      return `Dice expression is too complex. Try using fewer dice or simpler combinations`;
      
    case 'UNKNOWN_ERROR':
    default:
      return error.message || 'Unknown error occurred while parsing dice expression';
  }
}

/**
 * Validate multiple dice expressions at once
 * Useful for batch validation of expressions
 * 
 * @param expressions - Array of dice expressions to validate
 * @param config - Optional configuration for limits
 * @returns Array of validation results in the same order
 */
export function validateMultipleDiceExpressions(
  expressions: string[],
  config: DiceRollConfig = DEFAULT_DICE_CONFIG
): DiceValidationResult[] {
  return expressions.map(expr => validateDiceExpression(expr, config));
}

/**
 * Get suggestions for fixing malformed dice expressions
 * 
 * @param expression - The malformed expression
 * @returns Array of suggested corrections
 */
export function getDiceExpressionSuggestions(expression: string): string[] {
  const suggestions: string[] = [];
  const cleaned = expression.replace(/\s+/g, '').toLowerCase();
  
  // Common mistakes and suggestions
  if (cleaned.includes('dice') || cleaned.includes('die')) {
    suggestions.push('Use "d" notation instead of words (e.g., "2d6" instead of "2 dice")');
  }
  
  if (cleaned.includes('x') || cleaned.includes('*')) {
    suggestions.push('Use "d" for dice notation (e.g., "2d6" instead of "2x6" or "2*6")');
  }
  
  if (/\d+\s*-\s*\d+/.test(cleaned) && !cleaned.includes('d')) {
    suggestions.push('Did you mean a die range? Use "d" notation (e.g., "1d6" instead of "1-6")');
  }
  
  if (cleaned.includes('.') || cleaned.includes(',')) {
    suggestions.push('Remove decimal points and commas. Use whole numbers only');
  }
  
  if (/[a-z]+\d+/.test(cleaned) && !cleaned.includes('d')) {
    suggestions.push('Use "d" for dice notation (e.g., "d20" instead of "D20" or "die20")');
  }
  
  if (cleaned.match(/^\d+$/) && parseInt(cleaned) > 1) {
    const num = parseInt(cleaned);
    if (num <= 100) {
      suggestions.push(`Did you mean "d${num}" (roll 1 die with ${num} sides)?`);
      suggestions.push(`Or did you mean "+${num}" (add ${num} as a modifier)?`);
    }
  }
  
  if (cleaned.includes('++') || cleaned.includes('--')) {
    suggestions.push('Use single + or - for modifiers (e.g., "2d6+3" instead of "2d6++3")');
  }
  
  // If no specific suggestions, provide general help
  if (suggestions.length === 0) {
    suggestions.push('Try formats like: "2d6+3" (dice + modifier), "d20" (single die), or "+5" (modifier only)');
  }
  
  return suggestions;
}

/**
 * Sanitize user input for dice expressions
 * Removes common problematic characters and normalizes format
 * 
 * @param input - Raw user input
 * @returns Sanitized expression string
 */
export function sanitizeDiceInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input
    // Remove extra whitespace
    .replace(/\s+/g, '')
    // Convert common alternatives to standard notation
    .replace(/[xX×]/g, 'd')  // x, X, × to d
    .replace(/[Dd](?=[0-9])/g, 'd')  // D to d
    // Remove problematic characters
    .replace(/[^\d+\-d]/g, '')
    // Fix double operators
    .replace(/\+\+/g, '+')
    .replace(/--/g, '-')
    .replace(/\+-/g, '-')
    .replace(/-\+/g, '-')
    // Ensure proper format
    .toLowerCase();
  
  // Remove leading/trailing operators
  sanitized = sanitized.replace(/^[+\-]+/, '').replace(/[+\-]+$/, '');
  
  return sanitized;
}

/**
 * Check if an expression contains potentially dangerous patterns
 * (Very large numbers, excessive complexity, etc.)
 * 
 * @param expression - Expression to check for safety
 * @returns Object with safety status and warnings
 */
export function checkDiceExpressionSafety(expression: string): {
  isSafe: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check for extremely large numbers
  const largeNumbers = expression.match(/\d{4,}/g);
  if (largeNumbers) {
    warnings.push(`Very large numbers detected: ${largeNumbers.join(', ')}`);
  }
  
  // Check for excessive dice count
  const diceMatches = expression.match(/(\d+)d/g);
  if (diceMatches) {
    for (const match of diceMatches) {
      const count = parseInt(match.replace('d', ''));
      if (count > 50) {
        warnings.push(`High dice count: ${count}d (this may be slow to calculate)`);
      }
    }
  }
  
  // Check for very complex expressions
  const complexity = (expression.match(/d/g) || []).length + (expression.match(/[+\-]/g) || []).length;
  if (complexity > 10) {
    warnings.push('Very complex expression (may be slow to process)');
  }
  
  const isSafe = warnings.length === 0;
  
  return { isSafe, warnings };
}

/**
 * Helper functions migrated from data/utilities/dice.ts
 */

/**
 * Get die type by name
 */
export function getDieTypeByName(name: string): DieType | undefined {
  return STANDARD_DICE.find(die => die.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get common dice types only
 */
export function getCommonDice(): DieType[] {
  return STANDARD_DICE.filter(die => die.common);
}

/**
 * Roll multiple dice of the same type (migrated from data/utilities/dice.ts)
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @returns Array of roll results
 */
export function rollMultipleDice(count: number, sides: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
} 