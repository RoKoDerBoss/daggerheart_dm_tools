'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { generateMultipleLoot } from '@/utils/data-access'
import ToolInfo from '@/components/ToolInfo'
import type { LootItem } from '@/data'

interface LootGeneratorComponentProps {}

export default function LootGeneratorComponent({}: LootGeneratorComponentProps) {
  const [itemRarity, setItemRarity] = useState<string>('any')
  const [itemQuantity, setItemQuantity] = useState<number>(1)
  const [consumableQuantity, setConsumableQuantity] = useState<number>(1)
  const [generatedItems, setGeneratedItems] = useState<LootItem[]>([])
  const [generatedConsumables, setGeneratedConsumables] = useState<LootItem[]>([])

  const handleGenerateItems = () => {
    const lootItems = generateMultipleLoot('item', itemQuantity, itemRarity)
    setGeneratedItems(lootItems)
  }

  const handleGenerateConsumables = () => {
    const lootItems = generateMultipleLoot('consumable', consumableQuantity)
    setGeneratedConsumables(lootItems)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-600/30'
      case 'uncommon': return 'text-green-400 bg-green-600/30'
      case 'rare': return 'text-blue-400 bg-blue-600/30'
      case 'legendary': return 'text-yellow-400 bg-yellow-600/30'
      default: return 'text-gray-400 bg-gray-600/30'
    }
  }

  const LootDisplay = ({ items, emptyMessage }: { items: LootItem[], emptyMessage: string }) => (
    <div className="bg-card border-2 border-gray-600 rounded-lg p-4 min-h-[300px] max-h-[650px] overflow-y-auto">
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted italic text-center py-16">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((loot, index) => (
            <div
              key={index}
              className="bg-background border-2 border-gray-600 rounded-lg p-4 hover:border-accent/50 transition-colors"
            >
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-accent">{loot.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide ${getRarityColor(loot.rarity)}`}>
                    {loot.rarity}
                  </span>
                </div>
                <span className="text-sm text-muted italic">
                  {loot.diceRoll.rolls.join(' + ')} = {loot.diceRoll.total}
                </span>
              </div>
              <p className="text-muted leading-relaxed">{loot.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Brief Description */}
      <div className="text-center -mt-2">
        <p className="text-lg text-muted italic leading-relaxed max-w-2xl mx-auto">
          Generate exciting treasure and loot with customizable rarity and item types for your adventures
        </p>
      </div>

      {/* Loot Generator Tool */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Items Generator */}
        <div className="fantasy-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚔️</span>
            <h2 className="text-2xl font-bold text-foreground">Items</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                Rarity
              </label>
              <select
                value={itemRarity}
                onChange={(e) => setItemRarity(e.target.value)}
                className="w-full bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                <option value="any">Any Rarity</option>
                <option value="common">Common (1d12 or 2d12)</option>
                <option value="uncommon">Uncommon (2d12 or 3d12)</option>
                <option value="rare">Rare (3d12 or 4d12)</option>
                <option value="legendary">Legendary (4d12 or 5d12)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <Button onClick={handleGenerateItems} className="w-full mt-4 rounded-xl">
              Generate Items
            </Button>
          </div>
          
          <LootDisplay items={generatedItems} emptyMessage="No items yet..." />
        </div>

        {/* Consumables Generator */}
        <div className="fantasy-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🧪</span>
            <h2 className="text-2xl font-bold text-foreground">Consumables</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={consumableQuantity}
                onChange={(e) => setConsumableQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <Button onClick={handleGenerateConsumables} className="w-full mt-4 rounded-xl">
              Generate Consumables
            </Button>
          </div>
          
          <LootDisplay items={generatedConsumables} emptyMessage="No consumables yet..." />
        </div>
      </div>

      {/* Detailed Information Accordion */}
      <ToolInfo title="About Loot Generator">
        <h3>How It Works</h3>
        <p>
          The Loot Generator can be used to create party loot on the flyduring your Daggerheart campaigns using the dice-based generation from the Core Rulebook. 
          Each item is randomly selected and includes detailed descriptions to enhance your storytelling.
        </p>
        
        <h3>Key Features</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>Rarity-Based Generation</h4>
            <p>Generate items by specific rarity levels (Common, Uncommon, Rare, Legendary) or let the dice decide</p>
          </div>
          <div className="feature-card">
            <h4>Dual Item Types</h4>
            <p>Create both permanent items and consumables with different generation rules</p>
          </div>
          <div className="feature-card">
            <h4>Dice Roll Tracking</h4>
            <p>See the actual dice rolls that determined each item for transparency and authenticity</p>
          </div>
          <div className="feature-card">
            <h4>Bulk Generation</h4>
            <p>Generate multiple items at once to quickly populate treasure hoards or merchant inventories</p>
          </div>
        </div>

        <h3>Item Rarity System</h3>
        <ul>
          <li><strong>Common:</strong> Basic equipment and simple tools (1d12 or 2d12 range)</li>
          <li><strong>Uncommon:</strong> Quality gear with minor enhancements (2d12 or 3d12 range)</li>
          <li><strong>Rare:</strong> Exceptional items with notable properties (3d12 or 4d12 range)</li>
          <li><strong>Legendary:</strong> Powerful artifacts and magical treasures (4d12 or 5d12 range)</li>
        </ul>

        <h3>Usage Tips</h3>
        <ul>
          <li>Use &quot;Any Rarity&quot; for completely random treasure discovery</li>
          <li>Target specific rarities when creating themed encounters or rewards</li>
          <li>Generate consumables separately to balance permanent item rewards</li>
        </ul>
      </ToolInfo>
    </div>
  )
} 