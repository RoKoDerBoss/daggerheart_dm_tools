/**
 * DiceResultHoverCard - Specialized hover card for displaying dice roll results
 * Extends FantasyHoverCard with dice variant for enhanced roll information
 */

'use client';

import React, { useState } from 'react';
import { 
  FantasyHoverCard, 
  FantasyHoverCardTrigger, 
  FantasyHoverCardContent 
} from '@/components/FantasyHoverCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, History, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DiceResultHoverCardProps,
  DiceRollResult,
  RollAction,
  RollHistoryEntry 
} from '@/types/dice';

/**
 * Individual die result display component
 */
interface DieDisplayProps {
  value: number;
  sides: number;
  isCritical?: boolean;
  className?: string;
}

const DieDisplay: React.FC<DieDisplayProps> = ({ 
  value, 
  sides, 
  isCritical = false, 
  className 
}) => (
  <div 
    className={cn(
      // Enhanced fantasy die appearance with better mobile sizing
      "inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold border-2 transition-all duration-300",
      // Fantasy glow effects and enhanced critical styling
      isCritical 
        ? "bg-gradient-to-br from-accent to-accent-hover text-background border-accent shadow-lg shadow-accent/40 ring-2 ring-accent/30 animate-pulse" 
        : "bg-gradient-to-br from-card to-muted/20 text-foreground border-border hover:border-accent/50 hover:shadow-md hover:shadow-accent/20 hover:scale-105",
      // Enhanced mobile touch targets and visual feedback
      "cursor-default select-none backdrop-blur-sm",
      className
    )}
    title={`d${sides}: ${value}${isCritical ? ' (Critical!)' : ''}`}
  >
    <span className="relative z-10">{value}</span>
    {/* Fantasy sparkle effect for critical rolls */}
    {isCritical && (
      <div className="absolute inset-0 rounded-lg opacity-30 animate-ping bg-accent" />
    )}
  </div>
);

/**
 * Roll breakdown by die type component
 */
interface RollBreakdownProps {
  result: DiceRollResult;
  className?: string;
}

