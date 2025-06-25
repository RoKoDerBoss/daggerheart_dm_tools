/**
 * Roll History Display Component
 * Standalone component for displaying dice roll history with collapsible interface
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, History, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { useDiceRollHistory } from '@/hooks/useDiceRollHistory';
import { RollHistoryEntry, RollAction } from '@/types/dice';

/**
 * Props for the RollHistoryDisplay component
 */
export interface RollHistoryDisplayProps {
  /** Optional callback when a roll action is triggered */
  onRollAction?: (action: RollAction, expression: string, entry: RollHistoryEntry) => void;
  /** Optional custom class name */
  className?: string;
  /** Whether to show the component in compact mode */
  compact?: boolean;
  /** Maximum number of entries to display (default: 10) */
  maxDisplayEntries?: number;
}

/**
 * Individual roll history item component
 */
interface RollHistoryItemProps {
  entry: RollHistoryEntry;
  onRollAction?: (action: RollAction, expression: string, entry: RollHistoryEntry) => void;
  compact?: boolean;
}

const RollHistoryItem: React.FC<RollHistoryItemProps> = ({ 
  entry, 
  onRollAction,
  compact = false 
}) => {
  const { result } = entry;
  const expression = result.expression.originalExpression;

  const handleAction = (action: RollAction) => {
    onRollAction?.(action, expression, entry);
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: compact ? undefined : '2-digit'
    });
  };

  const getRollTypeColor = (rollType: string): string => {
    switch (rollType) {
      case 'critical': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/50';
      case 'advantage': return 'bg-green-500/20 text-green-600 border-green-500/50';
      case 'disadvantage': return 'bg-red-500/20 text-red-600 border-red-500/50';
      default: return 'bg-accent/20 text-accent border-accent/50';
    }
  };

  return (
    <div className={`
      group relative p-3 rounded-lg border border-accent/20 
      bg-gradient-to-r from-background to-accent/5
      hover:border-accent/40 transition-all duration-200
      ${compact ? 'p-2' : 'p-3'}
    `}>
      {/* Main content */}
      <div className="flex items-center justify-between gap-3">
        {/* Expression and total */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-cormorant text-accent font-medium">
            {expression}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`
            font-bold text-foreground
            ${compact ? 'text-lg' : 'text-xl'}
          `}>
            {result.total}
          </span>
          
          {/* Roll type badge */}
          {result.rollType !== 'normal' && (
            <Badge 
              variant="outline" 
              className={`
                text-xs border ${getRollTypeColor(result.rollType)}
                ${compact ? 'px-1 py-0' : 'px-2 py-1'}
              `}
            >
              {result.rollType}
            </Badge>
          )}
        </div>

        {/* Timestamp and actions */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(result.timestamp)}</span>
          
          {/* Action buttons - show on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent/20"
              onClick={() => handleAction('roll-again')}
              title="Re-roll this expression"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent/20"
              onClick={() => handleAction('copy-result')}
              title="Copy result to clipboard"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-600"
              onClick={() => handleAction('remove-from-history')}
              title="Remove from history"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context if available */}
      {entry.context && !compact && (
        <div className="mt-2 text-xs text-muted-foreground italic">
          {entry.context}
        </div>
      )}

      {/* Detailed breakdown for non-compact mode */}
      {!compact && result.breakdown.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {result.breakdown.map((breakdown, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20"
            >
              {breakdown.dieSpec}: {breakdown.values.join(', ')} = {breakdown.subtotal}
            </span>
          ))}
          {result.modifier !== 0 && (
            <span className={`
              px-2 py-1 rounded border
              ${result.modifier > 0 
                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                : 'bg-red-500/10 text-red-600 border-red-500/20'
              }
            `}>
              Modifier: {result.modifier > 0 ? '+' : ''}{result.modifier}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Main roll history display component
 */
export const RollHistoryDisplay: React.FC<RollHistoryDisplayProps> = ({
  onRollAction,
  className = '',
  compact = false,
  maxDisplayEntries = 10
}) => {
  const { history, clearHistory, removeRoll } = useDiceRollHistory();
  const [isOpen, setIsOpen] = useState(false);

  // Limit displayed entries
  const displayedHistory = history.slice(0, maxDisplayEntries);
  const hasMoreEntries = history.length > maxDisplayEntries;

  const handleRollAction = (action: RollAction, expression: string, entry: RollHistoryEntry) => {
    // Handle remove action internally
    if (action === 'remove-from-history') {
      removeRoll(entry.id);
      return;
    }

    // Pass other actions to parent
    onRollAction?.(action, expression, entry);
  };

  const handleClearAll = () => {
    clearHistory();
    setIsOpen(false);
  };

  // Don't render if no history
  if (history.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Collapsible trigger */}
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`
              w-full justify-between p-3 h-auto
              border border-accent/20 rounded-lg
              bg-gradient-to-r from-background to-accent/5
              hover:border-accent/40 hover:bg-accent/10
              transition-all duration-200
              ${compact ? 'p-2' : 'p-3'}
            `}
          >
            <div className="flex items-center gap-2">
              <History className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-accent`} />
              <span className="font-cormorant text-accent font-medium">
                Roll History
              </span>
              <Badge 
                variant="outline" 
                className="bg-accent/20 text-accent border-accent/50"
              >
                {history.length}
              </Badge>
            </div>
            
            <ChevronDown 
              className={`
                h-4 w-4 text-accent transition-transform duration-200
                ${isOpen ? 'rotate-180' : ''}
              `} 
            />
          </Button>
        </CollapsibleTrigger>

        {/* Collapsible content */}
        <CollapsibleContent className="mt-2">
          <div className={`
            space-y-2 max-h-96 overflow-y-auto
            scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent
            ${compact ? 'space-y-1 max-h-64' : 'space-y-2 max-h-96'}
          `}>
            {displayedHistory.map((entry) => (
              <RollHistoryItem
                key={entry.id}
                entry={entry}
                onRollAction={handleRollAction}
                compact={compact}
              />
            ))}

            {/* Show more indicator */}
            {hasMoreEntries && (
              <div className="text-center py-2 text-xs text-muted-foreground">
                Showing {maxDisplayEntries} of {history.length} rolls
              </div>
            )}

            {/* Clear all button */}
            <div className="pt-2 border-t border-accent/20">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="w-full text-red-600 border-red-500/50 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All History
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}; 