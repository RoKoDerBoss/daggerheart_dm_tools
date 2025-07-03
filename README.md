# Daggerheart DM Tools

A comprehensive collection of tools for Daggerheart tabletop RPG Dungeon Masters, built with Next.js 15, TypeScript, Tailwind CSS, and shadCN/ui components.

## 🎯 Features

### Available Tools
- **🏗️ Monster Builder** - Generate balanced adversaries with custom stats and features
- **⚔️ Loot Generator** - Create items and consumables with rarity-based generation  
- **⚖️ Battle Points Calculator** - Balance encounters using the official point system
- **😨 Fear Tracker** - Track fear levels with visual indicators and shake effects

### Tech Stack
- **Next.js 15** with App Router and React 19
- **TypeScript** for complete type safety
- **shadCN/ui** component library with custom fantasy theming
- **Tailwind CSS** with custom design system
- **Static Export** optimized for deployment
- **WCAG 2.1 AA Accessibility** compliant
- **Mobile-First Responsive Design**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RoKoDerBoss/daggerheart_dm_tools.git
cd daggerheart_dm_tools

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                # shadCN base components
│   ├── tools/             # Tool implementations
│   └── Fantasy*.tsx       # Custom fantasy-themed components
├── config/tools.ts        # Tool definitions and routing
├── data/                  # Game data (monsters, items, etc.)
├── lib/                   # Utility functions
└── hooks/                 # Custom React hooks
```

## 🎨 Design System

### Colors
- **Accent Gold (#fbbf24)**: Primary actions and highlights
- **Background Dark**: Main app background
- **Foreground Light**: Primary text content

### Component Guidelines
- Use shadCN base components for consistency
- Wrap with Fantasy* components for themed styling
- Ensure 44px minimum touch targets for mobile
- Include proper ARIA labels for accessibility

## 🛠️ Development

### Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

### Adding New Tools

1. **Add to config**: Update `src/config/tools.ts`
2. **Create component**: Add to `src/components/tools/`
3. **Dynamic routing**: Automatically handled by `[toolId]/page.tsx`

## 🏗️ Building for Production

```bash
npm run build
```

Creates static files in `out/` directory for deployment to Netlify, Vercel, or any static hosting service.

## ♿ Accessibility

- 44px minimum touch targets for mobile
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Visible focus indicators

## 🎮 About the Tools

- **Monster Builder**: Generate official Daggerheart stat blocks
- **Loot Generator**: Create treasure using official loot tables
- **Battle Points Calculator**: Balance encounters with official point system
- **Fear Tracker**: Visual fear tracking with dramatic effects

## 📝 License

ISC License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow component development guidelines
4. Ensure accessibility compliance
5. Test on mobile and desktop
6. Submit a pull request

## 🎲 About Daggerheart

Daggerheart is a fantasy tabletop roleplaying game of brave heroics and vibrant worlds. Learn more at [daggerheart.com](https://daggerheart.com).

---

*Built with ❤️ for the Daggerheart community*