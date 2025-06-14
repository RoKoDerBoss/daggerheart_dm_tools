import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <Card className="fantasy">
          <CardContent className="p-8">
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
              <Button asChild className="w-full" variant="default" size="default">
                <Link href="/" className="bg-accent text-background hover:bg-accent/90">
                  Return to Home
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline" size="default">
                <Link href="/tools" className="border-accent text-accent hover:bg-accent/10">
                  Browse DM Tools
                </Link>
              </Button>
            </div>
            
            {/* Additional Help */}
            <div className="mt-8">
              <Separator className="bg-accent/20" />
              <div className="pt-6">
                <p className="text-sm text-muted mb-3">
                  Looking for a specific tool? Check out our available tools:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button asChild variant="link" size="sm" className="text-accent hover:text-accent/80 p-0 h-auto">
                    <Link href="/tools/random-loot-generator">
                      Loot Generator
                    </Link>
                  </Button>
                  <span className="text-muted">•</span>
                  <Button asChild variant="link" size="sm" className="text-accent hover:text-accent/80 p-0 h-auto">
                    <Link href="/tools/battle-point-calculator">
                      Battle Points
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 