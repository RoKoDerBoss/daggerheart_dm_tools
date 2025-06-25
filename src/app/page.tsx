'use client'

import Link from 'next/link'
import { getFeaturedTools } from '@/config/tools'
import { Button } from '@/components/ui/button'
import { FantasyCard, FantasyCardContent } from "@/components/FantasyCard"
import { DiceRoller } from '@/components/dice'
import { DiceResultCard } from '@/components/DiceResultCard'

export default function Home() {
  const featuredTools = getFeaturedTools()

  return (
    <>
      <div className="min-h-screen fantasy-bg">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-accent font-cormorant font-bold">DAGGERHEART</span>
                  <span className="text-foreground font-cormorant">DM Tools</span>
                </div>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Enhance your tabletop adventures with our collection of powerful tools designed specifically for 
                <span className="text-accent font-semibold"> Daggerheart campaigns</span>. 
                From loot generation to battle management, we&apos;ve got your table covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  variant="fantasy-primary"
                  size="fantasy-lg"
                  className="text-lg"
                >
                  <Link href="/tools">
                    Explore All Tools
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="fantasy-secondary"
                  size="fantasy-lg"
                  className="text-lg"
                >
                  <Link href="/tools/fear-tracker">
                    Try Fear Tracker
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-cormorant font-bold text-foreground mb-4">Featured Tools</h2>
              <p className="text-lg sm:text-xl text-muted-foreground">Start with our most popular DM utilities</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              {featuredTools.map((tool) => (
                <FantasyCard
                  key={tool.id}
                  variant="elevated"
                  className="group"
                >
                  <FantasyCardContent className="p-8">
                    <Link
                      href={`/tools/${tool.id}`}
                      className="block text-decoration-none"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{tool.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                              {tool.name}
                            </h3>
                            <span className="text-xs px-3 py-1 bg-accent text-background rounded-full font-semibold">
                              {tool.category}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {tool.description}
                          </p>
                          <div className="text-accent font-semibold group-hover:text-accent/80 transition-colors">
                            Launch Tool →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FantasyCardContent>
                </FantasyCard>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
} 