/**
 * DiceResultCard - Standalone card component for displaying dice roll results
 * Replaces the result trigger card with collapse/expand functionality and auto-timer
 * Optimized for mobile and performance
 */

'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, History, Trash2, X, RotateCcw, Zap, TrendingDown, TrendingUp, CirclePlus, CircleMinus, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DiceRollResult,
  RollAction,
  RollHistoryEntry 
} from '@/types/dice';

// Lazy import for dice utilities to reduce initial bundle size
const getDiceUtils = () => import('@/lib/dice-utils');

// Memoized hook for detecting mobile viewport (using sm breakpoint)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Import sub-components from existing hover card (to be implemented later)
// These will be copied and adapted from DiceResultHoverCard.tsx
interface DieDisplayProps {
  value?: number;
  sides?: number;
  isCritical?: boolean;
  className?: string;
}

interface RollBreakdownProps {
  result: DiceRollResult;
  className?: string;
}

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

interface RollHistorySectionProps {
  currentResult: DiceRollResult;
  onRollAction?: (action: RollAction, expression: string) => void;
  className?: string;
}

interface RollHistoryItemProps {
  entry: RollHistoryEntry;
  onReroll?: (expression: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

interface DieDisplayExpandedProps extends DieDisplayProps {
  isBreakdownOpen: boolean;
  onToggleBreakdown: () => void;
  result: DiceRollResult;
  isMobile?: boolean;
}

const DieDisplay: React.FC<DieDisplayExpandedProps> = React.memo(({ 
  className, 
  isBreakdownOpen, 
  onToggleBreakdown, 
  result,
  isMobile = false 
}) => (
  <div className={cn(
    "w-full rounded-lg border-2 border-accent/30 bg-accent/5 flex items-center justify-between px-3 py-2",
    isMobile ? "min-h-14" : "min-h-16", // Larger touch targets on mobile
    className
  )}>
      {/* Roll Display - Left Side */}
      <div 
        className={cn(
          "flex items-center gap-2 cursor-pointer hover:bg-accent/10 transition-colors py-2 rounded-lg",
          isMobile && "min-h-10" // Ensure touch target
        )}
        onClick={onToggleBreakdown}
      >
          {/* Dice Emoji */}
          <div className="flex items-center">
              <span className={cn("text-2xl", isMobile && "text-3xl")}>🎲</span>
          </div>
          {/* Dice Expression */}
          <div className="flex items-center">
              <span className={cn(
                "font-bold text-accent font-mono",
                isMobile ? "text-lg" : "text-xl"
              )}>
                {result?.expression?.originalExpression || "1d20"}
              </span>
          </div>
          {/* Chevron */}
          <div className="flex items-center ml-auto">
              <ChevronDown className={cn("h-5 w-5 text-accent transition-transform", isBreakdownOpen && "rotate-180")} />
          </div>
      </div>
      {/* Result - Right Side */}
      <div className={cn(
        "flex items-center justify-center border-2 border-accent/30 bg-accent-foreground rounded-lg px-3 py-2 relative",
        isMobile ? "min-w-16 min-h-12" : "min-w-16"
      )}>
          <span className={cn(
            "font-bold text-accent font-mono",
            isMobile ? "text-xl" : "text-2xl"
          )}>
            {result?.total || 0}
          </span>
          {/* Roll Type Indicator */}
          {result?.rollType === 'advantage' && (
            <span className="absolute top-0.5 right-0.5 text-green-500">
              <CirclePlus className="h-3.5 w-3.5" />
            </span>
          )}
          {result?.rollType === 'disadvantage' && (
            <span className="absolute top-0.5 right-0.5 text-red-500">
              <CircleMinus className="h-3.5 w-3.5" />
            </span>
          )}
          {result?.rollType === 'critical' && (
            <span className="absolute top-0.5 right-0.5 text-yellow-500">
              <Zap className="h-3.5 w-3.5" />
            </span>
          )}
      </div>
  </div>
));

DieDisplay.displayName = 'DieDisplay';

// Regular function for border styling (non-hook version)
const getDieBorderStyle = (value: number, dieSpec: string, breakdown: any) => {
  // For critical rolls, use accent color
  if (breakdown.dieSpec === 'critical') {
    return "border-accent/60 shadow-accent/20 shadow-sm";
  }
  
  // Determine die sides for min/max calculation
  let dieSides: number;
  
  if (breakdown.dieSpec === 'advantage' || breakdown.dieSpec === 'disadvantage') {
    dieSides = 6; // advantage/disadvantage are always d6
  } else {
    // Parse die sides from dieSpec (e.g., "2d6" -> 6, "1d20" -> 20)
    const match = breakdown.dieSpec.match(/\d*d(\d+)/);
    dieSides = match ? parseInt(match[1]) : 0;
  }
  
  if (dieSides === 0) {
    return "border-accent/30"; // Default border
  }
  
  // Check for min/max rolls
  if (value === 1) {
    // Minimum roll - subtle red glow
    return "border-red-400/60 shadow-red-400/20 shadow-sm";
  } else if (value === dieSides) {
    // Maximum roll - subtle green glow
    return "border-green-400/60 shadow-green-400/20 shadow-sm";
  }
  
  return "border-accent/30"; // Default border
};

const RollBreakdown: React.FC<RollBreakdownProps> = React.memo(({ result, className }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("w-full space-y-2 p-2", className)}>
      {/* Dice Rolls Section */}
      {result.breakdown && result.breakdown.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className={cn("font-semibold text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
              Dice Rolls
            </h4>
          </div>
          {result.breakdown.map((breakdown, index) => (
            <DiceBreakdownRow 
              key={index} 
              breakdown={breakdown} 
              result={result}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
      
      {/* Modifier Section */}
      {result.modifier !== 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className={cn("font-semibold text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
              Modifier
            </h4>
          </div>
          <div className={cn(
            "rounded-lg bg-accent/5 border border-accent/20",
            isMobile ? "p-3 space-y-3" : "flex items-center justify-between py-2 px-2"
          )}>
            {isMobile ? (
              // Mobile: Vertical stack with modifier and result on same row
              <>              
                {/* Modifier value and result on same row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Modifier value */}
                  <div className="flex items-center gap-2 flex-1 justify-start">
                    <span 
                      className={cn(
                        "inline-flex items-center justify-center rounded-md text-sm font-bold",
                        "border-2 border-accent/30 bg-accent/10",
                        result.modifier > 0 ? "text-green-600" : "text-red-600",
                        "w-10 h-10"
                      )}
                    >
                      {result.modifier > 0 ? '+' : ''}{result.modifier}
                    </span>
                  </div>
                  
                  {/* Right: Equals and result */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-base text-muted-foreground font-bold">=</span>
                    <span className={cn(
                      "text-center text-accent/75 font-bold font-mono px-3 py-2 rounded-md border-2 border-accent/30 bg-accent-foreground/50",
                      "text-base min-w-10"
                    )}>
                      {result.modifier}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // Desktop: Horizontal layout
              <>
                {/* Left: Modifier */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span 
                      className={cn(
                        "inline-flex items-center justify-center rounded-md text-xs font-bold",
                        "border-2 border-accent/30 bg-accent/10",
                        result.modifier > 0 ? "text-green-600" : "text-red-600",
                        "w-8 h-8"
                      )}
                    >
                      {result.modifier > 0 ? '+' : ''}{result.modifier}
                    </span>
                  </div>
                </div>
                {/* Right: Subtotal */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">=</span>
                  <span className={cn(
                    "text-center text-accent/75 font-bold font-mono px-2 py-1 rounded-md border-2 border-accent/30 bg-accent-foreground/50",
                    "text-md min-w-10"
                  )}>
                    {result.modifier}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

RollBreakdown.displayName = 'RollBreakdown';

// Memoized breakdown row component for better performance
const DiceBreakdownRow: React.FC<{
  breakdown: any;
  result: DiceRollResult;
  isMobile: boolean;
}> = React.memo(({ breakdown, result, isMobile }) => {
  return (
    <div className={cn(
      "rounded-lg bg-accent/5 border border-accent/20",
      isMobile ? "p-3 space-y-3" : "flex items-center justify-between py-2 px-2"
    )}>
      {isMobile ? (
        // Mobile: Vertical stack layout with dice and result on same row
        <>
          {/* Die specification header */}
          <div className="flex items-center justify-center gap-2">
            {breakdown.dieSpec === 'advantage' && (
              <CirclePlus className="h-5 w-5 text-green-500" />
            )}
            {breakdown.dieSpec === 'disadvantage' && (
              <CircleMinus className="h-5 w-5 text-red-500" />
            )}
            {breakdown.dieSpec === 'critical' && (
              <Zap className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-base font-bold text-accent font-mono">
              {breakdown.dieSpec === 'advantage' ? '1d6' : 
               breakdown.dieSpec === 'disadvantage' ? '1d6' : 
               breakdown.dieSpec === 'critical' ? `${result.expression.dice[0]?.count || 1}d${result.expression.dice[0]?.sides || 20}` : 
               breakdown.dieSpec}
            </span>
          </div>
          
          {/* Individual die results and subtotal on same row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Individual dice */}
            <div className="flex items-center gap-2 flex-wrap flex-1 justify-start">
              {breakdown.values.map((value: number, valueIndex: number) => {
                const borderStyle = getDieBorderStyle(value, breakdown.dieSpec, breakdown);
                
                return (
                  <span 
                    key={valueIndex}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md text-sm font-bold",
                      "border-2 bg-accent/10 text-foreground transition-all duration-200",
                      "w-10 h-10", // Mobile size
                      borderStyle
                    )}
                  >
                    {value}
                  </span>
                );
              })}
            </div>
            
            {/* Right: Equals and result */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-base text-muted-foreground font-bold">=</span>
              <span className={cn(
                "text-center font-bold font-mono px-3 py-2 rounded-md border-2 border-accent/30 bg-accent-foreground/50",
                "text-base min-w-10",
                breakdown.dieSpec === 'advantage' ? "text-green-600" : 
                breakdown.dieSpec === 'disadvantage' ? "text-red-600" : 
                breakdown.dieSpec === 'critical' ? "text-yellow-600" : 
                "text-accent/75"
              )}>
                {breakdown.dieSpec === 'advantage' ? Math.abs(breakdown.subtotal) : 
                 breakdown.dieSpec === 'disadvantage' ? Math.abs(breakdown.subtotal) : 
                 breakdown.dieSpec === 'critical' ? breakdown.subtotal : 
                 breakdown.subtotal}
              </span>
            </div>
          </div>
        </>
      ) : (
        // Desktop: Horizontal layout
        <>
          {/* Left: Die spec and individual results */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {/* Die specification with icon for advantage/disadvantage/critical */}
              {breakdown.dieSpec === 'advantage' && (
                <CirclePlus className="h-4 w-4 text-green-500" />
              )}
              {breakdown.dieSpec === 'disadvantage' && (
                <CircleMinus className="h-4 w-4 text-red-500" />
              )}
              {breakdown.dieSpec === 'critical' && (
                <Zap className="h-4 w-4 text-yellow-500 -ml-1" />
              )}
              <span className="text-md font-bold text-accent font-mono">
                {breakdown.dieSpec === 'advantage' ? '1d6' : 
                 breakdown.dieSpec === 'disadvantage' ? '1d6' : 
                 breakdown.dieSpec === 'critical' ? `${result.expression.dice[0]?.count || 1}d${result.expression.dice[0]?.sides || 20}` : 
                 breakdown.dieSpec}
              </span>
            </div>
            
            {/* Individual die results */}
            <div className="flex items-center gap-1">
              {breakdown.values.map((value: number, valueIndex: number) => {
                const borderStyle = getDieBorderStyle(value, breakdown.dieSpec, breakdown);
                
                return (
                  <span 
                    key={valueIndex}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md text-xs font-bold",
                      "border-2 bg-accent/10 text-foreground transition-all duration-200",
                      "w-8 h-8",
                      borderStyle
                    )}
                  >
                    {value}
                  </span>
                );
              })}
            </div>
          </div>
          
          {/* Right: Subtotal */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">=</span>
            <span className={cn(
              "text-center font-bold font-mono px-2 py-1 rounded-md border-2 border-accent/30 bg-accent-foreground/50",
              "text-md min-w-10",
              breakdown.dieSpec === 'advantage' ? "text-green-600" : 
              breakdown.dieSpec === 'disadvantage' ? "text-red-600" : 
              breakdown.dieSpec === 'critical' ? "text-yellow-600" : 
              "text-accent/75"
            )}>
              {breakdown.dieSpec === 'advantage' ? Math.abs(breakdown.subtotal) : 
               breakdown.dieSpec === 'disadvantage' ? Math.abs(breakdown.subtotal) : 
               breakdown.dieSpec === 'critical' ? breakdown.subtotal : 
               breakdown.subtotal}
            </span>
          </div>
        </>
      )}
    </div>
  );
});

DiceBreakdownRow.displayName = 'DiceBreakdownRow';

const RollHistoryItem: React.FC<RollHistoryItemProps> = ({ entry, className }) => (
  <div className={cn("p-3 rounded-lg", className)}>
    <p>History Item - To be implemented</p>
  </div>
);

/**
 * Main DiceResultCard Props Interface
 */
interface DiceResultCardProps {
  /** The dice roll result data */
  result: DiceRollResult;
  /** Callback for roll actions (re-roll, critical, etc.) */
  onRollAction?: (action: RollAction, expression: string) => void;
  /** Custom className for styling */
  className?: string;
  /** Whether the card starts expanded */
  defaultExpanded?: boolean;
  /** Whether to show the history section */
  showHistory?: boolean;
  /** Auto-collapse timer in milliseconds (default: 10000ms) */
  autoCollapseTimer?: number;
  /** Whether to show close button when expanded */
  showCloseButton?: boolean;
  /** Callback when card is closed/collapsed */
  onClose?: () => void;
  /** Roll history entries (passed from parent) */
  rollHistory?: RollHistoryEntry[];
  /** Callback to remove entry from history */
  onRemoveFromHistory?: (id: string) => void;
}

/**
 * DiceResultCard Component
 * 
 * A standalone card that displays dice roll results with the following states:
 * - Collapsed: Shows only dice emoji (triggers expand on click) - Full screen on mobile
 * - Expanded: Shows full roll details, breakdown, and actions
 * - Auto-collapses after timer expires
 * - Optimized for mobile with larger touch targets and responsive layout
 */
export const DiceResultCard: React.FC<DiceResultCardProps> = ({
  result,
  onRollAction,
  className,
  defaultExpanded = true,
  showHistory = true,
  autoCollapseTimer = 10000,
  showCloseButton = true,
  onClose,
  rollHistory = [],
  onRemoveFromHistory
}) => {
  // Mobile detection
  const isMobile = useIsMobile();
  
  // Component state  
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Track if the component was initially expanded to differentiate from manual expansion
  const wasInitiallyExpandedRef = useRef(defaultExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [editExpression, setEditExpression] = useState(result.expression.originalExpression);
  const [editError, setEditError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualExpansionRef = useRef<boolean>(false);
  
  // Always start with history and breakdown collapsed
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Track result changes for transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevResultRef = useRef(result);
  
  // Track hover state to prevent auto-collapse
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-collapse timer functionality
  const startAutoCollapseTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const newTimeoutId = setTimeout(() => {
      // Only collapse if not hovered and not on mobile
      if (!isHovered && !isMobile) {
        setIsExpanded(false);
        setIsEditing(false);
      }
    }, autoCollapseTimer);
    
    timeoutRef.current = newTimeoutId;
  }, [autoCollapseTimer, isHovered, isMobile]);

  const cancelAutoCollapseTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handle initial expansion state and auto-collapse timer
  useEffect(() => {
    // Only start timer for initial programmatic expansion, not manual expansion
    // Also don't start timer if on mobile (never auto-collapse on mobile)
    const shouldStartTimer = isExpanded && 
                            !isEditing && 
                            autoCollapseTimer > 0 && 
                            !isManualExpansionRef.current &&
                            wasInitiallyExpandedRef.current &&
                            !isMobile;

    if (shouldStartTimer) {
      startAutoCollapseTimer();
    } else {
      cancelAutoCollapseTimer();
    }

    // Reset manual expansion flag when collapsing
    if (!isExpanded) {
      isManualExpansionRef.current = false;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isExpanded, isEditing, startAutoCollapseTimer, cancelAutoCollapseTimer, autoCollapseTimer, isMobile]);

  // Handle hover state changes - restart timer when hover ends
  useEffect(() => {
    if (isExpanded && !isHovered && !isMobile && !isEditing && !isManualExpansionRef.current) {
      // Restart timer when hover ends
      startAutoCollapseTimer();
    } else if (isHovered || isMobile) {
      // Cancel timer when hovering or on mobile
      cancelAutoCollapseTimer();
    }
  }, [isHovered, isMobile, isExpanded, isEditing, startAutoCollapseTimer, cancelAutoCollapseTimer]);

  // Update initial expansion tracking when defaultExpanded changes
  useEffect(() => {
    if (defaultExpanded && !isManualExpansionRef.current) {
      wasInitiallyExpandedRef.current = true;
      setIsExpanded(true);
    }
  }, [defaultExpanded]);

  // Note: Removed mobile state change logic - both sections always start collapsed

  // Handle result changes with transition effect
  useEffect(() => {
    if (prevResultRef.current && 
        (prevResultRef.current.total !== result.total || 
         prevResultRef.current.expression.originalExpression !== result.expression.originalExpression ||
         prevResultRef.current.rollType !== result.rollType)) {
      
      // Start transition
      setIsTransitioning(true);
      
      // Update edit expression to match new result
      setEditExpression(result.expression.originalExpression);
      
      // End transition after animation
      const transitionTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      // Cleanup
      return () => clearTimeout(transitionTimeout);
    }
    
    prevResultRef.current = result;
  }, [result]);

  // Event handlers
  const handleToggleExpanded = () => {
    const wasExpanded = isExpanded;
    setIsExpanded(!isExpanded);
    if (!wasExpanded) {
      // Expanding - reset editing state and mark as manual expansion
      setIsEditing(false);
      setEditError(null);
      // Mark as manual expansion to prevent auto-collapse timer
      isManualExpansionRef.current = true;
      cancelAutoCollapseTimer();
    } else {
      // Collapsing - reset manual expansion flag
      isManualExpansionRef.current = false;
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsEditing(false);
    // Call onClose if provided to update global context
    if (onClose) {
      onClose();
    }
  };

  const handleRollAction = (action: RollAction) => {
    // Store current breakdown state for roll-again action
    const wasBreakdownOpen = isBreakdownOpen;
    
    if (onRollAction) {
      // For roll-again (redo), use a special action to reset to original roll
      if (action === 'roll-again') {
        onRollAction('roll-reset', result.expression.originalExpression);
      } else {
        onRollAction(action, result.expression.originalExpression);
      }
    }
    
    // For roll-again, preserve the breakdown open state
    if (action === 'roll-again' && wasBreakdownOpen) {
      // Use setTimeout to ensure the new result has been rendered
      setTimeout(() => {
        setIsBreakdownOpen(true);
      }, 0);
    }
  };

  // Memoized ability checks for performance
  const { canCritical, canAdvantageDisadvantage } = useMemo(() => {
    const hasValidBaseDie = result.expression.dice.length > 0 && result.expression.dice[0].sides !== 20;
    const hasAdvantageOrDisadvantage = result.rollType === 'advantage' || result.rollType === 'disadvantage';
    const isCritical = result.rollType === 'critical';
    
    return {
      canCritical: hasValidBaseDie && !hasAdvantageOrDisadvantage,
      canAdvantageDisadvantage: !isCritical
    };
  }, [result.expression.dice, result.rollType]);

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

  const handleEdit = () => {
    setIsEditModalOpen(true);
    setEditExpression(result.expression.originalExpression);
    setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editExpression.trim()) {
      setEditError('Expression cannot be empty');
      return;
    }

    try {
      // Validate the expression first
      const { validateDiceExpression } = await getDiceUtils();
      const validation = validateDiceExpression(editExpression);
      
      if (!validation.isValid) {
        setEditError(validation.error?.message || 'Invalid dice expression');
        return;
      }

      // Close modal and trigger roll action
      setIsEditModalOpen(false);
      setEditError(null);
      
      // Use edit-expression action to re-roll with new expression
      if (onRollAction) {
        onRollAction('edit-expression', editExpression);
      }
    } catch (error) {
      setEditError('Failed to validate expression');
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditExpression(result.expression.originalExpression);
    setEditError(null);
  };

  const removeFromHistory = (id: string) => {
    if (onRemoveFromHistory) {
      onRemoveFromHistory(id);
    }
  };

  const handleReroll = (expression: string) => {
    if (onRollAction) {
      onRollAction('roll-again', expression);
    }
  };

  // Render collapsed state (dice emoji only)
  if (!isExpanded) {
    return (
      <div className={cn(
        "fixed z-50",
        // Mobile: Bottom center with compact button, Desktop: Small corner button
        isMobile 
          ? "bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full" 
          : "bottom-4 left-4 w-14 h-14 rounded-full",
        // Mobile: Compact button styling, Desktop: Same as before
        isMobile 
          ? "bg-gradient-to-r from-accent/30 to-accent/20 border-2 border-accent/50" 
          : "bg-gradient-to-br from-accent/20 to-accent/30 border-2 border-accent/50",
        "flex items-center justify-center",
        "cursor-pointer hover:scale-110 transition-all duration-200",
        "shadow-lg shadow-accent/20 hover:shadow-accent/30",
        "backdrop-blur-sm",
        // Mobile safe area padding
        isMobile && "pb-safe-bottom",
        className
      )}>
        <button
          onClick={handleToggleExpanded}
          className={cn(
            "hover:scale-105 transition-transform flex items-center gap-2",
            isMobile ? "text-lg px-2 py-1" : "text-2xl"
          )}
          title={`${result.expression.originalExpression} = ${result.total}`}
          aria-label={`Dice roll result: ${result.total}. Click to expand.`}
        >
          <span className={isMobile ? "text-2xl" : "text-2xl"}>🎲</span>
          {isMobile && (
            <span className="font-bold text-accent font-mono text-base">
              {result.expression.originalExpression} = {result.total}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Render expanded state (full card)
  return (
    <>
      {/* Mobile backdrop blur overlay - only when expanded */}
      {isMobile && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
      )}
      
      <div 
        ref={cardRef}
        className={cn(
          "fixed z-50",
          // Mobile: Bottom sheet style, Desktop: Bottom left card
          isMobile 
            ? "bottom-0 left-0 right-0 rounded-t-2xl" 
            : "bottom-4 left-4 w-80 max-w-[calc(100vw-2rem)] rounded-xl",
          // Mobile: Bottom sheet styling, Desktop: Card styling  
          isMobile 
            ? "bg-background border-t-2 border-x-2 border-accent/30 shadow-2xl shadow-accent/30" 
            : "bg-muted border-2 border-accent/30 shadow-lg shadow-accent/20 backdrop-blur-sm",
          // Mobile: Dynamic height with max constraint, Desktop: Fixed max height
          isMobile 
            ? "max-h-[60vh] pb-safe-bottom" 
            : "max-h-[calc(100vh-2rem)]",
          "overflow-y-auto flex flex-col gap-3",
          isMobile ? "p-4 pt-6" : "p-3",
          "transition-all duration-200 ease-in-out",
          {
            "scale-[101%] shadow-accent/40": isTransitioning,
          },
          className
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={() => isMobile && setIsHovered(true)}
        onTouchEnd={() => isMobile && setIsHovered(false)}
      >
      {/* Mobile: Full screen header, Desktop: Control bar */}
      <div className={cn(
        "flex w-full justify-between items-center",
        isMobile && "border-b border-accent/20 pb-4 mb-2"
      )}>
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={handleEdit}
            className={cn(
              "hover:bg-accent/10 hover:text-foreground",
              isMobile ? "h-10 w-10" : "h-6 w-6"
            )}
            title="Edit dice roll"
          >
            <Pencil className={cn("stroke-2", isMobile ? "h-5 w-5" : "h-4 w-4")} />
          </Button>
          {showCloseButton && (
            <Button
              variant="ghost"
              size={isMobile ? "default" : "sm"}
              onClick={handleClose}
              className={cn(
                "hover:bg-accent/10 hover:text-foreground",
                isMobile ? "h-10 w-10" : "h-6 w-6"
              )}
              title="Close dice result"
            >
              <X className={cn("stroke-2", isMobile ? "h-5 w-5" : "h-4 w-4")} />
            </Button>
          )}
        </div>
      </div>

      {/* Result Display */}
      <Collapsible open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen}>
        <div className="flex flex-col items-center space-y-1">
          {/* Roll Result Display */}
          <div className="flex w-full justify-between items-center">
            {/* Roll Display */}
            <DieDisplay 
              className="w-full" 
              isBreakdownOpen={isBreakdownOpen}
              onToggleBreakdown={() => setIsBreakdownOpen(!isBreakdownOpen)}
              result={result}
              isMobile={isMobile}
            />
          </div>
          <CollapsibleContent className="flex flex-col w-full items-center">
            {/* Roll Breakdown */}
            <RollBreakdown result={result} />
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Action Buttons */}
      <div className={cn(
        "flex w-full items-center gap-2",
        isMobile ? "justify-between" : "flex-1"
      )}>
        {/* All buttons in one horizontal line for mobile */}
        <Button
          variant="outline"
          size={isMobile ? "sm" : "sm"}
          onClick={() => handleRollAction('roll-again')}
          className={cn(
            "flex items-center gap-1 border-blue-500/50 hover:bg-blue-500/10",
            isMobile ? "h-10 flex-1" : "h-8 flex-1"
          )}
          title="Reset to original roll"
        >
          <RotateCcw className={cn("text-blue-500", isMobile ? "h-4 w-4" : "h-4 w-4")} />
          <span className={cn("text-muted-foreground hidden sm:inline", isMobile ? "text-xs" : "text-xs")}>Redo</span>
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "sm" : "sm"}
          onClick={() => handleRollAction('roll-critical')}
          disabled={!canCritical}
          className={cn(
            "flex items-center gap-1",
            canCritical 
              ? "border-accent/50 hover:bg-accent/10" 
              : "border-muted/30 opacity-50 cursor-not-allowed",
            isMobile ? "h-10 flex-1" : "h-8 flex-1"
          )}
          title={canCritical ? "Roll critical" : "Critical not available for d20 rolls or with advantage/disadvantage"}
        >
          <Zap className={cn(canCritical ? "text-accent" : "text-muted-foreground", isMobile ? "h-4 w-4" : "h-4 w-4")} />
          <span className={cn("text-muted-foreground hidden sm:inline", isMobile ? "text-xs" : "text-xs")}>Crit</span>
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "sm" : "sm"}
          onClick={() => handleRollAction('roll-advantage')}
          disabled={!canAdvantageDisadvantage}
          className={cn(
            "flex items-center gap-1",
            canAdvantageDisadvantage 
              ? "border-green-500/50 hover:bg-green-500/10" 
              : "border-muted/30 opacity-50 cursor-not-allowed",
            isMobile ? "h-10 flex-1" : "h-8 flex-1"
          )}
          title={canAdvantageDisadvantage ? "Roll with advantage" : "Advantage not available with critical rolls"}
        >
          <CirclePlus className={cn(canAdvantageDisadvantage ? "text-green-500" : "text-muted-foreground", isMobile ? "h-4 w-4" : "h-4 w-4")} />
          <span className={cn("text-muted-foreground hidden sm:inline", isMobile ? "text-xs" : "text-xs")}>Adv</span>
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "sm" : "sm"}
          onClick={() => handleRollAction('roll-disadvantage')}
          disabled={!canAdvantageDisadvantage}
          className={cn(
            "flex items-center gap-1",
            canAdvantageDisadvantage 
              ? "border-red-500/50 hover:bg-red-500/10" 
              : "border-muted/30 opacity-50 cursor-not-allowed",
            isMobile ? "h-10 flex-1" : "h-8 flex-1"
          )}
          title={canAdvantageDisadvantage ? "Roll with disadvantage" : "Disadvantage not available with critical rolls"}
        >
          <CircleMinus className={cn(canAdvantageDisadvantage ? "text-red-500" : "text-muted-foreground", isMobile ? "h-4 w-4" : "h-4 w-4")} />
          <span className={cn("text-muted-foreground hidden sm:inline", isMobile ? "text-xs" : "text-xs")}>Dis</span>
        </Button>
      </div>

      {/* Roll History */}
      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-end w-full justify-between">
            <CollapsibleTrigger className={cn(
              "flex items-center w-full justify-start space-x-1 cursor-pointer",
              isMobile && "min-h-12 py-2" // Larger touch target on mobile
            )}>
              {/* Accordion Trigger */}
              <div className="flex items-center">
                <History className={cn("text-accent", isMobile ? "h-6 w-6" : "h-5 w-5")} />
              </div>
              <div className="flex items-center">
                <span className={cn(
                  "font-bold font-cormorant text-muted-foreground",
                  isMobile ? "text-xl" : "text-lg"
                )}>Roll History</span>
              </div>
              <div className="flex items-center">
                <ChevronDown className={cn(
                  "text-muted-foreground transition-transform", 
                  isHistoryOpen && "rotate-180",
                  isMobile ? "h-5 w-5" : "h-4 w-4"
                )} />
              </div>
            </CollapsibleTrigger>
            {isHistoryOpen && (
              <div className="flex w-full justify-end mb-1 items-end">
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => {
                    if (onRemoveFromHistory) {
                      // Clear all history by removing each entry
                      rollHistory.forEach(entry => onRemoveFromHistory(entry.id));
                    }
                  }}
                  className={cn(
                    "text-muted-foreground hover:text-accent/50 hover:bg-transparent",
                    isMobile ? "h-8 px-2 text-sm" : "h-6 px-1 text-xs"
                  )}
                  title="Clear all roll history"
                >
                  Clear History
                </Button>
              </div>
            )}
          </div>
          <CollapsibleContent className="flex items-center w-full justify-center">
            {/* Roll History */}
            <div className="relative w-full">
              <div className={cn(
                "w-full space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent pr-1",
                isMobile ? "max-h-60" : "max-h-40"
              )}>
              {(() => {
                // Filter out the current result from history to avoid duplication
                const filteredHistory = rollHistory.filter(entry => 
                  entry.result.timestamp.getTime() !== result.timestamp.getTime() ||
                  entry.result.total !== result.total ||
                  entry.result.expression.originalExpression !== result.expression.originalExpression
                );
                
                return filteredHistory.length === 0 ? (
                  <div className={cn(
                    "text-center text-muted-foreground",
                    isMobile ? "py-6 text-base" : "py-4 text-sm"
                  )}>
                    No previous rolls
                  </div>
                ) : (
                  <>
                    {filteredHistory.map((entry: RollHistoryEntry) => (
                    <div 
                      key={entry.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors",
                        isMobile ? "p-3 min-h-14" : "p-2" // Larger touch targets on mobile
                      )}
                    >
                      {/* Left: Expression and arrow */}
                      <div className={cn(
                        "flex items-center gap-2 flex-1",
                        isMobile && "flex-col items-start gap-1"
                      )}>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-mono text-accent font-medium",
                            isMobile ? "text-base" : "text-sm"
                          )}>
                            {entry.result.expression.originalExpression}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className={cn(
                            "font-bold text-foreground",
                            isMobile ? "text-lg" : "text-sm"
                          )}>
                            {entry.result.total}
                          </span>
                        </div>
                      </div>
                      
                      {/* Right: Roll type icon and actions */}
                      <div className={cn(
                        "flex items-center gap-2",
                        isMobile && "ml-2"
                      )}>
                        {/* Roll type indicator */}
                        {entry.result.rollType === 'critical' && (
                          <span title="Critical">
                            <Zap className={cn("text-yellow-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                          </span>
                        )}
                        {entry.result.rollType === 'advantage' && (
                          <span title="Advantage">
                            <CirclePlus className={cn("text-green-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                          </span>
                        )}
                        {entry.result.rollType === 'disadvantage' && (
                          <span title="Disadvantage">
                            <CircleMinus className={cn("text-red-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                          </span>
                        )}
                        
                        {/* Reroll button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReroll(entry.result.expression.originalExpression)}
                          className={cn(
                            "hover:bg-accent/20",
                            isMobile ? "h-10 w-10 p-0" : "h-6 w-6 p-0"
                          )}
                          title="Reroll"
                        >
                          <RotateCcw className={cn(isMobile ? "h-4 w-4" : "h-3 w-3")} />
                        </Button>
                        
                        {/* Delete button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromHistory(entry.id)}
                          className={cn(
                            "hover:bg-red-500/20 hover:text-red-500",
                            isMobile ? "h-10 w-10 p-0" : "h-6 w-6 p-0"
                          )}
                          title="Remove from history"
                        >
                          <Trash2 className={cn(isMobile ? "h-4 w-4" : "h-3 w-3")} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
                );
              })()}
              </div>
              {/* Fade gradient at bottom to indicate scrollable content */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t pointer-events-none opacity-50",
                isMobile ? "h-6 from-background/95 to-transparent" : "h-4 from-muted to-transparent"
              )}></div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Edit Expression Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className={cn(
          isMobile ? "sm:max-w-[95vw] w-[95vw] max-h-[90vh]" : "sm:max-w-md"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(isMobile ? "text-xl" : "text-lg")}>
              Edit Dice Expression
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                value={editExpression}
                onChange={(e) => setEditExpression(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEditSubmit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleEditModalClose();
                  }
                }}
                placeholder="Enter dice expression (e.g., 2d6+3)"
                className={cn(
                  "font-mono",
                  editError && "border-red-500 focus:border-red-500",
                  isMobile && "h-12 text-base"
                )}
                autoFocus
              />
              {editError && (
                <p className={cn(
                  "text-red-600 mt-2",
                  isMobile ? "text-base" : "text-sm"
                )}>{editError}</p>
              )}
            </div>
            <div className={cn(
              "flex justify-end gap-2",
              isMobile && "flex-col-reverse"
            )}>
              <Button
                variant="outline"
                onClick={handleEditModalClose}
                className={cn(isMobile && "h-12")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                className={cn(
                  "bg-accent hover:bg-accent/90",
                  isMobile && "h-12"
                )}
              >
                Roll New Expression
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default DiceResultCard; 