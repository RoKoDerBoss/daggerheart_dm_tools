'use client'

import Link from 'next/link'
import { getAllTools, getTool } from '@/config/tools'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ToolLayoutProps {
  children: React.ReactNode
  currentToolId: string
}

export default function ToolLayout({ children, currentToolId }: ToolLayoutProps) {
  const allTools = getAllTools()
  const currentTool = getTool(currentToolId)
  const otherTools = allTools.filter(tool => tool.id !== currentToolId)

  return (
    <div className="min-h-screen fantasy-bg">
      {/* Tool Header */}
      <div className="bg-card border-b-2 border-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back to Tools */}
            <div className="flex items-center space-x-4">
              <Button asChild variant="fantasy-secondary" size="fantasy-sm">
                <Link href="/tools">
                  ← Back to Tools
                </Link>
              </Button>
            </div>

            {/* Center: Current Tool Info */}
            {currentTool && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-2xl">{currentTool.icon}</div>
                <div>
                  <div className="text-3xl md:text-4xl font-cormorant font-bold text-foreground">{currentTool.name}</div>
                </div>
              </div>
            )}

            {/* Right: Tool Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger className="!min-h-11" asChild>
                <Button variant="fantasy-primary" size="fantasy-sm" className="flex items-center space-x-2">
                  <span>Switch Tool</span>
                  <svg 
                    className="w-4 h-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="text-sm text-accent font-semibold">
                  Available Tools
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-accent/20" />
                {otherTools.map((tool) => (
                  <DropdownMenuItem key={tool.id} asChild className="hover:bg-accent/10 focus:bg-accent/10 data-[highlighted]:bg-accent/10">
                    <Link
                      href={`/tools/${tool.id}`}
                      className="flex items-center space-x-3 px-2 py-3 hover:text-accent transition-colors group cursor-pointer"
                    >
                      <div className="text-xl">{tool.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-accent">
                          {tool.name}
                        </div>
                        <div className="text-xs text-foreground/50">{tool.category}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-accent/20" />
                <DropdownMenuItem asChild className="hover:bg-accent/10 hover:text-foreground focus:bg-accent/10 data-[highlighted]:bg-accent/10">
                  <Link
                    href="/tools"
                    className="flex items-center px-2 py-2 text-sm text-accent transition-colors cursor-pointer"
                  >
                    View All Tools →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile: Current Tool Info */}
          {currentTool && (
            <div className="justify-center text-2xl md:hidden mt-4 flex items-center space-x-3 pt-4 border-t border-accent/20">
              <div className="text-2xl">{currentTool.icon}</div>
              <div>
                <div className="font-cormorant-upright font-semibold text-foreground text-2xl sm:text-3xl">{currentTool.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tool Content */}
      <div className="relative">
        {children}
      </div>

      {/* Tool Footer */}
      <div className="bg-card border-t-2 border-accent/20 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-cormorant font-bold text-foreground mb-4 sm:mb-2">
              Explore More Tools
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {otherTools.slice(0, 2).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-background/50 hover:bg-accent/10 rounded-lg transition-colors group"
                >
                  <div className="text-base sm:text-lg">{tool.icon}</div>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
            <Button asChild variant="fantasy-secondary" size="fantasy-default">
              <Link href="/tools">
                View All Tools
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 