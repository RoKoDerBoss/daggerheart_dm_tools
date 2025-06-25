import { 
  ITEMS_DATA, 
  CONSUMABLES_DATA, 
  RARITY_RANGES, 
  RARITY_DICE_COUNTS,
  ADVERSARY_TYPES,
  BATTLE_ADJUSTMENTS,
  calculateBasePoints,
  calculateAdjustments,
  getTotalAdversaryCost,
  type LootItem,
  type LootItemData 
} from '@/data'
import { rollMultipleDice } from '@/lib/dice-utils'

// ===== LOOT GENERATION UTILITIES =====

export type RarityType = 'common' | 'uncommon' | 'rare' | 'legendary'

export function generateLootItem(rarity: string = 'any'): LootItem {
  const diceCount = getDiceCountForRarity(rarity)
  const rollResult = rollDice(diceCount)
  
  // Constrain roll to appropriate range
  let finalRoll = rollResult.total
  if (rarity !== 'any') {
    const range = RARITY_RANGES[rarity as RarityType]
    if (range) {
      finalRoll = Math.max(range.min, Math.min(range.max, rollResult.total))
    }
  }
  
  finalRoll = Math.max(1, Math.min(60, finalRoll))
  
  const itemData = ITEMS_DATA.find(item => item.roll === finalRoll) || ITEMS_DATA[0]
  
  return {
    ...itemData,
    type: 'item',
    rarity: getRarityFromRoll(finalRoll),
    diceRoll: {
      total: rollResult.total,
      rolls: rollResult.rolls
    }
  }
}

export function generateConsumable(): LootItem {
  const diceCount = Math.floor(Math.random() * 5) + 1
  const rollResult = rollDice(diceCount)
  const finalRoll = Math.max(1, Math.min(60, rollResult.total))
  
  const consumableData = CONSUMABLES_DATA.find(item => item.roll === finalRoll) || CONSUMABLES_DATA[0]
  
  return {
    ...consumableData,
    type: 'consumable',
    rarity: getRarityFromRoll(finalRoll),
    diceRoll: {
      total: rollResult.total,
      rolls: rollResult.rolls
    }
  }
}

export function generateMultipleLoot(type: 'item' | 'consumable', quantity: number, rarity?: string): LootItem[] {
  const items: LootItem[] = []
  for (let i = 0; i < quantity; i++) {
    if (type === 'item') {
      items.push(generateLootItem(rarity))
    } else {
      items.push(generateConsumable())
    }
  }
  return items
}

function getDiceCountForRarity(rarity: string): number {
  if (rarity === 'any') {
    return Math.floor(Math.random() * 5) + 1
  }
  
  const diceCounts = RARITY_DICE_COUNTS[rarity as RarityType]
  if (diceCounts) {
    return diceCounts[Math.floor(Math.random() * diceCounts.length)]
  }
  
  return 1
}

function rollDice(count: number) {
  const rolls = rollMultipleDice(count, 12)
  const total = rolls.reduce((sum: number, roll: number) => sum + roll, 0)
  return { total, rolls }
}

function getRarityFromRoll(roll: number): RarityType {
  if (roll <= 12) return 'common'
  if (roll <= 24) return 'uncommon'
  if (roll <= 36) return 'rare'
  return 'legendary'
}

// ===== BATTLE POINTS UTILITIES =====

export interface BattleEncounter {
  partySize: number
  adjustments: Record<string, boolean>
  adversaries: Record<string, number>
}

export function calculateBattlePoints(encounter: BattleEncounter) {
  const basePoints = calculateBasePoints(encounter.partySize)
  const adjustmentModifier = calculateAdjustments(encounter.adjustments)
  const availablePoints = basePoints + adjustmentModifier
  const spentPoints = getTotalAdversaryCost(encounter.adversaries)
  const remainingPoints = availablePoints - spentPoints
  
  return {
    basePoints,
    adjustmentModifier,
    availablePoints,
    spentPoints,
    remainingPoints,
    isOverBudget: remainingPoints < 0,
    hasPointsLeft: remainingPoints > 0 && spentPoints > 0
  }
}

export function exportBattleEncounter(encounter: BattleEncounter): string {
  const calc = calculateBattlePoints(encounter)
  
  const adjustmentsList = Object.entries(encounter.adjustments)
    .filter(([_, active]) => active)
    .map(([id, _]) => {
      const adjustment = BATTLE_ADJUSTMENTS[id]
      return adjustment ? `• ${adjustment.name}: ${adjustment.modifier > 0 ? '+' : ''}${adjustment.modifier}` : ''
    })
    .filter(Boolean)
    .join('\n')
  
  const adversariesList = Object.entries(encounter.adversaries)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => {
      const adversary = ADVERSARY_TYPES[id]
      return adversary ? `• ${adversary.name}: ${count} (${count * adversary.cost} points)` : ''
    })
    .filter(Boolean)
    .join('\n')
  
  return `Battle Points Encounter
========================
Party Size: ${encounter.partySize} PCs
Base Points: ${calc.basePoints}

Adjustments:
${adjustmentsList || '• None'}

Available Points: ${calc.availablePoints}

Adversaries:
${adversariesList || '• None'}

Total Spent: ${calc.spentPoints} points
Remaining: ${calc.remainingPoints} points`
}

// ===== GENERIC DATA ACCESS UTILITIES =====

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const result: T[] = []
  for (let i = 0; i < count; i++) {
    result.push(getRandomItem(array))
  }
  return result
}

export function filterByProperty<T>(array: T[], property: keyof T, value: any): T[] {
  return array.filter(item => item[property] === value)
}

export function findByProperty<T>(array: T[], property: keyof T, value: any): T | undefined {
  return array.find(item => item[property] === value)
}

// ===== VALIDATION UTILITIES =====

export function validatePartySize(size: number): boolean {
  return size >= 1 && size <= 12 && Number.isInteger(size)
}

export function validateQuantity(quantity: number, max: number = 20): boolean {
  return quantity >= 1 && quantity <= max && Number.isInteger(quantity)
}

export function validateRarity(rarity: string): boolean {
  return rarity === 'any' || ['common', 'uncommon', 'rare', 'legendary'].includes(rarity)
} 