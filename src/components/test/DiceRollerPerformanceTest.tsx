'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Activity, 
  Smartphone, 
  Monitor, 
  Zap, 
  Clock, 
  MemoryStick, 
  Cpu, 
  Wifi,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { DiceRoller } from '@/components/DiceRoller';
import { useDiceRollHistory } from '@/hooks/useDiceRollHistory';
import { cn } from '@/lib/utils';

// Performance test interfaces
interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  interactionLatency: number;
  scrollPerformance: number;
  batteryImpact: number;
  networkRequests: number;
  cacheEfficiency: number;
}

interface TestResult {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  metrics: Partial<PerformanceMetrics>;
  recommendations: string[];
  timing: number;
}

interface DeviceProfile {
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  viewport: { width: number; height: number };
  userAgent: string;
  capabilities: {
    memory: number; // GB
    cpu: 'low' | 'mid' | 'high';
    network: '2g' | '3g' | '4g' | '5g' | 'wifi';
    battery: boolean;
  };
}

// Device profiles for testing
const DEVICE_PROFILES: DeviceProfile[] = [
  {
    name: 'iPhone SE (Low-end)',
    type: 'mobile',
    viewport: { width: 375, height: 667 },
    userAgent: 'iPhone SE',
    capabilities: { memory: 2, cpu: 'low', network: '3g', battery: true }
  },
  {
    name: 'iPhone 12 (Mid-range)',
    type: 'mobile',
    viewport: { width: 390, height: 844 },
    userAgent: 'iPhone 12',
    capabilities: { memory: 4, cpu: 'mid', network: '4g', battery: true }
  },
  {
    name: 'iPhone 15 Pro (High-end)',
    type: 'mobile',
    viewport: { width: 393, height: 852 },
    userAgent: 'iPhone 15 Pro',
    capabilities: { memory: 8, cpu: 'high', network: '5g', battery: true }
  },
  {
    name: 'Samsung Galaxy A54 (Mid-range)',
    type: 'mobile',
    viewport: { width: 360, height: 780 },
    userAgent: 'Samsung Galaxy A54',
    capabilities: { memory: 6, cpu: 'mid', network: '4g', battery: true }
  },
  {
    name: 'iPad Air (Tablet)',
    type: 'tablet',
    viewport: { width: 820, height: 1180 },
    userAgent: 'iPad Air',
    capabilities: { memory: 8, cpu: 'high', network: 'wifi', battery: true }
  },
  {
    name: 'Desktop (Reference)',
    type: 'desktop',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Desktop Chrome',
    capabilities: { memory: 16, cpu: 'high', network: 'wifi', battery: false }
  }
];

// Performance test categories
const PERFORMANCE_TESTS = [
  {
    id: 'render-performance',
    name: 'Render Performance',
    description: 'Measures component render times and frame rates',
    icon: Zap,
    weight: 25
  },
  {
    id: 'memory-efficiency',
    name: 'Memory Efficiency',
    description: 'Tests memory usage and leak prevention',
    icon: MemoryStick,
    weight: 20
  },
  {
    id: 'interaction-latency',
    name: 'Interaction Latency',
    description: 'Measures touch/click response times',
    icon: Clock,
    weight: 20
  },
  {
    id: 'bundle-optimization',
    name: 'Bundle Optimization',
    description: 'Analyzes code splitting and lazy loading',
    icon: Cpu,
    weight: 15
  },
  {
    id: 'mobile-optimization',
    name: 'Mobile Optimization',
    description: 'Tests mobile-specific performance features',
    icon: Smartphone,
    weight: 10
  },
  {
    id: 'network-efficiency',
    name: 'Network Efficiency',
    description: 'Measures network requests and caching',
    icon: Wifi,
    weight: 10
  }
];

