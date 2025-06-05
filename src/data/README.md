# Centralized Data Management System

This directory contains the centralized data management system for all tools in the Daggerheart DM Tools application.

## Structure

```
src/data/
├── README.md           # This file
├── index.ts           # Central export point for all data
├── loot/              # Loot generation data
│   ├── items.ts       # Item tables and metadata
│   └── consumables.ts # Consumable tables and metadata
├── combat/            # Combat-related data
│   ├── adversaries.ts # Adversary types and definitions
│   └── battle-points.ts # Battle points calculations
└── utilities/         # Shared utility data
    └── dice.ts        # Dice rolling utilities
```

## Usage

### Importing Data

```typescript
// Import everything from the main index
import { ITEMS_DATA, ADVERSARY_TYPES, rollDice } from '@/data'

// Import specific modules
import { ITEMS_DATA } from '@/data/loot/items'
import { BATTLE_ADJUSTMENTS } from '@/data/combat/battle-points'

// Import types
import type { LootItem, AdversaryType } from '@/data'
```

### Using Data Access Utilities

```typescript
// Import utility functions
import { 
  generateLootItem, 
  calculateBattlePoints,
  exportBattleEncounter 
} from '@/utils/data-access'

// Generate loot
const item = generateLootItem('rare')
const items = generateMultipleLoot('item', 5, 'common')

// Calculate battle points
const encounter = {
  partySize: 4,
  adjustments: { harder: true },
  adversaries: { standard: 2, leader: 1 }
}
const calc = calculateBattlePoints(encounter)
```

## Data Categories

### Generator Data
For tools that generate random content (loot, NPCs, encounters, etc.)
- Contains tables, weights, and generation rules
- Supports different rarity levels and probability distributions
- Example: `loot/items.ts`, `loot/consumables.ts`

### Calculator Data
For tools that perform calculations (battle points, XP, etc.)
- Contains formulas, modifiers, and calculation rules
- Supports validation and constraint checking
- Example: `combat/battle-points.ts`

### Resource Tracker Data
For tools that track resources (HP, inventory, sessions, etc.)
- Contains templates, defaults, and tracking rules
- Supports persistence and state management
- Future tools can follow this pattern

### Utility Data
Shared data used across multiple tools
- Common dice configurations
- Standard game mechanics
- Reusable calculation functions
- Example: `utilities/dice.ts`

## Adding New Data

### For New Tool Types

1. **Create a new category directory**:
   ```bash
   mkdir src/data/new-category
   ```

2. **Add data files**:
   ```typescript
   // src/data/new-category/tool-data.ts
   export interface NewToolData {
     id: string
     name: string
     // ... other properties
   }
   
   export const NEW_TOOL_DATA: NewToolData[] = [
     // ... data entries
   ]
   
   export function newToolFunction(param: string): NewToolData {
     // ... implementation
   }
   ```

3. **Export from main index**:
   ```typescript
   // src/data/index.ts
   export * from './new-category/tool-data'
   ```

4. **Add utility functions**:
   ```typescript
   // src/utils/data-access.ts
   import { NEW_TOOL_DATA } from '@/data'
   
   export function useNewTool(param: string) {
     // ... utility implementation
   }
   ```

### For Existing Categories

1. **Add to existing data files**:
   ```typescript
   // Add new entries to existing arrays
   export const ITEMS_DATA: LootItemData[] = [
     // ... existing items
     { roll: 61, name: "New Item", description: "..." }
   ]
   ```

2. **Create new related files**:
   ```typescript
   // src/data/loot/special-items.ts
   export const SPECIAL_ITEMS_DATA = [
     // ... special item data
   ]
   ```

3. **Update utility functions**:
   ```typescript
   // Add new generation methods
   export function generateSpecialItem(): LootItem {
     // ... implementation
   }
   ```

## Data Validation

All data should include proper TypeScript interfaces:

```typescript
// Define clear interfaces
export interface ToolData {
  id: string
  name: string
  category: 'basic' | 'advanced'
  cost?: number
}

// Use readonly arrays where appropriate
export const TOOL_DATA: readonly ToolData[] = [
  // ... data
] as const
```

## Best Practices

1. **Type Safety**: Always define TypeScript interfaces for data structures
2. **Immutability**: Use `readonly` and `as const` for static data
3. **Modularity**: Keep related data together, separate concerns
4. **Documentation**: Add JSDoc comments for complex functions
5. **Validation**: Include validation functions for user inputs
6. **Extensibility**: Design for future expansion

## Performance Considerations

- Large data arrays are loaded once and cached
- Use lazy loading for optional data
- Consider memory usage for browser-based tools
- Optimize for bundle size in production builds

## Testing

Add tests for:
- Data integrity and completeness
- Calculation accuracy
- Edge cases and error handling
- Performance with large datasets

Example test structure:
```typescript
describe('Loot Generation', () => {
  test('generates valid items for all rarities', () => {
    // ... test implementation
  })
  
  test('respects quantity limits', () => {
    // ... test implementation
  })
})
``` 