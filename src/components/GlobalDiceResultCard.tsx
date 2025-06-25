/**
 * GlobalDiceResultCard - Global dice result card that appears in bottom-left corner
 * Uses DiceContext for shared state across all DiceRoller components
 */

'use client';

import React from 'react';
import { useDice } from '@/contexts/DiceContext';
import { DiceResultCard } from '@/components/DiceResultCard';

export function GlobalDiceResultCard() {
  const {
    currentResult,
    isExpanded,
    rollHistory,
    handleRollAction,
    removeFromHistory,
    setIsExpanded,
  } = useDice();

  // Don't render anything if there's no current result
  if (!currentResult) {
    return null;
  }

  return (
    <DiceResultCard
      result={currentResult}
      onRollAction={handleRollAction}
      defaultExpanded={isExpanded}
      rollHistory={rollHistory}
      onRemoveFromHistory={removeFromHistory}
      onClose={() => setIsExpanded(false)}
      showCloseButton={true}
      autoCollapseTimer={10000}
    />
  );
}

export default GlobalDiceResultCard; 