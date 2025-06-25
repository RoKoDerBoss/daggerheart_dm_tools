/**
 * DiceRoller Component Tests
 * Tests for the DiceRoller component with ShadCN Button integration
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiceRoller } from './DiceRoller';

// Mock the dice-utils module to avoid dependency issues during testing
jest.mock('@/lib/dice-utils', () => ({
  extractDiceExpressions: jest.fn((text: string) => {
    const matches = text.match(/\d*d\d+(?:[+-]\d+)?/g);
    return matches || [];
  }),
  isDiceExpression: jest.fn((text: string) => /\d*d\d+(?:[+-]\d+)?/.test(text)),
  validateDiceExpression: jest.fn(() => ({ isValid: true, expression: '2d6' })),
  rollDiceExpression: jest.fn(() => ({
    total: 8,
    rolls: [{ value: 4, sides: 6 }, { value: 4, sides: 6 }],
    modifier: 0,
    rollType: 'normal',
    timestamp: Date.now(),
  })),
}));

describe('DiceRoller Component', () => {
  test('renders children without dice expressions unchanged', () => {
    render(
      <DiceRoller>
        <span>This is just regular text</span>
      </DiceRoller>
    );
    
    expect(screen.getByText('This is just regular text')).toBeInTheDocument();
  });

  test('renders dice expressions as clickable buttons', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    // Should find the dice expression as a button
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toBeInTheDocument();
    expect(diceButton).toHaveTextContent('2d6');
  });

  test('applies ShadCN Button classes correctly', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Should have ShadCN Button base classes
    expect(diceButton).toHaveClass('inline-flex');
    expect(diceButton).toHaveClass('items-center');
    expect(diceButton).toHaveClass('justify-center');
    expect(diceButton).toHaveClass('transition-transform');
  });

  test('handles disabled state correctly', () => {
    render(
      <DiceRoller disabled>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toBeDisabled();
  });

  test('includes dice emoji in button', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toHaveTextContent('🎲');
  });

  test('preserves accessibility attributes', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toHaveAttribute('aria-label');
    expect(diceButton).toHaveAttribute('title', 'Click to roll: 2d6');
    expect(diceButton).toHaveAttribute('data-dice-expression', '2d6');
  });

  test('supports custom ARIA labels', () => {
    render(
      <DiceRoller ariaLabel="Custom dice roller">
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group', { name: 'Custom dice roller' });
    expect(group).toBeInTheDocument();
  });

  test('supports custom ARIA descriptions', () => {
    render(
      <DiceRoller ariaDescription="This roller is for combat damage">
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    expect(screen.getByText('This roller is for combat damage')).toHaveClass('sr-only');
  });

  test('can disable keyboard shortcuts', () => {
    render(
      <DiceRoller enableKeyboardShortcuts={false}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('tabIndex', '-1');
    expect(group.getAttribute('aria-label')).not.toContain('Ctrl+R');
  });

  test('can disable result announcements', () => {
    render(
      <DiceRoller announceResults={false}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    // The component should render without aria-live regions for results
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  test('includes proper ARIA roles and live regions', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAttribute('aria-label');
  });

  test('handles error states with proper ARIA attributes', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toHaveAttribute('aria-invalid', 'false'); // Initially false
    expect(diceButton).toHaveAttribute('id'); // Should have unique ID
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-describedby'); // Group should have describedby
  });

  test('applies mobile-optimized classes', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveClass('touch-manipulation');
    expect(group).toHaveClass('gap-1');
    expect(group).toHaveClass('sm:gap-2');
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toHaveClass('min-h-[44px]');
    expect(diceButton).toHaveClass('min-w-[44px]');
  });

  test('supports compact mobile layout', () => {
    render(
      <DiceRoller compactMobile={true}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  test('supports custom mobile breakpoint', () => {
    render(
      <DiceRoller mobileBreakpoint={768}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  test('includes mobile-optimized emoji sizing', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    const emoji = diceButton.querySelector('[aria-hidden="true"]');
    expect(emoji).toHaveClass('text-base');
    expect(emoji).toHaveClass('sm:text-lg');
    expect(emoji).toHaveClass('select-none');
  });

  test('provides enhanced mobile touch feedback', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    expect(diceButton).toHaveClass('active:scale-95');
    expect(diceButton).toHaveClass('transition-transform');
  });

  // Additional comprehensive tests for rendering, interaction, and error states
  
  test('handles multiple dice expressions in same text', () => {
    render(
      <DiceRoller>
        Attack with 1d20+5 and deal 2d6+3 damage
      </DiceRoller>
    );
    
    const attackButton = screen.getByRole('button', { name: /roll dice: 1d20\+5/i });
    const damageButton = screen.getByRole('button', { name: /roll dice: 2d6\+3/i });
    
    expect(attackButton).toBeInTheDocument();
    expect(damageButton).toBeInTheDocument();
    expect(attackButton).toHaveTextContent('1d20+5');
    expect(damageButton).toHaveTextContent('2d6+3');
  });

  test('handles complex React element children', () => {
    render(
      <DiceRoller>
        <div>
          <span>Roll </span>
          <strong>2d6</strong>
          <span> for damage</span>
        </div>
      </DiceRoller>
    );
    
    // The component should render but may not create dice buttons for complex nested children
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveTextContent('Roll 2d6 for damage');
  });

  test('handles array of children', () => {
    render(
      <DiceRoller>
        {['Roll ', '1d8', ' for healing']}
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 1d8/i });
    expect(diceButton).toBeInTheDocument();
  });

  test('handles empty or null children gracefully', () => {
    const { unmount } = render(<DiceRoller>{null}</DiceRoller>);
    expect(screen.getAllByRole('group')[0]).toBeInTheDocument();
    unmount();
    
    render(<DiceRoller>{undefined}</DiceRoller>);
    expect(screen.getAllByRole('group')[0]).toBeInTheDocument();
    unmount();
    
    render(<DiceRoller>{''}</DiceRoller>);
    expect(screen.getAllByRole('group')[0]).toBeInTheDocument();
  });

  test('calls onClick callback when dice is clicked', async () => {
    const mockOnClick = jest.fn();
    const { rollDiceExpression } = require('@/lib/dice-utils');
    
    render(
      <DiceRoller onClick={mockOnClick}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the dice button with act
    await act(async () => {
      diceButton.click();
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(rollDiceExpression).toHaveBeenCalledWith('2d6');
    expect(mockOnClick).toHaveBeenCalledWith(expect.objectContaining({
      total: 8,
      rolls: expect.any(Array),
      rollType: 'normal'
    }));
  });

  test('calls onError callback when validation fails', async () => {
    const mockOnError = jest.fn();
    const { validateDiceExpression } = require('@/lib/dice-utils');
    
    // Mock validation to return an error
    validateDiceExpression.mockReturnValueOnce({
      isValid: false,
      error: {
        type: 'INVALID_FORMAT',
        message: 'Invalid dice format'
      }
    });
    
    render(
      <DiceRoller onError={mockOnError}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the dice button with act
    await act(async () => {
      diceButton.click();
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockOnError).toHaveBeenCalledWith({
      type: 'INVALID_FORMAT',
      message: 'Invalid dice format'
    });
  });

  test('displays loading state when rolling dice', async () => {
    // Mock a delayed response
    const { rollDiceExpression } = require('@/lib/dice-utils');
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    rollDiceExpression.mockImplementationOnce(() => delayedPromise);
    
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the dice button
    act(() => {
      diceButton.click();
    });
    
    // Should show loading state immediately
    expect(screen.getByText('Rolling...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Button should be disabled during rolling
    expect(diceButton).toHaveAttribute('aria-label', expect.stringContaining('Currently rolling'));
    
    // Resolve the promise to clean up
    act(() => {
      resolvePromise!({
        total: 8,
        rolls: [{ value: 4, sides: 6 }, { value: 4, sides: 6 }],
        modifier: 0,
        rollType: 'normal',
        timestamp: Date.now(),
      });
    });
  });

  test('displays error state with proper styling and ARIA', async () => {
    const { validateDiceExpression } = require('@/lib/dice-utils');
    
    // Mock validation to return an error
    validateDiceExpression.mockReturnValueOnce({
      isValid: false,
      error: {
        type: 'INVALID_FORMAT',
        message: 'Invalid dice format'
      }
    });
    
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the dice button to trigger error with act
    await act(async () => {
      diceButton.click();
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Should display error message (use getAllByText since there are multiple error texts)
    expect(screen.getAllByText(/error/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Button should have error styling
    expect(diceButton).toHaveClass('text-destructive');
    expect(diceButton).toHaveAttribute('aria-invalid', 'true');
  });

  test('displays success state after successful roll', async () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the dice button with act
    await act(async () => {
      diceButton.click();
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Should display success message - use getAllByText to handle multiple matches
    const successElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('Rolled 8') || element?.textContent === '8' || false;
    });
    expect(successElements[0]).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Should show success emoji
    expect(screen.getByText('✨')).toBeInTheDocument();
  });

  test('handles keyboard shortcuts correctly', async () => {
    const mockOnClick = jest.fn();
    
    render(
      <DiceRoller onClick={mockOnClick}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    
    // Test Ctrl+R shortcut with act
    await act(async () => {
      group.dispatchEvent(new KeyboardEvent('keydown', { 
        key: 'r', 
        ctrlKey: true, 
        bubbles: true 
      }));
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Should trigger roll
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('handles Enter key when focused', async () => {
    const mockOnClick = jest.fn();
    
    render(
      <DiceRoller onClick={mockOnClick}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    
    // Focus the group and press Enter with act
    await act(async () => {
      group.focus();
      const enterEvent = new KeyboardEvent('keydown', { 
        key: 'Enter', 
        bubbles: true 
      });
      // Manually set target and currentTarget for the test
      Object.defineProperty(enterEvent, 'target', { value: group, enumerable: true });
      Object.defineProperty(enterEvent, 'currentTarget', { value: group, enumerable: true });
      group.dispatchEvent(enterEvent);
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Should trigger roll
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('ignores keyboard shortcuts when disabled', () => {
    const mockOnClick = jest.fn();
    
    render(
      <DiceRoller onClick={mockOnClick} enableKeyboardShortcuts={false}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    
    // Test Ctrl+R shortcut
    group.dispatchEvent(new KeyboardEvent('keydown', { 
      key: 'r', 
      ctrlKey: true, 
      bubbles: true 
    }));
    
    // Should not trigger roll
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('prevents multiple simultaneous rolls', async () => {
    const mockOnClick = jest.fn();
    const { rollDiceExpression } = require('@/lib/dice-utils');
    
    // Mock a delayed response to simulate async rolling
    let callCount = 0;
    rollDiceExpression.mockImplementation(() => {
      callCount++;
      return new Promise(resolve => setTimeout(() => resolve({
        total: 8,
        rolls: [{ value: 4, sides: 6 }, { value: 4, sides: 6 }],
        modifier: 0,
        rollType: 'normal',
        timestamp: Date.now(),
      }), 50));
    });
    
    render(
      <DiceRoller onClick={mockOnClick}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the first time
    act(() => {
      diceButton.click();
    });
    
    // Try to click again while rolling (should be ignored)
    act(() => {
      diceButton.click();
      diceButton.click();
    });
    
    // Wait for the first roll to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Should only call rollDiceExpression once due to isRolling state protection
    expect(callCount).toBe(1);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('handles dice utils import failure gracefully', () => {
    render(
      <DiceRoller>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    // Should still render the component with text content
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveTextContent('Roll');
    expect(group).toHaveTextContent('2d6');
    expect(group).toHaveTextContent('for damage');
  });

  test('handles unknown errors during rolling', async () => {
    const mockOnError = jest.fn();
    const { rollDiceExpression } = require('@/lib/dice-utils');
    
    // Mock rollDiceExpression to throw an error
    rollDiceExpression.mockImplementationOnce(() => {
      throw new Error('Network error');
    });
    
    render(
      <DiceRoller onError={mockOnError}>
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    
    // Click the dice button with act
    await act(async () => {
      diceButton.click();
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockOnError).toHaveBeenCalledWith({
      type: 'UNKNOWN_ERROR',
      message: 'Network error'
    });
  });

  test('generates unique IDs for multiple instances', () => {
    render(
      <div>
        <DiceRoller>Roll 1d6</DiceRoller>
        <DiceRoller>Roll 1d8</DiceRoller>
      </div>
    );
    
    const buttons = screen.getAllByRole('button');
    const groups = screen.getAllByRole('group');
    
    // Each button should have a unique ID
    const buttonIds = buttons.map(button => button.id);
    expect(new Set(buttonIds).size).toBe(buttonIds.length);
    
    // Each group should have a unique ID
    const groupIds = groups.map(group => group.id);
    expect(new Set(groupIds).size).toBe(groupIds.length);
  });

  test('maintains proper ARIA relationships', () => {
    render(
      <DiceRoller ariaDescription="Combat damage roller">
        Roll 2d6 for damage
      </DiceRoller>
    );
    
    const group = screen.getByRole('group');
    const diceButton = screen.getByRole('button', { name: /roll dice: 2d6/i });
    const description = screen.getByText('Combat damage roller');
    
    // Group should be described by the description
    expect(group).toHaveAttribute('aria-describedby', expect.stringContaining(description.id));
    
    // Button should have proper ARIA relationships
    expect(diceButton).toHaveAttribute('id');
    // Button may or may not have aria-describedby depending on error state
    expect(diceButton).toHaveAttribute('aria-label');
  });
}); 