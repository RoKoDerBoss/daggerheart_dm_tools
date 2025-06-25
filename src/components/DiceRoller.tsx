/**
 * DiceRoller - Interactive dice rolling component
 * Converts text content containing dice expressions into clickable, rollable elements
 * Supports Daggerheart RPG dice mechanics including advantage/disadvantage and critical rolls
 * Now uses global DiceContext for shared dice result card
 */

'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDice } from '@/contexts/DiceContext';
import { 
  DiceRollerProps, 
  DiceRollResult, 
  DiceError 
} from '@/types/dice';
import styles from './DiceRoller.module.css';

/**
 * The DiceRoller now uses ShadCN Button component with dice variant
 * All styling is handled through the Button component's variant system
 * Uses global DiceContext for shared dice result display
 */

/**
 * Component state interface for internal state management
 */
interface DiceRollerState {
  /** Whether the component is currently processing a roll */
  isRolling: boolean;
  /** Current error state, if any */
  error: DiceError | null;
}

/**
 * Props interface specifically for the internal dice element
 */
interface DiceElementProps {
  expression: string;
  onClick: () => void;
  isDisabled: boolean;
  hasError: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Internal dice element component for rendering clickable dice expressions
 * Now uses ShadCN Button component with dice variant for consistent styling
 */
const DiceElement: React.FC<DiceElementProps> = ({
  expression,
  onClick,
  isDisabled,
  hasError,
  className,
  children,
}) => {
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isDisabled) {
      onClick();
    }
  }, [onClick, isDisabled]);

  // Generate unique IDs for accessibility
  const buttonId = `dice-button-${expression.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const errorId = hasError ? `${buttonId}-error` : undefined;
  
  // Create comprehensive ARIA label
  const ariaLabel = hasError 
    ? `Roll dice: ${expression} - Error: Invalid dice expression`
    : isDisabled 
    ? `Roll dice: ${expression} - Currently rolling, please wait`
    : `Roll dice: ${expression} - Press Enter or Space to roll`;

  return (
    <Button
      id={buttonId}
      variant="dice"
      size="dice"
      disabled={isDisabled}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-describedby={errorId}
      aria-invalid={hasError}
      data-dice-expression={expression}
      title={`Click to roll: ${expression}`}
      className={cn(
        styles.diceElement,
        // Enhanced mobile touch feedback
        'active:scale-95 transition-transform duration-150',
        // Better mobile spacing
        'mx-0.5 sm:mx-0',
        {
          'text-destructive decoration-destructive border-destructive/20 bg-destructive/5': hasError,
          // Enhanced mobile error state
          'ring-2 ring-destructive/30': hasError,
        },
        className
      )}
    >
      <span 
        className={cn(
          'text-md sm:text-base transition-transform duration-200 ease-in-out',
          'no-underline',
          // Enhanced mobile visibility
          'select-none'
        )} 
        aria-hidden="true"
      >
        🎲
      </span>
      <span className="relative underline decoration-accent">
        {children}
      </span>
    </Button>
  );
};

/**
 * Main DiceRoller component
 * Renders children with clickable dice expressions that can be rolled
 */
export const DiceRoller: React.FC<DiceRollerProps> = ({
  children,
  onClick,
  onError,
  showHistory = false,
  className,
  disabled = false,
  ariaLabel,
  ariaDescription,
  enableKeyboardShortcuts = true,
  announceResults = true,
  compactMobile = false,
  mobileBreakpoint = 640,
  showDetailedResults = true,
}) => {
  // Local component state (only for loading and errors)
  const [state, setState] = useState<DiceRollerState>({
    isRolling: false,
    error: null,
  });

  // Use global dice context
  const { setCurrentResult, setIsRolling } = useDice();

  // Generate responsive classes based on mobile breakpoint
  const getResponsiveClass = useCallback((mobileClass: string, desktopClass: string) => {
    if (mobileBreakpoint === 640) {
      // Use default Tailwind sm: breakpoint
      return `${mobileClass} sm:${desktopClass}`;
    }
    // For custom breakpoints, we'll use the default classes
    // In a real implementation, you might want to use CSS-in-JS or custom CSS
    return compactMobile ? mobileClass : `${mobileClass} sm:${desktopClass}`;
  }, [mobileBreakpoint, compactMobile]);

  // Extract text content from children for dice expression detection
  const textContent = useMemo(() => {
    if (typeof children === 'string') {
      return children;
    }
    
    if (React.isValidElement(children)) {
      return String((children.props as any).children || '');
    }
    
    return String(children || '');
  }, [children]);

  // Handle dice roll action
  const handleRoll = useCallback(async (expression: string) => {
    if (disabled || state.isRolling) {
      return;
    }

    setState(prev => ({
      ...prev,
      isRolling: true,
      error: null,
    }));

    // Update global rolling state
    setIsRolling(true);

    try {
      // Dynamic import to avoid circular dependencies and reduce bundle size
      const { rollDiceExpression, validateDiceExpression } = await import('@/lib/dice-utils');
      
      // Validate expression first
      const validation = validateDiceExpression(expression);
      if (!validation.isValid || !validation.expression) {
        const error = validation.error!;
        setState(prev => ({
          ...prev,
          isRolling: false,
          error,
        }));
        
        setIsRolling(false);
        
        if (onError) {
          onError(error);
        }
        return;
      }

      // Roll the dice
      const result = rollDiceExpression(expression);
      
      setState(prev => ({
        ...prev,
        isRolling: false,
        error: null,
      }));

      // Set the result in global context (this will show the card)
      setCurrentResult(result);

      // Call custom onClick handler if provided
      if (onClick) {
        onClick(result);
      }

    } catch (error) {
      const diceError: DiceError = {
        type: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Failed to roll dice',
      };

      setState(prev => ({
        ...prev,
        isRolling: false,
        error: diceError,
      }));

      setIsRolling(false);

      if (onError) {
        onError(diceError);
      }
    }
  }, [disabled, state.isRolling, onClick, onError, setCurrentResult, setIsRolling]);

  // Determine if component should be disabled
  const isDisabled = disabled || state.isRolling;

  // Handle keyboard shortcuts for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Only handle keyboard events if enabled, not disabled, and not currently rolling
    if (!enableKeyboardShortcuts || isDisabled) return;

    // Extract dice expressions from text content
    const extractDiceExpressions = require('@/lib/dice-utils').extractDiceExpressions;
    const expressions = extractDiceExpressions(textContent);
    
    if (expressions.length === 0) return;

    // Handle keyboard shortcuts
    switch (event.key) {
      case 'r':
      case 'R':
        // 'R' key to roll the first dice expression
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          handleRoll(expressions[0]);
        }
        break;
      case 'Enter':
        // Enter key when focused on the container
        if (event.target === event.currentTarget) {
          event.preventDefault();
          handleRoll(expressions[0]);
        }
        break;
    }
  }, [enableKeyboardShortcuts, isDisabled, textContent, handleRoll]);

  // Process children to detect and enhance dice expressions
  const processedChildren = useMemo(() => {
    return parseAndEnhanceChildren(children, handleRoll, isDisabled, !!state.error);
  }, [children, handleRoll, isDisabled, state.error]);

  // Generate stable unique IDs for accessibility (prevents hydration mismatches)
  const stableId = useId();
  const rollerId = `dice-roller-${stableId}`;
  const statusId = `${rollerId}-status`;
  const errorId = state.error ? `${rollerId}-error` : undefined;

  // Create comprehensive ARIA label
  const defaultAriaLabel = enableKeyboardShortcuts 
    ? "Interactive dice roller - Press Ctrl+R to roll dice"
    : "Interactive dice roller";
  const finalAriaLabel = ariaLabel || defaultAriaLabel;
  
  // Create description IDs array
  const descriptionIds = [
    ariaDescription && `${rollerId}-description`,
    state.error ? errorId : statusId
  ].filter(Boolean).join(' ');

  return (
    <span 
      id={rollerId}
      role="group"
      aria-label={finalAriaLabel}
      aria-describedby={descriptionIds || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : -1}
      onKeyDown={enableKeyboardShortcuts ? handleKeyDown : undefined}
      className={cn(
        'inline-flex items-center gap-1 sm:gap-2',
        // Mobile-optimized spacing and touch targets
        'py-1 px-1 sm:py-0 sm:px-0',
        // Enhanced focus indicators for mobile
        enableKeyboardShortcuts && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm',
        // Mobile-specific touch enhancements
        'touch-manipulation',
        {
          'animate-pulse cursor-wait': state.isRolling,
        },
        className
      )}
      data-component="dice-roller"
      data-rolling={state.isRolling}
      data-has-error={!!state.error}
    >
      {/* Hidden description for screen readers */}
      {ariaDescription && (
        <span 
          id={`${rollerId}-description`}
          className="sr-only"
        >
          {ariaDescription}
        </span>
      )}
      {processedChildren}
      
      {/* Show loading state when rolling */}
      {state.isRolling && (
        <span 
          id={statusId}
          className={cn(
            "ml-1 sm:ml-2 inline-flex items-center gap-1",
            // Mobile-optimized text sizing and spacing
            "text-xs sm:text-sm text-muted-foreground animate-bounce",
            // Ensure minimum touch target on mobile
            "min-h-[32px] py-1 px-1 sm:py-0 sm:px-0"
          )}
          aria-live={announceResults ? "polite" : "off"}
          role="status"
        >
          <span className="animate-spin text-sm sm:text-base" aria-hidden="true">🎲</span>
          <span className="font-medium">
            <span className="hidden sm:inline">Rolling dice, please wait...</span>
            <span className="sm:hidden">Rolling...</span>
          </span>
        </span>
      )}
      
      {/* Show error state */}
      {state.error && (
        <span 
          id={errorId}
          className={cn(
            "ml-1 sm:ml-2 inline-flex items-center gap-1",
            // Mobile-optimized text sizing and spacing
            "text-xs sm:text-sm text-destructive animate-pulse",
            // Ensure minimum touch target and better mobile visibility
            "min-h-[32px] py-1 px-1 sm:py-0 sm:px-0",
            // Enhanced mobile visibility for errors
            "font-medium"
          )}
          aria-live="assertive"
          role="alert"
          title={state.error.message}
        >
          <span className="text-sm sm:text-base" aria-hidden="true">⚠️</span>
          <span className="font-medium">
            <span className="hidden sm:inline">Error: {state.error.message}</span>
            <span className="sm:hidden">Error</span>
          </span>
        </span>
      )}

      {/* Note: DiceResultCard is now rendered globally via GlobalDiceResultCard */}
    </span>
  );
};

/**
 * Default export for convenience
 */
export default DiceRoller;

/**
 * Parse children content and enhance dice expressions with clickable elements
 */
function parseAndEnhanceChildren(
  children: React.ReactNode,
  onRoll: (expression: string) => void,
  isDisabled: boolean,
  hasError: boolean
): React.ReactNode {
  // Handle string children
  if (typeof children === 'string') {
    return parseTextForDiceExpressions(children, onRoll, isDisabled, hasError);
  }

  // Handle React element children
  if (React.isValidElement(children)) {
    const childText = String((children.props as any).children || '');
    
    // If the element contains text that might have dice expressions, process it
    if (childText && typeof (children.props as any).children === 'string') {
      const processedText = parseTextForDiceExpressions(childText, onRoll, isDisabled, hasError);
      
      // Clone the element with the processed children
      return React.cloneElement(children as React.ReactElement<any>, {
        ...(children.props as any),
        children: processedText,
      });
    }
  }

  // Handle arrays of children
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>
        {parseAndEnhanceChildren(child, onRoll, isDisabled, hasError)}
      </React.Fragment>
    ));
  }

  // Return other types as-is (numbers, booleans, null, undefined)
  return children;
}

/**
 * Parse text content for dice expressions and replace them with clickable elements
 */
function parseTextForDiceExpressions(
  text: string,
  onRoll: (expression: string) => void,
  isDisabled: boolean,
  hasError: boolean
): React.ReactNode {
  // Lazy load dice utilities to avoid initial bundle size
  let extractDiceExpressions: any;
  let isDiceExpression: any;
  
  try {
    // Use require for synchronous loading in this context
    const diceUtils = require('@/lib/dice-utils');
    extractDiceExpressions = diceUtils.extractDiceExpressions;
    isDiceExpression = diceUtils.isDiceExpression;
  } catch (error) {
    // If dice utils aren't available, return text as-is
    return text;
  }

  // Find all dice expressions in the text
  const expressions = extractDiceExpressions(text);
  
  if (expressions.length === 0) {
    return text;
  }

  // Split text around dice expressions and create elements
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let partKey = 0;

  // Sort expressions by their position in the text
  const sortedExpressions = expressions
    .map((expr: string) => ({ expr, index: text.indexOf(expr) }))
    .filter((item: { expr: string; index: number }) => item.index !== -1)
    .sort((a: { expr: string; index: number }, b: { expr: string; index: number }) => a.index - b.index);

  // Remove duplicates and overlapping expressions
  const uniqueExpressions: Array<{ expr: string; index: number }> = [];
  for (const item of sortedExpressions) {
    const isOverlapping = uniqueExpressions.some(existing => 
      (item.index >= existing.index && item.index < existing.index + existing.expr.length) ||
      (existing.index >= item.index && existing.index < item.index + item.expr.length)
    );
    
    if (!isOverlapping) {
      uniqueExpressions.push(item);
    }
  }

  for (const { expr, index } of uniqueExpressions) {
    // Add text before the dice expression
    if (index > lastIndex) {
      const beforeText = text.slice(lastIndex, index);
      if (beforeText) {
        parts.push(
          <React.Fragment key={`text-${partKey++}`}>
            {beforeText}
          </React.Fragment>
        );
      }
    }

    // Add the clickable dice expression
    parts.push(
      <DiceElement
        key={`dice-${partKey++}`}
        expression={expr}
        onClick={() => onRoll(expr)}
        isDisabled={isDisabled}
        hasError={hasError}
      >
        {expr}
      </DiceElement>
    );

    lastIndex = index + expr.length;
  }

  // Add remaining text after the last dice expression
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      parts.push(
        <React.Fragment key={`text-${partKey++}`}>
          {remainingText}
        </React.Fragment>
      );
    }
  }

  return parts.length === 0 ? text : parts;
}

/**
 * Type exports for external use
 */
export type { DiceRollerProps, DiceRollerState, DiceElementProps }; 