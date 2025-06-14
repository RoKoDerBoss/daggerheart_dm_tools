# Daggerheart DM Tools

A comprehensive collection of tools for Daggerheart tabletop RPG Dungeon Masters, built with Next.js 15, TypeScript, Tailwind CSS, and shadCN/ui components. Features a fantasy-themed design system optimized for both desktop and mobile experiences.

## 🎯 Features

### Core Technology Stack
- **Next.js 15** with App Router and React 19
- **TypeScript** for complete type safety
- **shadCN/ui** component library with custom fantasy theming
- **Tailwind CSS** with custom design system
- **Static Export** optimized for deployment
- **WCAG 2.1 AA Accessibility** compliant
- **Mobile-First Responsive Design** with 44px touch targets

### Available Tools
- **🏗️ Monster Builder** - Generate balanced adversaries with custom stats and features
- **⚔️ Loot Generator** - Create items and consumables with rarity-based generation
- **⚖️ Battle Points Calculator** - Balance encounters using the official point system
- **😨 Fear Tracker** - Track fear levels with visual indicators and shake effects

### Design System
- **Fantasy-themed UI** with gold accent colors and dark purple backgrounds
- **Custom shadCN components** with fantasy variants
- **Responsive layouts** that work seamlessly on mobile and desktop
- **Accessibility-first** design with proper ARIA labels and touch targets

## 🏗️ Component Architecture

### shadCN Integration
The project uses shadCN/ui as the foundation with custom fantasy-themed enhancements:

```
src/components/
├── ui/                          # shadCN base components
│   ├── button.tsx              # Enhanced with fantasy variants
│   ├── card.tsx                # Base card component
│   ├── input.tsx               # Form input component
│   ├── select.tsx              # Dropdown component
│   ├── dialog.tsx              # Modal dialogs
│   ├── dropdown-menu.tsx       # Context menus
│   ├── hover-card.tsx          # Hover tooltips
│   ├── popover.tsx             # Contextual popovers
│   ├── tooltip.tsx             # Simple tooltips
│   ├── collapsible.tsx         # Expandable sections
│   ├── badge.tsx               # Status indicators
│   ├── alert.tsx               # Notifications
│   ├── separator.tsx           # Dividers
│   └── checkbox.tsx            # Form checkboxes
├── Button.tsx                   # Enhanced button with fear-control variant
├── Card.tsx                     # Enhanced card with fantasy styling
├── FantasyCard.tsx              # Custom fantasy-themed card wrapper
├── FantasyHoverCard.tsx         # Fantasy-themed hover tooltips
├── FantasyPopover.tsx           # Fantasy-themed contextual info
├── FantasyTooltip.tsx           # Fantasy-themed help tooltips
└── tools/                       # Tool-specific components
    ├── MonsterBuilderComponent.tsx
    ├── LootGeneratorComponent.tsx
    ├── BattlePointsCalculatorComponent.tsx
    └── FearTrackerComponent.tsx
```

### Custom Fantasy Components

#### Button Variants
```typescript
// Standard shadCN variants
variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

// Fantasy-themed variants
variant: "fantasy-primary" | "fantasy-secondary" | "fear-control"

// Sizes with mobile compliance
size: "default" | "sm" | "lg" | "icon" | "fantasy-default" | "fantasy-sm" | "fantasy-lg"
```

#### Fantasy Card Types
```typescript
// FantasyCard variants
variant: "default" | "elegant" | "magical"
```

### Color System

The design system uses CSS custom properties that integrate with shadCN's theming:

```css
:root {
  --background: #0a0a0a;        /* Deep black background */
  --foreground: #fafafa;        /* Light text */
  --card: #1a1a1a;             /* Card backgrounds */
  --accent: #fbbf24;           /* Gold accent (#fbbf24) */
  --accent-hover: #f59e0b;     /* Darker gold hover */
  --muted: #a3a3a3;            /* Muted text */
  --success: #22c55e;          /* Success green */
  --warning: #eab308;          /* Warning yellow */
  --error: #ef4444;            /* Error red */
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RoKoDerBoss/daggerheart_dm_tools.git
cd daggerheart_dm_tools
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css              # Global styles with shadCN + fantasy theme
│   ├── layout.tsx               # Root layout with fonts and navigation
│   ├── page.tsx                 # Hero landing page
│   ├── not-found.tsx            # Custom 404 page
│   └── tools/
│       ├── page.tsx             # Tools gallery page
│       └── [toolId]/
│           └── page.tsx         # Dynamic tool pages
├── components/
│   ├── ui/                      # shadCN base components
│   ├── tools/                   # Tool implementations
│   ├── FantasyCard.tsx          # Custom fantasy components
│   ├── FantasyHoverCard.tsx
│   ├── FantasyPopover.tsx
│   ├── FantasyTooltip.tsx
│   ├── Button.tsx               # Enhanced button component
│   ├── Card.tsx                 # Enhanced card component
│   ├── Navbar.tsx               # Navigation with dropdowns
│   ├── ToolLayout.tsx           # Tool page layout
│   └── ToolInfo.tsx             # Collapsible tool information
├── config/
│   └── tools.ts                 # Tool definitions and routing
├── data/
│   ├── features.ts              # Monster features database
│   ├── items.ts                 # Loot items database
│   └── consumables.ts           # Consumables database
├── lib/
│   ├── utils.ts                 # shadCN utilities
│   ├── monster-utils.ts         # Monster generation logic
│   ├── loot-utils.ts            # Loot generation logic
│   └── battle-points-utils.ts   # Battle points calculations
└── hooks/                       # Custom React hooks
```

