export interface AdversaryType {
  id: string
  name: string
  description: string
  cost: number
  category: 'basic' | 'elite' | 'boss'
  icon: string
}

export const ADVERSARY_TYPES: Record<string, AdversaryType> = {
  minions: {
    id: 'minions',
    name: 'Minions',
    description: 'Weak creatures that work in groups. Easy to defeat individually but dangerous in numbers.',
    cost: 1,
    category: 'basic',
    icon: '👥'
  },
  social: {
    id: 'social',
    name: 'Social/Support',
    description: 'Non-combat adversaries or creatures that support others. May negotiate or provide assistance to enemies.',
    cost: 1,
    category: 'basic',
    icon: '💬'
  },
  horde: {
    id: 'horde',
    name: 'Horde',
    description: 'Large groups of creatures acting as a single entity. Overwhelming numbers with coordinated attacks.',
    cost: 2,
    category: 'basic',
    icon: '⚡'
  },
  ranged: {
    id: 'ranged',
    name: 'Ranged',
    description: 'Adversaries that prefer to attack from a distance. Often stay back and provide covering fire.',
    cost: 2,
    category: 'basic',
    icon: '🏹'
  },
  skulk: {
    id: 'skulk',
    name: 'Skulk',
    description: 'Stealthy adversaries that use cunning and ambush tactics. May appear and disappear during combat.',
    cost: 2,
    category: 'basic',
    icon: '👁️'
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'Typical adversaries with balanced capabilities. The baseline for most encounters.',
    cost: 2,
    category: 'basic',
    icon: '⚔️'
  },
  leader: {
    id: 'leader',
    name: 'Leader',
    description: 'Commanding adversaries that coordinate others and have enhanced abilities.',
    cost: 3,
    category: 'elite',
    icon: '👑'
  },
  bruiser: {
    id: 'bruiser',
    name: 'Bruiser',
    description: 'Tough, heavily armored adversaries that can take and deal significant damage.',
    cost: 4,
    category: 'elite',
    icon: '🔨'
  },
  solo: {
    id: 'solo',
    name: 'Solo',
    description: 'Powerful adversaries designed to face an entire party alone. Boss-level threats.',
    cost: 5,
    category: 'boss',
    icon: '⭐'
  }
}

export const ADVERSARY_CATEGORIES = {
  BASIC: 'basic',
  ELITE: 'elite', 
  BOSS: 'boss'
} as const

export function getAdversariesByCategory(category: string): AdversaryType[] {
  return Object.values(ADVERSARY_TYPES).filter(adversary => adversary.category === category)
}

export function getAdversaryById(id: string): AdversaryType | undefined {
  return ADVERSARY_TYPES[id]
}

export function getTotalAdversaryCost(adversaries: Record<string, number>): number {
  return Object.entries(adversaries).reduce((total, [id, count]) => {
    const adversary = getAdversaryById(id)
    return total + (adversary ? adversary.cost * count : 0)
  }, 0)
} 