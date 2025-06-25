/**
 * Integration Test Component for Dice Roller System
 * Demonstrates seamless integration with FantasyHoverCard design system
 */

import React from 'react';
import { DiceRoller } from '@/components/DiceRoller';
import { RollHistoryDisplay } from '@/components/RollHistoryDisplay';
import { FeatureHoverCard, DiceHoverCard } from '@/components/FantasyHoverCard';
import { useDiceRollHistory } from '@/hooks/useDiceRollHistory';
import { DiceRollResult, RollAction, RollHistoryEntry } from '@/types/dice';

/**
 * Integration test component that demonstrates all dice components working together
 * with the existing FantasyHoverCard design system
 */
export const DiceRollerIntegrationTest: React.FC = () => {
  const { addRoll } = useDiceRollHistory();

  // Handle dice roll results from DiceRoller
  const handleDiceRoll = (result: DiceRollResult) => {
    addRoll(result, 'Integration test roll');
    console.log('Dice rolled:', result);
  };

  // Handle roll actions from history display
  const handleRollAction = (action: RollAction, expression: string, entry: RollHistoryEntry) => {
    console.log('Roll action:', action, expression, entry);
    
    // Example: Handle re-roll action
    if (action === 'roll-again') {
      // In a real implementation, this would trigger the dice rolling logic
      console.log('Re-rolling:', expression);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-cormorant font-bold text-accent">
          Dice Roller Integration Test
        </h1>
        <p className="text-muted-foreground">
          Testing seamless integration with FantasyHoverCard design system
        </p>
      </div>

      {/* Test DiceRoller with FantasyHoverCard integration */}
      <div className="space-y-4">
        <h2 className="text-xl font-cormorant font-semibold text-accent">
          DiceRoller Component Integration
        </h2>
        
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-foreground mb-4">
            Click on any dice expression below to see the FantasyHoverCard integration:
          </p>
          
          <DiceRoller onClick={handleDiceRoll}>
            <p className="text-foreground leading-relaxed">
              The goblin attacks with <span className="font-mono">1d20+5</span> and deals{' '}
              <span className="font-mono">2d6+3</span> slashing damage on a hit. If the attack{' '}
              is a critical hit, add an additional <span className="font-mono">1d6</span> damage.
            </p>
          </DiceRoller>
        </div>
      </div>

      {/* Test existing FantasyHoverCard components for comparison */}
      <div className="space-y-4">
        <h2 className="text-xl font-cormorant font-semibold text-accent">
          Existing FantasyHoverCard Components
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-accent mb-2">Feature Hover Card</h3>
            <p className="text-foreground">
              This creature has{' '}
              <FeatureHoverCard
                featureName="Multiattack"
                description="The creature can make two attacks on its turn, targeting the same or different opponents."
                trigger={<span className="text-accent underline cursor-help">Multiattack</span>}
              />
              {' '}allowing it to strike twice per turn.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-accent mb-2">Dice Hover Card</h3>
            <p className="text-foreground">
              Roll{' '}
              <DiceHoverCard
                diceType="2d6"
                description="Standard damage dice for medium weapons. Each die shows 1-6, and critical hits double the result."
                trigger={<span className="font-mono text-accent">2d6</span>}
              />
              {' '}for weapon damage.
            </p>
          </div>
        </div>
      </div>

      {/* Test RollHistoryDisplay integration */}
      <div className="space-y-4">
        <h2 className="text-xl font-cormorant font-semibold text-accent">
          Roll History Integration
        </h2>
        
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-foreground mb-4">
            Roll some dice above to see the history display in action:
          </p>
          
          <RollHistoryDisplay
            onRollAction={handleRollAction}
            maxDisplayEntries={5}
          />
        </div>
      </div>

      {/* Design system consistency check */}
      <div className="space-y-4">
        <h2 className="text-xl font-cormorant font-semibold text-accent">
          Design System Consistency
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="w-8 h-8 bg-accent rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-accent-foreground font-bold">🎲</span>
            </div>
            <h3 className="font-semibold text-accent">Color Scheme</h3>
            <p className="text-sm text-muted-foreground">
              Consistent accent gold (#fbbf24) throughout all components
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg mx-auto mb-2 border border-accent/30"></div>
            <h3 className="font-semibold text-accent">Gradients</h3>
            <p className="text-sm text-muted-foreground">
              Fantasy-themed gradients and hover effects
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <div className="w-8 h-8 bg-card border-2 border-accent/50 rounded-lg mx-auto mb-2"></div>
            <h3 className="font-semibold text-accent">Borders</h3>
            <p className="text-sm text-muted-foreground">
              Consistent border styling and hover states
            </p>
          </div>
        </div>
      </div>

      {/* Mobile responsiveness test */}
      <div className="space-y-4">
        <h2 className="text-xl font-cormorant font-semibold text-accent">
          Mobile Responsiveness
        </h2>
        
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-foreground mb-4">
            All components are optimized for mobile with proper touch targets:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Minimum 44px touch targets</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Responsive text sizing (sm: breakpoints)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Optimized spacing and layout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 