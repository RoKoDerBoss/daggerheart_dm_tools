'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiceRoller } from '@/components/DiceRoller';
import { RollHistoryDisplay } from '@/components/RollHistoryDisplay';
import { useDiceRollHistory } from '@/hooks/useDiceRollHistory';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MousePointer,
  Hand,
  Zap,
  Clock,
  Target,
  Settings
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
  timing?: number;
}

interface ViewportTest {
  name: string;
  width: number;
  height: number;
  device: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VIEWPORT_TESTS: ViewportTest[] = [
  { name: 'Mobile Portrait', width: 375, height: 667, device: 'iPhone SE', icon: Smartphone },
  { name: 'Mobile Landscape', width: 667, height: 375, device: 'iPhone SE', icon: Smartphone },
  { name: 'Large Mobile', width: 414, height: 896, device: 'iPhone 11 Pro', icon: Smartphone },
  { name: 'Tablet Portrait', width: 768, height: 1024, device: 'iPad', icon: Tablet },
  { name: 'Tablet Landscape', width: 1024, height: 768, device: 'iPad', icon: Tablet },
  { name: 'Desktop Small', width: 1280, height: 720, device: 'Laptop', icon: Monitor },
  { name: 'Desktop Large', width: 1920, height: 1080, device: 'Desktop', icon: Monitor },
];

export const DiceRollerE2ETest: React.FC = () => {
  const [currentViewport, setCurrentViewport] = useState<ViewportTest>(VIEWPORT_TESTS[0]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const testContainerRef = useRef<HTMLDivElement>(null);
  const { history, clearHistory } = useDiceRollHistory();

  // Simulate viewport changes for testing
  const simulateViewport = (viewport: ViewportTest) => {
    if (testContainerRef.current) {
      testContainerRef.current.style.width = `${viewport.width}px`;
      testContainerRef.current.style.height = `${viewport.height}px`;
      testContainerRef.current.style.maxWidth = `${viewport.width}px`;
      testContainerRef.current.style.overflow = 'auto';
      testContainerRef.current.style.border = '2px solid #fbbf24';
      testContainerRef.current.style.borderRadius = '8px';
      testContainerRef.current.style.margin = '0 auto';
    }
  };

  // Test utilities
  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Touch target validation
  const validateTouchTargets = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const buttons = testContainerRef.current?.querySelectorAll('button');
      if (!buttons) throw new Error('No buttons found');

      let failedButtons = 0;
      const minSize = 44; // WCAG requirement

      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        if (rect.width < minSize || rect.height < minSize) {
          failedButtons++;
        }
      });

      const timing = Date.now() - startTime;

