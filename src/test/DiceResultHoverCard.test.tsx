/**
 * DiceResultHoverCard Component Tests
 * Tests for the DiceResultHoverCard component functionality and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiceResultHoverCard } from './DiceResultHoverCard';
import { DiceRollResult, RollAction } from '@/types/dice';

// Mock the dice-utils module
jest.mock('@/lib/dice-utils', () => ({
  validateDiceExpression: jest.fn(() => ({ 
    isValid: true, 
    expression: { 
      originalExpression: '2d6+3',
      dice: [{ count: 2, sides: 6 }],
      modifier: 3
    } 
  })),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  History: () => <div data-testid="history-icon">History</div>,
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
}));

// Create a mock dice roll result for testing
const createMockResult = (overrides?: Partial<DiceRollResult>): DiceRollResult => ({
  expression: {
    dice: [{ count: 2, sides: 6 }],
    modifier: 3,
    originalExpression: '2d6+3'
  },
  rolls: [
    { value: 4, sides: 6, isCritical: false },
    { value: 6, sides: 6, isCritical: true }
  ],
  modifier: 3,
  total: 13,
  breakdown: [
    {
      dieSpec: '2d6',
      values: [4, 6],
      subtotal: 10
    }
  ],
  timestamp: new Date('2023-01-01T12:00:00Z'),
  rollType: 'normal',
  ...overrides
});

describe('DiceResultHoverCard Component', () => {
  const defaultProps = {
    result: createMockResult(),
    open: true,
    onOpenChange: jest.fn(),
    children: <span>2d6+3</span>,
    onRollAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now() for consistent timestamp testing
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('12:00:00 PM');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders with basic props', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.getByText('2d6+3')).toBeInTheDocument();
      expect(screen.getByText('13')).toBeInTheDocument();
      expect(screen.getByText('12:00:00 PM')).toBeInTheDocument();
    });

    test('displays dice expression as clickable edit button', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('font-cormorant', 'text-accent', 'underline');
    });

    test('displays total result prominently', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const totalElement = screen.getByText('13');
      expect(totalElement).toHaveClass('text-3xl', 'font-bold');
    });

    test('shows roll type badge when not normal', () => {
      const criticalResult = createMockResult({ rollType: 'critical' });
      render(<DiceResultHoverCard {...defaultProps} result={criticalResult} />);
      
      expect(screen.getByText('critical')).toBeInTheDocument();
    });

    test('hides roll type badge for normal rolls', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.queryByText('normal')).not.toBeInTheDocument();
    });
  });

  describe('Roll Breakdown Display', () => {
    test('displays roll breakdown with individual dice', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.getByText('Roll Breakdown')).toBeInTheDocument();
      expect(screen.getByText('2d6')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // subtotal
    });

    test('shows individual die values', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    test('highlights critical rolls in die display', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const diceElements = screen.getAllByTitle(/d6: \d+/);
      const criticalDie = diceElements.find(el => el.textContent === '6');
      expect(criticalDie).toHaveClass('bg-gradient-to-br', 'from-accent', 'border-accent');
    });

    test('handles empty breakdown gracefully', () => {
      const resultWithoutBreakdown = createMockResult({ breakdown: [] });
      render(<DiceResultHoverCard {...defaultProps} result={resultWithoutBreakdown} />);
      
      expect(screen.queryByText('Roll Breakdown')).not.toBeInTheDocument();
    });
  });

  describe('Modifier Display', () => {
    test('shows modifier breakdown when modifier exists', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.getByText('Dice Total:')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // total - modifier
      expect(screen.getByText('Modifier:')).toBeInTheDocument();
      expect(screen.getByText('+3')).toBeInTheDocument();
    });

    test('hides modifier display when modifier is zero', () => {
      const resultWithoutModifier = createMockResult({ modifier: 0 });
      render(<DiceResultHoverCard {...defaultProps} result={resultWithoutModifier} />);
      
      expect(screen.queryByText('Dice Total:')).not.toBeInTheDocument();
      expect(screen.queryByText('Modifier:')).not.toBeInTheDocument();
    });

    test('displays negative modifiers correctly', () => {
      const resultWithNegativeModifier = createMockResult({ 
        modifier: -2,
        total: 8 
      });
      render(<DiceResultHoverCard {...defaultProps} result={resultWithNegativeModifier} />);
      
      expect(screen.getByText('-2')).toBeInTheDocument();
      expect(screen.getByText('-2')).toHaveClass('text-red-600');
    });

    test('applies correct color classes for positive/negative modifiers', () => {
      const { rerender } = render(<DiceResultHoverCard {...defaultProps} />);
      expect(screen.getByText('+3')).toHaveClass('text-green-600');

      const negativeResult = createMockResult({ modifier: -2, total: 8 });
      rerender(<DiceResultHoverCard {...defaultProps} result={negativeResult} />);
      expect(screen.getByText('-2')).toHaveClass('text-red-600');
    });
  });

  describe('Action Buttons', () => {
    test('renders all action buttons', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.getByText('🎲 Roll Again')).toBeInTheDocument();
      expect(screen.getByText('⚡ Critical')).toBeInTheDocument();
      expect(screen.getByText('📈 Advantage')).toBeInTheDocument();
      expect(screen.getByText('📉 Disadvantage')).toBeInTheDocument();
      expect(screen.getByText('📋 Copy Result')).toBeInTheDocument();
    });

    test('calls onRollAction with correct parameters', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      await act(async () => {
        fireEvent.click(screen.getByText('🎲 Roll Again'));
      });
      expect(defaultProps.onRollAction).toHaveBeenCalledWith('roll-again', '2d6+3');

      await act(async () => {
        fireEvent.click(screen.getByText('⚡ Critical'));
      });
      expect(defaultProps.onRollAction).toHaveBeenCalledWith('roll-critical', '2d6+3');

      await act(async () => {
        fireEvent.click(screen.getByText('📈 Advantage'));
      });
      expect(defaultProps.onRollAction).toHaveBeenCalledWith('roll-advantage', '2d6+3');

      await act(async () => {
        fireEvent.click(screen.getByText('📉 Disadvantage'));
      });
      expect(defaultProps.onRollAction).toHaveBeenCalledWith('roll-disadvantage', '2d6+3');

      await act(async () => {
        fireEvent.click(screen.getByText('📋 Copy Result'));
      });
      expect(defaultProps.onRollAction).toHaveBeenCalledWith('copy-result', '2d6+3');
    });

    test('applies correct color classes to action buttons', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const advantageButton = screen.getByText('📈 Advantage');
      expect(advantageButton).toHaveClass('text-green-600', 'border-green-500/50');

      const disadvantageButton = screen.getByText('📉 Disadvantage');
      expect(disadvantageButton).toHaveClass('text-red-600', 'border-red-500/50');

      const criticalButton = screen.getByText('⚡ Critical');
      expect(criticalButton).toHaveClass('text-yellow-600', 'border-yellow-500/50');
    });

    test('handles missing onRollAction callback gracefully', async () => {
      render(<DiceResultHoverCard {...defaultProps} onRollAction={undefined} />);
      
      // Should not throw error when clicking buttons
      await act(async () => {
        fireEvent.click(screen.getByText('🎲 Roll Again'));
      });
      // No assertion needed - just ensuring no error is thrown
    });
  });

  describe('Inline Editing Functionality', () => {
    test('enters edit mode when expression is clicked', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      expect(screen.getByDisplayValue('2d6+3')).toBeInTheDocument();
      expect(screen.getByText('✓ Save')).toBeInTheDocument();
      expect(screen.getByText('✕ Cancel')).toBeInTheDocument();
    });

    test('hides breakdown and actions during editing', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      expect(screen.queryByText('Roll Breakdown')).not.toBeInTheDocument();
      expect(screen.queryByText('🎲 Roll Again')).not.toBeInTheDocument();
    });

    test('updates expression input when typing', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const input = screen.getByDisplayValue('2d6+3');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: '3d8+1' } });
      });
      
      expect(screen.getByDisplayValue('3d8+1')).toBeInTheDocument();
    });

    test('validates expression on save', async () => {
      const { validateDiceExpression } = require('@/lib/dice-utils');
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const input = screen.getByDisplayValue('2d6+3');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: '3d8+1' } });
      });
      
      const saveButton = screen.getByText('✓ Save');
      
      await act(async () => {
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(validateDiceExpression).toHaveBeenCalledWith('3d8+1');
      });
    });

    test('shows validation error for invalid expression', async () => {
      const { validateDiceExpression } = require('@/lib/dice-utils');
      
      validateDiceExpression.mockReturnValue({
        isValid: false,
        error: { message: 'Invalid dice expression' }
      });
      
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const saveButton = screen.getByText('✓ Save');
      
      await act(async () => {
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Invalid dice expression')).toBeInTheDocument();
      });
    });

    test('calls onRollAction with edit-expression action on valid save', async () => {
      const { validateDiceExpression } = require('@/lib/dice-utils');
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const input = screen.getByDisplayValue('2d6+3');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: '3d8+1' } });
      });
      
      const saveButton = screen.getByText('✓ Save');
      
      await act(async () => {
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(defaultProps.onRollAction).toHaveBeenCalledWith('edit-expression', '3d8+1');
      });
    });

    test('cancels editing and resets expression', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const input = screen.getByDisplayValue('2d6+3');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: '3d8+1' } });
      });
      
      const cancelButton = screen.getByText('✕ Cancel');
      
      await act(async () => {
        fireEvent.click(cancelButton);
      });
      
      expect(screen.getByRole('button', { name: /click to edit dice expression/i })).toBeInTheDocument();
      expect(screen.getByText('2d6+3')).toBeInTheDocument();
    });

    test('supports keyboard shortcuts for save and cancel', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const input = screen.getByDisplayValue('2d6+3');
      
      // Test Enter key for save
      await act(async () => {
        fireEvent.change(input, { target: { value: '3d8+1' } });
      });
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });
      
      await waitFor(() => {
        expect(defaultProps.onRollAction).toHaveBeenCalledWith('edit-expression', '3d8+1');
      });
      
      // Reset and test Escape key for cancel
      jest.clearAllMocks();
      await act(async () => {
        fireEvent.click(editButton);
      });
      const newInput = screen.getByDisplayValue('2d6+3');
      await act(async () => {
        fireEvent.change(newInput, { target: { value: 'invalid' } });
      });
      await act(async () => {
        fireEvent.keyDown(newInput, { key: 'Escape', code: 'Escape' });
      });
      
      expect(screen.getByRole('button', { name: /click to edit dice expression/i })).toBeInTheDocument();
      expect(defaultProps.onRollAction).not.toHaveBeenCalled();
    });
  });

  describe('Roll History Section', () => {
    test('renders collapsible history section', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      expect(screen.getByText('Roll History')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Mock history count
    });

    test('expands history when clicked', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /roll history/i });
      
      await act(async () => {
        fireEvent.click(historyButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('12')).toBeInTheDocument(); // Mock history total
      });
    });

    test('displays individual history items with correct data', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /roll history/i });
      await act(async () => {
        fireEvent.click(historyButton);
      });
      
      await waitFor(() => {
        // Check for mock history items
        expect(screen.getByText('12')).toBeInTheDocument(); // advantage roll
        expect(screen.getByText('8')).toBeInTheDocument();  // normal roll
        expect(screen.getByText('18')).toBeInTheDocument(); // critical roll
        expect(screen.getByText('advantage')).toBeInTheDocument();
        expect(screen.getByText('critical')).toBeInTheDocument();
      });
    });

    test('handles re-roll action from history items', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /roll history/i });
      await act(async () => {
        fireEvent.click(historyButton);
      });
      
      await waitFor(async () => {
        const rerollButtons = screen.getAllByTitle('Re-roll this expression');
        await act(async () => {
          fireEvent.click(rerollButtons[0]);
        });
      });
      
      expect(defaultProps.onRollAction).toHaveBeenCalledWith('roll-again', '2d6+3');
    });

    test('shows clear all button when history exists', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /roll history/i });
      await act(async () => {
        fireEvent.click(historyButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Clear All')).toBeInTheDocument();
      });
    });

    test('handles empty history state', async () => {
      // This would require mocking the history to be empty
      // For now, we test the component renders without errors
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /roll history/i });
      expect(historyButton).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    test('applies responsive classes for mobile optimization', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const totalElement = screen.getByText('13');
      expect(totalElement).toHaveClass('text-3xl', 'sm:text-4xl');
    });

    test('applies mobile-optimized button sizing', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const rollAgainButton = screen.getByText('🎲 Roll Again');
      expect(rollAgainButton).toHaveClass('h-9', 'sm:h-10');
    });

    test('shows responsive content in hover card', () => {
      const { container } = render(<DiceResultHoverCard {...defaultProps} />);
      
      const hoverCardContent = container.querySelector('[class*="w-80"]');
      expect(hoverCardContent).toHaveClass('w-80', 'sm:w-96');
    });
  });

  describe('Accessibility Features', () => {
    test('provides proper ARIA labels for interactive elements', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      expect(editButton).toHaveAttribute('title', 'Click to edit dice expression');
    });

    test('includes proper button roles and titles', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /roll history/i });
      await act(async () => {
        fireEvent.click(historyButton);
      });
      
      await waitFor(() => {
        const rerollButtons = screen.getAllByTitle('Re-roll this expression');
        expect(rerollButtons[0]).toHaveAttribute('title', 'Re-roll this expression');
        
        const removeButtons = screen.getAllByTitle('Remove from history');
        expect(removeButtons[0]).toHaveAttribute('title', 'Remove from history');
      });
    });

    test('provides proper focus management during editing', async () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const input = screen.getByDisplayValue('2d6+3');
      expect(input).toHaveFocus();
    });

    test('includes proper semantic roles for dice elements', () => {
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const diceIcon = screen.getByRole('img', { name: 'dice' });
      expect(diceIcon).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles validation errors gracefully', async () => {
      const { validateDiceExpression } = require('@/lib/dice-utils');
      
      validateDiceExpression.mockImplementation(() => {
        throw new Error('Validation failed');
      });
      
      render(<DiceResultHoverCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /click to edit dice expression/i });
      
      await act(async () => {
        fireEvent.click(editButton);
      });
      
      const saveButton = screen.getByText('✓ Save');
      
      await act(async () => {
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Failed to validate expression')).toBeInTheDocument();
      });
    });

    test('handles missing result properties gracefully', () => {
      const incompleteResult = {
        ...createMockResult(),
        breakdown: undefined
      } as any;
      
      render(<DiceResultHoverCard {...defaultProps} result={incompleteResult} />);
      
      // Should still render without breaking
      expect(screen.getByText('13')).toBeInTheDocument();
      expect(screen.queryByText('Roll Breakdown')).not.toBeInTheDocument();
    });
  });
}); 