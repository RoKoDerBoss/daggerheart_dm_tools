export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: 'active' | 'coming-soon' | 'beta'
  features: string[]
  component?: string // For future component mapping
}

export const TOOL_CATEGORIES = {
  EQUIPMENT: 'Equipment',
  COMBAT: 'Combat',
  UTILITIES: 'Utilities'
} as const

export const TOOLS_REGISTRY: Record<string, Tool> = {
  'random-loot-generator': {
    id: 'random-loot-generator',
    name: 'Random Loot Generator',
    description: 'Generate exciting treasure and loot for your adventures with customizable rarity and item types.',
    icon: '💰',
    category: TOOL_CATEGORIES.EQUIPMENT,
    status: 'active',
    features: [
      'Generate items by rarity (Common, Uncommon, Rare, Legendary)',
      'Generate consumables with varied effects',
      'Dice-based rolling system with visual feedback',
      'Detailed item descriptions and rarity indicators',
      'Balanced for Daggerheart economy'
    ],
    component: 'LootGeneratorComponent'
  },
  'battle-point-calculator': {
    id: 'battle-point-calculator',
    name: 'Battle Point Calculator',
    description: 'Calculate and track battle points for encounters, helping balance challenging fights.',
    icon: '⚔️',
    category: TOOL_CATEGORIES.COMBAT,
    status: 'active',
    features: [
      'Calculate encounter difficulty based on party size',
      'Track battle points with adjustments and modifiers',
      'Support for all adversary types and costs',
      'Export encounter details for reference',
      'Real-time budget tracking and warnings'
    ],
    component: 'BattlePointsCalculatorComponent'
  },
  'dice-roller': {
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll any combination of dice with modifiers for all your Daggerheart mechanics.',
    icon: '🎯',
    category: TOOL_CATEGORIES.UTILITIES,
    status: 'coming-soon',
    features: [
      'Standard dice rolling (d4, d6, d8, d10, d12, d20)',
      'Multiple dice rolls with modifiers',
      'Advantage/disadvantage system support',
      'Roll history and saved combinations',
      'Quick access to common Daggerheart rolls'
    ]
  }
}

// Helper functions
export function getAllTools(): Tool[] {
  return Object.values(TOOLS_REGISTRY)
}

export function getTool(id: string): Tool | undefined {
  return TOOLS_REGISTRY[id]
}

export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter(tool => tool.category === category)
}

export function getFeaturedTools(): Tool[] {
  return getAllTools().filter(tool => 
    tool.id === 'random-loot-generator' || tool.id === 'battle-point-calculator'
  )
}

export function getAvailableToolIds(): string[] {
  return Object.keys(TOOLS_REGISTRY)
} 