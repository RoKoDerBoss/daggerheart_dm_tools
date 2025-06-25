/**
 * Monster Stat Block Integration Test Component
 * Demonstrates integration of dice roller components within monster stat blocks and other existing features
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiceRoller } from '@/components/DiceRoller';
import { RollHistoryDisplay } from '@/components/RollHistoryDisplay';
import { Sword, Shield, Heart, Zap, Eye, Target, Copy, RotateCcw } from 'lucide-react';

// Mock monster data based on the actual adversary stats
const mockMonsters = [
  {
    id: 'standard-t2',
    name: 'Orc Warrior',
    type: 'Standard',
    tier: 2,
    stats: {
      difficulty: 14,
      threshold: '10 / 19',
      attack: '+1',
      damage: '2d8+3',
      hitpoints: 4,
      stress: 3
    },
    features: [
      {
        name: 'Brutal Strike',
        description: 'When this adversary deals damage with a melee attack, they may spend a Fear to deal an additional 1d6 damage.',
        type: 'Action'
      },
      {
        name: 'Pack Tactics',
        description: 'This adversary has advantage on attack rolls when an ally is within Close range of the target.',
        type: 'Passive'
      }
    ]
  },
  {
    id: 'bruiser-t3',
    name: 'Stone Giant',
    type: 'Bruiser',
    tier: 3,
    stats: {
      difficulty: 17,
      threshold: '23 / 40',
      attack: '+3',
      damage: '3d8+4',
      hitpoints: 8,
      stress: 4
    },
    features: [
      {
        name: 'Boulder Throw',
        description: 'Ranged attack that deals 2d10+6 damage and knocks the target prone on a hit.',
        type: 'Action'
      },
      {
        name: 'Stone Skin',
        description: 'Reduce all incoming damage by 2 (minimum 1).',
        type: 'Passive'
      }
    ]
  },
  {
    id: 'solo-t4',
    name: 'Ancient Dragon',
    type: 'Solo',
    tier: 4,
    stats: {
      difficulty: 19,
      threshold: '35 / 65',
      attack: '+5',
      damage: '4d12+15',
      hitpoints: 12,
      stress: 8
    },
    features: [
      {
        name: 'Dragon Breath',
        description: 'All creatures in a Very Far cone must make a Dexterity save (DC 18) or take 6d8+10 fire damage.',
        type: 'Action'
      },
      {
        name: 'Legendary Resistance',
        description: 'When this adversary fails a saving throw, they may choose to succeed instead. (3/encounter)',
        type: 'Passive'
      }
    ]
  }
];

interface IntegrationTestProps {
  className?: string;
}

export const MonsterStatBlockIntegrationTest: React.FC<IntegrationTestProps> = ({ className }) => {
  const [selectedMonster, setSelectedMonster] = useState(mockMonsters[0]);
  const [rollHistory, setRollHistory] = useState<string[]>([]);

  const handleDiceRoll = (description: string, result: number) => {
    const timestamp = new Date().toLocaleTimeString();
    setRollHistory(prev => [`${description} → ${result} (${timestamp})`, ...prev.slice(0, 9)]);
  };

  const renderStatBlock = (monster: typeof mockMonsters[0]) => {
    return (
      <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
        <CardHeader>
          <CardTitle className="text-accent font-cormorant flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐉</span>
              {monster.name}
            </div>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
              {monster.type}, Tier {monster.tier}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Stats with Integrated Dice Rolling */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-green-500/30 p-3 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-1">DIFFICULTY</div>
              <div className="font-bold text-lg text-foreground">{monster.stats.difficulty}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-blue-500/30 p-3 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-1">HP</div>
              <div className="font-bold text-lg text-foreground">{monster.stats.hitpoints}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/30 p-3 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-1">STRESS</div>
              <div className="font-bold text-lg text-foreground">{monster.stats.stress}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-red-400/30 p-3 rounded-xl text-center">
              <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-1">ATTACK</div>
              <div className="font-bold text-lg text-foreground">{monster.stats.attack}</div>
            </div>
          </div>

          {/* Threshold */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
            <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-2 text-center">THRESHOLD</div>
            <div className="text-center text-sm">
              <span className="text-foreground text-xs font-light italic">Minor</span>
              <span className="text-foreground text-sm mx-2 font-light"> | </span>
              <span className="text-foreground text-lg font-bold">{monster.stats.threshold.split(' / ')[0]}</span>
              <span className="text-foreground text-sm mx-2 font-light"> | </span>
              <span className="text-foreground text-xs font-light italic">Major</span>
              <span className="text-foreground text-sm mx-2 font-light"> | </span>
              <span className="text-foreground text-lg font-bold">{monster.stats.threshold.split(' / ')[1]}</span>
              <span className="text-foreground text-sm mx-2 font-light"> | </span>
              <span className="text-foreground text-xs font-light italic">Severe</span>
            </div>
          </div>

          {/* Damage with Integrated Dice Roller */}
          <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 border border-red-400/30 p-4 rounded-xl">
            <div className="text-xs text-accent uppercase font-semibold tracking-wide mb-3 text-center">DAMAGE</div>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Sword className="h-5 w-5 text-red-400" />
                <span className="text-lg font-bold text-foreground">Base:</span>
              </div>
              <DiceRoller
                onClick={(result) => handleDiceRoll(`${monster.name} damage`, result.total)}
                className="text-accent hover:text-accent-hover"
              >
                {monster.stats.damage}
              </DiceRoller>
            </div>
          </div>

          {/* Features with Dice Integration */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Features
            </h4>
            {monster.features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-r from-background to-accent/5 border border-accent/20 p-4 rounded-lg">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        feature.type === 'Action' ? 'bg-red-500/20 text-red-600 border-red-500/50' :
                        feature.type === 'Passive' ? 'bg-blue-500/20 text-blue-600 border-blue-500/50' :
                        'bg-yellow-500/20 text-yellow-600 border-yellow-500/50'
                      }`}
                    >
                      {feature.type}
                    </Badge>
                    <h5 className="font-semibold text-accent">{feature.name}</h5>
                  </div>
                </div>
                <div className="text-sm text-foreground leading-relaxed">
                  {/* Parse and make dice expressions clickable */}
                  {feature.description.split(/(\d+d\d+(?:[+-]\d+)?)/g).map((part, partIndex) => {
                    if (/^\d+d\d+(?:[+-]\d+)?$/.test(part)) {
                      return (
                        <DiceRoller
                          key={partIndex}
                          onClick={(result) => handleDiceRoll(`${feature.name}`, result.total)}
                          className="text-accent hover:text-accent-hover font-mono"
                        >
                          {part}
                        </DiceRoller>
                      );
                    }
                    return <span key={partIndex}>{part}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-accent/20">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-accent border-accent/50 hover:bg-accent/10"
              onClick={() => handleDiceRoll(`${monster.name} attack roll`, Math.floor(Math.random() * 20) + 1)}
            >
              <Target className="h-4 w-4" />
              Attack Roll
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 border-red-500/50 hover:bg-red-500/10"
              onClick={() => {
                const damageRoll = Math.floor(Math.random() * 20) + 10;
                handleDiceRoll(`${monster.name} damage`, damageRoll);
              }}
            >
              <Sword className="h-4 w-4" />
              Damage Roll
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 border-blue-500/50 hover:bg-blue-500/10"
              onClick={() => {
                const saveRoll = Math.floor(Math.random() * 20) + 1;
                handleDiceRoll(`${monster.name} save`, saveRoll);
              }}
            >
              <Shield className="h-4 w-4" />
              Save Roll
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 ${className || ''}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">🐉</span>
          <h1 className="text-2xl sm:text-3xl font-cormorant font-bold text-accent">
            Monster Stat Block Integration Test
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Demonstrating how dice roller components integrate seamlessly with monster stat blocks and other existing features.
        </p>
      </div>

      {/* Monster Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Select Test Monster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockMonsters.map((monster) => (
              <Button
                key={monster.id}
                variant={selectedMonster.id === monster.id ? "fantasy-primary" : "outline"}
                size="sm"
                onClick={() => setSelectedMonster(monster)}
                className={selectedMonster.id === monster.id ? "" : "border-accent/50 text-accent hover:bg-accent/10"}
              >
                {monster.name} ({monster.type} T{monster.tier})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Integration Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monster Stat Block with Integrated Dice Rolling */}
        <div className="lg:col-span-2">
          {renderStatBlock(selectedMonster)}
        </div>

        {/* Roll History Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-accent font-cormorant flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Session Roll History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RollHistoryDisplay
                onRollAction={(action, expression, entry) => console.log('Roll action:', action, expression)}
                className="max-h-96"
              />
            </CardContent>
          </Card>

          {/* Quick Roll History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-accent font-cormorant text-sm">Recent Rolls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rollHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No rolls yet. Click on dice expressions in the stat block to start rolling!
                  </p>
                ) : (
                  rollHistory.map((roll, index) => (
                    <div key={index} className="text-xs p-2 bg-muted/20 rounded border border-accent/20">
                      {roll}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Features Showcase */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Integration Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-accent/20 bg-background/50">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Clickable Damage Values
              </h4>
              <p className="text-sm text-muted-foreground">
                Monster damage values like &quot;2d8+3&quot; are automatically converted to clickable dice rollers
              </p>
            </div>
            
            <div className="p-4 rounded-lg border border-accent/20 bg-background/50">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Feature Dice Integration
              </h4>
              <p className="text-sm text-muted-foreground">
                Dice expressions in feature descriptions are parsed and made interactive
              </p>
            </div>
            
            <div className="p-4 rounded-lg border border-accent/20 bg-background/50">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Roll History Integration
              </h4>
              <p className="text-sm text-muted-foreground">
                All rolls are automatically tracked and can be re-rolled or copied
              </p>
            </div>
            
            <div className="p-4 rounded-lg border border-accent/20 bg-background/50">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visual Consistency
              </h4>
              <p className="text-sm text-muted-foreground">
                Dice rollers maintain the fantasy theme and visual consistency with existing components
              </p>
            </div>
            
            <div className="p-4 rounded-lg border border-accent/20 bg-background/50">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Mobile Responsive
              </h4>
              <p className="text-sm text-muted-foreground">
                All dice interactions work properly on mobile devices with appropriate touch targets
              </p>
            </div>
            
            <div className="p-4 rounded-lg border border-accent/20 bg-background/50">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Quick Actions
              </h4>
              <p className="text-sm text-muted-foreground">
                Common monster actions (attack, damage, saves) are available as quick-roll buttons
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card className="border-green-500/30 bg-gradient-to-br from-card to-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-600 font-cormorant">Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-background/50 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-600 mb-2">In Combat</h4>
              <p className="text-sm text-muted-foreground mb-2">
                During combat, DMs can click directly on damage values in monster stat blocks to roll damage:
              </p>
              <div className="bg-muted/20 p-2 rounded font-mono text-sm">
                &quot;The orc attacks for &lt;DiceRoller&gt;2d8+3&lt;/DiceRoller&gt; damage!&quot;
              </div>
            </div>
            
            <div className="p-4 bg-background/50 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-600 mb-2">Feature Abilities</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Special abilities with dice expressions become interactive:
              </p>
              <div className="bg-muted/20 p-2 rounded font-mono text-sm">
                &quot;Dragon Breath: &lt;DiceRoller&gt;6d8+10&lt;/DiceRoller&gt; fire damage&quot;
              </div>
            </div>
            
            <div className="p-4 bg-background/50 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-600 mb-2">Roll Tracking</h4>
              <p className="text-sm text-muted-foreground">
                All rolls are automatically saved to history for easy reference and re-rolling during the session.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 