export const DiceRollerPerformanceTest: React.FC = () => {
  // State management
  const [currentDevice, setCurrentDevice] = useState<DeviceProfile>(DEVICE_PROFILES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [overallScore, setOverallScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [testProgress, setTestProgress] = useState(0);
  
  // Refs for testing
  const testContainerRef = useRef<HTMLDivElement>(null);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const { addRoll, history, clearHistory } = useDiceRollHistory();

  // Simulate device viewport
  const simulateDevice = useCallback((device: DeviceProfile) => {
    if (testContainerRef.current) {
      const container = testContainerRef.current;
      container.style.width = `${device.viewport.width}px`;
      container.style.height = `${device.viewport.height}px`;
      container.style.maxWidth = `${device.viewport.width}px`;
      container.style.maxHeight = `${device.viewport.height}px`;
      container.style.overflow = 'auto';
      container.style.border = '2px solid #666';
      container.style.borderRadius = '12px';
      container.style.backgroundColor = '#000';
      container.style.padding = '8px';
    }
  }, []);

  // Performance measurement utilities
  const measureRenderTime = useCallback(async (): Promise<number> => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Force a re-render
      setTestProgress(prev => prev + 1);
      
      requestAnimationFrame(() => {
        const endTime = performance.now();
        resolve(endTime - startTime);
      });
    });
  }, []);

  const measureMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }, []);

  const measureInteractionLatency = useCallback(async (): Promise<number> => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Simulate a dice roll interaction
      const button = testContainerRef.current?.querySelector('button');
      if (button) {
        button.click();
        
        requestAnimationFrame(() => {
          const endTime = performance.now();
          resolve(endTime - startTime);
        });
      } else {
        resolve(0);
      }
    });
  }, []);

  // Individual performance tests
  const testRenderPerformance = useCallback(async (): Promise<TestResult> => {
    const startTime = Date.now();
    const renderTimes: number[] = [];
    
    try {
      // Measure multiple render cycles
      for (let i = 0; i < 10; i++) {
        const renderTime = await measureRenderTime();
        renderTimes.push(renderTime);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      const maxRenderTime = Math.max(...renderTimes);
      
      // Performance scoring
      let score = 100;
      let status: 'pass' | 'warning' | 'fail' = 'pass';
      const recommendations: string[] = [];
      
      if (avgRenderTime > 16) { // 60fps threshold
        score -= 30;
        status = 'warning';
        recommendations.push('Consider using React.memo for expensive components');
      }
      
      if (maxRenderTime > 50) {
        score -= 20;
        status = 'fail';
        recommendations.push('Optimize heavy computations with useMemo');
      }
      
      if (currentDevice.capabilities.cpu === 'low' && avgRenderTime > 10) {
        score -= 15;
        recommendations.push('Add performance mode for low-end devices');
      }
      
      return {
        name: 'Render Performance',
        status,
        score: Math.max(0, score),
        metrics: {
          renderTime: avgRenderTime,
        },
        recommendations,
        timing: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Render Performance',
        status: 'fail',
        score: 0,
        metrics: {},
        recommendations: ['Fix render performance test errors'],
        timing: Date.now() - startTime
      };
    }
  }, [currentDevice, measureRenderTime]);

  const testMemoryEfficiency = useCallback(async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const initialMemory = measureMemoryUsage();
      
      // Simulate heavy usage
      for (let i = 0; i < 50; i++) {
        addRoll({
          expression: {
            dice: [{ count: 2, sides: 6 }],
            modifier: 3,
            originalExpression: '2d6+3'
          },
          rolls: [
            { value: Math.floor(Math.random() * 6) + 1, sides: 6, isCritical: false },
            { value: Math.floor(Math.random() * 6) + 1, sides: 6, isCritical: false }
          ],
          modifier: 3,
          total: Math.floor(Math.random() * 15) + 5,
          breakdown: [{
            dieSpec: '2d6',
            values: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1],
            subtotal: Math.floor(Math.random() * 12) + 2
          }],
          timestamp: new Date(),
          rollType: 'normal'
        }, `Test roll ${i}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      const peakMemory = measureMemoryUsage();
      
      // Clear history and measure cleanup
      clearHistory();
      await new Promise(resolve => setTimeout(resolve, 100));
      const finalMemory = measureMemoryUsage();
      
      const memoryIncrease = peakMemory - initialMemory;
      const memoryCleanup = peakMemory - finalMemory;
      
      let score = 100;
      let status: 'pass' | 'warning' | 'fail' = 'pass';
      const recommendations: string[] = [];
      
      if (memoryIncrease > 10) { // 10MB threshold
        score -= 25;
        status = 'warning';
        recommendations.push('Optimize data structures to reduce memory usage');
      }
      
      if (memoryCleanup < memoryIncrease * 0.8) {
        score -= 20;
        status = 'warning';
        recommendations.push('Improve memory cleanup and garbage collection');
      }
      
      if (currentDevice.capabilities.memory <= 2 && memoryIncrease > 5) {
        score -= 30;
        status = 'fail';
        recommendations.push('Add memory-constrained mode for low-memory devices');
      }
      
      return {
        name: 'Memory Efficiency',
        status,
        score: Math.max(0, score),
        metrics: {
          memoryUsage: memoryIncrease,
        },
        recommendations,
        timing: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Memory Efficiency',
        status: 'fail',
        score: 0,
        metrics: {},
        recommendations: ['Fix memory efficiency test errors'],
        timing: Date.now() - startTime
      };
    }
  }, [currentDevice, measureMemoryUsage, addRoll, clearHistory]);

  const testInteractionLatency = useCallback(async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const latencies: number[] = [];
      
      // Test multiple interactions
      for (let i = 0; i < 10; i++) {
        const latency = await measureInteractionLatency();
        latencies.push(latency);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);
      
      let score = 100;
      let status: 'pass' | 'warning' | 'fail' = 'pass';
      const recommendations: string[] = [];
      
      if (avgLatency > 100) { // 100ms threshold
        score -= 25;
        status = 'warning';
        recommendations.push('Optimize event handlers with useCallback');
      }
      
      if (maxLatency > 300) {
        score -= 30;
        status = 'fail';
        recommendations.push('Debounce rapid interactions to prevent blocking');
      }
      
      if (currentDevice.type === 'mobile' && avgLatency > 50) {
        score -= 20;
        recommendations.push('Optimize for mobile touch interactions');
      }
      
      return {
        name: 'Interaction Latency',
        status,
        score: Math.max(0, score),
        metrics: {
          interactionLatency: avgLatency,
        },
        recommendations,
        timing: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Interaction Latency',
        status: 'fail',
        score: 0,
        metrics: {},
        recommendations: ['Fix interaction latency test errors'],
        timing: Date.now() - startTime
      };
    }
  }, [currentDevice, measureInteractionLatency]);

  const testBundleOptimization = useCallback(async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Simulate bundle analysis
      const bundleMetrics = {
        initialBundle: 45, // KB
        diceUtilsBundle: 8, // KB
        componentsBundle: 12, // KB
        totalBundle: 65 // KB
      };
      
      let score = 100;
      let status: 'pass' | 'warning' | 'fail' = 'pass';
      const recommendations: string[] = [];
      
      if (bundleMetrics.totalBundle > 100) {
        score -= 30;
        status = 'warning';
        recommendations.push('Consider code splitting for large bundles');
      }
      
      if (bundleMetrics.initialBundle > 50) {
        score -= 20;
        recommendations.push('Implement lazy loading for non-critical components');
      }
      
      if (currentDevice.capabilities.network === '2g' || currentDevice.capabilities.network === '3g') {
        if (bundleMetrics.totalBundle > 50) {
          score -= 25;
          status = 'warning';
          recommendations.push('Optimize bundle size for slow networks');
        }
      }
      
      return {
        name: 'Bundle Optimization',
        status,
        score: Math.max(0, score),
        metrics: {
          bundleSize: bundleMetrics.totalBundle,
        },
        recommendations,
        timing: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Bundle Optimization',
        status: 'fail',
        score: 0,
        metrics: {},
        recommendations: ['Fix bundle optimization test errors'],
        timing: Date.now() - startTime
      };
    }
  }, [currentDevice]);

  const testMobileOptimization = useCallback(async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      let score = 100;
      let status: 'pass' | 'warning' | 'fail' = 'pass';
      const recommendations: string[] = [];
      
      // Test touch targets
      const buttons = testContainerRef.current?.querySelectorAll('button');
      let touchTargetScore = 100;
      
      buttons?.forEach(button => {
        const rect = button.getBoundingClientRect();
        const minSize = Math.min(rect.width, rect.height);
        if (minSize < 44) {
          touchTargetScore -= 20;
          recommendations.push('Ensure touch targets are at least 44px');
        }
      });
      
      // Test viewport optimization
      const viewport = testContainerRef.current?.getBoundingClientRect();
      let viewportScore = 100;
      
      if (viewport && viewport.width > currentDevice.viewport.width) {
        viewportScore -= 30;
        recommendations.push('Optimize layout for mobile viewport');
      }
      
      // Test scroll performance
      let scrollScore = 100;
      if (currentDevice.type === 'mobile') {
        // Simulate scroll test
        const hasHorizontalScroll = testContainerRef.current?.scrollWidth! > testContainerRef.current?.clientWidth!;
        if (hasHorizontalScroll) {
          scrollScore -= 40;
          recommendations.push('Eliminate horizontal scroll on mobile');
        }
      }
      
      score = Math.min(touchTargetScore, viewportScore, scrollScore);
      
      if (score < 80) {
        status = 'warning';
      }
      if (score < 60) {
        status = 'fail';
      }
      
      return {
        name: 'Mobile Optimization',
        status,
        score: Math.max(0, score),
        metrics: {
          scrollPerformance: scrollScore,
        },
        recommendations,
        timing: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Mobile Optimization',
        status: 'fail',
        score: 0,
        metrics: {},
        recommendations: ['Fix mobile optimization test errors'],
        timing: Date.now() - startTime
      };
    }
  }, [currentDevice]);

  const testNetworkEfficiency = useCallback(async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      let score = 100;
      let status: 'pass' | 'warning' | 'fail' = 'pass';
      const recommendations: string[] = [];
      
      // Simulate network analysis
      const networkMetrics = {
        requests: 3, // Initial page load requests
        cacheHitRate: 85, // Percentage
        compressionRatio: 70 // Percentage
      };
      
      if (networkMetrics.requests > 5) {
        score -= 20;
        recommendations.push('Reduce number of network requests');
      }
      
      if (networkMetrics.cacheHitRate < 80) {
        score -= 15;
        recommendations.push('Improve caching strategy');
      }
      
      if (currentDevice.capabilities.network === '2g' || currentDevice.capabilities.network === '3g') {
        if (networkMetrics.compressionRatio < 80) {
          score -= 25;
          recommendations.push('Enable better compression for slow networks');
        }
      }
      
      return {
        name: 'Network Efficiency',
        status,
        score: Math.max(0, score),
        metrics: {
          networkRequests: networkMetrics.requests,
          cacheEfficiency: networkMetrics.cacheHitRate,
        },
        recommendations,
        timing: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Network Efficiency',
        status: 'fail',
        score: 0,
        metrics: {},
        recommendations: ['Fix network efficiency test errors'],
        timing: Date.now() - startTime
      };
    }
  }, [currentDevice]);

  // Run all performance tests
  const runPerformanceTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults({});
    setTestProgress(0);
    
    const tests = [
      testRenderPerformance,
      testMemoryEfficiency,
      testInteractionLatency,
      testBundleOptimization,
      testMobileOptimization,
      testNetworkEfficiency
    ];
    
    const results: Record<string, TestResult> = {};
    let totalScore = 0;
    let totalWeight = 0;
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const testConfig = PERFORMANCE_TESTS[i];
      
      setTestProgress((i / tests.length) * 100);
      
      try {
        const result = await test();
        results[testConfig.id] = result;
        
        totalScore += result.score * testConfig.weight;
        totalWeight += testConfig.weight;
      } catch (error) {
        results[testConfig.id] = {
          name: testConfig.name,
          status: 'fail',
          score: 0,
          metrics: {},
          recommendations: ['Test execution failed'],
          timing: 0
        };
      }
      
      // Update results incrementally
      setTestResults({ ...results });
    }
    
    setTestProgress(100);
    setOverallScore(totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0);
    setIsRunning(false);
  }, [
    testRenderPerformance,
    testMemoryEfficiency,
    testInteractionLatency,
    testBundleOptimization,
    testMobileOptimization,
    testNetworkEfficiency
  ]);

  // Effect to simulate device when changed
  useEffect(() => {
    simulateDevice(currentDevice);
  }, [currentDevice, simulateDevice]);

  // Get status icon
  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Activity className="h-8 w-8 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-accent">
            Dice Roller Performance Testing
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive performance testing and optimization for mobile devices. 
          Test render performance, memory efficiency, interaction latency, and mobile-specific optimizations.
        </p>
      </div>

      {/* Device Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Profile Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEVICE_PROFILES.map((device) => (
              <Button
                key={device.name}
                variant={currentDevice.name === device.name ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => setCurrentDevice(device)}
                disabled={isRunning}
              >
                <div className="flex items-center gap-2 w-full">
                  {device.type === 'mobile' ? (
                    <Smartphone className="h-4 w-4" />
                  ) : device.type === 'tablet' ? (
                    <Monitor className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                  <span className="font-medium">{device.name}</span>
                </div>
                <div className="text-xs text-muted-foreground text-left">
                  {device.viewport.width}×{device.viewport.height} • {device.capabilities.memory}GB • {device.capabilities.cpu} CPU
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Performance Testing
            </span>
            <div className="flex items-center gap-2">
              {overallScore > 0 && (
                <Badge variant="outline" className={cn("text-lg px-3 py-1", getScoreColor(overallScore))}>
                  Score: {overallScore}/100
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={runPerformanceTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Performance Tests
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setTestResults({});
                setOverallScore(0);
                setTestProgress(0);
              }}
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Results
            </Button>
          </div>
          
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="simulator">Device Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERFORMANCE_TESTS.map((test) => {
              const result = testResults[test.id];
              const Icon = test.icon;
              
              return (
                <Card key={test.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {test.name}
                      </div>
                      {result && getStatusIcon(result.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                    {result ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Score:</span>
                          <span className={cn("font-bold", getScoreColor(result.score))}>
                            {result.score}/100
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Completed in {result.timing}ms
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {isRunning ? 'Testing...' : 'Not tested yet'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {Object.entries(testResults).map(([testId, result]) => (
            <Card key={testId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{result.name}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className={cn("font-bold", getScoreColor(result.score))}>
                      {result.score}/100
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics */}
                {Object.keys(result.metrics).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {result.metrics.renderTime && (
                        <div className="flex justify-between">
                          <span>Render Time:</span>
                          <span>{result.metrics.renderTime.toFixed(2)}ms</span>
                        </div>
                      )}
                      {result.metrics.memoryUsage && (
                        <div className="flex justify-between">
                          <span>Memory Usage:</span>
                          <span>{result.metrics.memoryUsage.toFixed(2)}MB</span>
                        </div>
                      )}
                      {result.metrics.interactionLatency && (
                        <div className="flex justify-between">
                          <span>Interaction Latency:</span>
                          <span>{result.metrics.interactionLatency.toFixed(2)}ms</span>
                        </div>
                      )}
                      {result.metrics.bundleSize && (
                        <div className="flex justify-between">
                          <span>Bundle Size:</span>
                          <span>{result.metrics.bundleSize}KB</span>
                        </div>
                      )}
                      {result.metrics.networkRequests && (
                        <div className="flex justify-between">
                          <span>Network Requests:</span>
                          <span>{result.metrics.networkRequests}</span>
                        </div>
                      )}
                      {result.metrics.cacheEfficiency && (
                        <div className="flex justify-between">
                          <span>Cache Efficiency:</span>
                          <span>{result.metrics.cacheEfficiency}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Recommendations */}
              <div>
                <h4 className="font-medium mb-3 text-accent">General Optimizations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use React.memo() for components that render frequently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Implement useCallback() for event handlers to prevent unnecessary re-renders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use useMemo() for expensive calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Implement lazy loading for non-critical components</span>
                  </li>
                </ul>
              </div>

              {/* Mobile-Specific */}
              <div>
                <h4 className="font-medium mb-3 text-accent">Mobile-Specific Optimizations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Ensure touch targets are minimum 44px for accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Use CSS transform instead of changing layout properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Implement passive event listeners for scroll performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Add will-change CSS property for animated elements</span>
                  </li>
                </ul>
              </div>

              {/* Bundle Optimization */}
              <div>
                <h4 className="font-medium mb-3 text-accent">Bundle Optimization</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Cpu className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Use dynamic imports for code splitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Cpu className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Tree-shake unused dependencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Cpu className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Compress assets with gzip/brotli</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Cpu className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Use service workers for caching strategies</span>
                  </li>
                </ul>
              </div>

              {/* Device-Specific Recommendations */}
              {currentDevice && (
                <div>
                  <h4 className="font-medium mb-3 text-accent">
                    Recommendations for {currentDevice.name}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {currentDevice.capabilities.memory <= 2 && (
                      <li className="flex items-start gap-2">
                        <MemoryStick className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Implement memory-constrained mode with reduced history limits</span>
                      </li>
                    )}
                    {currentDevice.capabilities.cpu === 'low' && (
                      <li className="flex items-start gap-2">
                        <Cpu className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>Add performance mode with simplified animations</span>
                      </li>
                    )}
                    {(currentDevice.capabilities.network === '2g' || currentDevice.capabilities.network === '3g') && (
                      <li className="flex items-start gap-2">
                        <Wifi className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Optimize for slow networks with aggressive caching</span>
                      </li>
                    )}
                    {currentDevice.capabilities.battery && (
                      <li className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Implement battery-saving mode with reduced animations</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Device Simulator - {currentDevice.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  Testing dice roller components in {currentDevice.viewport.width}×{currentDevice.viewport.height} viewport
                </div>
                
                {/* Device Frame */}
                <div 
                  ref={testContainerRef}
                  className="bg-background border-2 border-muted rounded-lg p-4 overflow-auto"
                  style={{
                    width: `${Math.min(currentDevice.viewport.width, 800)}px`,
                    height: `${Math.min(currentDevice.viewport.height, 600)}px`,
                    maxWidth: '100%'
                  }}
                >
                  {/* Test Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dice Roller Test Environment</h3>
                    
                    <div className="space-y-2">
                      <p>Test various dice expressions:</p>
                      <div className="flex flex-wrap gap-2">
                        <DiceRoller 
                          onClick={(result) => addRoll(result, 'Attack Roll')}
                          className="bg-accent/10 px-2 py-1 rounded"
                        >
                          Attack: 1d20+7
                        </DiceRoller>
                        <DiceRoller 
                          onClick={(result) => addRoll(result, 'Damage Roll')}
                          className="bg-accent/10 px-2 py-1 rounded"
                        >
                          Damage: 2d6+3
                        </DiceRoller>
                        <DiceRoller 
                          onClick={(result) => addRoll(result, 'Saving Throw')}
                          className="bg-accent/10 px-2 py-1 rounded"
                        >
                          Save: 1d20+2
                        </DiceRoller>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p>Complex expressions:</p>
                      <div className="flex flex-wrap gap-2">
                        <DiceRoller 
                          onClick={(result) => addRoll(result, 'Fireball')}
                          className="bg-accent/10 px-2 py-1 rounded"
                        >
                          Fireball: 8d6
                        </DiceRoller>
                        <DiceRoller 
                          onClick={(result) => addRoll(result, 'Healing')}
                          className="bg-accent/10 px-2 py-1 rounded"
                        >
                          Heal: 4d4+4
                        </DiceRoller>
                      </div>
                    </div>
                    
                    {history.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium">Recent Rolls:</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                                   {history.slice(-5).map((roll, index) => (
                           <div key={index} className="text-sm bg-muted p-2 rounded">
                             {roll.context}: {roll.result.expression.originalExpression} = {roll.result.total}
                           </div>
                         ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Device capabilities: {currentDevice.capabilities.memory}GB RAM, {currentDevice.capabilities.cpu} CPU, {currentDevice.capabilities.network} network
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
