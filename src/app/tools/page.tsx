import Link from 'next/link'
import { getAllTools } from '@/config/tools'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FantasyCard, FantasyCardContent } from "@/components/FantasyCard"

export default function ToolsPage() {
  const allTools = getAllTools()

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-cormorant font-bold text-foreground mb-6">
              DM <span className="text-accent">Toolkit</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to run epic Daggerheart campaigns. Our tools are designed to streamline 
              your game sessions and enhance the storytelling experience.
            </p>
          </div>

          {/* All Tools Grid */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-cormorant-upright font-bold text-foreground mb-8 text-center">Complete Collection</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTools.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.id}`} className="block group">
                  <FantasyCard 
                    variant="interactive"
                    className="h-full group"
                  >
                    <FantasyCardContent className="p-6 h-full flex flex-col">
                      <div className="text-4xl mb-4">{tool.icon}</div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {tool.name}
                        </h3>
                        {tool.status !== 'active' && (
                          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                            {tool.status === 'coming-soon' ? 'Coming Soon' : tool.status}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="default" className="bg-accent text-background hover:bg-accent/90">
                          {tool.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                        {tool.description}
                      </p>
                      
                      <div className="mt-auto">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-accent hover:text-accent/80 hover:bg-accent/10 p-0 h-auto font-semibold text-sm group-hover:text-accent/80 transition-colors"
                        >
                          Learn more →
                        </Button>
                      </div>
                    </FantasyCardContent>
                  </FantasyCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 