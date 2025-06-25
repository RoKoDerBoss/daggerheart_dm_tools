/**
 * Dice Components Export Index
 * Centralized exports for all dice-related components and utilities
 */

// Core Dice Components
export { DiceRoller } from '../DiceRoller';
export { default as DiceRollerDefault } from '../DiceRoller';
export { DiceResultHoverCard } from '../DiceResultHoverCard';
export { RollHistoryDisplay } from '../RollHistoryDisplay';

// Dice Hooks
export { useDiceRollHistory } from '../../hooks/useDiceRollHistory';

// Dice Types
export type {
  DiceRollerProps,
  DiceResultHoverCardProps,
  DiceRollResult,
  DiceExpression,
  DiceError,
  DiceValidationResult,
  Die,
  DiceRollConfig,
  SingleRoll,
  DiceBreakdown,
  RollHistoryEntry,
  RollAction,
  UseDiceRollHistoryReturn
} from '../../types/dice';

// Integration Test Components moved to src/test/

// Re-export dice utilities for convenience
export * from '../../lib/dice-utils';

/**
 * Convenience exports for common use cases
 */
import { DiceRoller } from '../DiceRoller';
import { DiceResultHoverCard } from '../DiceResultHoverCard';
import { RollHistoryDisplay } from '../RollHistoryDisplay';
import { useDiceRollHistory } from '../../hooks/useDiceRollHistory';

// Complete dice system bundle
export const DiceSystem = {
  DiceRoller,
  DiceResultHoverCard,
  RollHistoryDisplay,
  useDiceRollHistory,
} as const; 