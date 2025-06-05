import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="fantasy-card p-8">
          {/* Error Icon */}
          <div className="text-6xl mb-6">🗡️</div>
          
          {/* Error Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          
          <p className="text-muted mb-6">
            This adventure path seems to have led nowhere. The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          
          {/* Navigation Options */}
          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Return to Home
            </Link>
            
            <Link 
              href="/tools"
              className="block w-full border-2 border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors"
            >
              Browse DM Tools
            </Link>
          </div>
          
          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-sm text-muted">
              Looking for a specific tool? Check out our available tools:
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              <Link 
                href="/tools/loot-generator"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Loot Generator
              </Link>
              <span className="text-muted">•</span>
              <Link 
                href="/tools/battle-point-calculator"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Battle Points
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 