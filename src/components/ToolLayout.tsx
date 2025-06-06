'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getAllTools, getTool } from '@/config/tools'

interface ToolLayoutProps {
  children: React.ReactNode
  currentToolId: string
}

export default function ToolLayout({ children, currentToolId }: ToolLayoutProps) {
  const [isToolSwitcherOpen, setIsToolSwitcherOpen] = useState(false)
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
              <Link 
                href="/tools" 
                className="btn-secondary text-sm"
              >
                ← Back to Tools
              </Link>
            </div>

            {/* Center: Current Tool Info */}
            {currentTool && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-2xl">{currentTool.icon}</div>
                <div>
                  <div className="text-2xl sm:text-3xl font-cormorant-upright font-bold text-foreground">{currentTool.name}</div>
                </div>
              </div>
            )}

            {/* Right: Tool Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsToolSwitcherOpen(!isToolSwitcherOpen)}
                onBlur={() => setTimeout(() => setIsToolSwitcherOpen(false), 150)}
                className="btn-primary text-sm flex items-center space-x-2"
              >
                <span>Switch Tool</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isToolSwitcherOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isToolSwitcherOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 dropdown-menu z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-accent font-semibold border-b border-accent/20">
                      Available Tools
                    </div>
                    {otherTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="block px-4 py-3 hover:bg-accent/10 hover:text-accent transition-colors group"
                        onClick={() => setIsToolSwitcherOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{tool.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground group-hover:text-accent">
                              {tool.name}
                            </div>
                            <div className="text-xs text-muted">{tool.category}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-accent/20 mt-2 pt-2">
                      <Link
                        href="/tools"
                        className="block px-4 py-2 text-sm text-accent hover:bg-accent/10 transition-colors"
                        onClick={() => setIsToolSwitcherOpen(false)}
                      >
                        View All Tools →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            <h3 className="text-xl sm:text-2xl font-cormorant-upright font-bold text-foreground mb-4 sm:mb-2">
              Explore More Tools
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {otherTools.slice(0, 2).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-background/50 hover:bg-accent/10 rounded-lg transition-colors group"
                >
                  <div className="text-lg">{tool.icon}</div>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
            <Link 
              href="/tools" 
              className="btn-secondary"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 