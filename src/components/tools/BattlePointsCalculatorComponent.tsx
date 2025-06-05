'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { calculateBattlePoints, exportBattleEncounter, type BattleEncounter } from '@/utils/data-access'
import { ADVERSARY_TYPES, BATTLE_ADJUSTMENTS } from '@/data'

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

  const handlePartySizeChange = (value: string) => {
    const numValue = parseInt(value) || 1
    setEncounter(prev => ({
      ...prev,
      partySize: Math.max(1, Math.min(12, numValue))
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

  // Icon components
  const UserCheckIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  )

  const MessageCircleIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  )

  const ZapIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
    </svg>
  )

  const TargetIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  )

  const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    </svg>
  )

  const SwordsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"></path>
    </svg>
  )

  const CrownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l14 9-14 9V3z"></path>
    </svg>
  )

  const HammerIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
    </svg>
  )

  const StarIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
  )

  const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  )

  const RotateCcwIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
    </svg>
  )

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-end gap-3">
        <Button 
          onClick={handleExportEncounter}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <DownloadIcon />
          Export
        </Button>
        <Button 
          onClick={resetCalculator}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RotateCcwIcon />
          Reset
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Setup */}
        <div className="space-y-6">
          {/* Party Setup & Adjustments */}
          <div className="fantasy-card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Party Setup & Adjustments</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Party Setup */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Party Setup</h3>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                    Number of PCs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={encounter.partySize}
                    onChange={(e) => handlePartySizeChange(e.target.value)}
                    className="w-full bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                  <p className="text-sm text-muted mt-2">
                    Base Points: ({encounter.partySize} × 3) + 2 = <span className="text-accent font-semibold">{battleCalc.basePoints}</span>
                  </p>
                </div>
              </div>

              {/* Battle Adjustments */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Battle Adjustments</h3>
                <div className="space-y-3">
                  {Object.entries(BATTLE_ADJUSTMENTS).map(([id, adjustment]) => (
                    <label key={id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={encounter.adjustments[id as keyof typeof encounter.adjustments]}
                        onChange={() => handleAdjustmentChange(id as keyof typeof encounter.adjustments)}
                        className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                      />
                      <span className={`text-sm font-medium ${adjustment.modifier < 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({adjustment.modifier > 0 ? '+' : ''}{adjustment.modifier})
                      </span>
                      <span className="text-muted text-sm">{adjustment.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="fantasy-card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Battle Points Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted">Available Points:</span>
                <span className="text-accent font-bold text-2xl">{battleCalc.availablePoints}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted">Spent Points:</span>
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
          </div>
        </div>

        {/* Right Column - Adversaries */}
        <div className="fantasy-card p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Adversaries</h2>
          
          {/* 1 Point Adversaries */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-yellow-400 mb-4 border-b border-yellow-400/30 pb-2 uppercase tracking-wider">
              1 Point Each
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheckIcon />
                    <span>Minions</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.minions}
                  onChange={(e) => handleAdversaryChange('minions', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircleIcon />
                    <span>Social/Support</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.social}
                  onChange={(e) => handleAdversaryChange('social', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
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
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <ZapIcon />
                    <span>Horde</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.horde}
                  onChange={(e) => handleAdversaryChange('horde', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <TargetIcon />
                    <span>Ranged</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.ranged}
                  onChange={(e) => handleAdversaryChange('ranged', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <EyeIcon />
                    <span>Skulk</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.skulk}
                  onChange={(e) => handleAdversaryChange('skulk', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <SwordsIcon />
                    <span>Standard</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.standard}
                  onChange={(e) => handleAdversaryChange('standard', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
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
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <CrownIcon />
                    <span>Leader</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.leader}
                  onChange={(e) => handleAdversaryChange('leader', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
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
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <HammerIcon />
                    <span>Bruiser</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.bruiser}
                  onChange={(e) => handleAdversaryChange('bruiser', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
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
                <label className="block text-sm font-medium text-muted mb-2">
                  <div className="flex items-center gap-2">
                    <StarIcon />
                    <span>Solo</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  value={encounter.adversaries.solo}
                  onChange={(e) => handleAdversaryChange('solo', e.target.value)}
                  className="w-full bg-background border-2 border-gray-600 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 