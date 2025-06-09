'use client'

import { useState, useRef } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { 
  generateMonster, 
  generateMultipleMonsters,
  getAvailableFeatures,
  exportMonsterAsFile,
  exportMultipleMonstersAsFile,
  MONSTER_TYPES, 
  TIERS,
  type GeneratedMonster,
  type MonsterType,
  type Tier,
  type MonsterFeature
} from '@/lib/monster-utils'
import ToolInfo from '@/components/ToolInfo'

export default function MonsterBuilderComponent() {
  const [selectedTier, setSelectedTier] = useState<Tier>(1)
  const [selectedType, setSelectedType] = useState<MonsterType>('Standard')
  const [currentMonster, setCurrentMonster] = useState<GeneratedMonster | null>(null)
  const [generatedMonsters, setGeneratedMonsters] = useState<GeneratedMonster[]>([])
  const [bulkCount, setBulkCount] = useState(2)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set())
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  
  const monsterDisplayRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    try {
      if (isBulkMode) {
        const monsters = generateMultipleMonsters(selectedType, selectedTier, bulkCount)
        setGeneratedMonsters(monsters)
        setCurrentMonster(null)
      } else {
        const monster = generateMonster(selectedType, selectedTier)
        setCurrentMonster(monster)
        setGeneratedMonsters([])
      }
      setExpandedFeatures(new Set())
      
      // Scroll to monster display after generation with smooth animation
      setTimeout(() => {
        if (monsterDisplayRef.current) {
          // Add smooth scrolling to html element temporarily if not set
          const htmlElement = document.documentElement
          const originalScrollBehavior = htmlElement.style.scrollBehavior
          htmlElement.style.scrollBehavior = 'smooth'
          
          monsterDisplayRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
          
          // Restore original scroll behavior after scroll completes
          setTimeout(() => {
            if (originalScrollBehavior) {
              htmlElement.style.scrollBehavior = originalScrollBehavior
            } else {
              htmlElement.style.removeProperty('scroll-behavior')
            }
          }, 1000)
        }
      }, 300) // Slight delay to ensure content is rendered
    } catch (error) {
      console.error('Error generating monster(s):', error)
    } finally {
      setTimeout(() => setIsGenerating(false), 500) // Brief delay for better UX
    }
  }

  const handleReset = () => {
    setCurrentMonster(null)
    setGeneratedMonsters([])
    setExpandedFeatures(new Set())
    setShowResetConfirmation(false)
  }

  const handleCopyStats = (monster: GeneratedMonster) => {
    const thresholdText = monster.stats.threshold === "N/A" ? "No Threshold" : monster.stats.threshold
    const statsText = `${monster.name || 'Unnamed Monster'} | ${monster.type}, Tier ${monster.tier}
Difficulty: ${monster.stats.difficulty} | Threshold: ${thresholdText}
Attack: ${monster.stats.attack} | Damage: ${monster.stats.damage}
HP: ${monster.stats.hitpoints} | Stress: ${monster.stats.stress}`
    
    navigator.clipboard.writeText(statsText).then(() => {
      // Could add a toast notification here
    }).catch(err => {
      console.error('Failed to copy stats:', err)
    })
  }

  const toggleFeatureExpansion = (featureKey: string) => {
    const newExpanded = new Set(expandedFeatures)
    if (newExpanded.has(featureKey)) {
      newExpanded.delete(featureKey)
    } else {
      newExpanded.add(featureKey)
    }
    setExpandedFeatures(newExpanded)
  }

  const toggleDropdown = (featureKey: string) => {
    const newOpen = new Set(openDropdowns)
    if (newOpen.has(featureKey)) {
      newOpen.delete(featureKey)
    } else {
      newOpen.clear() // Close all other dropdowns
      newOpen.add(featureKey)
    }
    setOpenDropdowns(newOpen)
  }

  const getFeatureType = (featureName: string): string => {
    if (featureName.toLowerCase().includes('passive') || featureName.includes('(X)')) return 'Passive'
    if (featureName.toLowerCase().includes('reaction')) return 'Reaction'
    return 'Action'
  }

  const handleMonsterNameChange = (monsterId: string, newName: string) => {
    if (currentMonster && currentMonster.id === monsterId) {
      setCurrentMonster({ ...currentMonster, name: newName })
    } else {
      setGeneratedMonsters(prev => 
        prev.map(monster => 
          monster.id === monsterId 
            ? { ...monster, name: newName }
            : monster
        )
      )
    }
  }

  const handleFeatureChange = (monsterId: string, featureIndex: number, newFeature: MonsterFeature) => {
    if (currentMonster && currentMonster.id === monsterId) {
      const updatedFeatures = [...currentMonster.selectedFeatures]
      updatedFeatures[featureIndex] = newFeature
      setCurrentMonster({ ...currentMonster, selectedFeatures: updatedFeatures })
    } else {
      setGeneratedMonsters(prev => 
        prev.map(monster => {
          if (monster.id === monsterId) {
            const updatedFeatures = [...monster.selectedFeatures]
            updatedFeatures[featureIndex] = newFeature
            return { ...monster, selectedFeatures: updatedFeatures }
          }
          return monster
        })
      )
    }
  }

  const handleExportSingle = (monster: GeneratedMonster) => {
    exportMonsterAsFile(monster)
  }

  const handleExportMultiple = () => {
    exportMultipleMonstersAsFile(generatedMonsters)
  }

  const adjustBulkCount = (delta: number) => {
    const newCount = Math.max(2, Math.min(4, bulkCount + delta))
    setBulkCount(newCount)
  }

  const renderMonsterCard = (monster: GeneratedMonster, index?: number) => {
    const availableFeatures = getAvailableFeatures(monster.type as MonsterType)
    
    return (
      <div key={monster.id} className="relative fantasy-card bg-gradient-to-br from-background to-muted/20 border-2 border-accent/30 p-4 sm:p-6 max-w-md overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={monster.name}
                onChange={(e) => handleMonsterNameChange(monster.id, e.target.value)}
                className="text-lg sm:text-2xl font-bold bg-transparent border-none outline-none text-foreground hover:bg-accent/10 focus:bg-accent/10 px-2 py-1 rounded flex-1"
                placeholder="Click to edit name"
              />
              <button
                onClick={() => {
                  const input = document.querySelector(`input[value="${monster.name}"]`) as HTMLInputElement
                  input?.focus()
                }}
                className="hidden sm:block text-muted-foreground hover:text-accent transition-colors p-2"
                title="Edit name"
              >
                ✏️
              </button>
            </div>
            <p className="text-accent font-semibold ml-2 text-sm sm:text-base">
              {monster.type}, Tier {monster.tier}
            </p>
          </div>
          {typeof index === 'number' && (
            <div className="bg-accent/20 text-accent px-2 sm:px-3 py-1 rounded-full font-bold text-sm sm:text-base">
              #{index + 1}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
          {/* Row 1: DIFFICULTY, HP, STRESS */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-green-500/30 p-1.5 sm:p-2 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-0.5">DIFFICULTY</div>
              <div className="font-bold text-base sm:text-lg text-foreground">{monster.stats.difficulty}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-green-500/30 p-1.5 sm:p-2 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-0.5">HP</div>
              <div className="font-bold text-base sm:text-lg text-foreground">{monster.stats.hitpoints}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-green-500/30 p-1.5 sm:p-2 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-0.5">STRESS</div>
              <div className="font-bold text-base sm:text-lg text-foreground">{monster.stats.stress}</div>
            </div>
          </div>

          {/* Row 2: THRESHOLD (Full Width) */}
          <div className="grid grid-cols-1">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/30 p-1.5 sm:p-2 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-1">THRESHOLD</div>
              <div className="text-xs text-foreground">
                {monster.stats.threshold === "N/A" ? (
                  <span className="text-sm sm:text-lg text-muted-foreground">No Threshold (Dies in one hit)</span>
                ) : (
                  <>
                    <span className="text-foreground text-xs sm:text-sm font-light italic">Minor</span>
                    <span className="text-foreground text-sm sm:text-base mx-1 font-light"> |ㅤ</span>
                    <span className="text-foreground text-lg sm:text-xl font-bold">{monster.stats.threshold.split(' / ')[0]}</span>
                    <span className="text-foreground text-sm sm:text-base mx-1 font-light">ㅤ| </span>
                    <span className="text-foreground text-xs sm:text-sm font-light italic">Major</span>
                    <span className="text-foreground text-sm sm:text-base mx-1 font-light"> |ㅤ</span>
                    <span className="text-foreground text-lg sm:text-xl font-bold">{monster.stats.threshold.split(' / ')[1]}</span>
                    <span className="text-foreground text-sm sm:text-base mx-1 font-light">ㅤ| </span>
                    <span className="text-foreground text-xs sm:text-sm font-light italic">Severe</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: ATTACK (1 column), DAMAGE (2 columns) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-red-400/30 p-1.5 sm:p-2 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-0.5">ATTACK</div>
              <div className="font-bold text-base sm:text-lg text-foreground">{monster.stats.attack}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-red-400/30 p-1.5 sm:p-2 rounded-xl text-center col-span-2">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-0.5">DAMAGE</div>
              <div className="font-bold text-base sm:text-lg text-foreground">{monster.stats.damage}</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">Features:</h4>
          <div className="space-y-2">
            {monster.selectedFeatures
              .map((feature, originalIndex) => ({ feature, originalIndex }))
              .sort((a, b) => {
                const typeA = getFeatureType(a.feature.name)
                const typeB = getFeatureType(b.feature.name)
                const typeOrder: { [key: string]: number } = { 'Passive': 0, 'Action': 1, 'Reaction': 2 }
                return typeOrder[typeA] - typeOrder[typeB]
              })
              .map(({ feature, originalIndex }) => {
              const featureKey = `${monster.id}-${originalIndex}`
              const isExpanded = expandedFeatures.has(featureKey)
              const isDropdownOpen = openDropdowns.has(featureKey)
              const featureType = getFeatureType(feature.name)
              
              return (
                <div key={originalIndex} className="group bg-muted/20 rounded-md border border-accent/20 relative">
                  <div className="flex items-center p-3 hover:bg-accent/5 transition-colors">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full font-semibold mr-2 ${
                        featureType === 'Action' ? 'bg-blue-500/20 text-blue-300' :
                        featureType === 'Reaction' ? 'bg-red-500/20 text-red-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {featureType}
                    </span>
                    
                    {/* Custom Dropdown Container */}
                    <div className="flex items-center flex-1 relative">
                      {/* Clickable Area */}
                      <div
                        onClick={() => toggleDropdown(featureKey)}
                        className="flex items-center cursor-pointer"
                        data-dropdown-trigger={featureKey}
                      >
                        <span className="text-accent font-semibold text-sm">
                          {feature.name}
                        </span>
                        <div className="ml-1">
                          <ChevronDown className="h-4 w-4 text-accent font-semibold" />
                        </div>
                      </div>
                      
                      {/* Dropdown Options */}
                      {isDropdownOpen && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdowns(new Set())}
                          />
                          
                          {/* Dropdown Menu */}
                          <div className="absolute bottom-full left-0 z-[60] bg-background border border-accent/30 rounded-lg shadow-xl min-w-48 max-h-48 overflow-y-auto mb-1">
                            {availableFeatures.map((availableFeature, idx) => (
                              <div
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleFeatureChange(monster.id, originalIndex, availableFeature)
                                  setOpenDropdowns(new Set())
                                }}
                                className={`px-3 py-2 text-sm cursor-pointer transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                  availableFeature.name === feature.name
                                    ? 'bg-accent/20 text-accent font-semibold'
                                    : 'text-foreground hover:bg-accent/10'
                                }`}
                              >
                                {availableFeature.name}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleFeatureExpansion(featureKey)}
                      className="text-muted-foreground hover:text-accent transition-colors ml-2 flex flex-1 justify-end items-center text-right"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className={`transition-transform duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-3 pb-3 border-t border-accent/10">
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="bg-background/95 backdrop-blur-sm pt-1 flex items-center gap-2">
          <button
            onClick={() => handleExportSingle(monster)}
            className="flex-1 bg-accent hover:bg-accent/80 text-background font-semibold py-2.5 sm:py-2 px-3 rounded text-sm transition-colors min-h-[44px] sm:min-h-0"
            title="Export Monster"
          >
            Export
          </button>
          
          <button
            onClick={handleGenerate}
            className="bg-muted hover:bg-muted/80 text-foreground font-semibold py-2.5 sm:py-2 px-3 rounded text-sm transition-colors min-h-[44px] sm:min-h-0"
            title="New Monster"
          >
            <span className="text-base sm:text-lg">🔄</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-lg text-muted italic leading-relaxed max-w-2xl mx-auto">
          Generate custom monsters for your Daggerheart campaigns with randomized features and stats
        </p>
      </div>
      
      <div className="fantasy-card p-8">
        {/* Generation Controls - Redesigned */}
        <div className="bg-muted/20 p-6 rounded-lg mb-2 relative">
          {/* Reset Button - Top Right */}
          <button
            onClick={() => setShowResetConfirmation(true)}
            disabled={isGenerating || (!currentMonster && generatedMonsters.length === 0)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-accent disabled:text-muted-foreground/50 transition-colors text-sm flex items-center gap-1 disabled:cursor-not-allowed z-10"
            title="Clear All Monsters"
          >
            Clear
          </button>

          {/* Main Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-md font-semibold text-foreground mb-2">
                Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(Number(e.target.value) as Tier)}
                disabled={isGenerating}
                className="w-full bg-background border border-accent/30 rounded px-3 py-2 text-foreground focus:border-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {TIERS.map(tier => (
                  <option key={tier} value={tier}>Tier {tier}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-md font-semibold text-foreground mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MonsterType)}
                disabled={isGenerating}
                className="w-full bg-background border border-accent/30 rounded px-3 py-2 text-foreground focus:border-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {MONSTER_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Generation Controls */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBulkMode}
                onChange={(e) => setIsBulkMode(e.target.checked)}
                disabled={isGenerating}
                className="w-4 h-4 text-accent bg-background border-accent/30 rounded focus:ring-accent focus:ring-2 disabled:opacity-50"
              />
              <span className="text-sm font-semibold text-foreground">Bulk Generation</span>
            </label>

            {/* Animated Bulk Stepper */}
            <div className={`transition-all duration-300 overflow-hidden ${isBulkMode ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-sm text-muted-foreground">Generate</span>
                <div className="flex items-center border border-accent/30 rounded bg-background">
                  <button
                    onClick={() => adjustBulkCount(-1)}
                    disabled={isGenerating || bulkCount <= 2}
                    className="px-4 py-2 sm:px-3 sm:py-1 text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] sm:min-h-0 text-lg sm:text-base"
                    aria-label="Decrease monster count"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 sm:px-3 sm:py-1 text-foreground font-semibold min-w-[3rem] sm:min-w-[2rem] text-center">
                    {bulkCount}
                  </span>
                  <button
                    onClick={() => adjustBulkCount(1)}
                    disabled={isGenerating || bulkCount >= 4}
                    className="px-4 py-2 sm:px-3 sm:py-1 text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] sm:min-h-0 text-lg sm:text-base"
                    aria-label="Increase monster count"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">monsters</span>
              </div>
            </div>
          </div>

          {/* Unified Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-background font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg min-h-[48px] w-full sm:w-auto max-w-xs"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-background border-t-transparent"></div>
                  <span className="text-sm sm:text-base">Generating...</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Generate {isBulkMode ? `${bulkCount} Monsters` : 'Monster'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-accent/30 rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-foreground mb-2">Clear All Monsters?</h3>
              <p className="text-muted-foreground mb-4">
                This will remove all generated monsters and reset the tool.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirmation(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Monster Display Area */}
        <div ref={monsterDisplayRef}>
          {/* Single Monster Display */}
          {currentMonster && (
            <div>
              <h3 className="text-2xl font-cormorant font-bold text-foreground mb-4">Generated Monster</h3>
              <div className="flex justify-center">
                {renderMonsterCard(currentMonster)}
              </div>
            </div>
          )}

          {/* Multiple Monsters Display */}
          {generatedMonsters.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-cormorant font-bold text-foreground">
                  Generated Monsters ({generatedMonsters.length})
                </h3>
                <button
                  onClick={handleExportMultiple}
                  className="bg-accent hover:bg-accent/80 text-background font-semibold py-2 px-4 rounded transition-colors"
                >
                  Export All
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
                {generatedMonsters.map((monster, index) => renderMonsterCard(monster, index))}
              </div>
            </div>
          )}
        </div>

        {/* No Content State */}
        {!currentMonster && generatedMonsters.length === 0 && (
          <div className="text-center py-12 bg-muted/10 rounded-lg">
            <div className="text-6xl mb-4">🎲</div>
            <h3 className="text-xl font-cormorant font-bold text-foreground mb-2">
              Ready to Create Monsters
            </h3>
            <p className="text-muted">
              Select your desired tier and type, then click generate to create your custom monster
            </p>
          </div>
        )}

        {/* Tool Information */}
        <ToolInfo title="About Monster Builder">
          <h3>How It Works</h3>
          <p>
            The Monster Builder generates custom monsters for your Daggerheart campaigns using official adversary tables and features. 
            Each monster is created with appropriate stats for its tier and type, plus randomized features that match its role.
          </p>
          
          <h3>Key Features</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Tier-Based Generation</h4>
              <p>Generate monsters for tiers 1-4 with appropriate difficulty scaling and stat progression</p>
            </div>
            <div className="feature-card">
              <h4>Type-Specific Features</h4>
              <p>Each monster type gets features that match its role (Bruiser, Skulk, Support, etc.) plus general features</p>
            </div>
            <div className="feature-card">
              <h4>Customizable Features</h4>
              <p>Edit any feature after generation using dropdown menus with all available options</p>
            </div>
          </div>

          <h3>Monster Types</h3>
          <ul>
            <li><strong>Standard:</strong> Balanced adversaries suitable for most encounters</li>
            <li><strong>Bruiser:</strong> High damage, high health tanks that control space</li>
            <li><strong>Horde:</strong> Weaker individually but dangerous in groups</li>
            <li><strong>Minion:</strong> Very weak enemies that die in one hit</li>
            <li><strong>Solo:</strong> Powerful single adversaries designed to fight alone</li>
            <li><strong>Leader:</strong> Commanders that enhance other adversaries</li>
            <li><strong>Ranged:</strong> Long-distance attackers with positioning advantages</li>
            <li><strong>Skulk:</strong> Stealthy adversaries with mobility and surprise</li>
            <li><strong>Support:</strong> Utility-focused enemies that aid allies</li>
            <li><strong>Social:</strong> Non-combat adversaries for social encounters</li>
          </ul>

          <h3>Usage Tips</h3>
          <ul>
            <li>Use bulk generation to quickly create multiple variants of the same type</li>
            <li>Edit features after generation to fine-tune monsters for specific encounters</li>
            <li>Export monsters as text files for easy reference during gameplay</li>
            <li>Mix different types and tiers to create varied, interesting encounters</li>
          </ul>
        </ToolInfo>
      </div>
    </>
  )
} 