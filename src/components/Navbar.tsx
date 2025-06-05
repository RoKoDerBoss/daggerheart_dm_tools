'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getAllTools } from '@/config/tools'

export default function Navbar() {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const tools = getAllTools()

  return (
    <nav className="bg-card border-b-2 border-accent/20 relative z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-accent hover:text-accent/80 transition-colors">
              ⚔️ Daggerheart DM Tools
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="nav-link">
              Home
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                onBlur={() => setTimeout(() => setIsToolsDropdownOpen(false), 150)}
                className="nav-link flex items-center space-x-1"
              >
                <span>Tools</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isToolsDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 dropdown-menu">
                  <div className="py-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                        onClick={() => setIsToolsDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{tool.icon}</span>
                          <span>{tool.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="nav-link p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-accent/20 mt-2 pt-2 pb-4">
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              
              {/* Mobile Tools List */}
              <div className="border-t border-accent/20 pt-2 mt-2">
                <div className="text-sm text-accent font-semibold px-4 py-2">Quick Access:</div>
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="block px-4 py-2 text-sm text-muted hover:text-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 