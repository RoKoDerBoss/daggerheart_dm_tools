// Loot Data
export * from './loot/items'
export * from './loot/consumables'

// Combat Data
export * from './combat/adversaries'
export * from './combat/battle-points'

// Utility Data (dice utilities moved to @/lib/dice-utils)

// Re-export types for convenience
export type { 
  LootItem, 
  LootItemData 
} from './loot/items'

export type { 
  AdversaryType
} from './combat/adversaries'

export type { 
  BattleAdjustment,
  BattlePointsConfig 
} from './combat/battle-points'

// Note: DieType types now exported from @/lib/dice-utils 