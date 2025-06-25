/**
 * TypeScript type definitions for dice rolling system
 * Supports Daggerheart RPG dice mechanics including critical rolls and advantage/disadvantage
 */

/**
 * Represents a single die in a dice expression
 */
export interface Die {
  /** Number of dice to roll */
  count: number;
  /** Number of sides on each die */
  sides: number;
}

/**
 * Represents a parsed dice expression with all components
 */
export interface DiceExpression {
  /** Array of dice components (e.g., 2d6, 1d8) */
  dice: Die[];
  /** Static modifier to add/subtract from total */
  modifier: number;
  /** Original string expression that was parsed */
  originalExpression: string;
}

/**
 * Result of rolling a single die
 */
export interface SingleRoll {
  /** The value rolled */
  value: number;
  /** Number of sides on the die */
  sides: number;
  /** Whether this was a critical roll (max value) */
  isCritical: boolean;
}

/**
 * Complete result of rolling a dice expression
 */
export interface DiceRollResult {
  /** Original dice expression that was rolled */
  expression: DiceExpression;
  /** Individual roll results for each die */
  rolls: SingleRoll[];
  /** Static modifier applied */
  modifier: number;
  /** Total result including all dice and modifiers */
  total: number;
  /** Breakdown of totals per die type */
  breakdown: DiceBreakdown[];
  /** Timestamp when the roll occurred */
  timestamp: Date;
  /** Whether this roll included advantage/disadvantage */
  rollType: 'normal' | 'advantage' | 'disadvantage' | 'critical';
}

/**
 * Breakdown of rolls by die type for display purposes
 */
export interface DiceBreakdown {
  /** Die specification (e.g., "2d6") */
  dieSpec: string;
  /** Individual roll values */
  values: number[];
  /** Subtotal for this die type */
  subtotal: number;
}

/**
 * Error states for dice expression parsing and rolling
 */
export type DiceError = 
  | { type: 'INVALID_EXPRESSION'; message: string; expression: string }
  | { type: 'INVALID_DIE_COUNT'; message: string; count: number }
  | { type: 'INVALID_DIE_SIDES'; message: string; sides: number }
  | { type: 'MODIFIER_TOO_LARGE'; message: string; modifier: number }
  | { type: 'EXPRESSION_TOO_COMPLEX'; message: string; complexity: number }
  | { type: 'UNKNOWN_ERROR'; message: string };

/**
 * Validation result for dice expressions
 */
export interface DiceValidationResult {
  /** Whether the expression is valid */
  isValid: boolean;
  /** Error details if invalid */
  error?: DiceError;
  /** Parsed expression if valid */
  expression?: DiceExpression;
}

/**
 * Configuration for dice rolling behavior
 */
export interface DiceRollConfig {
  /** Whether to highlight critical rolls */
  highlightCriticals: boolean;
  /** Maximum number of dice allowed in a single expression */
  maxDiceCount: number;
  /** Maximum die size allowed */
  maxDieSides: number;
  /** Maximum modifier value allowed */
  maxModifier: number;
}

/**
 * Roll history entry for session persistence
 */
export interface RollHistoryEntry {
  /** Unique identifier for the roll */
  id: string;
  /** The roll result */
  result: DiceRollResult;
  /** Context where the roll was made (optional) */
  context?: string;
}

/**
 * Props for dice roller components
 */
export interface DiceRollerProps {
  /** Children containing dice expression text */
  children: React.ReactNode;
  /** Optional click handler override */
  onClick?: (result: DiceRollResult) => void;
  /** Optional error handler */
  onError?: (error: DiceError) => void;
  /** Whether to show roll history */
  showHistory?: boolean;
  /** Custom styling classes */
  className?: string;
  /** Whether component is disabled */
  disabled?: boolean;
  /** Custom ARIA label for the dice roller group */
  ariaLabel?: string;
  /** Custom description for screen readers */
  ariaDescription?: string;
  /** Whether to enable keyboard shortcuts (default: true) */
  enableKeyboardShortcuts?: boolean;
  /** Whether to announce roll results to screen readers (default: true) */
  announceResults?: boolean;
  /** Whether to use compact mobile layout (default: auto-detect) */
  compactMobile?: boolean;
  /** Custom mobile breakpoint in pixels (default: 640) */
  mobileBreakpoint?: number;
  /** Whether to show detailed results with hover card (default: true) */
  showDetailedResults?: boolean;
}

/**
 * Props for dice result hover card
 */
export interface DiceResultHoverCardProps {
  /** The dice roll result to display */
  result: DiceRollResult;
  /** Whether the card is open */
  open: boolean;
  /** Handler for card open/close state */
  onOpenChange: (open: boolean) => void;
  /** Trigger element for the hover card */
  children: React.ReactNode;
  /** Optional callback for roll actions */
  onRollAction?: (action: RollAction, expression: string) => void;
}

/**
 * Available actions in the dice result hover card
 */
export type RollAction = 
  | 'roll-again'
  | 'roll-reset'
  | 'roll-critical'
  | 'roll-advantage'
  | 'roll-disadvantage'
  | 'copy-result'
  | 'edit-expression'
  | 'remove-from-history';

/**
 * Hook return type for dice roll history management
 */
export interface UseDiceRollHistoryReturn {
  /** Current roll history */
  history: RollHistoryEntry[];
  /** Add a new roll to history */
  addRoll: (result: DiceRollResult, context?: string) => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Remove a specific roll from history */
  removeRoll: (id: string) => void;
  /** Get a specific roll by ID */
  getRoll: (id: string) => RollHistoryEntry | undefined;
  /** Whether history is at maximum capacity */
  isHistoryFull: boolean;
} 