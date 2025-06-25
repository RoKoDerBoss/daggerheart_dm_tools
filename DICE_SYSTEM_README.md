# Daggerheart Dice System

## Overview

The Daggerheart Dice System provides a global, shared dice rolling experience across all DiceRoller components in the application. Key features include:

- **Single Shared Card**: Only one dice result card appears at a time, regardless of which dice expression is clicked
- **Persistent History**: Roll history is saved to localStorage and persists across page navigation
- **Smooth Transitions**: Results animate smoothly when switching between different dice expressions
- **Daggerheart Mechanics**: Supports advantage (+d6), disadvantage (-d6), and critical (max base die values)

## Components

### 1. DiceContext (`src/contexts/DiceContext.tsx`)
Global state management using React Context that handles:
- Current dice result display
- Roll history with localStorage persistence
- Roll actions (advantage, disadvantage, critical, etc.)
- Transition states

### 2. DiceLayout (`src/components/DiceLayout.tsx`)
Layout wrapper that provides the DiceContext and renders the global dice card.

### 3. GlobalDiceResultCard (`src/components/GlobalDiceResultCard.tsx`)
The single instance of DiceResultCard that appears in the bottom-left corner.

### 4. DiceRoller (`src/components/DiceRoller.tsx`)
Updated to use the global context instead of managing its own state.

## Usage

### Basic Setup

The system is already integrated into the main app layout (`src/app/layout.tsx`):

```tsx
import { DiceLayout } from '@/components/DiceLayout'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <main>
          <DiceLayout>
            {children}
          </DiceLayout>
        </main>
      </body>
    </html>
  )
}
```

### Using DiceRoller Components

Simply use DiceRoller components anywhere in your app:

```tsx
import { DiceRoller } from '@/components/dice'

function MyComponent() {
  return (
    <div>
      <p>Roll for initiative: <DiceRoller>1d20+3</DiceRoller></p>
      <p>Attack roll: <DiceRoller>2d6+5</DiceRoller></p>
      <p>Damage: <DiceRoller>1d8+2</DiceRoller></p>
    </div>
  )
}
```

### Behavior

1. **Single Card**: When you click any dice expression, the result appears in the shared card
2. **Card Replacement**: Clicking a different dice expression replaces the current result with a smooth transition
3. **Persistent History**: All rolls are saved to localStorage and remain available across page reloads
4. **Auto-collapse**: The card auto-collapses to emoji mode after 10 seconds (but can be manually expanded)

## Features

### Roll History
- Stores up to 20 rolls in localStorage
- Shows last 5 rolls in the UI
- Each entry shows expression → result
- Includes roll type indicators (critical ⚡, advantage ➕, disadvantage ➖)
- Click any history entry to re-roll that expression

### Roll Modifications
- **Advantage**: Adds 1d6 to the original roll
- **Disadvantage**: Subtracts 1d6 from the original roll  
- **Critical**: Adds maximum value of each base die (e.g., 2d6 critical adds +6+6)

### Persistence
- Roll history survives page navigation
- History is automatically cleaned up (keeps most recent 20 entries)
- Card state resets when navigating to new pages

## Development

### Adding New Roll Actions

To add new roll actions, update the `RollAction` type in `src/types/dice.ts` and handle it in `DiceContext.handleRollAction()`.

### Customizing Transitions

Modify the transition classes in `DiceResultCard.tsx`:

```tsx
"transition-all duration-300 ease-in-out",
{
  "scale-105 shadow-accent/30": isTransitioning,
}
```

### Debugging

The dice system includes console logging for development. Check the browser console for:
- Roll action processing
- localStorage operations
- Error handling

## Examples

Visit the home page (`/`) to see the dice system in action with sample expressions like `1d20+5` and `2d6+2`. 