// Import the data files
import adversaryStatsData from '@/data/combat/adversary-stats.json'
import adversaryFeaturesData from '@/data/combat/adversary-features.json'

// Interfaces
export interface MonsterStats {
  type: string
  tier: number
  difficulty: number
  threshold: string
  attack: string
  damage: string
  hitpoints: number
  stress: number
  features: number
}

export interface MonsterFeature {
  category: string
  name: string
  description: string
}

export interface GeneratedMonster {
  id: string
  name: string
  type: string
  tier: number
  stats: MonsterStats
  selectedFeatures: MonsterFeature[]
}

// Constants
export const MONSTER_TYPES = [
  'Standard', 'Bruiser', 'Horde', 'Minion', 'Solo', 
  'Leader', 'Ranged', 'Skulk', 'Support', 'Social'
] as const

export const FEATURE_CATEGORIES = [
  'General', 'Bruiser', 'Horde', 'Leader', 'Minion', 
  'Skulk', 'Solo', 'Support'
] as const

export const TIERS = [1, 2, 3, 4] as const

export type MonsterType = typeof MONSTER_TYPES[number]
export type FeatureCategory = typeof FEATURE_CATEGORIES[number]
export type Tier = typeof TIERS[number]

// Helper functions
function processAdversaryData() {
  const processedData = []
  let currentType = ''
  
  for (const entry of adversaryStatsData) {
    if (entry['Role (Type)']) {
      currentType = entry['Role (Type)']
    }
    
    // Skip entries with N/A values
    if (entry.Difficulty === 'N/A' || !entry.Tier) {
      continue
    }
    
    processedData.push({
      ...entry,
      'Role (Type)': currentType
    })
  }
  
  return processedData
}

export function getMonsterStats(type: MonsterType, tier: Tier): MonsterStats | null {
  const processedData = processAdversaryData()
  
  // Find the stat entry for the specific type and tier
  const statEntry = processedData.find(entry => 
    entry['Role (Type)'] === type && entry.Tier === tier
  )
  
  if (!statEntry) return null
  
  return {
    type,
    tier,
    difficulty: Number(statEntry.Difficulty),
    threshold: String(statEntry['Threshold (Major/Severe)']),
    attack: String(statEntry.Attack),
    damage: String(statEntry.Damage),
    hitpoints: Number(statEntry.Hitpoints),
    stress: Number(statEntry.Stress),
    features: Number(statEntry.Features)
  }
}

export function getAvailableFeatures(type: MonsterType): MonsterFeature[] {
  const typeCategory = type === 'Standard' ? 'General' : type
  
  // Get features for the specific type and general features
  const features = adversaryFeaturesData
    .filter(feature => 
      feature.Category === 'General' || 
      feature.Category === typeCategory
    )
    .map(feature => ({
      category: feature.Category,
      name: feature['Feature Type'],
      description: feature.Description
    }))
  
  return features
}

export function selectRandomFeatures(
  availableFeatures: MonsterFeature[], 
  maxFeatures: number
): MonsterFeature[] {
  if (availableFeatures.length <= maxFeatures) {
    return [...availableFeatures]
  }
  
  const selected: MonsterFeature[] = []
  const featuresCopy = [...availableFeatures]
  const selectedFeatureNames = new Set<string>()
  
  // Always include at least one general feature if available
  const generalFeatures = featuresCopy.filter(f => f.category === 'General')
  if (generalFeatures.length > 0) {
    const randomGeneral = generalFeatures[Math.floor(Math.random() * generalFeatures.length)]
    selected.push(randomGeneral)
    selectedFeatureNames.add(randomGeneral.name)
    featuresCopy.splice(featuresCopy.indexOf(randomGeneral), 1)
  }
  
  // Fill remaining slots randomly, ensuring no duplicate feature names
  while (selected.length < maxFeatures && featuresCopy.length > 0) {
    const availableUniqueFeatures = featuresCopy.filter(f => !selectedFeatureNames.has(f.name))
    
    if (availableUniqueFeatures.length === 0) {
      break // No more unique features available
    }
    
    const randomIndex = Math.floor(Math.random() * availableUniqueFeatures.length)
    const selectedFeature = availableUniqueFeatures[randomIndex]
    
    selected.push(selectedFeature)
    selectedFeatureNames.add(selectedFeature.name)
    featuresCopy.splice(featuresCopy.indexOf(selectedFeature), 1)
  }
  
  return selected
}

export function generateMonster(type: MonsterType, tier: Tier): GeneratedMonster | null {
  const stats = getMonsterStats(type, tier)
  if (!stats) return null
  
  const availableFeatures = getAvailableFeatures(type)
  const selectedFeatures = selectRandomFeatures(availableFeatures, stats.features)
  
  return {
    id: generateMonsterId(),
    name: '',
    type,
    tier,
    stats,
    selectedFeatures
  }
}

export function generateMultipleMonsters(
  type: MonsterType, 
  tier: Tier, 
  count: number
): GeneratedMonster[] {
  const monsters: GeneratedMonster[] = []
  
  for (let i = 0; i < count; i++) {
    const monster = generateMonster(type, tier)
    if (monster) {
      monsters.push(monster)
    }
  }
  
  return monsters
}

export function formatMonsterForExport(monster: GeneratedMonster): string {
  const { name, type, tier, stats, selectedFeatures } = monster
  const monsterName = name.trim() || 'Unnamed Monster'
  const thresholdText = stats.threshold === "N/A" ? "No Threshold" : stats.threshold
  
  let output = `${monsterName} | ${type}, Tier ${tier}\n`
  output += `Difficulty: ${stats.difficulty} | Threshold: ${thresholdText}\n`
  output += `Attack: ${stats.attack} | Damage: ${stats.damage}\n`
  output += `HP: ${stats.hitpoints} | Stress: ${stats.stress}\n\n`
  
  if (selectedFeatures.length > 0) {
    output += `Features:\n`
    selectedFeatures.forEach(feature => {
      output += `• ${feature.name}: ${feature.description}\n`
    })
  }
  
  return output
}

export function exportMonsterAsFile(monster: GeneratedMonster): void {
  const content = formatMonsterForExport(monster)
  const monsterName = monster.name.trim() || 'Unnamed_Monster'
  const filename = `${monsterName.replace(/\s+/g, '_')}_${monster.type}_T${monster.tier}.txt`
  
  // Create and trigger download
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportMultipleMonstersAsFile(monsters: GeneratedMonster[]): void {
  let content = `Generated Monsters (${monsters.length})\n`
  content += `${'='.repeat(50)}\n\n`
  
  monsters.forEach((monster, index) => {
    content += `${index + 1}. ${formatMonsterForExport(monster)}\n`
    if (index < monsters.length - 1) {
      content += `${'-'.repeat(40)}\n\n`
    }
  })
  
  const filename = `Multiple_Monsters_${new Date().toISOString().split('T')[0]}.txt`
  
  // Create and trigger download
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Utility function to generate unique IDs
function generateMonsterId(): string {
  return `monster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Validation functions
export function isValidMonsterType(type: string): type is MonsterType {
  return MONSTER_TYPES.includes(type as MonsterType)
}

export function isValidTier(tier: number): tier is Tier {
  return TIERS.includes(tier as Tier)
}

export function getAvailableTiersForType(type: MonsterType): Tier[] {
  const processedData = processAdversaryData()
  
  const availableTiers = processedData
    .filter(entry => entry['Role (Type)'] === type)
    .map(entry => entry.Tier)
    .filter((tier, index, arr) => arr.indexOf(tier) === index) // Remove duplicates
    .sort((a, b) => a - b)
  
  return availableTiers as Tier[]
} 