export interface BattleAdjustment {
  id: string
  name: string
  description: string
  modifier: number
  category: 'easier' | 'harder'
}

export interface BattlePointsConfig {
  basePointsPerPC: number
  basePointsConstant: number
  minPartySize: number
  maxPartySize: number
}

export const BATTLE_ADJUSTMENTS: Record<string, BattleAdjustment> = {
  easier: {
    id: 'easier',
    name: 'Easier/Shorter Fight',
    description: 'The encounter is intended to be easier than normal or will be resolved quickly.',
    modifier: -1,
    category: 'easier'
  },
  twoSolos: {
    id: 'twoSolos',
    name: 'Using 2+ Solo Adversaries',
    description: 'Multiple solo adversaries can overwhelm action economy, so reduce points to compensate.',
    modifier: -2,
    category: 'easier'
  },
  bonusDamage: {
    id: 'bonusDamage',
    name: 'Bonus Damage (+1d4 or +2)',
    description: 'Adversaries deal additional damage, making the encounter more dangerous.',
    modifier: -2,
    category: 'easier'
  },
  lowerTier: {
    id: 'lowerTier',
    name: 'Lower Tier Adversary',
    description: 'Using adversaries from a lower tier than the party level.',
    modifier: 1,
    category: 'harder'
  },
  noBruisersEtc: {
    id: 'noBruisersEtc',
    name: 'No Bruisers/Hordes/Leaders/Solos',
    description: 'Only using basic adversary types limits tactical complexity.',
    modifier: 1,
    category: 'harder'
  },
  harder: {
    id: 'harder',
    name: 'Harder/Longer Fight',
    description: 'The encounter is intended to be more challenging than normal.',
    modifier: 2,
    category: 'harder'
  }
}

export const BATTLE_POINTS_CONFIG: BattlePointsConfig = {
  basePointsPerPC: 3,
  basePointsConstant: 2,
  minPartySize: 1,
  maxPartySize: 12
}

export function calculateBasePoints(partySize: number): number {
  const clampedSize = Math.max(
    BATTLE_POINTS_CONFIG.minPartySize, 
    Math.min(BATTLE_POINTS_CONFIG.maxPartySize, partySize)
  )
  return (clampedSize * BATTLE_POINTS_CONFIG.basePointsPerPC) + BATTLE_POINTS_CONFIG.basePointsConstant
}

export function calculateAdjustments(activeAdjustments: Record<string, boolean>): number {
  return Object.entries(activeAdjustments).reduce((total, [id, isActive]) => {
    if (isActive && BATTLE_ADJUSTMENTS[id]) {
      return total + BATTLE_ADJUSTMENTS[id].modifier
    }
    return total
  }, 0)
}

export function calculateAvailablePoints(partySize: number, adjustments: Record<string, boolean>): number {
  return calculateBasePoints(partySize) + calculateAdjustments(adjustments)
}

export function getAdjustmentsByCategory(category: 'easier' | 'harder'): BattleAdjustment[] {
  return Object.values(BATTLE_ADJUSTMENTS).filter(adj => adj.category === category)
}

export function getAdjustmentById(id: string): BattleAdjustment | undefined {
  return BATTLE_ADJUSTMENTS[id]
} 