## 🎨 Design System Guidelines

### Color Usage
- **Accent Gold (#fbbf24)**: Primary actions, highlights, and interactive elements
- **Background Dark**: Main app background with gradient overlays
- **Card Dark**: Component backgrounds with subtle borders
- **Foreground Light**: Primary text content
- **Muted Gray**: Secondary text and descriptions

### Typography
- **Headers**: Cormorant font family for fantasy feel
- **Body**: Inter font family for readability
- **Monospace**: Code and technical content

### Component Patterns
- **Cards**: Use FantasyCard for consistent styling with gradient borders
- **Buttons**: Prefer fantasy-primary for main actions, fantasy-secondary for secondary actions
- **Help Elements**: Use FantasyPopover for contextual help, FantasyTooltip for quick tips
- **Forms**: All inputs have 44px minimum height for mobile accessibility

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production with static export
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Adding New Tools

1. **Create Tool Configuration**:
```typescript
// In src/config/tools.ts
{
  id: 'new-tool',
  name: 'New Tool',
  description: 'Tool description',
  icon: '🎲',
  category: 'Generation',
  featured: false
}
```

2. **Create Tool Component**:
```typescript
// In src/components/tools/NewToolComponent.tsx
export default function NewToolComponent() {
  return (
    <div className="space-y-6">
      {/* Tool implementation */}
    </div>
  )
}
```

3. **Add Tool Page**:
```typescript
// The dynamic routing will automatically handle [toolId]/page.tsx
// Just ensure your tool ID matches the config
```

### Component Development Guidelines

1. **Use shadCN Base Components**: Start with shadCN components for consistency
2. **Add Fantasy Theming**: Wrap in Fantasy* components for themed styling
3. **Mobile-First**: Ensure 44px minimum touch targets
4. **Accessibility**: Include proper ARIA labels and descriptions
5. **Type Safety**: Use TypeScript interfaces for all props and data

### Custom Component Creation

```typescript
// Example: Creating a fantasy-themed component
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/Button"

export function MyFantasyComponent() {
  return (
    <Card className="fantasy">
      <CardContent className="p-6">
        <Button variant="fantasy-primary" size="fantasy-default">
          Fantasy Action
        </Button>
      </CardContent>
    </Card>
  )
}
```

## 🏗️ Building for Production

### Static Export
```bash
npm run build
```

This creates an `out` directory with static files optimized for deployment to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Performance Optimizations
- ✅ Static generation for all pages
- ✅ Optimized bundle sizes with tree shaking
- ✅ Image optimization disabled for static export
- ✅ CSS purging and minification
- ✅ TypeScript compilation and type checking

## ♿ Accessibility Features

The application meets WCAG 2.1 AA standards:

- **44px minimum touch targets** for mobile users
- **Proper ARIA labels** on all interactive elements
- **Keyboard navigation** support throughout
- **Screen reader compatibility** with semantic HTML
- **High contrast ratios** that exceed requirements
- **Focus management** with visible focus indicators

## 🎮 About the Tools

### Monster Builder
Generate balanced adversaries with official Daggerheart stat blocks, features, and abilities. Supports all monster types and tiers with bulk generation capabilities.

### Loot Generator
Create treasure using the official loot tables with rarity-based generation. Separate systems for permanent items and consumables.

### Battle Points Calculator
Balance encounters using the official battle points system. Calculates points based on party size and applies encounter modifiers.

### Fear Tracker
Visual fear level tracking with skull indicators and screen shake effects for dramatic moments.

## 📝 License

ISC License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the component development guidelines
4. Ensure accessibility compliance
5. Test on mobile and desktop
6. Submit a pull request

## 🎲 About Daggerheart

Daggerheart is a fantasy tabletop roleplaying game of brave heroics and vibrant worlds that are built together with your gaming group. Learn more at [daggerheart.com](https://daggerheart.com).

---

*Built with ❤️ for the Daggerheart community*