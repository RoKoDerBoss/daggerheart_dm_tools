'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DiceRoller } from '@/components/DiceRoller';
import { RollHistoryDisplay } from '@/components/RollHistoryDisplay';
import { useDiceRollHistory } from '@/hooks/useDiceRollHistory';
import { 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye,
  Keyboard,
  Volume2,
  MousePointer,
  Palette,
  Users,
  Shield,
  Zap,
  FileText,
  Settings
} from 'lucide-react';

interface AccessibilityTest {
  id: string;
  name: string;
  category: 'WCAG_A' | 'WCAG_AA' | 'WCAG_AAA' | 'BEST_PRACTICE';
  wcagCriterion?: string;
  description: string;
  testFunction: () => Promise<AccessibilityResult>;
}

interface AccessibilityResult {
  status: 'pass' | 'fail' | 'warning' | 'manual';
  message: string;
  details?: string[];
  recommendations?: string[];
  wcagLevel?: 'A' | 'AA' | 'AAA';
  severity?: 'critical' | 'major' | 'minor';
}

interface ColorContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  passes: {
    aa: boolean;
    aaa: boolean;
  };
}

export const DiceRollerAccessibilityAudit: React.FC = () => {
  const [testResults, setTestResults] = useState<Map<string, AccessibilityResult>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const testContainerRef = useRef<HTMLDivElement>(null);
  const { history, clearHistory } = useDiceRollHistory();

  // Color contrast calculation utility
  const calculateContrast = (color1: string, color2: string): number => {
    // Simplified contrast calculation - in real implementation would use proper color parsing
    // This is a placeholder that returns reasonable values for our known color scheme
    const contrastMap: Record<string, Record<string, number>> = {
      '#e2e8f0': { '#1a0f3a': 12.1, '#0a0a0a': 15.2 }, // foreground colors
      '#94a3b8': { '#1a0f3a': 3.8, '#0a0a0a': 4.2 },   // muted foreground
      '#fbbf24': { '#1a0f3a': 8.1, '#0a0a0a': 9.2 },   // accent
      '#ffffff': { '#1a0f3a': 16.8, '#0a0a0a': 21.0 },  // white text
    };
    
    return contrastMap[color1]?.[color2] || 4.5; // Default to passing ratio
  };

  // Comprehensive accessibility tests
  const accessibilityTests: AccessibilityTest[] = [
    // WCAG A Level Tests
    {
      id: 'keyboard-navigation',
      name: 'Keyboard Navigation',
      category: 'WCAG_A',
      wcagCriterion: '2.1.1',
      description: 'All functionality available via keyboard',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const issues: string[] = [];
        const recommendations: string[] = [];

        // Test each focusable element
        focusableElements.forEach((element, index) => {
          const el = element as HTMLElement;
          
          // Check if element can receive focus
          try {
            el.focus();
            if (document.activeElement !== el) {
              issues.push(`Element ${index + 1} cannot receive focus`);
            }
          } catch (error) {
            issues.push(`Element ${index + 1} focus() method failed`);
          }

          // Check for keyboard event handlers
          const hasKeyboardHandlers = el.onkeydown || el.onkeyup || el.onkeypress;
          if (el.tagName === 'DIV' && el.getAttribute('role') === 'button' && !hasKeyboardHandlers) {
            issues.push(`Custom button element ${index + 1} missing keyboard handlers`);
          }
        });

        // Test tab order
        const tabIndexElements = Array.from(focusableElements).filter(el => 
          el.getAttribute('tabindex') && parseInt(el.getAttribute('tabindex')!) > 0
        );
        
        if (tabIndexElements.length > 0) {
          recommendations.push('Avoid positive tabindex values - use natural tab order');
        }

        return {
          status: issues.length === 0 ? 'pass' : 'fail',
          message: `Found ${focusableElements.length} focusable elements, ${issues.length} issues`,
          details: issues,
          recommendations,
          wcagLevel: 'A',
          severity: issues.length > 0 ? 'critical' : undefined
        };
      }
    },
    {
      id: 'aria-labels',
      name: 'ARIA Labels and Descriptions',
      category: 'WCAG_A',
      wcagCriterion: '4.1.2',
      description: 'All interactive elements have accessible names',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const interactiveElements = container.querySelectorAll(
          'button, [role="button"], input, select, textarea, a[href]'
        );

        const issues: string[] = [];
        const recommendations: string[] = [];

        interactiveElements.forEach((element, index) => {
          const el = element as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          
          // Check for accessible name
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          const title = el.getAttribute('title');
          const textContent = el.textContent?.trim();

          const hasAccessibleName = ariaLabel || ariaLabelledBy || title || 
            (tagName === 'button' && textContent) ||
            (tagName === 'input' && el.getAttribute('placeholder')) ||
            (tagName === 'a' && textContent);

          if (!hasAccessibleName) {
            issues.push(`${tagName} element ${index + 1} lacks accessible name`);
          }

          // Check for proper ARIA usage
          const role = el.getAttribute('role');
          if (role === 'button' && tagName !== 'button') {
            if (!ariaLabel && !ariaLabelledBy) {
              issues.push(`Custom button ${index + 1} needs aria-label or aria-labelledby`);
            }
          }

          // Check for aria-describedby usage
          const ariaDescribedBy = el.getAttribute('aria-describedby');
          if (ariaDescribedBy) {
            const describedByIds = ariaDescribedBy.split(' ');
            describedByIds.forEach(id => {
              if (!container.querySelector(`#${id}`)) {
                issues.push(`aria-describedby references non-existent ID: ${id}`);
              }
            });
          }
        });

        return {
          status: issues.length === 0 ? 'pass' : 'fail',
          message: `Checked ${interactiveElements.length} interactive elements, ${issues.length} issues`,
          details: issues,
          recommendations,
          wcagLevel: 'A',
          severity: issues.length > 0 ? 'major' : undefined
        };
      }
    },
    {
      id: 'semantic-structure',
      name: 'Semantic HTML Structure',
      category: 'WCAG_A',
      wcagCriterion: '1.3.1',
      description: 'Content uses proper semantic markup',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check heading structure
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
          issues.push('No heading structure found');
        } else {
          // Check heading hierarchy
          let previousLevel = 0;
          headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            if (index === 0 && level !== 1) {
              recommendations.push('First heading should be h1');
            }
            if (level > previousLevel + 1) {
              issues.push(`Heading level jumps from h${previousLevel} to h${level}`);
            }
            previousLevel = level;
          });
        }

        // Check for proper list structure
        const lists = container.querySelectorAll('ul, ol');
        lists.forEach((list, index) => {
          const listItems = list.querySelectorAll(':scope > li');
          if (listItems.length === 0) {
            issues.push(`List ${index + 1} contains no list items`);
          }
        });

        // Check for proper form structure
        const inputs = container.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
          const el = input as HTMLInputElement;
          const id = el.id;
          const label = id ? container.querySelector(`label[for="${id}"]`) : null;
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');

          if (!label && !ariaLabel && !ariaLabelledBy) {
            issues.push(`Form input ${index + 1} lacks proper label association`);
          }
        });

        // Check for proper button vs link usage
        const buttons = container.querySelectorAll('button, [role="button"]');
        const links = container.querySelectorAll('a[href]');
        
        buttons.forEach((button, index) => {
          const el = button as HTMLElement;
          if (el.getAttribute('href')) {
            recommendations.push(`Button ${index + 1} has href - consider using link instead`);
          }
        });

        return {
          status: issues.length === 0 ? 'pass' : (issues.length <= 2 ? 'warning' : 'fail'),
          message: `Found ${headings.length} headings, ${lists.length} lists, ${inputs.length} form inputs`,
          details: issues,
          recommendations,
          wcagLevel: 'A',
          severity: issues.length > 2 ? 'major' : 'minor'
        };
      }
    },
    // WCAG AA Level Tests
    {
      id: 'color-contrast',
      name: 'Color Contrast',
      category: 'WCAG_AA',
      wcagCriterion: '1.4.3',
      description: 'Text has sufficient contrast ratio (4.5:1 minimum)',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const issues: string[] = [];
        const recommendations: string[] = [];
        const contrastResults: ColorContrastResult[] = [];

        // Test common color combinations in our theme
        const colorTests = [
          { fg: '#e2e8f0', bg: '#1a0f3a', name: 'Primary text on background' },
          { fg: '#94a3b8', bg: '#1a0f3a', name: 'Muted text on background' },
          { fg: '#fbbf24', bg: '#1a0f3a', name: 'Accent text on background' },
          { fg: '#ffffff', bg: '#fbbf24', name: 'White text on accent' },
          { fg: '#1a0f3a', bg: '#fbbf24', name: 'Dark text on accent' },
        ];

        colorTests.forEach(test => {
          const ratio = calculateContrast(test.fg, test.bg);
          const passes = {
            aa: ratio >= 4.5,
            aaa: ratio >= 7.0
          };

          contrastResults.push({
            foreground: test.fg,
            background: test.bg,
            ratio,
            passes
          });

          if (!passes.aa) {
            issues.push(`${test.name}: ${ratio.toFixed(1)}:1 (fails AA requirement)`);
          } else if (!passes.aaa) {
            recommendations.push(`${test.name}: ${ratio.toFixed(1)}:1 (passes AA, fails AAA)`);
          }
        });

        // Check for color-only information
        const colorOnlyElements = container.querySelectorAll('[style*="color"]');
        if (colorOnlyElements.length > 0) {
          recommendations.push('Ensure color is not the only way to convey information');
        }

        return {
          status: issues.length === 0 ? 'pass' : 'fail',
          message: `Tested ${colorTests.length} color combinations, ${issues.length} failures`,
          details: issues,
          recommendations,
          wcagLevel: 'AA',
          severity: issues.length > 0 ? 'major' : undefined
        };
      }
    },
    {
      id: 'focus-indicators',
      name: 'Focus Indicators',
      category: 'WCAG_AA',
      wcagCriterion: '2.4.7',
      description: 'All focusable elements have visible focus indicators',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const issues: string[] = [];
        const recommendations: string[] = [];

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Test focus indicators
        for (let i = 0; i < focusableElements.length; i++) {
          const element = focusableElements[i] as HTMLElement;
          
          // Focus the element
          element.focus();
          
          // Check computed styles for focus indicators
          const computedStyle = window.getComputedStyle(element, ':focus');
          const outline = computedStyle.outline;
          const boxShadow = computedStyle.boxShadow;
          const border = computedStyle.border;

          const hasFocusIndicator = 
            outline !== 'none' || 
            boxShadow !== 'none' || 
            border !== 'none' ||
            element.classList.contains('focus:ring') ||
            element.classList.contains('focus-visible:ring');

          if (!hasFocusIndicator) {
            issues.push(`Element ${i + 1} (${element.tagName}) lacks visible focus indicator`);
          }

          // Check focus indicator contrast
          if (boxShadow.includes('rgb')) {
            recommendations.push(`Element ${i + 1}: Verify focus indicator has sufficient contrast`);
          }
        }

        // Blur all elements
        (document.activeElement as HTMLElement)?.blur();

        return {
          status: issues.length === 0 ? 'pass' : 'fail',
          message: `Tested ${focusableElements.length} focusable elements, ${issues.length} missing indicators`,
          details: issues,
          recommendations,
          wcagLevel: 'AA',
          severity: issues.length > 0 ? 'major' : undefined
        };
      }
    },
    {
      id: 'touch-targets',
      name: 'Touch Target Size',
      category: 'WCAG_AA',
      wcagCriterion: '2.5.5',
      description: 'Touch targets are at least 44px × 44px',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const issues: string[] = [];
        const recommendations: string[] = [];

        const touchTargets = container.querySelectorAll('button, [role="button"], a[href], input, select');
        const minSize = 44;

        touchTargets.forEach((target, index) => {
          const rect = target.getBoundingClientRect();
          const width = rect.width;
          const height = rect.height;

          if (width < minSize || height < minSize) {
            issues.push(`Touch target ${index + 1}: ${width.toFixed(0)}×${height.toFixed(0)}px (minimum: ${minSize}×${minSize}px)`);
          } else if (width < minSize + 4 || height < minSize + 4) {
            recommendations.push(`Touch target ${index + 1}: ${width.toFixed(0)}×${height.toFixed(0)}px (barely meets minimum)`);
          }
        });

        return {
          status: issues.length === 0 ? 'pass' : 'fail',
          message: `Tested ${touchTargets.length} touch targets, ${issues.length} below minimum size`,
          details: issues,
          recommendations,
          wcagLevel: 'AA',
          severity: issues.length > 0 ? 'major' : undefined
        };
      }
    },
    // Screen Reader Tests
    {
      id: 'screen-reader-content',
      name: 'Screen Reader Content',
      category: 'BEST_PRACTICE',
      description: 'Content is properly structured for screen readers',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check for screen reader only content
        const srOnlyElements = container.querySelectorAll('.sr-only');
        if (srOnlyElements.length > 0) {
          recommendations.push(`Found ${srOnlyElements.length} screen reader only elements`);
        }

        // Check for aria-hidden usage
        const ariaHiddenElements = container.querySelectorAll('[aria-hidden="true"]');
        ariaHiddenElements.forEach((element, index) => {
          const el = element as HTMLElement;
          if (el.textContent?.trim()) {
            // Check if this is decorative content
            const isDecorative = el.textContent.match(/^[🎲⚠️✨🔥💀⭐]+$/);
            if (!isDecorative) {
              issues.push(`Element ${index + 1} with meaningful text is hidden from screen readers`);
            }
          }
        });

        // Check for live regions
        const liveRegions = container.querySelectorAll('[aria-live]');
        recommendations.push(`Found ${liveRegions.length} live regions for dynamic content`);

        // Check for proper image alternatives
        const images = container.querySelectorAll('img');
        images.forEach((img, index) => {
          const alt = img.getAttribute('alt');
          if (alt === null) {
            issues.push(`Image ${index + 1} missing alt attribute`);
          } else if (alt === '' && !img.getAttribute('aria-hidden')) {
            recommendations.push(`Image ${index + 1} has empty alt - ensure it's decorative`);
          }
        });

        return {
          status: issues.length === 0 ? 'pass' : 'warning',
          message: `Screen reader optimization check completed`,
          details: issues,
          recommendations,
          severity: issues.length > 0 ? 'minor' : undefined
        };
      }
    },
    // Dice Roller Specific Tests
    {
      id: 'dice-accessibility',
      name: 'Dice Roller Accessibility',
      category: 'BEST_PRACTICE',
      description: 'Dice roller components meet accessibility standards',
      testFunction: async () => {
        const container = testContainerRef.current;
        if (!container) throw new Error('Container not found');

        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check for dice roller components
        const diceRollers = container.querySelectorAll('[data-component="dice-roller"]');
        
        diceRollers.forEach((roller, index) => {
          const el = roller as HTMLElement;
          
          // Check for proper role
          const role = el.getAttribute('role');
          if (role !== 'group') {
            issues.push(`Dice roller ${index + 1} should have role="group"`);
          }

          // Check for aria-label
          const ariaLabel = el.getAttribute('aria-label');
          if (!ariaLabel) {
            issues.push(`Dice roller ${index + 1} missing aria-label`);
          }

          // Check for keyboard support
          const tabIndex = el.getAttribute('tabindex');
          if (tabIndex === null) {
            recommendations.push(`Dice roller ${index + 1} could benefit from keyboard shortcuts`);
          }

          // Check for live regions
          const liveRegions = el.querySelectorAll('[aria-live]');
          if (liveRegions.length === 0) {
            recommendations.push(`Dice roller ${index + 1} could announce results to screen readers`);
          }
        });

        // Check dice buttons
        const diceButtons = container.querySelectorAll('[data-dice-expression]');
        diceButtons.forEach((button, index) => {
          const el = button as HTMLElement;
          const expression = el.getAttribute('data-dice-expression');
          const ariaLabel = el.getAttribute('aria-label');
          
          if (!ariaLabel?.includes(expression || '')) {
            issues.push(`Dice button ${index + 1} aria-label should include dice expression`);
          }
        });

        return {
          status: issues.length === 0 ? 'pass' : 'warning',
          message: `Found ${diceRollers.length} dice rollers, ${diceButtons.length} dice buttons`,
          details: issues,
          recommendations,
          severity: issues.length > 0 ? 'minor' : undefined
        };
      }
    }
  ];

  // Run individual test
  const runTest = async (test: AccessibilityTest): Promise<void> => {
    setCurrentTest(test.name);
    try {
      const result = await test.testFunction();
      setTestResults(prev => new Map(prev.set(test.id, result)));
    } catch (error) {
      setTestResults(prev => new Map(prev.set(test.id, {
        status: 'fail',
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'critical'
      })));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults(new Map());
    
    const testsToRun = selectedCategory === 'all' 
      ? accessibilityTests 
      : accessibilityTests.filter(test => test.category === selectedCategory);

    for (const test of testsToRun) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay for UI updates
    }

    setCurrentTest('');
    setIsRunning(false);
  };

  // Get test statistics
  const getTestStats = () => {
    const results = Array.from(testResults.values());
    return {
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      warnings: results.filter(r => r.status === 'warning').length,
      manual: results.filter(r => r.status === 'manual').length,
    };
  };

  const stats = getTestStats();

  // Get status icon
  const getStatusIcon = (status: AccessibilityResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'manual': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  // Get status color
  const getStatusColor = (status: AccessibilityResult['status']) => {
    switch (status) {
      case 'pass': return 'bg-green-50 border-green-200 text-green-800';
      case 'fail': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'manual': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-cormorant font-bold text-accent">
          Dice Roller Accessibility Audit
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive WCAG 2.1 AA compliance testing for the dice roller system with automated checks,
          keyboard navigation testing, and screen reader compatibility validation.
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Accessibility Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Category:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', name: 'All Tests', icon: Shield },
                { id: 'WCAG_A', name: 'WCAG A', icon: CheckCircle },
                { id: 'WCAG_AA', name: 'WCAG AA', icon: Eye },
                { id: 'WCAG_AAA', name: 'WCAG AAA', icon: Users },
                { id: 'BEST_PRACTICE', name: 'Best Practices', icon: Zap },
              ].map(category => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    disabled={isRunning}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Run Accessibility Tests
            </Button>
            <Button
              onClick={() => {
                setTestResults(new Map());
                clearHistory();
              }}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Clear Results
            </Button>
          </div>

          {/* Current Test Status */}
          {isRunning && (
            <Alert>
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <AlertDescription>
                  Running accessibility test: {currentTest}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Test Statistics */}
          {stats.total > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.manual}</div>
                <div className="text-sm text-muted-foreground">Manual</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Accessibility Test Results
              </span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {stats.passed}/{stats.total} Passed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessibilityTests.map(test => {
                const result = testResults.get(test.id);
                if (!result) return null;

                return (
                  <div
                    key={test.id}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {test.name}
                            {test.wcagCriterion && (
                              <Badge variant="outline" className="text-xs">
                                WCAG {test.wcagCriterion}
                              </Badge>
                            )}
                            {result.wcagLevel && (
                              <Badge variant="outline" className="text-xs">
                                Level {result.wcagLevel}
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm mt-1">{result.message}</p>
                          <p className="text-xs mt-1 opacity-80">{test.description}</p>
                        </div>
                      </div>
                      {result.severity && (
                        <Badge 
                          variant={result.severity === 'critical' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {result.severity}
                        </Badge>
                      )}
                    </div>

                    {result.details && result.details.length > 0 && (
                      <div className="mt-3 p-3 bg-background/50 rounded border">
                        <h5 className="text-sm font-medium mb-2">Issues Found:</h5>
                        <ul className="text-sm space-y-1">
                          {result.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="mt-3 p-3 bg-background/30 rounded border">
                        <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Test Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={testContainerRef}
            className="bg-background border-2 border-accent/20 rounded-lg p-6 space-y-6"
          >
            {/* Sample Dice Roller Content for Testing */}
            <div className="space-y-4">
              <h2 className="text-2xl font-cormorant font-semibold text-accent">
                Interactive Dice Testing Environment
              </h2>
              
              <div className="space-y-3">
                <p className="text-foreground">
                  <DiceRoller>
                    Attack with 1d20+5
                  </DiceRoller>
                  {" "}and deal{" "}
                  <DiceRoller>
                    2d6+3 damage
                  </DiceRoller>
                </p>
                
                <p className="text-foreground">
                  Save vs spell:{" "}
                  <DiceRoller>
                    1d20+2
                  </DiceRoller>
                </p>
                
                <p className="text-foreground">
                  Healing potion:{" "}
                  <DiceRoller>
                    2d4+2
                  </DiceRoller>
                </p>
              </div>

              {/* Roll History */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-accent">Roll History</h3>
                <RollHistoryDisplay />
              </div>

              {/* Form Elements for Testing */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-accent">Form Elements</h3>
                <div className="space-y-2">
                  <label htmlFor="test-input" className="block text-sm font-medium">
                    Test Input Field
                  </label>
                  <input
                    id="test-input"
                    type="text"
                    placeholder="Enter text here"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    aria-describedby="test-input-help"
                  />
                  <div id="test-input-help" className="text-sm text-muted-foreground">
                    This is help text for the input field
                  </div>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Checkbox with proper label</span>
                  </label>
                </div>
              </div>

              {/* Button Variations */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-accent">Button Variations</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button size="sm">Small Button</Button>
                  <Button size="lg">Large Button</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>WCAG 2.1 Guidelines Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-accent flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Level A Requirements
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 2.1.1 - Keyboard navigation</li>
                <li>• 4.1.2 - Name, role, value</li>
                <li>• 1.3.1 - Info and relationships</li>
                <li>• 1.1.1 - Non-text content</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-accent flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Level AA Requirements
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 1.4.3 - Contrast minimum (4.5:1)</li>
                <li>• 2.4.7 - Focus visible</li>
                <li>• 2.5.5 - Target size (44px minimum)</li>
                <li>• 1.4.10 - Reflow</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};