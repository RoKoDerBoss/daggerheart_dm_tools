# Tool Components Directory

This directory contains individual tool components that are rendered within the dynamic tool routing system.

## Adding a New Tool

To add a new tool to the system:

### 1. Update the Tools Registry

Add your tool to `src/config/tools.ts`:

```typescript
export const TOOLS_REGISTRY: Record<string, Tool> = {
  // ... existing tools
  'your-new-tool': {
    id: 'your-new-tool',
    name: 'Your New Tool',
    description: 'Brief description of what this tool does.',
    icon: '🎯', // Emoji icon
    category: TOOL_CATEGORIES.UTILITIES, // or appropriate category
    status: 'coming-soon', // 'active', 'coming-soon', or 'beta'
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ],
    component: 'YourNewToolComponent' // Optional: for future component mapping
  }
}
```

### 2. Create the Tool Component (Optional)

Create a component file in this directory (e.g., `YourNewToolComponent.tsx`):

```typescript
interface YourNewToolComponentProps {
  // Define any props the tool needs
}

export default function YourNewToolComponent({ }: YourNewToolComponentProps) {
  return (
    <div className="fantasy-card p-8">
      <h3 className="text-2xl font-bold text-foreground mb-4">
        Your Tool Interface
      </h3>
      <p className="text-muted mb-6">
        Your tool's interactive interface goes here.
      </p>
      
      {/* Add your tool's functionality here */}
      <div className="space-y-4">
        {/* Tool controls, inputs, outputs, etc. */}
      </div>
    </div>
  )
}
```

### 3. Dynamic Integration (Future)

The tool will automatically appear in:
- Navigation dropdowns
- Tools page
- Dynamic routing at `/tools/your-new-tool`

For custom component rendering, you'll need to update the dynamic page to conditionally render your component based on the tool ID.

## Tool Categories

Available categories (add new ones to `TOOL_CATEGORIES` in the config):
- `EQUIPMENT` - Loot, items, gear
- `COMBAT` - Battle calculations, encounters
- `UTILITIES` - General purpose tools

## Tool Status

- `active` - Fully functional tool
- `beta` - Working but may have issues
- `coming-soon` - Placeholder/not yet implemented

## Styling

All tools should use the established design system:
- `fantasy-card` for main containers
- `text-foreground` for primary text
- `text-muted` for secondary text
- `text-accent` for highlights and interactive elements
- `btn-primary` and `btn-secondary` for buttons 