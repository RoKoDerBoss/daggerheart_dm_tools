# Dice Roller System - Developer Guide

The complete guide for developers working with the Daggerheart dice roller system. This document serves as your starting point for understanding, integrating, and extending the dice rolling functionality.

## 📋 Quick Navigation

- **[Getting Started](#getting-started)** - Basic setup and first implementation
- **[Core Concepts](#core-concepts)** - Understanding the system architecture
- **[Common Use Cases](#common-use-cases)** - Practical implementation patterns
- **[Advanced Features](#advanced-features)** - Power user functionality
- **[Best Practices](#best-practices)** - Performance and maintainability
- **[Troubleshooting](#troubleshooting)** - Common issues and solutions

## 🚀 Getting Started

### What is the Dice Roller System?

The Daggerheart dice roller system is a comprehensive React component library that automatically detects dice expressions in text and makes them interactive. It's designed specifically for tabletop RPG applications with features like:

- **Automatic Detection**: Finds dice expressions like `2d6+3` in any text
- **Click-to-Roll**: Makes expressions clickable with visual feedback
- **Roll History**: Tracks all rolls with session persistence
- **Accessibility**: Full keyboard navigation and screen reader support
- **Mobile Optimized**: Touch-friendly with proper target sizes
- **Fantasy Themed**: Integrates with the Daggerheart design system

### 5-Minute Quick Start

1. **Import the component**:
```typescript
import { DiceRoller } from '@/components/dice';
```

2. **Wrap your text**:
```typescript
export function MyComponent() {
  return (
    <p>
      The orc attacks for <DiceRoller>2d6+3</DiceRoller> damage!
    </p>
  );
}
```

3. **That's it!** The `2d6+3` is now clickable and will roll dice when clicked.

### Your First Implementation

Here's a complete working example:

```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { useState } from 'react';

export function MonsterAttack() {
  const { addRoll } = useDiceRollHistory();
  const [lastDamage, setLastDamage] = useState<number | null>(null);

  const handleDamageRoll = (result) => {
    setLastDamage(result.total);
    addRoll(result, 'Orc damage');
  };

  return (
    <div className="monster-attack">
      <h3>Orc Warrior</h3>
      <p>
        The orc swings its greataxe for{' '}
        <DiceRoller onClick={handleDamageRoll}>2d6+3</DiceRoller> damage!
      </p>
      
      {lastDamage && (
        <div className="damage-result">
          💥 Dealt {lastDamage} damage!
        </div>
      )}
    </div>
  );
}
```

## 🏗️ Core Concepts

### Component Architecture

The system is built around four main components:

```
DiceRoller (Core)
├── Detects dice expressions in text
├── Renders clickable dice buttons
└── Handles roll execution

DiceResultHoverCard (Display)
├── Shows detailed roll results
├── Provides action buttons
└── Enables result manipulation

RollHistoryDisplay (History)
├── Shows session roll history
├── Enables roll management
└── Provides statistics

useDiceRollHistory (State)
├── Manages roll history state
├── Handles sessionStorage
└── Provides history operations
```

### Data Flow

```
User clicks dice → DiceRoller validates → Rolls dice → Returns result
                                                           ↓
Result passed to onClick handler → Can be added to history → Displayed in UI
```

### Supported Dice Expressions

The system recognizes these patterns:

| Expression | Description | Example |
|------------|-------------|---------|
| `XdY` | X dice of Y sides | `2d6` = roll 2 six-sided dice |
| `XdY+Z` | Dice with positive modifier | `1d20+5` = d20 plus 5 |
| `XdY-Z` | Dice with negative modifier | `1d8-1` = d8 minus 1 |
| `dY` | Single die (implied 1) | `d20` = roll 1 twenty-sided die |
| `+Z` | Modifier only | `+3` = add 3 |
| Complex | Multiple terms | `2d6+1d4+2` = 2d6 + 1d4 + 2 |

## 🎯 Common Use Cases

### 1. Monster Stat Blocks

**Problem**: Make monster stats interactive for quick rolling.

**Solution**:
```typescript
import { DiceRoller } from '@/components/dice';

export function MonsterStatBlock({ monster }) {
  return (
    <div className="monster-stats">
      <h3>{monster.name}</h3>
      <p><strong>HP:</strong> <DiceRoller>{monster.hitDice}</DiceRoller></p>
      <p><strong>AC:</strong> {monster.ac}</p>
      
      <h4>Attacks</h4>
      {monster.attacks.map(attack => (
        <div key={attack.name}>
          <strong>{attack.name}:</strong>{' '}
          <DiceRoller>{attack.toHit}</DiceRoller> to hit,{' '}
          <DiceRoller>{attack.damage}</DiceRoller> damage
        </div>
      ))}
    </div>
  );
}
```

### 2. Character Sheets

**Problem**: Enable ability checks and skill rolls.

**Solution**:
```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';

export function CharacterSheet({ character }) {
  const { addRoll } = useDiceRollHistory();

  const handleSkillCheck = (skillName) => (result) => {
    addRoll(result, `${character.name} ${skillName} check`);
    
    // Determine success/failure
    const dc = 15; // Example DC
    const success = result.total >= dc;
    console.log(`${skillName}: ${result.total} - ${success ? 'Success!' : 'Failure'}`);
  };

  return (
    <div className="character-sheet">
      <h2>{character.name}</h2>
      
      <div className="skills">
        <h3>Skills</h3>
        {character.skills.map(skill => (
          <div key={skill.name}>
            {skill.name}:{' '}
            <DiceRoller onClick={handleSkillCheck(skill.name)}>
              1d20{skill.modifier >= 0 ? '+' : ''}{skill.modifier}
            </DiceRoller>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Spell Descriptions

**Problem**: Make spell damage interactive.

**Solution**:
```typescript
import { DiceRoller, DiceResultHoverCard } from '@/components/dice';
import { useState } from 'react';

export function SpellCard({ spell }) {
  const [lastCast, setLastCast] = useState(null);

  const handleSpellCast = (result) => {
    setLastCast(result);
    console.log(`${spell.name} deals ${result.total} ${spell.damageType} damage`);
  };

  return (
    <div className="spell-card">
      <h3>{spell.name}</h3>
      <p>{spell.description}</p>
      
      <p>
        <strong>Damage:</strong>{' '}
        <DiceRoller onClick={handleSpellCast}>
          {spell.damage}
        </DiceRoller> {spell.damageType}
      </p>
      
      {lastCast && (
        <DiceResultHoverCard 
          result={lastCast}
          onRollAction={(action, expression) => {
            if (action === 'roll-critical') {
              console.log('Critical hit!');
            }
          }}
        >
          <span className="last-cast">
            Last cast: {lastCast.total} damage
          </span>
        </DiceResultHoverCard>
      )}
    </div>
  );
}
```

### 4. Combat Tracker

**Problem**: Track initiative and combat actions.

**Solution**:
```typescript
import { DiceRoller, RollHistoryDisplay, useDiceRollHistory } from '@/components/dice';

export function CombatTracker({ combatants }) {
  const { addRoll } = useDiceRollHistory();

  const handleInitiative = (combatantName) => (result) => {
    addRoll(result, `${combatantName} initiative`);
    // Update combatant initiative in state
  };

  const handleAttack = (attackerName, targetName) => (result) => {
    addRoll(result, `${attackerName} attacks ${targetName}`);
    // Handle attack logic
  };

  return (
    <div className="combat-tracker">
      <h2>Combat Tracker</h2>
      
      <div className="initiative">
        <h3>Roll Initiative</h3>
        {combatants.map(combatant => (
          <div key={combatant.id}>
            {combatant.name}:{' '}
            <DiceRoller onClick={handleInitiative(combatant.name)}>
              1d20+{combatant.dexModifier}
            </DiceRoller>
          </div>
        ))}
      </div>
      
      <RollHistoryDisplay maxDisplayEntries={10} />
    </div>
  );
}
```

## ⚡ Advanced Features

### Custom Roll Handlers

Create sophisticated roll handling logic:

```typescript
import { DiceRoller, DiceRollResult } from '@/components/dice';

export function AdvancedRollHandler() {
  const handleCriticalSystem = (result: DiceRollResult) => {
    const d20Rolls = result.rolls.filter(roll => roll.sides === 20);
    
    if (d20Rolls.some(roll => roll.value === 20)) {
      console.log('Natural 20! Critical success!');
      // Handle critical success
    } else if (d20Rolls.some(roll => roll.value === 1)) {
      console.log('Natural 1! Critical failure!');
      // Handle critical failure
    } else {
      console.log(`Standard roll: ${result.total}`);
    }
  };

  return (
    <DiceRoller onClick={handleCriticalSystem}>
      1d20+5
    </DiceRoller>
  );
}
```

### Advantage/Disadvantage System

Implement D&D-style advantage mechanics:

```typescript
import { rollDiceExpression } from '@/components/dice';

export function AdvantageRoller() {
  const rollWithAdvantage = (expression: string) => {
    const roll1 = rollDiceExpression(expression);
    const roll2 = rollDiceExpression(expression);
    
    const finalResult = roll1.total >= roll2.total ? roll1 : roll2;
    
    console.log(`Advantage: ${roll1.total}, ${roll2.total} → ${finalResult.total}`);
    return finalResult;
  };

  const rollWithDisadvantage = (expression: string) => {
    const roll1 = rollDiceExpression(expression);
    const roll2 = rollDiceExpression(expression);
    
    const finalResult = roll1.total <= roll2.total ? roll1 : roll2;
    
    console.log(`Disadvantage: ${roll1.total}, ${roll2.total} → ${finalResult.total}`);
    return finalResult;
  };

  return (
    <div className="advantage-system">
      <button onClick={() => rollWithAdvantage('1d20+5')}>
        Roll with Advantage
      </button>
      <button onClick={() => rollWithDisadvantage('1d20+5')}>
        Roll with Disadvantage
      </button>
    </div>
  );
}
```

### Batch Rolling

Roll multiple dice expressions at once:

```typescript
import { rollDiceExpression, useDiceRollHistory } from '@/components/dice';

export function BatchRoller() {
  const { addRoll } = useDiceRollHistory();

  const rollMultipleAttacks = () => {
    const attacks = ['1d20+7', '1d20+7', '1d20+2']; // Fighter with multiple attacks
    
    const results = attacks.map((expression, index) => {
      const result = rollDiceExpression(expression);
      addRoll(result, `Attack ${index + 1}`);
      return result;
    });

    console.log('Attack results:', results.map(r => r.total));
  };

  return (
    <button onClick={rollMultipleAttacks}>
      Roll Multiple Attacks
    </button>
  );
}
```

## ✅ Best Practices

### 1. Performance Optimization

```typescript
// ✅ Good - Use React.memo for expensive components
const MonsterList = React.memo(({ monsters }) => {
  return (
    <div>
      {monsters.map(monster => (
        <MonsterCard key={monster.id} monster={monster} />
      ))}
    </div>
  );
});

// ✅ Good - Use useCallback for roll handlers
const MyComponent = () => {
  const handleRoll = useCallback((result) => {
    // Handle roll
  }, []);

  return <DiceRoller onClick={handleRoll}>1d20</DiceRoller>;
};
```

### 2. Error Handling

```typescript
// ✅ Good - Always handle errors gracefully
const SafeDiceRoller = ({ expression }) => {
  const [error, setError] = useState(null);

  const handleError = (diceError) => {
    setError(diceError.message);
    // Log for debugging
    console.error('Dice error:', diceError);
  };

  return (
    <div>
      <DiceRoller onError={handleError}>
        {expression}
      </DiceRoller>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
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
<section aria-labelledby="combat-section">
  <h2 id="combat-section">Combat Actions</h2>
  <DiceRoller>1d20+5</DiceRoller>
</section>
```

### 4. State Management

```typescript
// ✅ Good - Centralize roll handling
const useGameState = () => {
  const { addRoll } = useDiceRollHistory();
  
  const handleGameRoll = useCallback((result, context) => {
    addRoll(result, context);
    
    // Additional game logic
    updateGameState(result);
    checkForCriticals(result);
    updateCombatLog(result, context);
  }, [addRoll]);

  return { handleGameRoll };
};
```

### 5. Testing

```typescript
// ✅ Good - Test dice interactions
import { render, screen, fireEvent } from '@testing-library/react';
import { DiceRoller } from '@/components/dice';

test('dice roller handles clicks correctly', async () => {
  const mockOnClick = jest.fn();
  
  render(
    <DiceRoller onClick={mockOnClick}>
      2d6+3
    </DiceRoller>
  );
  
  const diceButton = screen.getByRole('button', { name: /roll dice/i });
  fireEvent.click(diceButton);
  
  await waitFor(() => {
    expect(mockOnClick).toHaveBeenCalledWith(
      expect.objectContaining({
        total: expect.any(Number),
        rolls: expect.any(Array),
      })
    );
  });
});
```

## 🐛 Troubleshooting

### Common Issues

#### Issue: Dice expressions not detected
**Symptoms**: Text with dice expressions doesn't become clickable.

**Solutions**:
```typescript
// ❌ Problem - Complex nested structure
<DiceRoller>
  <div>
    <span>Roll {variable}</span>
  </div>
</DiceRoller>

// ✅ Solution - Simple text content
<DiceRoller>Roll 2d6+3</DiceRoller>

// ✅ Alternative - Template literal
<DiceRoller>{`Roll ${diceExpression}`}</DiceRoller>
```

#### Issue: Rolls not appearing in history
**Symptoms**: Dice rolls work but don't show in roll history.

**Solutions**:
```typescript
// ❌ Problem - Not using the hook
const MyComponent = () => {
  return <DiceRoller>1d20</DiceRoller>;
};

// ✅ Solution - Use the hook and handle rolls
const MyComponent = () => {
  const { addRoll } = useDiceRollHistory();
  
  const handleRoll = (result) => {
    addRoll(result, 'My roll');
  };
  
  return <DiceRoller onClick={handleRoll}>1d20</DiceRoller>;
};
```

#### Issue: Performance problems with many dice rollers
**Symptoms**: Page becomes slow with multiple DiceRoller components.

**Solutions**:
```typescript
// ✅ Solution - Optimize with React.memo
const OptimizedMonsterCard = React.memo(({ monster }) => {
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

### Debug Mode

Enable detailed logging for development:

```typescript
const DebugDiceRoller = ({ children, ...props }) => {
  const handleRoll = (result) => {
    console.group('Dice Roll Debug');
    console.log('Expression:', result.expression.originalExpression);
    console.log('Individual rolls:', result.rolls);
    console.log('Modifier:', result.modifier);
    console.log('Total:', result.total);
    console.log('Timestamp:', new Date(result.timestamp));
    console.groupEnd();
    
    props.onClick?.(result);
  };

  const handleError = (error) => {
    console.error('Dice Error:', error);
    props.onError?.(error);
  };

  return (
    <DiceRoller 
      {...props}
      onClick={handleRoll}
      onError={handleError}
    >
      {children}
    </DiceRoller>
  );
};
```

## 📚 Additional Resources

### Documentation
- **[Usage Guide](./dice-roller-usage-guide.md)** - Comprehensive usage examples
- **[API Reference](./dice-roller-api-reference.md)** - Complete API documentation
- **[Code Examples](./dice-roller-examples.md)** - Copy-paste ready examples

### Source Code
- **Components**: `src/components/DiceRoller.tsx`, `src/components/DiceResultHoverCard.tsx`
- **Utilities**: `src/lib/dice-utils.ts`
- **Types**: `src/types/dice.ts`
- **Tests**: `src/components/DiceRoller.test.tsx`

### Integration Examples
- **Monster Builder**: See how dice rolling is integrated in `src/components/tools/MonsterBuilderComponent.tsx`
- **Integration Tests**: Check `src/components/DiceRollerIntegrationTest.tsx`

## 🎯 Next Steps

1. **Start Simple**: Begin with basic `<DiceRoller>` usage
2. **Add History**: Integrate `useDiceRollHistory` for roll tracking
3. **Enhance UX**: Use `DiceResultHoverCard` for detailed results
4. **Optimize**: Apply performance best practices
5. **Test**: Write tests for your dice interactions
6. **Extend**: Create custom roll handlers for your game mechanics

## 💬 Support

- **Issues**: Check existing integration test components for working examples
- **Patterns**: Reference the tool components that successfully use the system
- **Performance**: Use React DevTools to profile component performance
- **Accessibility**: Test with screen readers and keyboard navigation

---

**Ready to roll?** Start with the [Usage Guide](./dice-roller-usage-guide.md) for hands-on examples, or dive into the [API Reference](./dice-roller-api-reference.md) for detailed technical documentation. 