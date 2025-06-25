# Dice Roller System - API Reference

Complete API documentation for all components, hooks, utilities, and types in the Daggerheart dice roller system.

## 📋 Table of Contents

1. [Components](#components)
2. [Hooks](#hooks)
3. [Utilities](#utilities)
4. [Types](#types)
5. [Constants](#constants)
6. [Error Handling](#error-handling)

## 🎲 Components

### DiceRoller

The main component for creating interactive dice rolling elements.

#### Props

```typescript
interface DiceRollerProps {
  children: React.ReactNode;
  onClick?: (result: DiceRollResult) => void;
  onError?: (error: DiceError) => void;
  showHistory?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  enableKeyboardShortcuts?: boolean;
  announceResults?: boolean;
  compactMobile?: boolean;
  mobileBreakpoint?: number;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Text content containing dice expressions |
| `onClick` | `(result: DiceRollResult) => void` | `undefined` | Custom roll result handler |
| `onError` | `(error: DiceError) => void` | `undefined` | Error handler for invalid expressions |
| `showHistory` | `boolean` | `false` | Whether to show roll history |
| `className` | `string` | `undefined` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable all rolling functionality |
| `ariaLabel` | `string` | Auto-generated | Custom ARIA label for accessibility |
| `ariaDescription` | `string` | `undefined` | Additional description for screen readers |
| `enableKeyboardShortcuts` | `boolean` | `true` | Enable Ctrl+R and Enter shortcuts |
| `announceResults` | `boolean` | `true` | Announce results to screen readers |
| `compactMobile` | `boolean` | `false` | Use compact layout on mobile |
| `mobileBreakpoint` | `number` | `640` | Mobile breakpoint in pixels |

#### Usage Examples

```typescript
// Basic usage
<DiceRoller>Roll 2d6+3 for damage</DiceRoller>

// With custom handler
<DiceRoller onClick={(result) => console.log(result)}>
  Attack: 1d20+5
</DiceRoller>

// With error handling
<DiceRoller 
  onError={(error) => alert(error.message)}
  ariaLabel="Roll initiative"
>
  1d20+2
</DiceRoller>

// Disabled state
<DiceRoller disabled>2d6+3</DiceRoller>
```

#### Keyboard Shortcuts

- **Ctrl+R** (or **Cmd+R** on Mac): Roll the first dice expression
- **Enter**: Roll when the component container is focused
- **Tab**: Navigate to dice buttons
- **Space/Enter**: Activate focused dice button

#### Accessibility Features

- Automatic ARIA labels for all interactive elements
- Screen reader announcements for roll results
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure

---

### DiceResultHoverCard

A specialized hover card for displaying detailed dice roll results with action buttons.

#### Props

```typescript
interface DiceResultHoverCardProps {
  result: DiceRollResult;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  onRollAction?: (action: RollAction, expression: string) => void;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `result` | `DiceRollResult` | **Required** | The dice roll result to display |
| `open` | `boolean` | `undefined` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Open state change handler |
| `children` | `React.ReactNode` | **Required** | Trigger element |
| `onRollAction` | `(action: RollAction, expression: string) => void` | `undefined` | Action button handler |

#### Available Actions

```typescript
type RollAction = 
  | 'roll-again'      // Roll the same expression again
  | 'roll-critical'   // Add maximum die value to result
  | 'roll-advantage'  // Add d6 to the roll
  | 'roll-disadvantage' // Subtract d6 from the roll
  | 'copy-result'     // Copy result to clipboard
  | 'edit-expression' // Edit the dice expression
  | 'remove-from-history'; // Remove from roll history
```

#### Usage Examples

```typescript
// Basic usage
<DiceResultHoverCard 
  result={rollResult}
  onRollAction={(action, expression) => {
    console.log(`Action: ${action}, Expression: ${expression}`);
  }}
>
  <button>View Roll Details</button>
</DiceResultHoverCard>

// Controlled state
const [isOpen, setIsOpen] = useState(false);

<DiceResultHoverCard
  result={rollResult}
  open={isOpen}
  onOpenChange={setIsOpen}
  onRollAction={handleRollAction}
>
  <span className="underline cursor-pointer">
    Rolled: {rollResult.total}
  </span>
</DiceResultHoverCard>
```

---

### RollHistoryDisplay

A component for displaying and managing dice roll history.

#### Props

```typescript
interface RollHistoryDisplayProps {
  onRollAction?: (action: RollAction, expression: string, entry: RollHistoryEntry) => void;
  className?: string;
  compact?: boolean;
  maxDisplayEntries?: number;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRollAction` | `(action: RollAction, expression: string, entry: RollHistoryEntry) => void` | `undefined` | Handler for roll actions |
| `className` | `string` | `undefined` | Additional CSS classes |
| `compact` | `boolean` | `false` | Use compact display mode |
| `maxDisplayEntries` | `number` | `10` | Maximum entries to display |

#### Usage Examples

```typescript
// Basic usage
<RollHistoryDisplay />

// With custom handler
<RollHistoryDisplay 
  onRollAction={(action, expression, entry) => {
    if (action === 'roll-again') {
      // Handle re-roll
    }
  }}
  maxDisplayEntries={5}
  compact={true}
/>
```

## 🪝 Hooks

### useDiceRollHistory

A custom hook for managing dice roll history with sessionStorage persistence.

#### Return Value

```typescript
interface UseDiceRollHistoryReturn {
  rollHistory: RollHistoryEntry[];
  addRoll: (result: DiceRollResult, context?: string) => void;
  removeRoll: (id: string) => void;
  clearHistory: () => void;
  getHistoryStats: () => HistoryStats;
}
```

#### Methods

##### `addRoll(result, context?)`

Adds a new roll to the history.

```typescript
const { addRoll } = useDiceRollHistory();

addRoll(rollResult, 'Combat damage roll');
```

##### `removeRoll(id)`

Removes a specific roll from history.

```typescript
const { removeRoll } = useDiceRollHistory();

removeRoll('roll-id-123');
```

##### `clearHistory()`

Clears all roll history.

```typescript
const { clearHistory } = useDiceRollHistory();

clearHistory();
```

##### `getHistoryStats()`

Returns statistics about the roll history.

```typescript
const { getHistoryStats } = useDiceRollHistory();

const stats = getHistoryStats();
// Returns: { totalRolls, averageRoll, highestRoll, lowestRoll }
```

#### Usage Examples

```typescript
// Basic usage
const { rollHistory, addRoll, clearHistory } = useDiceRollHistory();

// Add a roll
const handleRoll = (result: DiceRollResult) => {
  addRoll(result, 'Initiative roll');
};

// Display history
return (
  <div>
    <button onClick={clearHistory}>Clear History</button>
    {rollHistory.map(entry => (
      <div key={entry.id}>
        {entry.context}: {entry.result.total}
      </div>
    ))}
  </div>
);
```

## 🔧 Utilities

### validateDiceExpression

Validates a dice expression and returns detailed validation results.

```typescript
function validateDiceExpression(expression: string): DiceValidationResult
```

#### Parameters

- `expression` (string): The dice expression to validate

#### Returns

```typescript
interface DiceValidationResult {
  isValid: boolean;
  expression?: DiceExpression;
  error?: DiceError;
}
```

#### Usage Examples

```typescript
import { validateDiceExpression } from '@/components/dice';

// Valid expression
const result1 = validateDiceExpression('2d6+3');
// { isValid: true, expression: { ... } }

// Invalid expression
const result2 = validateDiceExpression('invalid');
// { isValid: false, error: { type: 'INVALID_FORMAT', message: '...' } }
```

---

### rollDiceExpression

Rolls dice based on a dice expression and returns the result.

```typescript
function rollDiceExpression(expression: string): DiceRollResult
```

#### Parameters

- `expression` (string): The dice expression to roll

#### Returns

`DiceRollResult` object with roll details

#### Usage Examples

```typescript
import { rollDiceExpression } from '@/components/dice';

const result = rollDiceExpression('2d6+3');
console.log(result.total); // e.g., 11
console.log(result.rolls); // [{ value: 4, sides: 6 }, { value: 4, sides: 6 }]
console.log(result.modifier); // 3
```

---

### extractDiceExpressions

Extracts all dice expressions from a text string.

```typescript
function extractDiceExpressions(text: string): string[]
```

#### Parameters

- `text` (string): Text to search for dice expressions

#### Returns

Array of dice expression strings found in the text

#### Usage Examples

```typescript
import { extractDiceExpressions } from '@/components/dice';

const text = "Roll 2d6+3 for damage and 1d20 for initiative";
const expressions = extractDiceExpressions(text);
// ['2d6+3', '1d20']
```

---

### isDiceExpression

Checks if a string is a valid dice expression.

```typescript
function isDiceExpression(text: string): boolean
```

#### Parameters

- `text` (string): Text to check

#### Returns

`true` if the text is a valid dice expression, `false` otherwise

#### Usage Examples

```typescript
import { isDiceExpression } from '@/components/dice';

isDiceExpression('2d6+3'); // true
isDiceExpression('hello'); // false
isDiceExpression('1d20'); // true
```

---

### parseDiceExpression

Parses a dice expression into its component parts.

```typescript
function parseDiceExpression(expression: string): DiceExpression | null
```

#### Parameters

- `expression` (string): The dice expression to parse

#### Returns

`DiceExpression` object or `null` if invalid

#### Usage Examples

```typescript
import { parseDiceExpression } from '@/components/dice';

const parsed = parseDiceExpression('2d6+3');
// {
//   originalExpression: '2d6+3',
//   dice: [{ count: 2, sides: 6 }],
//   modifier: 3
// }
```

## 📝 Types

### DiceRollResult

The result of a dice roll operation.

```typescript
interface DiceRollResult {
  total: number;
  rolls: SingleRoll[];
  modifier: number;
  rollType: 'normal' | 'advantage' | 'disadvantage' | 'critical';
  timestamp: number;
  expression: DiceExpression;
}
```

### SingleRoll

Individual die roll result.

```typescript
interface SingleRoll {
  value: number;
  sides: number;
  isCritical?: boolean;
}
```

### DiceExpression

Parsed dice expression structure.

```typescript
interface DiceExpression {
  originalExpression: string;
  dice: Die[];
  modifier: number;
}
```

### Die

Individual die specification.

```typescript
interface Die {
  count: number;
  sides: number;
}
```

### DiceError

Error information for dice operations.

```typescript
interface DiceError {
  type: DiceErrorType;
  message: string;
}

type DiceErrorType = 
  | 'INVALID_FORMAT'
  | 'INVALID_DIE_COUNT'
  | 'INVALID_DIE_SIDES'
  | 'INVALID_MODIFIER'
  | 'EXPRESSION_TOO_COMPLEX'
  | 'UNKNOWN_ERROR';
```

### RollHistoryEntry

Entry in the roll history.

```typescript
interface RollHistoryEntry {
  id: string;
  result: DiceRollResult;
  context?: string;
  timestamp: number;
}
```

### DiceValidationResult

Result of dice expression validation.

```typescript
interface DiceValidationResult {
  isValid: boolean;
  expression?: DiceExpression;
  error?: DiceError;
}
```

### RollAction

Available actions for roll results.

```typescript
type RollAction = 
  | 'roll-again'
  | 'roll-critical'
  | 'roll-advantage'
  | 'roll-disadvantage'
  | 'copy-result'
  | 'edit-expression'
  | 'remove-from-history';
```

## 📊 Constants

### Dice Configuration

```typescript
// Maximum number of dice in a single expression
export const MAX_DICE_COUNT = 100;

// Maximum die sides supported
export const MAX_DIE_SIDES = 1000;

// Maximum modifier value
export const MAX_MODIFIER = 1000;

// Default roll history limit
export const DEFAULT_HISTORY_LIMIT = 50;

// Supported die types
export const STANDARD_DICE = [4, 6, 8, 10, 12, 20, 100] as const;
```

### Regular Expressions

```typescript
// Dice expression pattern
export const DICE_EXPRESSION_REGEX = /(\d*)d(\d+)([+-]\d+)?/gi;

// Complete dice expression validation
export const FULL_DICE_REGEX = /^(\d*d\d+([+-]\d+)?|\+\d+|-\d+)(\s*[+-]\s*(\d*d\d+([+-]\d+)?|\d+))*$/i;
```

## ❌ Error Handling

### Error Types

The system provides detailed error information for different failure scenarios:

#### INVALID_FORMAT
```typescript
// Triggered by: malformed expressions
"2d" // Missing die sides
"d" // Missing die sides and count
"2x6" // Invalid separator
```

#### INVALID_DIE_COUNT
```typescript
// Triggered by: invalid die counts
"0d6" // Zero dice
"1000d6" // Too many dice
```

#### INVALID_DIE_SIDES
```typescript
// Triggered by: invalid die sides
"2d0" // Zero-sided die
"2d1001" // Too many sides
```

#### INVALID_MODIFIER
```typescript
// Triggered by: invalid modifiers
"2d6+1001" // Modifier too large
"2d6+-5" // Invalid modifier format
```

#### EXPRESSION_TOO_COMPLEX
```typescript
// Triggered by: overly complex expressions
"1d6+2d8+3d10+4d12+5d20+6d4" // Too many terms
```

### Error Handling Examples

```typescript
// Component-level error handling
<DiceRoller 
  onError={(error) => {
    switch (error.type) {
      case 'INVALID_FORMAT':
        showToast('Invalid dice format. Use format like "2d6+3"');
        break;
      case 'INVALID_DIE_COUNT':
        showToast('Invalid number of dice');
        break;
      default:
        showToast(`Dice error: ${error.message}`);
    }
  }}
>
  {userInput}
</DiceRoller>

// Utility-level error handling
try {
  const result = rollDiceExpression(userInput);
  console.log(result);
} catch (error) {
  if (error instanceof DiceError) {
    console.error(`Dice error: ${error.type} - ${error.message}`);
  }
}
```

## 🔍 Advanced Usage

### Custom Dice Types

```typescript
// Extend the system for custom dice
const rollCustomDie = (sides: number): number => {
  // Custom rolling logic
  return Math.floor(Math.random() * sides) + 1;
};

// Use with the existing system
const customResult: DiceRollResult = {
  total: rollCustomDie(6),
  rolls: [{ value: rollCustomDie(6), sides: 6 }],
  modifier: 0,
  rollType: 'normal',
  timestamp: Date.now(),
  expression: { originalExpression: '1d6', dice: [{ count: 1, sides: 6 }], modifier: 0 }
};
```

### Batch Operations

```typescript
// Roll multiple expressions at once
const expressions = ['1d20', '2d6+3', '1d8+1'];
const results = expressions.map(expr => rollDiceExpression(expr));

// Add multiple rolls to history
const { addRoll } = useDiceRollHistory();
results.forEach((result, index) => {
  addRoll(result, `Batch roll ${index + 1}`);
});
```

### Integration with External Systems

```typescript
// Export roll data
const exportRollHistory = (history: RollHistoryEntry[]) => {
  const data = history.map(entry => ({
    expression: entry.result.expression.originalExpression,
    result: entry.result.total,
    timestamp: new Date(entry.timestamp).toISOString(),
    context: entry.context
  }));
  
  return JSON.stringify(data, null, 2);
};

// Import roll data
const importRollHistory = (jsonData: string) => {
  const data = JSON.parse(jsonData);
  // Process and add to history
};
```

---

This API reference provides complete documentation for integrating and extending the Daggerheart dice roller system. For usage examples and best practices, see the [Usage Guide](./dice-roller-usage-guide.md). 