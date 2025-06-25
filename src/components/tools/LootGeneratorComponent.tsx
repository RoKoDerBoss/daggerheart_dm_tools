'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateMultipleLoot } from '@/utils/data-access'
import ToolInfo from '@/components/ToolInfo'
import type { LootItem } from '@/data'
import { HelpPopover, InfoPopover, TipPopover } from '@/components/FantasyPopover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface LootGeneratorComponentProps {}

export default function LootGeneratorComponent({}: LootGeneratorComponentProps) {
  const [itemRarity, setItemRarity] = useState<string>('any')
  const [itemQuantity, setItemQuantity] = useState<number>(1)
  const [consumableQuantity, setConsumableQuantity] = useState<number>(1)
  const [generatedItems, setGeneratedItems] = useState<LootItem[]>([])
  const [generatedConsumables, setGeneratedConsumables] = useState<LootItem[]>([])

  const handleGenerateItems = () => {
    if (!itemQuantity || itemQuantity < 1) return
    const lootItems = generateMultipleLoot('item', itemQuantity, itemRarity)
    setGeneratedItems(lootItems)
  }

  const handleGenerateConsumables = () => {
    if (!consumableQuantity || consumableQuantity < 1) return
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
        <div className="flex items-center justify-center h-full text-muted-foreground italic text-center py-16">
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
                <div className="flex flex-wrap flex-col sm:flex-row items-start gap-2">
                  <h3 className="text-lg font-semibold text-accent">{loot.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide ${getRarityColor(loot.rarity)}`}>
                    {loot.rarity}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground italic">
                  {loot.diceRoll.rolls.join(' + ')} = {loot.diceRoll.total}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{loot.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center -mt-2">
        <p className="text-lg text-muted-foreground italic leading-relaxed max-w-2xl mx-auto">
          Generate exciting treasure and loot with customizable rarity and item types for your adventures
        </p>
      </div>

      {/* Loot Generator Tool */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Items Generator */}
        <Card className="fantasy">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⚔️</span>
              <h2 className="text-2xl font-bold text-foreground">Items</h2>
            </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="item-rarity-select" className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                <div className="flex text-muted-foreground items-center gap-2">
                  Rarity
                  <HelpPopover title="Item Rarity">
                    Controls the power level and value of generated items. Higher rarities have better bonuses but are more expensive. &ldquo;Any Rarity&rdquo; generates random items across all tiers.
                  </HelpPopover>
                </div>
              </label>
              <Select
                value={itemRarity}
                onValueChange={(value) => setItemRarity(value)}
              >
                <SelectTrigger 
                  id="item-rarity-select"
                  className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  aria-describedby="item-rarity-help"
                >
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rarity</SelectItem>
                  <SelectItem value="common">Common (1d12 or 2d12)</SelectItem>
                  <SelectItem value="uncommon">Uncommon (2d12 or 3d12)</SelectItem>
                  <SelectItem value="rare">Rare (3d12 or 4d12)</SelectItem>
                  <SelectItem value="legendary">Legendary (4d12 or 5d12)</SelectItem>
                </SelectContent>
              </Select>
              <div id="item-rarity-help" className="sr-only">
                Controls the power level and rarity of generated items. Higher rarities create more valuable and powerful items.
              </div>
            </div>
            
            <div>
              <label htmlFor="item-quantity-input" className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                <div className="flex text-muted-foreground items-center gap-2">
                  Quantity
                  <HelpPopover title="Item Quantity">
                    Generate multiple items at once to fill treasure hoards quickly. Great for post-combat loot distribution!
                  </HelpPopover>
                </div>
              </label>
              <Input
                id="item-quantity-input"
                type="number"
                min="1"
                max="20"
                value={itemQuantity || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value)
                  setItemQuantity(value === '' ? 0 : value)
                }}
                className="w-full bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                aria-describedby="item-quantity-help"
              />
              <div id="item-quantity-help" className="sr-only">
                Number of items to generate at once, from 1 to 20 items.
              </div>
            </div>
            
            <Button onClick={handleGenerateItems} className="w-full mt-4 rounded-xl">
              Generate Items
            </Button>
          </div>
          
          <LootDisplay items={generatedItems} emptyMessage="No items yet..." />
          </CardContent>
        </Card>

        {/* Consumables Generator */}
        <Card className="fantasy">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🧪</span>
              <h2 className="text-2xl font-bold text-foreground">Consumables</h2>
            </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2 uppercase tracking-wide">
                <div className="flex text-muted-foreground items-center gap-2">
                  Quantity
                  <HelpPopover title="Consumables">
                    Consumables don&apos;t have rarity tiers - they&apos;re generated from a curated list of potions, scrolls, and temporary items perfect for immediate use.
                  </HelpPopover>
                </div>
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={consumableQuantity || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value)
                  setConsumableQuantity(value === '' ? 0 : value)
                }}
                className="w-full bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <div className="hidden lg:block h-[75px]" />
            
            <Button onClick={handleGenerateConsumables} className="w-full mt-4 rounded-xl">
              Generate Consumables
            </Button>
          </div>
          
          <LootDisplay items={generatedConsumables} emptyMessage="No consumables yet..." />
          </CardContent>
        </Card>
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
        <ul className="list-none p-0 my-4 text-muted-foreground">
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Common:</strong> Basic equipment and simple tools (1d12 or 2d12 range)
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Uncommon:</strong> Quality gear with minor enhancements (2d12 or 3d12 range)
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Rare:</strong> Exceptional items with notable properties (3d12 or 4d12 range)
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            <strong>Legendary:</strong> Powerful artifacts and magical treasures (4d12 or 5d12 range)
          </li>
        </ul>

        <h3>Usage Tips</h3>
        <ul className="list-none p-0 my-4 text-muted-foreground">
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            Use &ldquo;Any Rarity&rdquo; for completely random treasure discovery
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            Target specific rarities when creating themed encounters or rewards
          </li>
          <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
            Generate consumables separately to balance permanent item rewards
          </li>
        </ul>
      </ToolInfo>
    </div>
  )
} 