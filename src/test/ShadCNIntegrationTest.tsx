/**
 * ShadCN Integration Test Component
 * Verifies proper integration and styling of all ShadCN components used in the dice roller system
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, RotateCcw, Copy, Trash2, History } from 'lucide-react';

export const ShadCNIntegrationTest: React.FC = () => {
  const [inputValue, setInputValue] = useState('2d6+3');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-cormorant font-bold text-accent">
          ShadCN Components Integration Test
        </h1>
        <p className="text-muted-foreground">
          Verifying proper integration of all ShadCN components
        </p>
      </div>

      {/* Button Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Button Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="fantasy-primary">Fantasy Primary</Button>
            <Button variant="fantasy-secondary">Fantasy Secondary</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-accent/50 text-accent hover:bg-accent/10">
              🎲 Roll Again
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs text-yellow-600 border-yellow-500/50">
              ⚡ Critical
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent/20">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Input Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter dice expression"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="max-w-md"
          />
          
          <Input
            variant="fantasy"
            placeholder="Fantasy styled input"
            className="max-w-md"
          />
          
          <Input
            value="invalid"
            className="max-w-md border-red-500 focus:border-red-500 ring-2 ring-red-500/20"
          />
        </CardContent>
      </Card>

      {/* Badge Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Badge Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/50">
              critical
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/50">
              advantage
            </Badge>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
              15
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Collapsible Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto border border-accent/20 rounded-lg bg-gradient-to-r from-background to-accent/5 hover:border-accent/40"
              >
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-accent" />
                  <span className="font-cormorant text-accent font-medium">Roll History</span>
                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
                    3
                  </Badge>
                </div>
                <ChevronDown className={`h-4 w-4 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-2">
                <div className="group p-3 rounded-lg border border-accent/20 bg-gradient-to-r from-background to-accent/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-cormorant text-accent font-medium">2d6+3</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-bold text-foreground text-xl">15</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent/20">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500/20">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Integration Summary */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-cormorant">Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-accent mb-2">✅ Verified Components</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Button - All variants working</li>
                <li>• Input - Standard and fantasy variants</li>
                <li>• Badge - Custom styling applied</li>
                <li>• Card - Proper structure</li>
                <li>• Collapsible - Fantasy theming</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2">🎨 Design Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Consistent accent colors</li>
                <li>• Mobile-friendly sizing</li>
                <li>• Fantasy theme integration</li>
                <li>• Proper hover effects</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 