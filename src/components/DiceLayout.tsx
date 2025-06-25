/**
 * DiceLayout - Layout component that provides global dice context and result card
 * Should be used to wrap the entire application or major sections
 */

'use client';

import React from 'react';
import { DiceProvider } from '@/contexts/DiceContext';
import { GlobalDiceResultCard } from '@/components/GlobalDiceResultCard';

interface DiceLayoutProps {
  children: React.ReactNode;
}

export function DiceLayout({ children }: DiceLayoutProps) {
  return (
    <DiceProvider>
      {children}
      <GlobalDiceResultCard />
    </DiceProvider>
  );
}

export default DiceLayout; 