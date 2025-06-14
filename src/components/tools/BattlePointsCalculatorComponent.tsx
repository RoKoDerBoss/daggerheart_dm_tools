'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { calculateBattlePoints, exportBattleEncounter, type BattleEncounter } from '@/utils/data-access'
import ToolInfo from '@/components/ToolInfo'
import { ADVERSARY_TYPES, BATTLE_ADJUSTMENTS } from '@/data'
import { HelpPopover } from '@/components/FantasyPopover'
import { FantasyCard, FantasyCardContent } from '@/components/FantasyCard'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { UserCheck, MessageCircle, Zap, Target, Eye, Swords, Crown, Hammer, Star, Download, RefreshCw } from 'lucide-react'

interface BattlePointsCalculatorComponentProps {}

export default function BattlePointsCalculatorComponent({}: BattlePointsCalculatorComponentProps) {
  const [encounter, setEncounter] = useState<BattleEncounter>({
    partySize: 4,
    adjustments: {
      easier: false,
      twoSolos: false,
      bonusDamage: false,
      lowerTier: false,
      noBruisersEtc: false,
      harder: false
    },
    adversaries: {
      minions: 0,
      social: 0,
      horde: 0,
      ranged: 0,
      skulk: 0,
      standard: 0,
      leader: 0,
      bruiser: 0,
      solo: 0
    }
  })

  const [partySizeInput, setPartySizeInput] = useState(encounter.partySize.toString())

  // Keep partySizeInput in sync with encounter.partySize
  useEffect(() => {
    setPartySizeInput(encounter.partySize.toString())
  }, [encounter.partySize])

  const handlePartySizeInputChange = (value: string) => {
    // Allow empty string for editing
    if (/^\d{0,2}$/.test(value)) {
      setPartySizeInput(value)
    }
  }

  const commitPartySize = () => {
    const numValue = parseInt(partySizeInput)
    if (!isNaN(numValue)) {
      setEncounter(prev => ({
        ...prev,
        partySize: Math.max(1, Math.min(12, numValue))
      }))
    } else {
      // If empty or invalid, reset to previous valid value
      setPartySizeInput(encounter.partySize.toString())
    }
  }

  const battleCalc = calculateBattlePoints(encounter)

  const handleAdjustmentChange = (key: keyof typeof encounter.adjustments) => {
    setEncounter(prev => ({
      ...prev,
      adjustments: {
        ...prev.adjustments,
        [key]: !prev.adjustments[key]
      }
    }))
  }

  const handleAdversaryChange = (type: keyof typeof encounter.adversaries, value: string) => {
    const numValue = parseInt(value) || 0
    setEncounter(prev => ({
      ...prev,
      adversaries: {
        ...prev.adversaries,
        [type]: Math.max(0, numValue)
      }
    }))
  }

  const resetCalculator = () => {
    setEncounter({
      partySize: 4,
      adjustments: {
        easier: false,
        twoSolos: false,
        bonusDamage: false,
        lowerTier: false,
        noBruisersEtc: false,
        harder: false
      },
      adversaries: {
        minions: 0,
        social: 0,
        horde: 0,
        ranged: 0,
        skulk: 0,
        standard: 0,
        leader: 0,
        bruiser: 0,
        solo: 0
      }
    })
  }

  const handleExportEncounter = () => {
    const encounterText = exportBattleEncounter(encounter)
    const blob = new Blob([encounterText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `battle-encounter-${encounter.partySize}pc.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center -mt-2">
        <p className="text-lg text-muted-foreground-foreground italic leading-relaxed max-w-2xl mx-auto">
          Calculate and track battle points for encounters, helping balance challenging fights
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Setup */}
        <div className="space-y-6">
          {/* Party Setup & Adjustments */}
          <FantasyCard variant="default">
            <FantasyCardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Party Setup & Adjustments</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExportEncounter}
                    variant="outline"
                    className="flex items-center gap-1.5 text-sm px-3 py-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">Export</span>
                  </Button>
                  <Button 
                    onClick={resetCalculator}
                    variant="outline"
                    className="flex items-center gap-1.5 text-sm px-3 py-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden lg:inline">Reset</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Party Setup */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    <div className="flex items-center gap-2">
                      Party Size
                      <HelpPopover title="Party Size">
                        The number of player characters in your party. This determines the base battle points available for the encounter. Standard formula: (Party Size × 3) + 2. Recommended range is 3-6 players.
                      </HelpPopover>
                    </div>
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Number of PCs
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={partySizeInput}
                      onChange={(e) => handlePartySizeInputChange(e.target.value)}
                      onBlur={commitPartySize}
                      onKeyDown={e => { if (e.key === 'Enter') commitPartySize() }}
                      variant="fantasy"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Base Points: ({encounter.partySize} × 3) + 2 = <span className="text-lg text-accent font-semibold">{battleCalc.basePoints}</span>
                    </p>
                  </div>
                </div>

                {/* Battle Adjustments */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    <div className="flex items-center gap-2">
                      Battle Adjustments
                      <HelpPopover title="Battle Adjustments">
                        Modify the encounter difficulty based on situational factors. Positive modifiers (+) make encounters harder, negative modifiers (-) make them easier. These adjust the total battle points available.
                      </HelpPopover>
                    </div>
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(BATTLE_ADJUSTMENTS).map(([id, adjustment]) => (
                      <label key={id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={encounter.adjustments[id as keyof typeof encounter.adjustments]}
                          onCheckedChange={() => handleAdjustmentChange(id as keyof typeof encounter.adjustments)}
                          variant="foreground"
                        />
                        <span className={`text-lg sm:text-base font-medium ${adjustment.modifier < 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {adjustment.modifier > 0 ? '+' : ''}{adjustment.modifier}
                        </span>
                        <div className="flex flex-wrap items-center text-muted-foreground text-sm break-words whitespace-normal w-full">{adjustment.name}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FantasyCardContent>
          </FantasyCard>

          {/* Results */}
          <FantasyCard variant="default">
            <FantasyCardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Battle Points Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground-foreground">Available Points:</span>
                  <span className="text-accent font-bold text-2xl">{battleCalc.availablePoints}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground-foreground">Spent Points:</span>
                  <span className="text-yellow-400 font-bold text-2xl">{battleCalc.spentPoints}</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="text-foreground font-semibold">Remaining:</span>
                    <span className={`font-bold text-3xl ${battleCalc.remainingPoints >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {battleCalc.remainingPoints}
                    </span>
                  </div>
                </div>
                {battleCalc.isOverBudget && (
                  <div className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg p-3 mt-3">
                    ⚠️ Over budget! Reduce adversaries or adjust modifiers.
                  </div>
                )}
                {battleCalc.hasPointsLeft && (
                  <div className="text-yellow-400 text-sm bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mt-3">
                    💡 You have {battleCalc.remainingPoints} points left to spend.
                  </div>
                )}
              </div>
            </FantasyCardContent>
          </FantasyCard>
        </div>

        {/* Right Column - Adversaries */}
        <FantasyCard variant="default">
          <FantasyCardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Adversaries</h2>
            
            {/* 1 Point Adversaries */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-yellow-400 mb-4 border-b border-yellow-400/30 pb-2 uppercase tracking-wider">
                1 Point Each
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-yellow-400" />
                      <span>Minions</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.minions}
                    onChange={(e) => handleAdversaryChange('minions', e.target.value)}
                    variant="fantasy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-yellow-400" />
                      <span>Social/Support</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.social}
                    onChange={(e) => handleAdversaryChange('social', e.target.value)}
                    variant="fantasy"
                  />
                </div>
              </div>
            </div>

            {/* 2 Point Adversaries */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-orange-400 mb-4 border-b border-orange-400/30 pb-2 uppercase tracking-wider">
                2 Points Each
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span>Horde</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.horde}
                    onChange={(e) => handleAdversaryChange('horde', e.target.value)}
                    variant="fantasy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-400" />
                      <span>Ranged</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.ranged}
                    onChange={(e) => handleAdversaryChange('ranged', e.target.value)}
                    variant="fantasy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-orange-400" />
                      <span>Skulk</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.skulk}
                    onChange={(e) => handleAdversaryChange('skulk', e.target.value)}
                    variant="fantasy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Swords className="w-4 h-4 text-orange-400" />
                      <span>Standard</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.standard}
                    onChange={(e) => handleAdversaryChange('standard', e.target.value)}
                    variant="fantasy"
                  />
                </div>
              </div>
            </div>

            {/* 3 Point Adversaries */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-red-400 mb-4 border-b border-red-400/30 pb-2 uppercase tracking-wider">
                3 Points Each
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-red-400" />
                      <span>Leader</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.leader}
                    onChange={(e) => handleAdversaryChange('leader', e.target.value)}
                    variant="fantasy"
                  />
                </div>
              </div>
            </div>

            {/* 4 Point Adversaries */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-red-400 mb-4 border-b border-red-400/30 pb-2 uppercase tracking-wider">
                4 Points Each
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Hammer className="w-4 h-4 text-red-400" />
                      <span>Bruiser</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.bruiser}
                    onChange={(e) => handleAdversaryChange('bruiser', e.target.value)}
                    variant="fantasy"
                  />
                </div>
              </div>
            </div>

            {/* 5 Point Adversaries */}
            <div>
              <h3 className="text-sm font-bold text-purple-400 mb-4 border-b border-purple-400/30 pb-2 uppercase tracking-wider">
                5 Points Each
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>Solo</span>
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={encounter.adversaries.solo}
                    onChange={(e) => handleAdversaryChange('solo', e.target.value)}
                    variant="fantasy"
                  />
                </div>
              </div>
            </div>
          </FantasyCardContent>
        </FantasyCard>
      </div>

      {/* Detailed Information Accordion */}
      <ToolInfo title="About Battle Points Calculator">
        <h3>How It Works</h3>
        <p>
          The Battle Points Calculator helps you create balanced encounters for your Daggerheart campaigns. 
          Based on the Core Rulebook you can set your party size, choose adversary types, and apply situational adjustments to generate the perfect challenge level.
        </p>
        
        <h3>Key Features</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>Dynamic Point Calculation</h4>
            <p>Automatically calculates base points and adjustments based on party size and encounter modifiers</p>
          </div>
          <div className="feature-card">
            <h4>Adversary Budget Tracking</h4>
            <p>Real-time tracking of spent and remaining battle points with visual warnings for budget limits</p>
          </div>
          <div className="feature-card">
            <h4>Encounter Export</h4>
            <p>Export complete encounter details as text files for easy reference during gameplay</p>
          </div>
        </div>

        <h3>Adversary Types & Costs</h3>
        <ul>
          <li><strong>1 Point:</strong> Minions, Social/Support adversaries</li>
          <li><strong>2 Points:</strong> Horde, Ranged, Skulk, Standard adversaries</li>
          <li><strong>3 Points:</strong> Leader adversaries</li>
          <li><strong>4 Points:</strong> Bruiser adversaries</li>
          <li><strong>5 Points:</strong> Solo adversaries</li>
        </ul>

        <h3>Encounter Adjustments</h3>
        <ul className="list-none p-0 my-4 text-muted-foreground-foreground">
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Easier:</strong> Reduces total budget for simpler encounters
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Two Solos:</strong> Adjustment for encounters with multiple solo adversaries
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Bonus Damage:</strong> Account for environmental or special damage sources
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Lower Tier:</strong> Adjustment for adversaries below party level
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>No Bruisers/Etc:</strong> Compensation when avoiding certain adversary types
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Harder:</strong> Increases budget for more challenging encounters
          </li>
        </ul>
      </ToolInfo>
    </div>
  )
} 