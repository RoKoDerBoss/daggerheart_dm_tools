# Data Access Utilities

This directory contains utility functions that provide a clean interface for accessing and manipulating the centralized data system.

## Overview

The `data-access.ts` file provides high-level functions that tools can use to interact with data without needing to understand the underlying data structures or implement complex logic themselves.

## Core Utilities

### Loot Generation

```typescript
import { generateLootItem, generateMultipleLoot } from '@/utils/data-access'

// Generate a single item
const item = generateLootItem('rare')
const anyRarityItem = generateLootItem('any')

// Generate multiple items
const items = generateMultipleLoot('item', 5, 'common')
const consumables = generateMultipleLoot('consumable', 3)
```

**Features:**
- Automatic dice rolling with rarity-appropriate dice counts
- Roll constraints to ensure valid results
- Rarity determination from roll results
- Support for both items and consumables

### Battle Points Calculation

```typescript
import { calculateBattlePoints, exportBattleEncounter } from '@/utils/data-access'

const encounter = {
  partySize: 4,
  adjustments: { harder: true, lowerTier: false },
  adversaries: { standard: 2, leader: 1, solo: 0 }
}

const calc = calculateBattlePoints(encounter)
// Returns: { basePoints, adjustmentModifier, availablePoints, spentPoints, remainingPoints, isOverBudget, hasPointsLeft }

const exportText = exportBattleEncounter(encounter)
```

**Features:**
- Automatic calculation of base points from party size
- Adjustment modifier calculation
- Adversary cost calculation
- Budget validation and status checking
- Export formatting for encounters

### Generic Data Access

```typescript
import { getRandomItem, filterByProperty, validatePartySize } from '@/utils/data-access'

// Get random items from arrays
const randomAdversary = getRandomItem(ADVERSARY_TYPES)
const randomItems = getRandomItems(ITEMS_DATA, 3)

// Filter data
const basicAdversaries = filterByProperty(ADVERSARY_TYPES, 'category', 'basic')
const legendaryItems = filterByProperty(ITEMS_DATA, 'rarity', 'legendary')

// Validation
const isValidParty = validatePartySize(4) // true
const isValidQuantity = validateQuantity(25, 20) // false
```

**Features:**
- Generic utility functions for common operations
- Input validation for user data
- Type-safe filtering and searching
- Random selection utilities

## Adding New Utilities

When adding new tools or data types, follow this pattern:

### 1. Create Tool-Specific Functions

```typescript
// For a new spell generator tool
export function generateSpell(level: number, school?: string): Spell {
  // Implementation using centralized spell data
}

export function generateSpellbook(spellCount: number, maxLevel: number): Spell[] {
  // Implementation
}
```

### 2. Add Calculation Functions

```typescript
// For XP calculation
export interface XPEncounter {
  partyLevel: number
  partySize: number
  monsters: MonsterXP[]
}

export function calculateXP(encounter: XPEncounter): XPResult {
  // Implementation using XP tables from data
}
```

### 3. Add Export/Import Functions

```typescript
export function exportSpellbook(spells: Spell[]): string {
  // Format for export
}

export function importSpellbook(data: string): Spell[] {
  // Parse imported data
}
```

## Design Principles

### Separation of Concerns
- **Data**: Static tables and constants in `/data`
- **Logic**: Business logic and calculations in `/utils/data-access`
- **UI**: React components that call utility functions

### Type Safety
All functions include proper TypeScript types:
```typescript
export function generateLootItem(rarity: RarityType = 'any'): LootItem
export function validateQuantity(quantity: number, max: number = 20): boolean
```

### Error Handling
Functions handle edge cases gracefully:
```typescript
export function generateLootItem(rarity: string = 'any'): LootItem {
  // Validate input
  if (!validateRarity(rarity)) {
    rarity = 'any'
  }
  
  // Ensure valid results
  const finalRoll = Math.max(1, Math.min(60, rollResult.total))
  
  // Fallback for missing data
  const itemData = ITEMS_DATA.find(item => item.roll === finalRoll) || ITEMS_DATA[0]
}
```

### Performance
- Functions are optimized for repeated calls
- Large calculations are memoized where appropriate
- Data lookups use efficient algorithms

## Testing

Utility functions should be thoroughly tested:

```typescript
// Example test file: data-access.test.ts
describe('Loot Generation', () => {
  test('generates items within rarity constraints', () => {
    const item = generateLootItem('common')
    expect(['common', 'uncommon', 'rare', 'legendary']).toContain(item.rarity)
  })
  
  test('respects quantity limits', () => {
    const items = generateMultipleLoot('item', 5)
    expect(items).toHaveLength(5)
  })
})

describe('Battle Points', () => {
  test('calculates correct base points', () => {
    const encounter = { partySize: 4, adjustments: {}, adversaries: {} }
    const calc = calculateBattlePoints(encounter)
    expect(calc.basePoints).toBe(14) // (4 * 3) + 2
  })
})
```

## Integration with Components

Components should use these utilities rather than implementing logic directly:

```typescript
// ✅ Good - using utilities
import { generateLootItem } from '@/utils/data-access'

const handleGenerate = () => {
  const item = generateLootItem(selectedRarity)
  setGeneratedItem(item)
}

// ❌ Bad - implementing logic in component
const handleGenerate = () => {
  const diceCount = rarity === 'common' ? 2 : 4
  const roll = Math.floor(Math.random() * 12) + 1
  // ... complex logic
}
```

This approach keeps components focused on UI concerns and makes the business logic reusable and testable. 