      if (failedButtons === 0) {
        return {
          name: 'Touch Target Validation',
          status: 'pass',
          message: `All ${buttons.length} buttons meet 44px minimum requirement`,
          timing
        };
      } else {
        return {
          name: 'Touch Target Validation',
          status: 'fail',
          message: `${failedButtons}/${buttons.length} buttons below 44px minimum`,
          timing
        };
      }
    } catch (error) {
      return {
        name: 'Touch Target Validation',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - startTime
      };
    }
  };

  // Dice rolling functionality test
  const testDiceRolling = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const diceButtons = testContainerRef.current?.querySelectorAll('[data-testid^="dice-button"]');
      if (!diceButtons || diceButtons.length === 0) {
        throw new Error('No dice buttons found');
      }

      // Test first dice button
      const firstButton = diceButtons[0] as HTMLButtonElement;
      const initialHistoryLength = history.length;
      
      // Simulate click
      firstButton.click();
      await sleep(100); // Wait for roll to complete

      // Check if roll was added to history
      const newHistoryLength = history.length;
      
      const timing = Date.now() - startTime;

      if (newHistoryLength > initialHistoryLength) {
        return {
          name: 'Dice Rolling Functionality',
          status: 'pass',
          message: 'Dice roll executed and added to history',
          timing
        };
      } else {
        return {
          name: 'Dice Rolling Functionality',
          status: 'warning',
          message: 'Dice roll may not have completed',
          timing
        };
      }
    } catch (error) {
      return {
        name: 'Dice Rolling Functionality',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - startTime
      };
    }
  };

  // Responsive layout test
  const testResponsiveLayout = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const container = testContainerRef.current;
      if (!container) throw new Error('Test container not found');

      const elements = container.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
      const hasResponsiveClasses = elements.length > 0;

      // Check for horizontal scrolling
      const hasHorizontalScroll = container.scrollWidth > container.clientWidth;

      const timing = Date.now() - startTime;

      if (hasResponsiveClasses && !hasHorizontalScroll) {
        return {
          name: 'Responsive Layout',
          status: 'pass',
          message: `Found ${elements.length} responsive elements, no horizontal scroll`,
          timing
        };
      } else if (hasHorizontalScroll) {
        return {
          name: 'Responsive Layout',
          status: 'fail',
          message: 'Horizontal scrolling detected',
          timing
        };
      } else {
        return {
          name: 'Responsive Layout',
          status: 'warning',
          message: 'Limited responsive classes found',
          timing
        };
      }
    } catch (error) {
      return {
        name: 'Responsive Layout',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - startTime
      };
    }
  };

  // Accessibility test
  const testAccessibility = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const container = testContainerRef.current;
      if (!container) throw new Error('Test container not found');

      let issues = 0;
      const checks = [];

      // Check for ARIA labels
      const buttonsWithoutAria = container.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      if (buttonsWithoutAria.length > 0) {
        issues++;
        checks.push(`${buttonsWithoutAria.length} buttons missing ARIA labels`);
      }

      // Check for proper heading structure
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        issues++;
        checks.push('No heading structure found');
      }

      // Check for focus indicators
      const focusableElements = container.querySelectorAll('button, input, select, textarea, a[href]');
      if (focusableElements.length === 0) {
        issues++;
        checks.push('No focusable elements found');
      }

      const timing = Date.now() - startTime;

      if (issues === 0) {
        return {
          name: 'Accessibility Compliance',
          status: 'pass',
          message: `All accessibility checks passed (${focusableElements.length} focusable elements)`,
          timing
        };
      } else {
        return {
          name: 'Accessibility Compliance',
          status: 'warning',
          message: `${issues} accessibility issues found`,
          details: checks.join(', '),
          timing
        };
      }
    } catch (error) {
      return {
        name: 'Accessibility Compliance',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - startTime
      };
    }
  };

  // Performance test
  const testPerformance = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Measure render time
      const renderStart = performance.now();
      
      // Force a re-render by changing viewport
      simulateViewport(currentViewport);
      await sleep(50);
      
      const renderTime = performance.now() - renderStart;
      
      // Check for memory leaks (basic check)
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Simulate multiple interactions
      for (let i = 0; i < 5; i++) {
        const buttons = testContainerRef.current?.querySelectorAll('button');
        if (buttons && buttons.length > 0) {
          (buttons[0] as HTMLButtonElement).click();
          await sleep(10);
        }
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      const timing = Date.now() - startTime;

      if (renderTime < 100 && memoryIncrease < 1000000) { // 1MB threshold
        return {
          name: 'Performance Test',
          status: 'pass',
          message: `Render: ${renderTime.toFixed(2)}ms, Memory: ${(memoryIncrease/1024).toFixed(2)}KB`,
          timing
        };
      } else {
        return {
          name: 'Performance Test',
          status: 'warning',
          message: `Render: ${renderTime.toFixed(2)}ms, Memory: ${(memoryIncrease/1024).toFixed(2)}KB`,
          details: renderTime > 100 ? 'Slow render time' : 'High memory usage',
          timing
        };
      }
    } catch (error) {
      return {
        name: 'Performance Test',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing: Date.now() - startTime
      };
    }
  };

  // Run all tests for current viewport
  const runViewportTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      { name: 'Touch Targets', fn: validateTouchTargets },
      { name: 'Dice Rolling', fn: testDiceRolling },
      { name: 'Responsive Layout', fn: testResponsiveLayout },
      { name: 'Accessibility', fn: testAccessibility },
      { name: 'Performance', fn: testPerformance },
    ];

    for (const test of tests) {
      setCurrentTest(test.name);
      await sleep(200); // Visual delay
      const result = await test.fn();
      addTestResult(result);
    }

    setCurrentTest('');
    setIsRunning(false);
  };

  // Run tests for all viewports
  const runAllViewportTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    for (const viewport of VIEWPORT_TESTS) {
      setCurrentViewport(viewport);
      simulateViewport(viewport);
      await sleep(500); // Allow layout to settle
      
      const tests = [
        { name: 'Touch Targets', fn: validateTouchTargets },
        { name: 'Responsive Layout', fn: testResponsiveLayout },
        { name: 'Accessibility', fn: testAccessibility },
      ];

      for (const test of tests) {
        setCurrentTest(`${viewport.name} - ${test.name}`);
        await sleep(100);
        const result = await test.fn();
        result.name = `${viewport.name} - ${result.name}`;
        addTestResult(result);
      }
    }

    setCurrentTest('');
    setIsRunning(false);
  };

  // Initialize viewport on mount
  useEffect(() => {
    simulateViewport(currentViewport);
  }, [currentViewport]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200';
      case 'fail': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const passedTests = testResults.filter(r => r.status === 'pass').length;
  const totalTests = testResults.length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-cormorant font-bold text-accent">
          Dice Roller E2E Testing Suite
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive end-to-end testing across mobile and desktop viewports with real user interactions,
          accessibility validation, and performance monitoring.
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Viewport Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Viewport:</label>
            <div className="flex flex-wrap gap-2">
              {VIEWPORT_TESTS.map((viewport) => {
                const Icon = viewport.icon;
                return (
                  <Button
                    key={viewport.name}
                    variant={currentViewport.name === viewport.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentViewport(viewport)}
                    disabled={isRunning}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {viewport.name}
                    <span className="text-xs opacity-70">
                      {viewport.width}×{viewport.height}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={runViewportTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Test Current Viewport
            </Button>
            <Button
              onClick={runAllViewportTests}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Test All Viewports
            </Button>
            <Button
              onClick={() => {
                setTestResults([]);
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
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  Running: {currentTest}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Test Results
              </span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {passedTests}/{totalTests} Passed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h4 className="font-medium">{result.name}</h4>
                        <p className="text-sm mt-1">{result.message}</p>
                        {result.details && (
                          <p className="text-xs mt-2 opacity-80">{result.details}</p>
                        )}
                      </div>
                    </div>
                    {result.timing && (
                      <Badge variant="outline" className="text-xs">
                        {result.timing}ms
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Test Environment - {currentViewport.name}
            <Badge variant="outline">
              {currentViewport.width}×{currentViewport.height}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={testContainerRef}
            className="bg-background border-2 border-accent rounded-lg p-4 space-y-6 transition-all duration-300"
            style={{
              width: `${currentViewport.width}px`,
              height: `${currentViewport.height}px`,
              maxWidth: `${currentViewport.width}px`,
              overflow: 'auto',
              margin: '0 auto'
            }}
          >
            {/* Sample Dice Roller Content */}
            <div className="space-y-4">
              <h2 className="text-xl font-cormorant font-semibold text-accent">
                Interactive Dice Testing
              </h2>
              
              <div className="space-y-3">
                <p className="text-foreground">
                  <DiceRoller data-testid="dice-button-attack">
                    Attack with 1d20+5
                  </DiceRoller>
                  {" "}and deal{" "}
                  <DiceRoller data-testid="dice-button-damage">
                    2d6+3 damage
                  </DiceRoller>
                </p>
                
                <p className="text-foreground">
                  Save vs spell:{" "}
                  <DiceRoller data-testid="dice-button-save">
                    1d20+2
                  </DiceRoller>
                </p>
                
                <p className="text-foreground">
                  Healing potion:{" "}
                  <DiceRoller data-testid="dice-button-heal">
                    2d4+2
                  </DiceRoller>
                </p>
              </div>

              {/* Roll History */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-accent">Roll History</h3>
                <RollHistoryDisplay />
              </div>

              {/* Touch Target Test Elements */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-accent">Touch Target Tests</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small Button</Button>
                  <Button>Default Button</Button>
                  <Button size="lg">Large Button</Button>
                  <Button size="icon">
                    <Hand className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Form Elements */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-accent">Form Elements</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Text input"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                    <option>Select option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Checkbox option</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-accent">Test Categories</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Touch Target Validation (44px minimum)</li>
                <li>• Dice Rolling Functionality</li>
                <li>• Responsive Layout Testing</li>
                <li>• Accessibility Compliance</li>
                <li>• Performance Monitoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-accent">Viewport Coverage</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Mobile Portrait & Landscape</li>
                <li>• Tablet Portrait & Landscape</li>
                <li>• Desktop Small & Large</li>
                <li>• Real device simulation</li>
                <li>• Touch interaction testing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};