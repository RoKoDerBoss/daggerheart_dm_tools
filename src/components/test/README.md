# Test Components Directory

This directory contains all test, integration, and validation components for the Daggerheart DM Tools dice roller system.

## Directory Structure

```
src/components/test/
├── index.ts                              # Centralized exports for all test components
├── README.md                             # This documentation file
│
├── DiceRollerE2ETest.tsx                 # End-to-end testing component
├── DiceRollerAccessibilityAudit.tsx      # WCAG 2.1 AA accessibility audit
├── DiceRollerPerformanceTest.tsx         # Mobile performance testing
│
├── DiceRollerIntegrationTest.tsx         # Basic integration testing
├── MonsterStatBlockIntegrationTest.tsx   # Monster stat block integration
├── ShadCNIntegrationTest.tsx             # ShadCN UI component integration
└── ShadCNIntegrationVerification.tsx     # ShadCN component verification
```

## Test Components Overview

### Main Test Components

#### `DiceRollerE2ETest.tsx`
- **Purpose**: Comprehensive end-to-end testing across multiple device viewports
- **Features**: 
  - Real-time viewport simulation (7 device sizes)
  - Automated test execution (5 categories, 35 test cases)
  - Touch target validation, responsive layout testing
  - Performance monitoring and accessibility compliance
- **Access**: `/test/dice-roller-e2e`
- **Report**: `reports/dice-roller-e2e-test-report.md`

#### `DiceRollerAccessibilityAudit.tsx`
- **Purpose**: WCAG 2.1 AA compliance testing and accessibility validation
- **Features**:
  - 8 test categories covering WCAG A, AA, AAA levels
  - Keyboard navigation testing, ARIA label validation
  - Screen reader compatibility, color contrast analysis
  - Real-time validation with severity classification
- **Access**: `/test/dice-roller-accessibility`
- **Report**: `reports/dice-roller-accessibility-audit-report.md`

#### `DiceRollerPerformanceTest.tsx`
- **Purpose**: Mobile device performance testing and optimization
- **Features**:
  - 6 device profiles (iPhone SE to Desktop)
  - 6 performance categories (render, memory, latency, bundle, mobile, network)
  - Real-time device simulation and performance metrics
  - Device-specific recommendations and optimization analysis
- **Access**: `/test/dice-roller-performance`
- **Report**: `reports/dice-roller-performance-test-report.md`

### Integration Test Components

#### `DiceRollerIntegrationTest.tsx`
- **Purpose**: Basic integration testing with FantasyHoverCard design system
- **Features**: Component interaction testing, roll history integration
- **Usage**: Demonstrates seamless integration with existing UI components

#### `MonsterStatBlockIntegrationTest.tsx`
- **Purpose**: Integration testing within monster stat blocks
- **Features**: Clickable damage values, feature dice expressions, roll history tracking
- **Usage**: Shows dice roller working within complex game content

#### `ShadCNIntegrationTest.tsx`
- **Purpose**: ShadCN UI component integration verification
- **Features**: Button, Input, Badge, Collapsible component testing
- **Usage**: Validates proper styling and functionality with ShadCN components

#### `ShadCNIntegrationVerification.tsx`
- **Purpose**: Comprehensive ShadCN component verification
- **Features**: Live component testing, verification results, integration status
- **Usage**: Detailed validation of all ShadCN components used in the system

## Usage

### Importing Test Components

```typescript
// Import individual components
import { DiceRollerE2ETest } from '@/components/test/DiceRollerE2ETest';
import { DiceRollerAccessibilityAudit } from '@/components/test/DiceRollerAccessibilityAudit';
import { DiceRollerPerformanceTest } from '@/components/test/DiceRollerPerformanceTest';

// Import from index (recommended)
import { 
  DiceRollerE2ETest,
  DiceRollerAccessibilityAudit,
  DiceRollerPerformanceTest 
} from '@/components/test';
```

### Running Tests

1. **E2E Testing**: Navigate to `/test/dice-roller-e2e`
2. **Accessibility Audit**: Navigate to `/test/dice-roller-accessibility`
3. **Performance Testing**: Navigate to `/test/dice-roller-performance`

### Test Reports

All test reports are automatically generated and stored in the `reports/` directory:

- `dice-roller-e2e-test-report.md` - E2E testing results
- `dice-roller-accessibility-audit-report.md` - Accessibility audit results
- `dice-roller-performance-test-report.md` - Performance testing results

## Development Guidelines

### Adding New Test Components

1. Create the component in this directory
2. Add export to `index.ts`
3. Create corresponding test page in `src/app/test/`
4. Generate test report in `reports/` directory
5. Update this README with component documentation

### Test Component Standards

- Use TypeScript for all test components
- Follow existing naming conventions (`DiceRoller[TestType].tsx`)
- Include comprehensive error handling
- Provide detailed test results and recommendations
- Maintain mobile responsiveness
- Include accessibility features

### File Organization

- **Test Components**: Keep in `src/components/test/`
- **Test Pages**: Create in `src/app/test/[test-name]/`
- **Test Reports**: Generate in `reports/`
- **Test Data**: Store in component files or separate data files

## Test Coverage

The test suite provides comprehensive coverage of:

- ✅ **Functionality**: All dice rolling features and edge cases
- ✅ **Performance**: Render times, memory usage, interaction latency
- ✅ **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation
- ✅ **Responsiveness**: Mobile and desktop viewport testing
- ✅ **Integration**: Component interaction and system integration
- ✅ **Cross-browser**: Testing across different device capabilities

## Maintenance

### Regular Testing Schedule

- **Daily**: Automated build testing
- **Weekly**: E2E regression testing
- **Monthly**: Full accessibility and performance audits
- **Release**: Comprehensive test suite execution

### Updating Tests

When modifying dice roller components:

1. Run relevant test suites
2. Update test expectations if needed
3. Regenerate test reports
4. Update documentation

## Related Documentation

- [Dice Roller Developer Guide](../../docs/dice-roller-developer-guide.md)
- [Component Export Structure](../README.md)
- [API Reference](../../docs/dice-roller-api-reference.md)
- [Usage Examples](../../docs/dice-roller-examples.md) 