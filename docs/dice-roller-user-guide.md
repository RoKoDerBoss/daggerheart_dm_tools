# Daggerheart Dice Roller - Complete User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Interactive Examples](#interactive-examples)
5. [Mobile Optimization](#mobile-optimization)
6. [Troubleshooting](#troubleshooting)

## Getting Started

The Daggerheart Dice Roller provides an intuitive way to roll dice directly in your content by simply typing dice expressions.

### Quick Start

```tsx
import { DiceRoller } from '@/components/dice';

function MyComponent() {
  return (
    <DiceRoller>
      Roll for attack: 1d20+5
    </DiceRoller>
  );
}
```

When users click on "1d20+5", it automatically becomes a clickable dice roll!

## Basic Usage

### Simple Dice Expressions

The most common dice expressions:

```tsx
<DiceRoller>Try rolling 1d20 for initiative!</DiceRoller>
<DiceRoller>Damage roll: 2d6+3</DiceRoller>
<DiceRoller>Fireball: 8d6</DiceRoller>
```

### Supported Dice Formats

- **Basic**: `1d20`, `2d6`, `3d8`
- **With Modifiers**: `1d20+5`, `2d6-1`, `1d8+3`
- **Complex**: `2d6+2+1d4`, `1d20+1d4+3`

## Advanced Features

### Roll Types

#### Advantage/Disadvantage
```tsx
<DiceRoller>
  Roll with advantage: 1d20+5
  {/* Click the dice, then click "Adv" button */}
</DiceRoller>
```

#### Critical Hits
```tsx
<DiceRoller>
  Critical damage: 2d8+4
  {/* Click "Crit" to double the dice */}
</DiceRoller>
```

### Roll History

The component automatically tracks roll history:

```tsx
<DiceRoller showHistory={true}>
  Make multiple rolls: 1d20, 2d6, 1d8
</DiceRoller>
```

## Interactive Examples

### Combat Scenario

```tsx
function CombatExample() {
  return (
    <div className="space-y-4">
      <h3>Orc Warrior Combat</h3>
      
      <div className="bg-muted p-4 rounded-lg">
        <h4>Actions</h4>
        <DiceRoller>
          **Battleaxe Attack**: Roll 1d20+5 to hit
        </DiceRoller>
        <DiceRoller>
          **Damage**: On hit, deal 1d8+3 slashing damage
        </DiceRoller>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h4>Saving Throws</h4>
        <DiceRoller>
          **Constitution Save**: 1d20+2
        </DiceRoller>
        <DiceRoller>
          **Wisdom Save**: 1d20+0
        </DiceRoller>
      </div>
    </div>
  );
}
```

### Character Creation

```tsx
function CharacterCreation() {
  return (
    <div className="space-y-4">
      <h3>Roll Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <DiceRoller>**Strength**: 3d6</DiceRoller>
        <DiceRoller>**Dexterity**: 3d6</DiceRoller>
        <DiceRoller>**Constitution**: 3d6</DiceRoller>
        <DiceRoller>**Intelligence**: 3d6</DiceRoller>
        <DiceRoller>**Wisdom**: 3d6</DiceRoller>
        <DiceRoller>**Charisma**: 3d6</DiceRoller>
      </div>
      
      <DiceRoller>
        **Starting Gold**: 4d4 × 10 gp
      </DiceRoller>
    </div>
  );
}
```

### Spell Effects

```tsx
function SpellExample() {
  return (
    <div className="space-y-4">
      <h3>Wizard Spells</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4>Magic Missile</h4>
        <p>Level 1 Evocation</p>
        <DiceRoller>
          Each dart deals 1d4+1 force damage
        </DiceRoller>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg">
        <h4>Fireball</h4>
        <p>Level 3 Evocation</p>
        <DiceRoller>
          Deals 8d6 fire damage (Dex save for half)
        </DiceRoller>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4>Cure Wounds</h4>
        <p>Level 1 Evocation</p>
        <DiceRoller>
          Heals 1d8+3 hit points
        </DiceRoller>
      </div>
    </div>
  );
}
```

## Mobile Optimization

The dice roller is fully optimized for mobile devices:

### Touch-Friendly Design
- **44px minimum touch targets** for all clickable elements
- **Swipe gestures** for accessing roll history
- **Bottom sheet interface** for dice results on mobile

### Responsive Layout
```tsx
<DiceRoller compactMobile={true}>
  This text will be more compact on mobile: 1d20+5
</DiceRoller>
```

### Mobile-Specific Features
- **Auto-collapse results** after 10 seconds
- **Gesture navigation** in result cards
- **Safe area support** for notched devices

## Troubleshooting

### Common Issues

#### Dice Not Clickable
**Problem**: Dice expressions don't become clickable
**Solution**: Ensure expressions follow the format `XdY+Z`

```tsx
// ❌ Not detected
<DiceRoller>Roll a d20</DiceRoller>

// ✅ Correctly detected  
<DiceRoller>Roll 1d20</DiceRoller>
```

#### Results Not Showing
**Problem**: Dice roll but no result appears
**Solution**: Ensure you have the global dice context

```tsx
// App.tsx or layout.tsx
import { DiceProvider } from '@/contexts/DiceContext';
import { GlobalDiceResultCard } from '@/components/dice';

export default function App() {
  return (
    <DiceProvider>
      <YourAppContent />
      <GlobalDiceResultCard />
    </DiceProvider>
  );
}
```

#### Mobile Display Issues
**Problem**: Dice results not displaying properly on mobile
**Solution**: Check your viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid dice expression" | Malformed dice syntax | Use format `XdY+Z` |
| "Too many dice" | Expression exceeds limits | Reduce dice count |
| "Invalid modifier" | Modifier too large | Keep modifiers reasonable |

### Performance Tips

1. **Limit concurrent rolls** - Don't roll hundreds of dice at once
2. **Use roll history** - Access previous results instead of re-rolling
3. **Clear history** - Periodically clear old rolls to improve performance

### Browser Support

The dice roller supports:
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

For older browsers, dice expressions will display as plain text.

---

*For developers looking to integrate or customize the dice roller, see the [Developer Guide](./dice-roller-developer-guide.md) and [API Reference](./dice-roller-api-reference.md).* 