import Link from 'next/link'
import { getAllTools, getFeaturedTools } from '@/config/tools'

export default function Home() {
  const allTools = getAllTools()
  const featuredTools = getFeaturedTools()
  const regularTools = allTools.filter(tool => !featuredTools.some(ft => ft.id === tool.id))

  return (
    <div className="min-h-screen fantasy-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-accent">Daggerheart</span>
              <br />
              <span className="text-foreground">DM Tools</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              Enhance your tabletop adventures with our collection of powerful tools designed specifically for 
              <span className="text-accent font-semibold"> Daggerheart campaigns</span>. 
              From loot generation to battle management, we&apos;ve got your table covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/tools" 
                className="btn-primary text-lg px-8 py-4 inline-block text-decoration-none"
              >
                Explore All Tools
              </Link>
              <Link 
                href="/tools/random-loot-generator" 
                className="btn-secondary text-lg px-8 py-4 inline-block text-decoration-none"
              >
                Try Loot Generator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Tools</h2>
            <p className="text-xl text-muted">Start with our most popular DM utilities</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="fantasy-card p-8 block text-decoration-none group"
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
                    <p className="text-muted mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="text-accent font-semibold group-hover:text-accent/80 transition-colors">
                      Launch Tool →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      {regularTools.length > 0 && (
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Complete Toolkit</h2>
              <p className="text-xl text-muted">Everything you need to run epic Daggerheart campaigns</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {regularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="fantasy-card p-6 block text-decoration-none group"
                >
                  <div className="text-3xl mb-4">{tool.icon}</div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded font-semibold">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-muted mb-4 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="text-accent font-semibold text-sm group-hover:text-accent/80 transition-colors">
                    Try it now →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="fantasy-card p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">About Daggerheart</h2>
              <p className="text-lg text-muted leading-relaxed mb-6">
                Daggerheart is a fantasy tabletop roleplaying game of brave heroics and vibrant worlds 
                that are built together with your gaming group. Create a shared story full of tension, 
                laughter, and memorable moments about the heroic deeds of fantastic characters.
              </p>
              <p className="text-muted">
                Our tools are designed to streamline your game sessions, letting you focus on what matters most: 
                <span className="text-accent font-semibold"> telling amazing stories together</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 