export interface DieType {
  sides: number
  name: string
  common: boolean
}

export interface DiceRoll {
  dieType: number
  count: number
  modifier: number
  advantage?: boolean
  disadvantage?: boolean
}

export interface DiceRollResult {
  rolls: number[]
  total: number
  modifier: number
  finalTotal: number
  diceExpression: string
}

export const STANDARD_DICE: DieType[] = [
  { sides: 4, name: 'd4', common: true },
  { sides: 6, name: 'd6', common: true },
  { sides: 8, name: 'd8', common: true },
  { sides: 10, name: 'd10', common: true },
  { sides: 12, name: 'd12', common: true },
  { sides: 20, name: 'd20', common: true },
  { sides: 100, name: 'd100', common: false }
]

export const COMMON_DAGGERHEART_ROLLS = [
  { name: 'Action Roll', expression: '2d12', description: 'Standard action roll with dual d12s' },
  { name: 'Hope Die', expression: '1d20', description: 'Hope die for adding to action rolls' },
  { name: 'Damage (Light)', expression: '1d4', description: 'Light weapon damage' },
  { name: 'Damage (Medium)', expression: '1d6', description: 'Medium weapon damage' },
  { name: 'Damage (Heavy)', expression: '1d8', description: 'Heavy weapon damage' },
  { name: 'Damage (Very Heavy)', expression: '1d10', description: 'Very heavy weapon damage' },
  { name: 'Magic Damage', expression: '1d20', description: 'Spell damage roll' }
]

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollMultipleDice(count: number, sides: number): number[] {
  const rolls: number[] = []
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides))
  }
  return rolls
}

export function calculateRollTotal(rolls: number[], modifier: number = 0): number {
  return rolls.reduce((sum, roll) => sum + roll, 0) + modifier
}

export function rollDice(diceRoll: DiceRoll): DiceRollResult {
  const rolls = rollMultipleDice(diceRoll.count, diceRoll.dieType)
  const total = rolls.reduce((sum, roll) => sum + roll, 0)
  const finalTotal = total + diceRoll.modifier
  
  const modifierStr = diceRoll.modifier !== 0 
    ? (diceRoll.modifier > 0 ? `+${diceRoll.modifier}` : `${diceRoll.modifier}`)
    : ''
  
  const diceExpression = `${diceRoll.count}d${diceRoll.dieType}${modifierStr}`
  
  return {
    rolls,
    total,
    modifier: diceRoll.modifier,
    finalTotal,
    diceExpression
  }
}

export function parseDiceExpression(expression: string): DiceRoll | null {
  // Basic parser for expressions like "2d12+3" or "1d20-1"
  const regex = /^(\d+)d(\d+)([+-]\d+)?$/i
  const match = expression.trim().match(regex)
  
  if (!match) return null
  
  const count = parseInt(match[1])
  const dieType = parseInt(match[2])
  const modifier = match[3] ? parseInt(match[3]) : 0
  
  return {
    count,
    dieType,
    modifier
  }
}

export function getDieTypeByName(name: string): DieType | undefined {
  return STANDARD_DICE.find(die => die.name.toLowerCase() === name.toLowerCase())
}

export function getCommonDice(): DieType[] {
  return STANDARD_DICE.filter(die => die.common)
} 