const RollBreakdown: React.FC<RollBreakdownProps> = ({ result, className }) => {
  if (!result.breakdown || result.breakdown.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3 p-3 rounded-lg bg-gradient-to-r from-muted/10 to-muted/5 border border-accent/20", className)}>
      <h5 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <span className="text-accent">⚄</span>
        Roll Breakdown
      </h5>
      <div className="space-y-2">
        {result.breakdown.map((group, index) => (
          <div key={index} className="flex items-center justify-between text-sm sm:text-base p-2 rounded-md bg-background/50 border border-border/50 hover:border-accent/30 transition-colors">
            <span className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="font-mono text-accent font-semibold text-xs sm:text-sm whitespace-nowrap">
                {group.dieSpec}
              </span>
              <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                {group.values.map((value, rollIndex) => (
                  <DieDisplay
                    key={rollIndex}
                    value={value}
                    sides={parseInt(group.dieSpec.split('d')[1])}
                    isCritical={value === parseInt(group.dieSpec.split('d')[1])}
                  />
                ))}
              </div>
            </span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">=</span>
              <span className="font-bold text-foreground text-sm sm:text-base px-2 py-1 rounded bg-accent/10 border border-accent/20">
                {group.subtotal}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Roll summary component
 */
interface RollSummaryProps {
  result: DiceRollResult;
  className?: string;
  isEditing?: boolean;
  editExpression?: string;
  editError?: string | null;
  onEditChange?: (value: string) => void;
  onEditSubmit?: () => void;
  onEditCancel?: () => void;
  onEditKeyDown?: (e: React.KeyboardEvent) => void;
  onStartEdit?: () => void;
}

const RollSummary: React.FC<RollSummaryProps> = ({ 
  result, 
  className,
  isEditing = false,
  editExpression = '',
  editError = null,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onEditKeyDown,
  onStartEdit
}) => (
  <div className={cn("space-y-4 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20 shadow-lg shadow-accent/10", className)}>
    {/* Roll Total */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-3xl sm:text-4xl" role="img" aria-label="dice">🎲</span>
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={editExpression}
              onChange={(e) => onEditChange?.(e.target.value)}
              onKeyDown={onEditKeyDown}
              placeholder="Enter dice expression (e.g., 2d6+3)"
              className={cn(
                "font-mono text-sm sm:text-base border-2 bg-background/70 backdrop-blur-sm",
                editError && "border-red-500 focus:border-red-500 ring-2 ring-red-500/20"
              )}
              autoFocus
            />
            {editError && (
              <p className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                {editError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onEditSubmit}
                className="text-xs sm:text-sm h-7 sm:h-8 px-3 border-accent/50 text-accent hover:bg-accent/10"
              >
                ✓ Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onEditCancel}
                className="text-xs sm:text-sm h-7 sm:h-8 px-3 hover:bg-muted/50"
              >
                ✕ Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={onStartEdit}
            className="font-cormorant text-lg sm:text-xl font-semibold text-accent hover:text-accent-hover transition-all duration-200 cursor-pointer underline decoration-dashed underline-offset-2 hover:underline-offset-4 hover:scale-105 min-w-0 truncate"
            title="Click to edit dice expression"
          >
            {result.expression.originalExpression}
          </button>
        )}
      </div>
      {!isEditing && (
        <div className="text-right flex-shrink-0">
          <div className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-br from-accent/20 to-accent/10 px-3 sm:px-4 py-2 rounded-lg border border-accent/30 shadow-md">
            {result.total}
          </div>
          {result.rollType !== 'normal' && (
            <Badge 
              variant={result.rollType === 'critical' ? 'default' : 'secondary'}
              className="text-xs sm:text-sm mt-2 shadow-sm"
            >
              {result.rollType}
            </Badge>
          )}
        </div>
      )}
    </div>

    {/* Modifier Display */}
    {!isEditing && result.modifier !== 0 && (
      <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 border-t border-accent/20">
        <div className="flex items-center justify-between p-2 rounded-md bg-background/30">
          <span className="text-xs sm:text-sm text-muted-foreground">Dice Total:</span>
          <span className="text-sm sm:text-base font-semibold text-foreground">{result.total - result.modifier}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-md bg-background/30">
          <span className="text-xs sm:text-sm text-muted-foreground">Modifier:</span>
          <span className={cn(
            "text-sm sm:text-base font-semibold",
            result.modifier > 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {result.modifier > 0 ? '+' : ''}{result.modifier}
          </span>
        </div>
      </div>
    )}
  </div>
);

/**
 * Roll history item component
 */
interface RollHistoryItemProps {
  entry: RollHistoryEntry;
  onReroll?: (expression: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

const RollHistoryItem: React.FC<RollHistoryItemProps> = ({ 
  entry, 
  onReroll, 
  onRemove,
  className 
}) => (
  <div className={cn(
    "flex items-center justify-between p-3 sm:p-3 rounded-lg bg-gradient-to-r from-background/80 to-muted/30 border border-border/50 hover:border-accent/40 transition-all duration-200 hover:shadow-md hover:shadow-accent/10 group", 
    className
  )}>
    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <span className="text-xs sm:text-sm font-mono text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20 whitespace-nowrap">
        {entry.result.expression.originalExpression}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">→</span>
      <span className="text-sm sm:text-base font-bold text-foreground bg-foreground/10 px-2 py-1 rounded">
        {entry.result.total}
      </span>
      {entry.result.rollType !== 'normal' && (
        <Badge variant="secondary" className="text-xs py-0 h-5 sm:h-6 bg-accent/20 text-accent border-accent/30">
          {entry.result.rollType}
        </Badge>
      )}
    </div>
    <div className="flex items-center gap-1 sm:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onReroll?.(entry.result.expression.originalExpression)}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-sm hover:bg-accent/20 hover:text-accent transition-colors"
        title="Re-roll this expression"
      >
        🎲
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove?.(entry.id)}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="Remove from history"
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  </div>
);

/**
 * Collapsible roll history section component
 */
interface RollHistorySectionProps {
  currentResult: DiceRollResult;
  onRollAction?: (action: RollAction, expression: string) => void;
  className?: string;
}

const RollHistorySection: React.FC<RollHistorySectionProps> = ({ 
  currentResult, 
  onRollAction,
  className 
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Mock roll history for demonstration - in real implementation, this would come from useDiceRollHistory hook
  const mockHistory: RollHistoryEntry[] = [
    {
      id: '1',
      result: {
        ...currentResult,
        total: 12,
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        rollType: 'advantage'
      }
    },
    {
      id: '2',
      result: {
        ...currentResult,
        total: 8,
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        rollType: 'normal'
      }
    },
    {
      id: '3',
      result: {
        ...currentResult,
        total: 18,
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        rollType: 'critical'
      }
    }
  ];

  const handleReroll = (expression: string) => {
    if (onRollAction) {
      onRollAction('roll-again', expression);
    }
  };

  const handleRemove = (id: string) => {
    // In real implementation, this would remove from history
    console.log('Remove roll:', id);
  };

  const handleClearHistory = () => {
    // In real implementation, this would clear all history
    console.log('Clear all history');
  };

  return (
    <div className={cn("space-y-3 p-3 rounded-lg bg-gradient-to-br from-muted/5 to-muted/10 border border-accent/20", className)}>
      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between p-3 h-auto text-left hover:bg-accent/10 rounded-lg border border-transparent hover:border-accent/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-accent/20 border border-accent/30">
                <History className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <span className="text-sm sm:text-base text-foreground font-medium">
                Roll History
              </span>
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                {mockHistory.length}
              </Badge>
            </div>
            <ChevronDown 
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-300",
                isHistoryOpen && "rotate-180 text-accent"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
            {mockHistory.length === 0 ? (
              <div className="text-xs sm:text-sm text-muted-foreground text-center py-6 italic bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl opacity-50">📜</span>
                  <span>No previous rolls</span>
                </div>
              </div>
            ) : (
              mockHistory.map((entry, index) => (
                <RollHistoryItem
                  key={entry.id}
                  entry={entry}
                  onReroll={handleReroll}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
          {mockHistory.length > 0 && (
            <div className="flex justify-end pt-2 border-t border-accent/20">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearHistory}
                className="text-xs sm:text-sm h-7 sm:h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

/**
 * Main DiceResultHoverCard component
 */
export const DiceResultHoverCard: React.FC<DiceResultHoverCardProps> = ({
  result,
  open,
  onOpenChange,
  children,
  onRollAction,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editExpression, setEditExpression] = useState(result.expression.originalExpression);
  const [editError, setEditError] = useState<string | null>(null);

  const handleRollAction = (action: RollAction) => {
    if (onRollAction) {
      onRollAction(action, result.expression.originalExpression);
    }
  };

  const handleEditSubmit = async () => {
    try {
      // Validate the edited expression
      const { validateDiceExpression } = await import('@/lib/dice-utils');
      const validation = validateDiceExpression(editExpression.trim());
      
      if (!validation.isValid || !validation.expression) {
        setEditError(validation.error?.message || 'Invalid dice expression');
        return;
      }

      // Clear error and trigger roll with new expression
      setEditError(null);
      setIsEditing(false);
      
      if (onRollAction) {
        onRollAction('edit-expression', editExpression.trim());
      }
    } catch (error) {
      setEditError('Failed to validate expression');
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditExpression(result.expression.originalExpression);
    setEditError(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleEditCancel();
    }
  };

  return (
    <FantasyHoverCard open={open} onOpenChange={onOpenChange}>
      <FantasyHoverCardTrigger className="font-mono text-accent font-semibold">
        {children}
      </FantasyHoverCardTrigger>
      <FantasyHoverCardContent variant="dice" className="w-80 sm:w-96 max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Roll Summary */}
          <RollSummary 
            result={result}
            isEditing={isEditing}
            editExpression={editExpression}
            editError={editError}
            onEditChange={setEditExpression}
            onEditSubmit={handleEditSubmit}
            onEditCancel={handleEditCancel}
            onEditKeyDown={handleEditKeyDown}
            onStartEdit={() => setIsEditing(true)}
          />
          
          {/* Roll Breakdown */}
          {!isEditing && <RollBreakdown result={result} />}
          
          {/* Roll History */}
          {!isEditing && (
            <RollHistorySection 
              currentResult={result}
              onRollAction={handleRollAction}
            />
          )}
          
          {/* Action Buttons and Timestamp */}
          {!isEditing && (
            <div className="space-y-3 sm:space-y-4 pt-3 border-t-2 border-accent/20">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRollAction('roll-again')}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-all duration-200 hover:scale-105"
                >
                  🎲 Roll Again
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRollAction('roll-critical')}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10 border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-200 hover:scale-105"
                >
                  ⚡ Critical
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRollAction('roll-advantage')}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:border-green-500 transition-all duration-200 hover:scale-105"
                >
                  📈 Advantage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRollAction('roll-disadvantage')}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10 border-red-500/50 text-red-600 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200 hover:scale-105"
                >
                  📉 Disadvantage
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRollAction('copy-result')}
                className="w-full text-xs sm:text-sm h-9 sm:h-10 hover:bg-accent/10 hover:text-accent transition-all duration-200 border border-transparent hover:border-accent/30"
              >
                📋 Copy Result
              </Button>
              
              {/* Timestamp */}
              <div className="text-xs sm:text-sm text-muted-foreground text-center pt-3 border-t border-accent/20 bg-gradient-to-r from-transparent via-muted/10 to-transparent rounded-lg p-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-accent">⏰</span>
                  <span>Rolled {result.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </FantasyHoverCardContent>
    </FantasyHoverCard>
  );
};

export default DiceResultHoverCard; 