import Link from 'next/link'
import { getAllTools, getFeaturedTools } from '@/config/tools'

export default function ToolsPage() {
  const allTools = getAllTools()
  const featuredTools = getFeaturedTools()
  const regularTools = allTools.filter(tool => !featuredTools.some(ft => ft.id === tool.id))

  return (
    <div className="min-h-screen fantasy-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              DM <span className="text-accent">Toolkit</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Everything you need to run epic Daggerheart campaigns. Our tools are designed to streamline 
              your game sessions and enhance the storytelling experience.
            </p>
          </div>

          {/* Featured Tools */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Tools</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="fantasy-card p-8 block text-decoration-none group"
                >
                  <div className="flex items-start space-x-6">
                    <div className="text-5xl">{tool.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {tool.name}
                        </h3>
                        <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold">
                          {tool.status === 'coming-soon' ? 'Coming Soon' : tool.status}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-sm px-2 py-1 bg-accent text-background rounded font-semibold">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-muted mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="text-accent font-semibold group-hover:text-accent/80 transition-colors">
                        Explore Tool →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Tools Grid */}
          {regularTools.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Complete Collection</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="fantasy-card p-6 block text-decoration-none group"
                  >
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {tool.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded font-semibold">
                        {tool.status === 'coming-soon' ? 'Coming Soon' : tool.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs px-2 py-1 bg-accent text-background rounded font-semibold">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-muted mb-4 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="text-accent font-semibold text-sm group-hover:text-accent/80 transition-colors">
                      Learn more →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center">
            <div className="fantasy-card p-8 lg:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                More Tools Coming Soon
              </h3>
              <p className="text-muted mb-6 leading-relaxed">
                We&apos;re constantly expanding our toolkit to support every aspect of your Daggerheart campaigns. 
                Have a suggestion for a new tool? We&apos;d love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/" 
                  className="btn-primary text-center"
                >
                  Back to Home
                </Link>
                <Link 
                  href="/tools/random-loot-generator" 
                  className="btn-secondary text-center"
                >
                  Try Featured Tool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 