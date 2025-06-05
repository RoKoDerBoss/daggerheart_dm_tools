# Daggerheart DM Tools

A collection of tools for Daggerheart tabletop RPG, built with Next.js 14, TypeScript, and Tailwind CSS, optimized for static export and Netlify deployment.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Static Export** optimized for Netlify
- **Dynamic Routes** for individual tools
- **Responsive Design** with modern UI

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Landing page
│   ├── not-found.tsx        # Custom 404 page
│   └── tools/
│       ├── page.tsx         # Tools index page
│       └── [toolName]/
│           └── page.tsx     # Dynamic tool pages
└── components/
    ├── Navbar.tsx           # Navigation component
    ├── Button.tsx           # Reusable button component
    └── Card.tsx             # Reusable card component
```

## Available Tools

- **Character Generator** - Generate random characters for campaigns
- **Name Generator** - Generate names for NPCs and locations
- **Adventure Hooks** - Get inspiration for adventures
- **Dice Roller** - Roll dice for game mechanics

*Note: Tools are currently placeholder pages. Implement functionality as needed.*

## Getting Started

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

## Building for Production

### Static Export for Netlify

```bash
npm run build
```

This will create an `out` directory with static files ready for deployment.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` directory to Netlify
3. Or connect your GitHub repository to Netlify for automatic deployments

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production with static export
- `npm run start` - Start production server (not needed for static export)
- `npm run lint` - Run ESLint

### Adding New Tools

1. Add the tool to the `availableTools` array in `src/app/tools/[toolName]/page.tsx`
2. Add tool details to the `toolDetails` object
3. Update the tools list in `src/app/page.tsx` and `src/app/tools/page.tsx`
4. Create the actual tool functionality in the dynamic page

## Configuration

### Next.js Configuration

The project is configured for static export in `next.config.js`:
- `output: 'export'` - Enables static export
- `trailingSlash: true` - Adds trailing slashes for better compatibility
- `images.unoptimized: true` - Disables image optimization for static export

### Tailwind CSS

Configured to scan all relevant files in the `src` directory. Custom CSS variables are defined in `globals.css` for theming.

## License

ISC License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## About Daggerheart

Daggerheart is a fantasy tabletop roleplaying game of brave heroics and vibrant worlds that are built together with your gaming group.