# Components Export Structure

This document explains how to import and use components from the centralized export system.

## Import Patterns

### Individual Component Imports

```typescript
// Import specific components
import { DiceRoller, DiceResultHoverCard } from '@/components';
import { Button, Card } from '@/components';
import { FantasyHoverCard, FantasyTooltip } from '@/components';

// Import from specific categories
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { LootGeneratorComponent } from '@/components';
```

### Bulk Imports

```typescript
// Import entire dice system
import * as Dice from '@/components/dice';

// Use components
const MyComponent = () => (
  <Dice.DiceRoller>
    Roll 2d6 for damage
  </Dice.DiceRoller>
);

// Import all components (not recommended for production)
import * as Components from '@/components';
```

### Convenience Bundles

```typescript
// Import pre-configured bundles
import { DiceSystem, DiceTestingUtils } from '@/components/dice';

// Use the complete dice system
const { DiceRoller, DiceResultHoverCard, RollHistoryDisplay, useDiceRollHistory } = DiceSystem;
```

## Usage Examples

### Basic Dice Roller

```typescript
import { DiceRoller } from '@/components';

export function BasicExample() {
  return (
    <div>
      <p>
        <DiceRoller>
          Attack with 1d20+5 for hit, then roll 2d6+3 for damage
        </DiceRoller>
      </p>
    </div>
  );
}
```

### Advanced Dice System with History

```typescript
import { 
  DiceRoller, 
  DiceResultHoverCard, 
  RollHistoryDisplay,
  useDiceRollHistory 
} from '@/components/dice';

export function AdvancedDiceExample() {
  const { addRoll } = useDiceRollHistory();

  const handleRoll = (result) => {
    addRoll(result, 'Combat roll');
  };

  return (
    <div className="space-y-4">
      <DiceRoller onClick={handleRoll}>
        Roll 2d6+3 for damage
      </DiceRoller>
      
      <RollHistoryDisplay maxDisplayEntries={5} />
    </div>
  );
}
```

### Integration with Fantasy Components

```typescript
import { 
  DiceRoller,
  FantasyHoverCard,
  FantasyHoverCardTrigger,
  FantasyHoverCardContent,
  Button
} from '@/components';

export function FantasyIntegration() {
  return (
    <FantasyHoverCard>
      <FantasyHoverCardTrigger asChild>
        <Button variant="fantasy-primary">
          <DiceRoller>Roll 1d20</DiceRoller>
        </Button>
      </FantasyHoverCardTrigger>
      <FantasyHoverCardContent>
        <p>This will roll a d20 with fantasy styling!</p>
      </FantasyHoverCardContent>
    </FantasyHoverCard>
  );
}
```

### Tool Component Integration

```typescript
import { 
  DiceRoller,
  MonsterBuilderComponent,
  LootGeneratorComponent 
} from '@/components';

export function ToolIntegration() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2>Monster Stats</h2>
        <p>
          <DiceRoller>
            HP: 4d8+12, AC: 15, Attack: 1d20+6 (2d6+4 damage)
          </DiceRoller>
        </p>
        <MonsterBuilderComponent />
      </div>
      
      <div>
        <h2>Loot Generation</h2>
        <LootGeneratorComponent />
      </div>
    </div>
  );
}
```

## Component Categories

### Dice System (`@/components/dice`)

**Core Components:**
- `DiceRoller` - Main interactive dice rolling component
- `DiceResultHoverCard` - Hover card for displaying roll results
- `RollHistoryDisplay` - Component for showing roll history

**Hooks:**
- `useDiceRollHistory` - Hook for managing roll history

**Types:**
- All dice-related TypeScript types and interfaces

**Utilities:**
- All dice utility functions (parsing, validation, rolling)

### UI Foundation (`@/components`)

**shadcn/ui Components:**
- `Button`, `Card`, `Input`, `Select`, etc.
- All base UI components with consistent styling

**Fantasy Components:**
- `FantasyCard`, `FantasyHoverCard`, `FantasyPopover`, `FantasyTooltip`
- Enhanced components with fantasy theming

### Layout System

**Layout Components:**
- `Navbar` - Main navigation
- `SkipLink` - Accessibility skip link
- `ToolLayout` - Layout wrapper for tools
- `ToolInfo` - Tool information display

### Tool Components

**Available Tools:**
- `LootGeneratorComponent`
- `BattlePointsCalculatorComponent`
- `FearTrackerComponent`
- `MonsterBuilderComponent`

## Best Practices

### 1. Import Only What You Need

```typescript
// ✅ Good - specific imports
import { DiceRoller, Button } from '@/components';

// ❌ Avoid - importing everything
import * as Components from '@/components';
```

### 2. Use Type Imports for Types

```typescript
// ✅ Good - separate type imports
import { DiceRoller } from '@/components';
import type { DiceRollResult } from '@/components/dice';
```

### 3. Leverage Convenience Bundles

```typescript
// ✅ Good - use bundles for related functionality
import { DiceSystem } from '@/components/dice';
const { DiceRoller, useDiceRollHistory } = DiceSystem;
```

### 4. Consistent Import Paths

```typescript
// ✅ Good - consistent paths
import { DiceRoller } from '@/components';
import { DiceRoller } from '@/components/dice'; // Also valid

// ❌ Avoid - direct file imports
import { DiceRoller } from '@/components/DiceRoller';
```

## Development and Testing

### Integration Test Components

```typescript
// Available for development/testing
import { 
  DiceRollerIntegrationTest,
  ShadCNIntegrationTest,
  MonsterStatBlockIntegrationTest 
} from '@/components';

// Or from the testing bundle
import { DiceTestingUtils } from '@/components/dice';
```

### Testing Your Components

```typescript
import { render, screen } from '@testing-library/react';
import { DiceRoller } from '@/components';

test('dice roller renders correctly', () => {
  render(<DiceRoller>Roll 2d6</DiceRoller>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## Migration Guide

If you're updating existing imports:

```typescript
// Old imports
import { DiceRoller } from '@/components/DiceRoller';
import { useDiceRollHistory } from '@/hooks/useDiceRollHistory';

// New imports
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
// or
import { DiceRoller, useDiceRollHistory } from '@/components';
```

This centralized export structure makes it easier to:
- Find and import components
- Maintain consistent import patterns
- Bundle related functionality
- Support tree shaking for optimal bundle sizes
- Provide clear documentation and examples 