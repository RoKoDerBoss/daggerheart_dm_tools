# Dice Roller System - Developer Usage Guide

A comprehensive guide for developers on how to integrate and use the Daggerheart dice roller system in their components and applications.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Components](#core-components)
3. [Usage Examples](#usage-examples)
4. [Advanced Integration](#advanced-integration)
5. [API Reference](#api-reference)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Performance Considerations](#performance-considerations)

## 🚀 Quick Start

### Installation & Setup

The dice roller system is already integrated into the Daggerheart DM Tools. To use it in your components:

```typescript
// Import the components you need
import { DiceRoller, DiceResultHoverCard, useDiceRollHistory } from '@/components/dice';

// Or import from the main components index
import { DiceRoller } from '@/components';
```

### Basic Usage

```typescript
import { DiceRoller } from '@/components/dice';

export function MyComponent() {
  return (
    <div>
      <p>
        The orc attacks for <DiceRoller>2d6+3</DiceRoller> damage!
      </p>
    </div>
  );
}
```

That's it! The dice expression `2d6+3` will automatically become a clickable, rollable element.

## 🎲 Core Components

### DiceRoller

The main component that detects dice expressions in text and makes them interactive.

**Key Features:**
- Automatic dice expression detection
- Click-to-roll functionality
- Keyboard shortcuts (Ctrl+R, Enter)
- Mobile-optimized touch targets
- Accessibility support (ARIA labels, screen reader announcements)
- Error handling and validation

**Supported Dice Expressions:**
- `1d20` - Single die
- `2d6+3` - Multiple dice with modifier
- `1d8-1` - Dice with negative modifier
- `d20` - Implied single die
- `+5` - Modifier only
- `3d6+2d4+1` - Complex expressions

### DiceResultHoverCard

A specialized hover card for displaying detailed roll results with action buttons.

**Key Features:**
- Detailed roll breakdown
- Action buttons (Roll Again, Critical, Advantage/Disadvantage)
- Inline expression editing
- Copy result functionality
- Roll history integration

### RollHistoryDisplay

A standalone component for displaying and managing roll history.

**Key Features:**
- Session-based persistence
- Individual roll actions
- Collapsible interface
- Mobile-responsive design

### useDiceRollHistory Hook

A custom hook for managing dice roll history state.

**Key Features:**
- SessionStorage persistence
- Automatic cleanup
- TypeScript interfaces
- Error handling

## 💡 Usage Examples

### Example 1: Basic Monster Stat Block

```typescript
import { DiceRoller } from '@/components/dice';

export function MonsterStatBlock() {
  return (
    <div className="monster-stats">
      <h3>Orc Warrior</h3>
      <p><strong>HP:</strong> <DiceRoller>4d8+8</DiceRoller></p>
      <p><strong>AC:</strong> 13</p>
      <p><strong>Attack:</strong> <DiceRoller>1d20+5</DiceRoller> to hit, <DiceRoller>2d6+3</DiceRoller> damage</p>
      <p><strong>Special:</strong> Rage - <DiceRoller>3d6+6</DiceRoller> berserker damage</p>
    </div>
  );
}
```

### Example 2: Interactive Combat Tool

```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { useState } from 'react';

export function CombatTool() {
  const { addRoll, rollHistory } = useDiceRollHistory();
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const handleRoll = (result: DiceRollResult) => {
    // Add to history
    addRoll(result, 'Combat roll');
    
    // Add to combat log
    const logEntry = `Rolled ${result.expression.originalExpression}: ${result.total}`;
    setCombatLog(prev => [...prev, logEntry]);
  };

  return (
    <div className="combat-tool">
      <div className="actions">
        <p>Quick Actions:</p>
        <ul>
          <li><DiceRoller onClick={handleRoll}>1d20</DiceRoller> - Initiative</li>
          <li><DiceRoller onClick={handleRoll}>1d20+5</DiceRoller> - Attack Roll</li>
          <li><DiceRoller onClick={handleRoll}>2d6+3</DiceRoller> - Weapon Damage</li>
          <li><DiceRoller onClick={handleRoll}>1d4</DiceRoller> - Healing Potion</li>
        </ul>
      </div>
      
      <div className="combat-log">
        <h4>Combat Log</h4>
        {combatLog.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Advanced Integration with Hover Cards

```typescript
import { 
  DiceRoller, 
  DiceResultHoverCard,
  FantasyHoverCard,
  FantasyHoverCardTrigger,
  FantasyHoverCardContent 
} from '@/components';

export function SpellDescription() {
  const [lastRoll, setLastRoll] = useState<DiceRollResult | null>(null);
  const [showHoverCard, setShowHoverCard] = useState(false);

  const handleSpellDamage = (result: DiceRollResult) => {
    setLastRoll(result);
    setShowHoverCard(true);
  };

  return (
    <div className="spell-card">
      <h3>Fireball</h3>
      <p>
        A bright streak flashes from your pointing finger to a point you choose 
        within range and then blossoms with a low roar into an explosion of flame.
      </p>
      <p>
        <strong>Damage:</strong> 
        <DiceRoller onClick={handleSpellDamage}>8d6</DiceRoller> fire damage
      </p>
      
      {lastRoll && (
        <DiceResultHoverCard
          result={lastRoll}
          open={showHoverCard}
          onOpenChange={setShowHoverCard}
          onRollAction={(action, expression) => {
            console.log(`Spell action: ${action} with ${expression}`);
          }}
        >
          <span>View last roll details</span>
        </DiceResultHoverCard>
      )}
    </div>
  );
}
```

### Example 4: Custom Dice Rolling Interface

```typescript
import { 
  DiceRoller, 
  RollHistoryDisplay, 
  useDiceRollHistory 
} from '@/components/dice';
import { Button } from '@/components';
import { useState } from 'react';

export function CustomDiceInterface() {
  const { addRoll, clearHistory } = useDiceRollHistory();
  const [customExpression, setCustomExpression] = useState('1d20');

  const commonRolls = [
    { label: 'D20', expression: '1d20' },
    { label: 'D20 + 5', expression: '1d20+5' },
    { label: 'Damage', expression: '2d6+3' },
    { label: 'Healing', expression: '2d4+2' },
    { label: 'Fireball', expression: '8d6' },
  ];

  const handleCustomRoll = (result: DiceRollResult) => {
    addRoll(result, 'Custom roll');
  };

  return (
    <div className="dice-interface space-y-6">
      {/* Quick Roll Buttons */}
      <div className="quick-rolls">
        <h4>Quick Rolls</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {commonRolls.map((roll) => (
            <Button key={roll.label} variant="outline" className="p-2">
              <DiceRoller onClick={handleCustomRoll}>
                {roll.expression}
              </DiceRoller>
              <span className="ml-2 text-xs">{roll.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Expression */}
      <div className="custom-roll">
        <h4>Custom Roll</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={customExpression}
            onChange={(e) => setCustomExpression(e.target.value)}
            placeholder="Enter dice expression (e.g., 3d6+2)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <Button>
            <DiceRoller onClick={handleCustomRoll}>
              {customExpression}
            </DiceRoller>
          </Button>
        </div>
      </div>

      {/* Roll History */}
      <div className="roll-history">
        <div className="flex justify-between items-center mb-4">
          <h4>Roll History</h4>
          <Button variant="outline" size="sm" onClick={clearHistory}>
            Clear History
          </Button>
        </div>
        <RollHistoryDisplay maxDisplayEntries={10} />
      </div>
    </div>
  );
}
```

### Example 5: Form Integration

```typescript
import { DiceRoller } from '@/components/dice';
import { useState } from 'react';

export function CharacterCreationForm() {
  const [stats, setStats] = useState({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  });

  const handleStatRoll = (stat: string) => (result: DiceRollResult) => {
    setStats(prev => ({
      ...prev,
      [stat]: result.total
    }));
  };

  return (
    <form className="character-creation">
      <h3>Roll Character Stats</h3>
      <div className="stats-grid grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="stat-row">
            <label className="capitalize font-medium">{stat}:</label>
            <div className="flex items-center gap-2">
              <DiceRoller onClick={handleStatRoll(stat)}>4d6</DiceRoller>
              <span className="font-bold text-lg">{value || '—'}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Click on <DiceRoller>4d6</DiceRoller> to roll stats. 
          The system automatically takes the highest 3 dice.
        </p>
      </div>
    </form>
  );
}
```

## 🔧 Advanced Integration

### Custom Roll Handlers

```typescript
import { DiceRoller, DiceRollResult } from '@/components/dice';

export function AdvancedRollHandler() {
  const handleCriticalHit = (result: DiceRollResult) => {
    // Double the damage dice (not the modifier)
    const diceTotal = result.rolls.reduce((sum, roll) => sum + roll.value, 0);
    const criticalDamage = (diceTotal * 2) + result.modifier;
    
    console.log(`Critical hit! Normal: ${result.total}, Critical: ${criticalDamage}`);
  };

  const handleAdvantageRoll = (result: DiceRollResult) => {
    // For advantage, you'd typically roll twice and take the higher
    // This is a simplified example
    console.log(`Advantage roll: ${result.total} (roll again and take higher)`);
  };

  return (
    <div>
      <p>
        Attack: <DiceRoller onClick={handleCriticalHit}>1d20+5</DiceRoller>
      </p>
      <p>
        With Advantage: <DiceRoller onClick={handleAdvantageRoll}>1d20+5</DiceRoller>
      </p>
    </div>
  );
}
```

### Integration with State Management

```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { useContext, createContext } from 'react';

// Create a combat context
const CombatContext = createContext({
  currentTurn: 0,
  combatants: [],
  addCombatRoll: (roll: DiceRollResult, combatant: string) => {},
});

export function CombatProvider({ children }) {
  const { addRoll } = useDiceRollHistory();
  const [combatState, setCombatState] = useState({
    currentTurn: 0,
    combatants: [],
  });

  const addCombatRoll = (roll: DiceRollResult, combatant: string) => {
    // Add to dice history
    addRoll(roll, `${combatant} combat roll`);
    
    // Add to combat state
    // ... combat logic
  };

  return (
    <CombatContext.Provider value={{ ...combatState, addCombatRoll }}>
      {children}
    </CombatContext.Provider>
  );
}

export function CombatantCard({ combatant }) {
  const { addCombatRoll } = useContext(CombatContext);

  const handleRoll = (result: DiceRollResult) => {
    addCombatRoll(result, combatant.name);
  };

  return (
    <div className="combatant-card">
      <h4>{combatant.name}</h4>
      <p>
        Attack: <DiceRoller onClick={handleRoll}>{combatant.attackRoll}</DiceRoller>
      </p>
      <p>
        Damage: <DiceRoller onClick={handleRoll}>{combatant.damageRoll}</DiceRoller>
      </p>
    </div>
  );
}
```

## 📚 API Reference

### DiceRoller Props

```typescript
interface DiceRollerProps {
  children: React.ReactNode;              // Text content with dice expressions
  onClick?: (result: DiceRollResult) => void;  // Custom roll handler
  onError?: (error: DiceError) => void;   // Error handler
  showHistory?: boolean;                  // Show roll history (default: false)
  className?: string;                     // Custom CSS classes
  disabled?: boolean;                     // Disable rolling (default: false)
  ariaLabel?: string;                     // Custom ARIA label
  ariaDescription?: string;               // Custom ARIA description
  enableKeyboardShortcuts?: boolean;      // Enable Ctrl+R, Enter (default: true)
  announceResults?: boolean;              // Screen reader announcements (default: true)
  compactMobile?: boolean;                // Compact mobile layout (default: false)
  mobileBreakpoint?: number;              // Mobile breakpoint in px (default: 640)
}
```

### DiceRollResult Interface

```typescript
interface DiceRollResult {
  total: number;                          // Final roll total
  rolls: SingleRoll[];                    // Individual die results
  modifier: number;                       // Applied modifier
  rollType: 'normal' | 'advantage' | 'disadvantage' | 'critical';
  timestamp: number;                      // When the roll occurred
  expression: DiceExpression;             // Parsed expression details
}

interface SingleRoll {
  value: number;                          // Die result
  sides: number;                          // Die type (d6, d20, etc.)
  isCritical?: boolean;                   // Whether this die rolled max value
}
```

### useDiceRollHistory Hook

```typescript
interface UseDiceRollHistoryReturn {
  rollHistory: RollHistoryEntry[];        // Current roll history
  addRoll: (result: DiceRollResult, context?: string) => void;  // Add new roll
  removeRoll: (id: string) => void;       // Remove specific roll
  clearHistory: () => void;               // Clear all history
  getHistoryStats: () => HistoryStats;    // Get statistics
}

interface RollHistoryEntry {
  id: string;                             // Unique identifier
  result: DiceRollResult;                 // Roll result
  context?: string;                       // Optional context/description
  timestamp: number;                      // When roll was added
}
```

### Utility Functions

```typescript
// Available from '@/components/dice' or '@/lib/dice-utils'

// Validate a dice expression
function validateDiceExpression(expression: string): DiceValidationResult;

// Roll dice from an expression
function rollDiceExpression(expression: string): DiceRollResult;

// Extract dice expressions from text
function extractDiceExpressions(text: string): string[];

// Check if text contains dice expressions
function isDiceExpression(text: string): boolean;

// Parse a dice expression into components
function parseDiceExpression(expression: string): DiceExpression | null;
```

## ✅ Best Practices

### 1. Performance Optimization

```typescript
// ✅ Good - Use React.memo for expensive components
const ExpensiveMonsterList = React.memo(({ monsters }) => {
  return (
    <div>
      {monsters.map(monster => (
        <div key={monster.id}>
          <DiceRoller>{monster.attackRoll}</DiceRoller>
        </div>
      ))}
    </div>
  );
});

// ✅ Good - Use useCallback for roll handlers
const MyComponent = () => {
  const handleRoll = useCallback((result: DiceRollResult) => {
    // Handle roll
  }, []);

  return <DiceRoller onClick={handleRoll}>1d20</DiceRoller>;
};
```

### 2. Error Handling

```typescript
// ✅ Good - Always handle errors
const MyComponent = () => {
  const handleError = (error: DiceError) => {
    console.error('Dice roll error:', error);
    // Show user-friendly error message
    toast.error(`Invalid dice expression: ${error.message}`);
  };

  return (
    <DiceRoller onError={handleError}>
      {userInputExpression}
    </DiceRoller>
  );
};
```

### 3. Accessibility

```typescript
// ✅ Good - Provide context for screen readers
<DiceRoller 
  ariaLabel="Roll damage for fireball spell"
  ariaDescription="This will roll 8 six-sided dice for fire damage"
>
  8d6
</DiceRoller>

// ✅ Good - Use semantic HTML
<div role="region" aria-labelledby="combat-rolls">
  <h3 id="combat-rolls">Combat Rolls</h3>
  <DiceRoller>1d20+5</DiceRoller>
</div>
```

### 4. Mobile Optimization

```typescript
// ✅ Good - Consider mobile users
<DiceRoller 
  compactMobile={true}
  mobileBreakpoint={768}
  className="touch-manipulation" // Improves touch responsiveness
>
  2d6+3
</DiceRoller>
```

### 5. State Management

```typescript
// ✅ Good - Centralize roll handling
const useGameState = () => {
  const { addRoll } = useDiceRollHistory();
  
  const handleGameRoll = useCallback((result: DiceRollResult, context: string) => {
    addRoll(result, context);
    
    // Additional game logic
    updateGameState(result);
  }, [addRoll]);

  return { handleGameRoll };
};
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Dice Expressions Not Detected

**Problem:** Dice expressions in text aren't becoming clickable.

**Solutions:**
```typescript
// ❌ Problem - Complex nested structure
<DiceRoller>
  <div>
    <span>Roll {diceExpression}</span>
  </div>
</DiceRoller>

// ✅ Solution - Simple text content
<DiceRoller>Roll 2d6+3</DiceRoller>

// ✅ Alternative - Direct string
<DiceRoller>{`Roll ${diceExpression}`}</DiceRoller>
```

#### 2. Rolls Not Being Added to History

**Problem:** Dice rolls aren't appearing in the roll history.

**Solutions:**
```typescript
// ❌ Problem - Not using the hook
const MyComponent = () => {
  return <DiceRoller>1d20</DiceRoller>;
};

// ✅ Solution - Use the hook and handle rolls
const MyComponent = () => {
  const { addRoll } = useDiceRollHistory();
  
  const handleRoll = (result: DiceRollResult) => {
    addRoll(result, 'My roll');
  };
  
  return <DiceRoller onClick={handleRoll}>1d20</DiceRoller>;
};
```

#### 3. Performance Issues with Many Dice Rollers

**Problem:** Page becomes slow with many DiceRoller components.

**Solutions:**
```typescript
// ✅ Solution - Use React.memo and useCallback
const MonsterCard = React.memo(({ monster }) => {
  const handleRoll = useCallback((result) => {
    // Handle roll
  }, []);

  return (
    <div>
      <DiceRoller onClick={handleRoll}>
        {monster.attackRoll}
      </DiceRoller>
    </div>
  );
});
```

#### 4. Invalid Dice Expressions

**Problem:** Users entering invalid dice expressions.

**Solutions:**
```typescript
// ✅ Solution - Validate before using
import { validateDiceExpression } from '@/components/dice';

const validateUserInput = (expression: string) => {
  const validation = validateDiceExpression(expression);
  if (!validation.isValid) {
    alert(`Invalid dice expression: ${validation.error?.message}`);
    return false;
  }
  return true;
};
```

### Debug Mode

Enable debug logging for development:

```typescript
// Add to your component for debugging
const MyComponent = () => {
  const handleRoll = (result: DiceRollResult) => {
    console.log('Dice roll result:', result);
    console.log('Expression:', result.expression);
    console.log('Individual rolls:', result.rolls);
  };

  const handleError = (error: DiceError) => {
    console.error('Dice error:', error);
  };

  return (
    <DiceRoller 
      onClick={handleRoll}
      onError={handleError}
    >
      1d20+5
    </DiceRoller>
  );
};
```

## ⚡ Performance Considerations

### Bundle Size Impact

The dice system uses dynamic imports to minimize initial bundle size:

```typescript
// The system automatically loads dice utilities only when needed
// Initial bundle impact: ~5KB gzipped
// Full system when loaded: ~15KB gzipped
```

### Memory Usage

- Roll history is limited to 50 entries by default
- SessionStorage is used for persistence (not memory)
- Components are optimized for re-rendering

### Optimization Tips

1. **Limit Roll History**: Set appropriate limits for your use case
```typescript
const { addRoll } = useDiceRollHistory({ maxEntries: 20 });
```

2. **Use React.memo**: For components with many dice rollers
```typescript
const MonsterList = React.memo(({ monsters }) => {
  // Component implementation
});
```

3. **Debounce Rapid Rolls**: Prevent spam clicking
```typescript
const debouncedRoll = useMemo(
  () => debounce(handleRoll, 300),
  [handleRoll]
);
```

## 🎯 Integration Checklist

When integrating the dice system into your components:

- [ ] Import necessary components from `@/components/dice`
- [ ] Handle roll results with custom `onClick` handlers
- [ ] Implement error handling with `onError`
- [ ] Use `useDiceRollHistory` hook for roll tracking
- [ ] Add appropriate ARIA labels for accessibility
- [ ] Test on mobile devices for touch interaction
- [ ] Verify keyboard navigation works (Tab, Enter, Ctrl+R)
- [ ] Check that dice expressions are properly detected
- [ ] Ensure roll history persists across page reloads
- [ ] Test error states with invalid expressions

## 📖 Additional Resources

- **Component Source Code**: `src/components/DiceRoller.tsx`
- **Utility Functions**: `src/lib/dice-utils.ts`
- **Type Definitions**: `src/types/dice.ts`
- **Integration Tests**: `src/components/DiceRollerIntegrationTest.tsx`
- **Design System**: `docs/design-system-guide.md`
- **Main README**: `README.md`

---

**Need Help?** Check the integration test components for working examples, or refer to the existing tool components that already use the dice system successfully. 

# Daggerheart Dice Roller - Usage Guide

Complete guide for using the integrated `DiceRoller` and `DiceResultHoverCard` components in your Daggerheart DM tools.

## ✨ New Floating Result Display

The `DiceRoller` component now shows results in a **floating display** in the lower left corner of the screen, keeping your content clean and uncluttered:

- Roll results appear as a floating badge in the bottom-left corner
- Click the floating result to open the detailed hover card
- Results auto-hide after 8 seconds, leaving a **persistent dice emoji**
- Click the dice emoji to restore the full result display
- Manual dismiss with the ✕ button completely removes the result
- No inline clutter next to your dice expressions

## Basic Usage

The `DiceRoller` component automatically shows detailed results with the floating display:

```tsx
import { DiceRoller } from '@/components/DiceRoller';

function BasicExample() {
  return (
    <div>
      <p>
        The goblin attacks with its scimitar: <DiceRoller>1d20+4</DiceRoller> to hit, 
        dealing <DiceRoller>1d6+2</DiceRoller> slashing damage on a successful hit.
      </p>
    </div>
  );
}
```

**How it works:**
1. Click on any dice expression (e.g., `1d20+4`) to roll
2. A floating result badge appears in the lower left corner
3. Click the floating badge to see detailed results in a hover card
4. After 8 seconds, the badge auto-hides but leaves a **persistent dice emoji**
5. Click the dice emoji anytime to restore the full result display and hover card
6. Or click the ✕ button to completely dismiss the result

## Advanced Usage with Custom Handlers

```tsx
import { DiceRoller } from '@/components/DiceRoller';
import { DiceRollResult, DiceError } from '@/types/dice';

function CombatExample() {
  const handleAttackRoll = (result: DiceRollResult) => {
    console.log('Attack roll:', result.total);
    
    // Add custom logic - maybe compare against AC
    const targetAC = 15;
    const hit = result.total >= targetAC;
    
    if (hit) {
      console.log('Attack hits!');
      // Maybe trigger damage roll automatically
    } else {
      console.log('Attack misses!');
    }
  };

  const handleError = (error: DiceError) => {
    console.error('Dice roll error:', error.message);
    // Show user-friendly error message
  };

  return (
    <div className="combat-section">
      <h3>Ancient Red Drake</h3>
      <div className="abilities">
        <p>
          <strong>Claw Attack:</strong> 
          <DiceRoller 
            onClick={handleAttackRoll}
            onError={handleError}
          >
            1d20+9
          </DiceRoller> to hit, 
          <DiceRoller>2d8+6</DiceRoller> slashing damage
        </p>
        
        <p>
          <strong>Fire Breath:</strong> All creatures in a 30-foot cone must 
          make a DC 17 Wisdom save or take <DiceRoller>6d6</DiceRoller> fire damage
        </p>
      </div>
    </div>
  );
}
```

## Disabling Floating Display

If you prefer the simple result display without the floating badge:

```tsx
import { DiceRoller } from '@/components/DiceRoller';

function SimpleExample() {
  return (
    <DiceRoller showDetailedResults={false}>
      Simple roll: 1d20+5
    </DiceRoller>
  );
}
```

## Multiple Dice Rollers

The floating display handles multiple dice rollers gracefully - each new roll replaces the previous floating result:

```tsx
import { DiceRoller } from '@/components/DiceRoller';

function MultipleRollsExample() {
  return (
    <div className="spell-description">
      <h3>Fireball Spell</h3>
      <p>
        Range: 150 feet. Make a spell attack: <DiceRoller>1d20+8</DiceRoller>
      </p>
      <p>
        Each creature in a 20-foot radius must make a Dexterity saving throw.
      </p>
      <p>
        Damage on failed save: <DiceRoller>8d6</DiceRoller> fire damage
      </p>
      <p>
        Damage on successful save: <DiceRoller>4d6</DiceRoller> fire damage
      </p>
    </div>
  );
}
```

Only the most recent roll result will be shown in the floating display.

## Complete Monster Stat Block Example

```tsx
import { DiceRoller } from '@/components/DiceRoller';
import { useState } from 'react';

function MonsterStatBlock() {
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const addToCombatLog = (message: string) => {
    setCombatLog(prev => [...prev, message]);
  };

  const handleRoll = (context: string) => (result: DiceRollResult) => {
    const message = `${context}: ${result.total} (${result.expression.originalExpression})`;
    addToCombatLog(message);
  };

  return (
    <div className="monster-card">
      <h2 className="text-2xl font-bold text-accent mb-4">Bone Colossus</h2>
      
      <div className="stats grid grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-semibold">Armor Class</h4>
          <p>18 (Natural Armor)</p>
        </div>
        <div>
          <h4 className="font-semibold">Hit Points</h4>
          <p><DiceRoller onClick={handleRoll('HP Roll')}>15d12+45</DiceRoller> (142 average)</p>
        </div>
      </div>

      <div className="actions space-y-4">
        <h3 className="text-xl font-semibold text-accent">Actions</h3>
        
        <div className="action">
          <h4 className="font-semibold">Multiattack</h4>
          <p>The colossus makes three attacks: two with its bone fists and one bone shard throw.</p>
        </div>

        <div className="action">
          <h4 className="font-semibold">Bone Fist</h4>
          <p>
            <em>Melee Weapon Attack:</em> <DiceRoller onClick={handleRoll('Bone Fist Attack')}>1d20+10</DiceRoller> to hit, 
            reach 10 ft., one target. 
            <em>Hit:</em> <DiceRoller onClick={handleRoll('Bone Fist Damage')}>2d8+6</DiceRoller> bludgeoning damage.
          </p>
        </div>

        <div className="action">
          <h4 className="font-semibold">Bone Shard Throw</h4>
          <p>
            <em>Ranged Weapon Attack:</em> <DiceRoller onClick={handleRoll('Bone Shard Attack')}>1d20+8</DiceRoller> to hit, 
            range 60/180 ft., one target. 
            <em>Hit:</em> <DiceRoller onClick={handleRoll('Bone Shard Damage')}>1d10+4</DiceRoller> piercing damage.
          </p>
        </div>

        <div className="action">
          <h4 className="font-semibold">Necrotic Aura (Recharge 5-6)</h4>
          <p>
            All creatures within 20 feet must make a DC 16 Constitution saving throw. 
            On failure: <DiceRoller onClick={handleRoll('Necrotic Aura Damage')}>4d6</DiceRoller> necrotic damage, 
            half damage on success.
          </p>
        </div>
      </div>

      {/* Combat Log */}
      {combatLog.length > 0 && (
        <div className="combat-log mt-6 p-4 bg-muted/20 rounded-lg">
          <h4 className="font-semibold mb-2">Combat Log</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {combatLog.map((entry, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                {entry}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setCombatLog([])}
            className="text-xs text-destructive hover:underline mt-2"
          >
            Clear Log
          </button>
        </div>
      )}
    </div>
  );
}
```

## Key Features of the Floating Display

### 🎯 Clean UI
- No inline clutter next to dice expressions
- Results appear in a dedicated floating area
- Content stays readable and organized

### ⏰ Smart Auto-Hide
- Full results auto-hide after 8 seconds, leaving a persistent dice emoji
- Prevents screen clutter while maintaining quick access to last roll
- Click the dice emoji to instantly restore the full result display
- Manual dismiss option with ✕ button completely removes the result

### 📱 Mobile Optimized
- Fixed positioning works perfectly on mobile
- Touch-friendly floating badge
- Responsive sizing for different screen sizes

### 🎲 Rich Interactions
- Click floating result to see detailed breakdown
- All hover card functionality preserved
- Interactive actions: Roll Again, Advantage, Disadvantage, etc.

### ♿ Accessibility
- Full screen reader support
- Keyboard navigation maintained
- Proper ARIA labels and descriptions
- Roll results announced to assistive technologies

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Text containing dice expressions |
| `onClick` | `(result: DiceRollResult) => void` | `undefined` | Custom roll result handler |
| `onError` | `(error: DiceError) => void` | `undefined` | Error handler for invalid expressions |
| `showDetailedResults` | `boolean` | `true` | Show floating result display |
| `disabled` | `boolean` | `false` | Disable all rolling functionality |
| `className` | `string` | `undefined` | Additional CSS classes |
| `ariaLabel` | `string` | Auto-generated | Custom ARIA label |
| `enableKeyboardShortcuts` | `boolean` | `true` | Enable Ctrl+R shortcut |
| `announceResults` | `boolean` | `true` | Announce results to screen readers |
| `compactMobile` | `boolean` | `false` | Use compact mobile layout |

The floating display system provides a clean, unobtrusive dice rolling experience that keeps your Daggerheart RPG content organized while still offering rich interaction capabilities. 