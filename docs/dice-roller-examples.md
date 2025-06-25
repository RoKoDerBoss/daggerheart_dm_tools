# Dice Roller System - Code Examples

A collection of practical, copy-paste ready examples for integrating the Daggerheart dice roller system into your components.

## 📋 Table of Contents

1. [Basic Examples](#basic-examples)
2. [Game Mechanics](#game-mechanics)
3. [UI Patterns](#ui-patterns)
4. [Advanced Integration](#advanced-integration)
5. [Custom Components](#custom-components)
6. [Testing Examples](#testing-examples)

## 🎯 Basic Examples

### Simple Dice Rolling

```typescript
import { DiceRoller } from '@/components/dice';

export function BasicDiceExample() {
  return (
    <div className="space-y-4">
      <h3>Basic Dice Rolling</h3>
      
      {/* Simple dice expressions */}
      <p>Roll a d20: <DiceRoller>1d20</DiceRoller></p>
      <p>Roll damage: <DiceRoller>2d6+3</DiceRoller></p>
      <p>Roll healing: <DiceRoller>1d4+1</DiceRoller></p>
      
      {/* Multiple dice in one text */}
      <p>
        Attack roll: <DiceRoller>1d20+5</DiceRoller> to hit, 
        <DiceRoller>1d8+3</DiceRoller> damage on success
      </p>
    </div>
  );
}
```

### Handling Roll Results

```typescript
import { DiceRoller, DiceRollResult } from '@/components/dice';
import { useState } from 'react';

export function RollResultExample() {
  const [lastRoll, setLastRoll] = useState<DiceRollResult | null>(null);

  const handleRoll = (result: DiceRollResult) => {
    setLastRoll(result);
    console.log('Roll result:', result);
  };

  return (
    <div className="space-y-4">
      <h3>Roll Result Handling</h3>
      
      <div>
        <DiceRoller onClick={handleRoll}>2d6+3</DiceRoller>
      </div>
      
      {lastRoll && (
        <div className="p-4 bg-card rounded-lg">
          <h4>Last Roll Result:</h4>
          <p><strong>Expression:</strong> {lastRoll.expression.originalExpression}</p>
          <p><strong>Total:</strong> {lastRoll.total}</p>
          <p><strong>Individual Rolls:</strong> {lastRoll.rolls.map(r => r.value).join(', ')}</p>
          <p><strong>Modifier:</strong> {lastRoll.modifier}</p>
          <p><strong>Timestamp:</strong> {new Date(lastRoll.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}
```

### Error Handling

```typescript
import { DiceRoller, DiceError } from '@/components/dice';
import { useState } from 'react';

export function ErrorHandlingExample() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (diceError: DiceError) => {
    setError(`${diceError.type}: ${diceError.message}`);
    
    // Clear error after 3 seconds
    setTimeout(() => setError(null), 3000);
  };

  return (
    <div className="space-y-4">
      <h3>Error Handling</h3>
      
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <p>Valid: <DiceRoller onError={handleError}>2d6+3</DiceRoller></p>
        <p>Invalid: <DiceRoller onError={handleError}>invalid dice</DiceRoller></p>
        <p>Too many dice: <DiceRoller onError={handleError}>1000d6</DiceRoller></p>
      </div>
    </div>
  );
}
```

## 🎮 Game Mechanics

### Character Sheet Integration

```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { useState } from 'react';

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export function CharacterSheet() {
  const { addRoll } = useDiceRollHistory();
  const [stats, setStats] = useState<CharacterStats>({
    strength: 10,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 15,
    charisma: 8,
  });

  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  const getModifierString = (score: number) => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const handleSkillCheck = (skill: string, stat: keyof CharacterStats) => (result: DiceRollResult) => {
    addRoll(result, `${skill} check`);
    
    const modifier = getModifier(stats[stat]);
    const total = result.total + modifier;
    
    console.log(`${skill} check: ${result.total} + ${modifier} = ${total}`);
  };

  return (
    <div className="character-sheet space-y-6">
      <h2>Character Sheet</h2>
      
      {/* Ability Scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([stat, score]) => (
          <div key={stat} className="p-4 bg-card rounded-lg text-center">
            <h4 className="font-semibold capitalize">{stat}</h4>
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm text-muted-foreground">
              {getModifierString(score)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Skill Checks */}
      <div className="space-y-2">
        <h3>Skill Checks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            Athletics (Str): 
            <DiceRoller onClick={handleSkillCheck('Athletics', 'strength')}>
              1d20{getModifierString(stats.strength)}
            </DiceRoller>
          </div>
          <div>
            Stealth (Dex): 
            <DiceRoller onClick={handleSkillCheck('Stealth', 'dexterity')}>
              1d20{getModifierString(stats.dexterity)}
            </DiceRoller>
          </div>
          <div>
            Investigation (Int): 
            <DiceRoller onClick={handleSkillCheck('Investigation', 'intelligence')}>
              1d20{getModifierString(stats.intelligence)}
            </DiceRoller>
          </div>
          <div>
            Perception (Wis): 
            <DiceRoller onClick={handleSkillCheck('Perception', 'wisdom')}>
              1d20{getModifierString(stats.wisdom)}
            </DiceRoller>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Combat Tracker

```typescript
import { DiceRoller, useDiceRollHistory, DiceRollResult } from '@/components/dice';
import { useState } from 'react';

interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  attackBonus: number;
  damageRoll: string;
}

export function CombatTracker() {
  const { addRoll } = useDiceRollHistory();
  const [combatants, setCombatants] = useState<Combatant[]>([
    {
      id: '1',
      name: 'Fighter',
      initiative: 0,
      hp: 45,
      maxHp: 45,
      ac: 18,
      attackBonus: 7,
      damageRoll: '1d8+4',
    },
    {
      id: '2',
      name: 'Orc',
      initiative: 0,
      hp: 15,
      maxHp: 15,
      ac: 13,
      attackBonus: 5,
      damageRoll: '1d12+3',
    },
  ]);
  
  const [currentTurn, setCurrentTurn] = useState(0);

  const handleInitiative = (combatantId: string) => (result: DiceRollResult) => {
    addRoll(result, 'Initiative roll');
    
    setCombatants(prev => prev.map(c => 
      c.id === combatantId 
        ? { ...c, initiative: result.total }
        : c
    ));
  };

  const handleAttack = (attackerName: string) => (result: DiceRollResult) => {
    addRoll(result, `${attackerName} attack roll`);
    
    const success = result.total >= 15; // Example AC
    console.log(`${attackerName} attack: ${result.total} - ${success ? 'HIT' : 'MISS'}`);
  };

  const handleDamage = (attackerName: string) => (result: DiceRollResult) => {
    addRoll(result, `${attackerName} damage roll`);
    console.log(`${attackerName} deals ${result.total} damage`);
  };

  const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);

  return (
    <div className="combat-tracker space-y-6">
      <h2>Combat Tracker</h2>
      
      {/* Initiative Rolling */}
      <div className="space-y-2">
        <h3>Roll Initiative</h3>
        {combatants.map(combatant => (
          <div key={combatant.id} className="flex items-center gap-4">
            <span className="w-20">{combatant.name}:</span>
            <DiceRoller onClick={handleInitiative(combatant.id)}>
              1d20+2
            </DiceRoller>
            <span className="font-bold">{combatant.initiative || '—'}</span>
          </div>
        ))}
      </div>
      
      {/* Combat Order */}
      <div className="space-y-2">
        <h3>Combat Order</h3>
        {sortedCombatants.map((combatant, index) => (
          <div 
            key={combatant.id} 
            className={`p-4 rounded-lg border ${
              index === currentTurn ? 'border-accent bg-accent/10' : 'border-border bg-card'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{combatant.name}</h4>
              <span className="text-sm">Initiative: {combatant.initiative}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>HP: {combatant.hp}/{combatant.maxHp}</div>
              <div>AC: {combatant.ac}</div>
            </div>
            
            <div className="mt-2 space-x-4">
              <span>
                Attack: 
                <DiceRoller onClick={handleAttack(combatant.name)}>
                  1d20+{combatant.attackBonus}
                </DiceRoller>
              </span>
              <span>
                Damage: 
                <DiceRoller onClick={handleDamage(combatant.name)}>
                  {combatant.damageRoll}
                </DiceRoller>
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setCurrentTurn((prev) => (prev + 1) % sortedCombatants.length)}
          className="px-4 py-2 bg-accent text-accent-foreground rounded"
        >
          Next Turn
        </button>
      </div>
    </div>
  );
}
```

### Spell Casting System

```typescript
import { DiceRoller, DiceRollResult } from '@/components/dice';
import { useState } from 'react';

interface Spell {
  name: string;
  level: number;
  damage: string;
  description: string;
  damageType: string;
}

export function SpellCastingSystem() {
  const [spells] = useState<Spell[]>([
    {
      name: 'Magic Missile',
      level: 1,
      damage: '1d4+1',
      description: 'A dart of magical force strikes a creature.',
      damageType: 'force',
    },
    {
      name: 'Fireball',
      level: 3,
      damage: '8d6',
      description: 'A bright streak flashes and explodes in flame.',
      damageType: 'fire',
    },
    {
      name: 'Lightning Bolt',
      level: 3,
      damage: '8d6',
      description: 'A stroke of lightning forming a line.',
      damageType: 'lightning',
    },
  ]);

  const [castResults, setCastResults] = useState<Record<string, DiceRollResult>>({});

  const handleSpellCast = (spellName: string) => (result: DiceRollResult) => {
    setCastResults(prev => ({
      ...prev,
      [spellName]: result,
    }));
    
    console.log(`${spellName} deals ${result.total} damage`);
  };

  return (
    <div className="spell-system space-y-6">
      <h2>Spell Casting System</h2>
      
      <div className="grid gap-4">
        {spells.map(spell => (
          <div key={spell.name} className="p-4 bg-card rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{spell.name}</h3>
              <span className="text-sm bg-accent/20 px-2 py-1 rounded">
                Level {spell.level}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {spell.description}
            </p>
            
            <div className="flex items-center gap-4">
              <span>
                Damage: 
                <DiceRoller onClick={handleSpellCast(spell.name)}>
                  {spell.damage}
                </DiceRoller>
                {spell.damageType}
              </span>
              
              {castResults[spell.name] && (
                <span className="font-bold text-accent">
                  Last cast: {castResults[spell.name].total} damage
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 UI Patterns

### Dice Button Grid

```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { Button } from '@/components';

export function DiceButtonGrid() {
  const { addRoll } = useDiceRollHistory();

  const diceTypes = [
    { label: 'd4', expression: '1d4' },
    { label: 'd6', expression: '1d6' },
    { label: 'd8', expression: '1d8' },
    { label: 'd10', expression: '1d10' },
    { label: 'd12', expression: '1d12' },
    { label: 'd20', expression: '1d20' },
    { label: 'd100', expression: '1d100' },
  ];

  const commonRolls = [
    { label: 'Initiative', expression: '1d20+2' },
    { label: 'Attack', expression: '1d20+5' },
    { label: 'Damage', expression: '2d6+3' },
    { label: 'Healing', expression: '2d4+2' },
  ];

  const handleRoll = (context: string) => (result: DiceRollResult) => {
    addRoll(result, context);
  };

  return (
    <div className="dice-grid space-y-6">
      <div>
        <h3 className="mb-4">Standard Dice</h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {diceTypes.map(dice => (
            <Button key={dice.label} variant="outline" className="aspect-square">
              <DiceRoller onClick={handleRoll(`${dice.label} roll`)}>
                {dice.expression}
              </DiceRoller>
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="mb-4">Common Rolls</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonRolls.map(roll => (
            <Button key={roll.label} variant="outline">
              <div className="text-center">
                <div className="font-semibold">{roll.label}</div>
                <DiceRoller onClick={handleRoll(roll.label)}>
                  {roll.expression}
                </DiceRoller>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Roll History Panel

```typescript
import { RollHistoryDisplay, useDiceRollHistory } from '@/components/dice';
import { Button } from '@/components';
import { useState } from 'react';

export function RollHistoryPanel() {
  const { rollHistory, clearHistory, getHistoryStats } = useDiceRollHistory();
  const [showStats, setShowStats] = useState(false);
  
  const stats = getHistoryStats();

  return (
    <div className="roll-history-panel space-y-4">
      <div className="flex justify-between items-center">
        <h3>Roll History ({rollHistory.length})</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearHistory}
            disabled={rollHistory.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      {showStats && stats.totalRolls > 0 && (
        <div className="p-4 bg-card rounded-lg">
          <h4 className="font-semibold mb-2">Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Rolls</div>
              <div className="font-bold">{stats.totalRolls}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Average</div>
              <div className="font-bold">{stats.averageRoll.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Highest</div>
              <div className="font-bold">{stats.highestRoll}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Lowest</div>
              <div className="font-bold">{stats.lowestRoll}</div>
            </div>
          </div>
        </div>
      )}
      
      <RollHistoryDisplay 
        maxDisplayEntries={10}
        onRollAction={(action, expression, entry) => {
          console.log(`History action: ${action} for ${expression}`);
        }}
      />
    </div>
  );
}
```

### Interactive Monster Card

```typescript
import { DiceRoller, useDiceRollHistory } from '@/components/dice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components';
import { useState } from 'react';

interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  attacks: Array<{
    name: string;
    toHit: string;
    damage: string;
    description: string;
  }>;
  abilities: Array<{
    name: string;
    description: string;
    damage?: string;
  }>;
}

export function InteractiveMonsterCard() {
  const { addRoll } = useDiceRollHistory();
  const [monster, setMonster] = useState<Monster>({
    name: 'Orc Warrior',
    hp: 15,
    maxHp: 15,
    ac: 13,
    attacks: [
      {
        name: 'Greataxe',
        toHit: '1d20+5',
        damage: '1d12+3',
        description: 'Melee weapon attack',
      },
      {
        name: 'Javelin',
        toHit: '1d20+5',
        damage: '1d6+3',
        description: 'Ranged weapon attack (30/120 ft.)',
      },
    ],
    abilities: [
      {
        name: 'Aggressive',
        description: 'Move up to speed toward hostile creature',
      },
      {
        name: 'Berserker Rage',
        description: 'When below half HP, deal extra damage',
        damage: '1d6',
      },
    ],
  });

  const handleAttackRoll = (attackName: string) => (result: DiceRollResult) => {
    addRoll(result, `${monster.name} ${attackName} attack`);
  };

  const handleDamageRoll = (attackName: string) => (result: DiceRollResult) => {
    addRoll(result, `${monster.name} ${attackName} damage`);
  };

  const handleAbilityRoll = (abilityName: string) => (result: DiceRollResult) => {
    addRoll(result, `${monster.name} ${abilityName}`);
  };

  return (
    <Card className="monster-card">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{monster.name}</span>
          <span className="text-sm font-normal">
            HP: {monster.hp}/{monster.maxHp} | AC: {monster.ac}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Attacks */}
        <div>
          <h4 className="font-semibold mb-2">Attacks</h4>
          {monster.attacks.map(attack => (
            <div key={attack.name} className="p-3 bg-muted/20 rounded-lg mb-2">
              <div className="flex justify-between items-start mb-1">
                <h5 className="font-medium">{attack.name}</h5>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {attack.description}
              </p>
              <div className="flex gap-4 text-sm">
                <span>
                  To Hit: 
                  <DiceRoller onClick={handleAttackRoll(attack.name)}>
                    {attack.toHit}
                  </DiceRoller>
                </span>
                <span>
                  Damage: 
                  <DiceRoller onClick={handleDamageRoll(attack.name)}>
                    {attack.damage}
                  </DiceRoller>
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Abilities */}
        <div>
          <h4 className="font-semibold mb-2">Special Abilities</h4>
          {monster.abilities.map(ability => (
            <div key={ability.name} className="p-3 bg-muted/20 rounded-lg mb-2">
              <h5 className="font-medium">{ability.name}</h5>
              <p className="text-sm text-muted-foreground">
                {ability.description}
                {ability.damage && (
                  <span>
                    {' '}(
                    <DiceRoller onClick={handleAbilityRoll(ability.name)}>
                      {ability.damage}
                    </DiceRoller>
                    {' '}extra damage)
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🔧 Advanced Integration

### Custom Dice Roller with Modifiers

```typescript
import { DiceRoller, DiceRollResult, rollDiceExpression } from '@/components/dice';
import { useState } from 'react';

export function AdvancedDiceRoller() {
  const [baseExpression, setBaseExpression] = useState('1d20');
  const [modifiers, setModifiers] = useState({
    proficiency: 0,
    ability: 0,
    circumstance: 0,
    advantage: false,
    disadvantage: false,
  });
  
  const [results, setResults] = useState<DiceRollResult[]>([]);

  const calculateFinalExpression = () => {
    const totalModifier = modifiers.proficiency + modifiers.ability + modifiers.circumstance;
    const modifierString = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
    return `${baseExpression}${totalModifier !== 0 ? modifierString : ''}`;
  };

  const handleAdvancedRoll = () => {
    const expression = calculateFinalExpression();
    let rollResults: DiceRollResult[] = [];

    if (modifiers.advantage || modifiers.disadvantage) {
      // Roll twice for advantage/disadvantage
      const roll1 = rollDiceExpression(expression);
      const roll2 = rollDiceExpression(expression);
      
      rollResults = [roll1, roll2];
      
      // Determine which roll to use
      const finalResult = modifiers.advantage 
        ? (roll1.total >= roll2.total ? roll1 : roll2)
        : (roll1.total <= roll2.total ? roll1 : roll2);
      
      console.log(`${modifiers.advantage ? 'Advantage' : 'Disadvantage'}: ${roll1.total}, ${roll2.total} -> ${finalResult.total}`);
    } else {
      // Normal roll
      const result = rollDiceExpression(expression);
      rollResults = [result];
    }
    
    setResults(rollResults);
  };

  return (
    <div className="advanced-roller space-y-6">
      <h3>Advanced Dice Roller</h3>
      
      {/* Base Expression */}
      <div>
        <label className="block text-sm font-medium mb-2">Base Expression</label>
        <input
          type="text"
          value={baseExpression}
          onChange={(e) => setBaseExpression(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="1d20"
        />
      </div>
      
      {/* Modifiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Proficiency Bonus</label>
          <input
            type="number"
            value={modifiers.proficiency}
            onChange={(e) => setModifiers(prev => ({ ...prev, proficiency: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Ability Modifier</label>
          <input
            type="number"
            value={modifiers.ability}
            onChange={(e) => setModifiers(prev => ({ ...prev, ability: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Circumstance</label>
          <input
            type="number"
            value={modifiers.circumstance}
            onChange={(e) => setModifiers(prev => ({ ...prev, circumstance: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
      
      {/* Advantage/Disadvantage */}
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={modifiers.advantage}
            onChange={(e) => setModifiers(prev => ({ 
              ...prev, 
              advantage: e.target.checked,
              disadvantage: e.target.checked ? false : prev.disadvantage
            }))}
            className="mr-2"
          />
          Advantage
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={modifiers.disadvantage}
            onChange={(e) => setModifiers(prev => ({ 
              ...prev, 
              disadvantage: e.target.checked,
              advantage: e.target.checked ? false : prev.advantage
            }))}
            className="mr-2"
          />
          Disadvantage
        </label>
      </div>
      
      {/* Final Expression Display */}
      <div className="p-4 bg-card rounded-lg">
        <h4 className="font-semibold mb-2">Final Expression</h4>
        <div className="text-lg font-mono">
          {calculateFinalExpression()}
          {(modifiers.advantage || modifiers.disadvantage) && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({modifiers.advantage ? 'Advantage' : 'Disadvantage'})
            </span>
          )}
        </div>
      </div>
      
      {/* Roll Button */}
      <button
        onClick={handleAdvancedRoll}
        className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold"
      >
        Roll Dice
      </button>
      
      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Results</h4>
          {results.map((result, index) => (
            <div key={index} className="p-3 bg-card rounded-lg">
              <div className="flex justify-between items-center">
                <span>Roll {index + 1}: {result.total}</span>
                <span className="text-sm text-muted-foreground">
                  {result.rolls.map(r => r.value).join(' + ')}
                  {result.modifier !== 0 && ` + ${result.modifier}`}
                </span>
              </div>
            </div>
          ))}
          
          {results.length > 1 && (
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <strong>
                Final Result: {modifiers.advantage 
                  ? Math.max(...results.map(r => r.total))
                  : Math.min(...results.map(r => r.total))
                }
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Dice Roller with Animation

```typescript
import { DiceRoller, DiceRollResult } from '@/components/dice';
import { useState, useEffect } from 'react';

export function AnimatedDiceRoller() {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<DiceRollResult | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'rolling' | 'result'>('idle');

  const handleRoll = (rollResult: DiceRollResult) => {
    setIsRolling(true);
    setAnimationPhase('rolling');
    setResult(null);

    // Simulate rolling animation
    setTimeout(() => {
      setResult(rollResult);
      setAnimationPhase('result');
      setIsRolling(false);
    }, 1500);
  };

  const resetAnimation = () => {
    setAnimationPhase('idle');
    setResult(null);
  };

  return (
    <div className="animated-roller text-center space-y-6">
      <h3>Animated Dice Roller</h3>
      
      {/* Dice Animation Area */}
      <div className="relative h-32 flex items-center justify-center">
        {animationPhase === 'idle' && (
          <div className="text-6xl">🎲</div>
        )}
        
        {animationPhase === 'rolling' && (
          <div className="text-6xl animate-spin">🎲</div>
        )}
        
        {animationPhase === 'result' && result && (
          <div className="space-y-2 animate-bounce">
            <div className="text-4xl font-bold text-accent">
              {result.total}
            </div>
            <div className="text-sm text-muted-foreground">
              {result.expression.originalExpression}
            </div>
          </div>
        )}
      </div>
      
      {/* Roll Controls */}
      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          <DiceRoller 
            onClick={handleRoll}
            disabled={isRolling}
            className={isRolling ? 'opacity-50 cursor-not-allowed' : ''}
          >
            1d20
          </DiceRoller>
          <DiceRoller 
            onClick={handleRoll}
            disabled={isRolling}
            className={isRolling ? 'opacity-50 cursor-not-allowed' : ''}
          >
            2d6+3
          </DiceRoller>
          <DiceRoller 
            onClick={handleRoll}
            disabled={isRolling}
            className={isRolling ? 'opacity-50 cursor-not-allowed' : ''}
          >
            1d100
          </DiceRoller>
        </div>
        
        {result && (
          <button
            onClick={resetAnimation}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Detailed Result */}
      {result && animationPhase === 'result' && (
        <div className="p-4 bg-card rounded-lg max-w-md mx-auto">
          <h4 className="font-semibold mb-2">Roll Details</h4>
          <div className="space-y-1 text-sm">
            <div>Expression: {result.expression.originalExpression}</div>
            <div>Individual Rolls: {result.rolls.map(r => r.value).join(', ')}</div>
            <div>Modifier: {result.modifier}</div>
            <div>Total: <strong>{result.total}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🧪 Testing Examples

### Unit Test Example

```typescript
// DiceRoller.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DiceRoller } from '@/components/dice';

// Mock the dice utilities
jest.mock('@/lib/dice-utils', () => ({
  rollDiceExpression: jest.fn(() => ({
    total: 10,
    rolls: [{ value: 4, sides: 6 }, { value: 6, sides: 6 }],
    modifier: 0,
    rollType: 'normal',
    timestamp: Date.now(),
    expression: {
      originalExpression: '2d6',
      dice: [{ count: 2, sides: 6 }],
      modifier: 0,
    },
  })),
  validateDiceExpression: jest.fn(() => ({ isValid: true })),
  extractDiceExpressions: jest.fn(() => ['2d6']),
}));

describe('DiceRoller', () => {
  test('renders dice expression as clickable button', () => {
    render(<DiceRoller>Roll 2d6 for damage</DiceRoller>);
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toBeInTheDocument();
  });

  test('calls onClick handler when dice is rolled', async () => {
    const mockOnClick = jest.fn();
    
    render(
      <DiceRoller onClick={mockOnClick}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    fireEvent.click(diceButton);
    
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 10,
          rolls: expect.any(Array),
        })
      );
    });
  });

  test('handles error states correctly', async () => {
    const mockOnError = jest.fn();
    const { validateDiceExpression } = require('@/lib/dice-utils');
    
    validateDiceExpression.mockReturnValueOnce({
      isValid: false,
      error: { type: 'INVALID_FORMAT', message: 'Invalid format' },
    });
    
    render(
      <DiceRoller onError={mockOnError}>
        Invalid expression
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button');
    fireEvent.click(diceButton);
    
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith({
        type: 'INVALID_FORMAT',
        message: 'Invalid format',
      });
    });
  });
});
```

### Integration Test Example

```typescript
// DiceSystemIntegration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DiceRoller, RollHistoryDisplay, useDiceRollHistory } from '@/components/dice';

function TestComponent() {
  const { addRoll } = useDiceRollHistory();

  const handleRoll = (result) => {
    addRoll(result, 'Test roll');
  };

  return (
    <div>
      <DiceRoller onClick={handleRoll}>2d6+3</DiceRoller>
      <RollHistoryDisplay maxDisplayEntries={5} />
    </div>
  );
}

describe('Dice System Integration', () => {
  test('roll appears in history after rolling', async () => {
    render(<TestComponent />);
    
    const diceButton = screen.getByRole('button', { name: /roll dice/i });
    fireEvent.click(diceButton);
    
    await waitFor(() => {
      expect(screen.getByText(/test roll/i)).toBeInTheDocument();
    });
  });
});
```

### Custom Hook Test Example

```typescript
// useDiceRollHistory.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useDiceRollHistory } from '@/components/dice';

const mockResult = {
  total: 10,
  rolls: [{ value: 4, sides: 6 }, { value: 6, sides: 6 }],
  modifier: 0,
  rollType: 'normal' as const,
  timestamp: Date.now(),
  expression: {
    originalExpression: '2d6',
    dice: [{ count: 2, sides: 6 }],
    modifier: 0,
  },
};

describe('useDiceRollHistory', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('adds roll to history', () => {
    const { result } = renderHook(() => useDiceRollHistory());

    act(() => {
      result.current.addRoll(mockResult, 'Test roll');
    });

    expect(result.current.rollHistory).toHaveLength(1);
    expect(result.current.rollHistory[0].context).toBe('Test roll');
  });

  test('clears history', () => {
    const { result } = renderHook(() => useDiceRollHistory());

    act(() => {
      result.current.addRoll(mockResult, 'Test roll');
    });

    expect(result.current.rollHistory).toHaveLength(1);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.rollHistory).toHaveLength(0);
  });

  test('persists history in sessionStorage', () => {
    const { result } = renderHook(() => useDiceRollHistory());

    act(() => {
      result.current.addRoll(mockResult, 'Test roll');
    });

    // Create new hook instance to test persistence
    const { result: result2 } = renderHook(() => useDiceRollHistory());

    expect(result2.current.rollHistory).toHaveLength(1);
    expect(result2.current.rollHistory[0].context).toBe('Test roll');
  });
});
```

---

These examples provide a comprehensive foundation for integrating the dice roller system into your Daggerheart DM Tools. Each example is designed to be copy-paste ready while demonstrating best practices for different use cases. 