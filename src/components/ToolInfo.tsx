'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface ToolInfoProps {
  title?: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export default function ToolInfo({ 
  title = "Features & Details", 
  children, 
  defaultExpanded = false 
}: ToolInfoProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="fantasy my-4 sm:my-6 border-accent/30 bg-background/20 hover:border-accent/50 hover:shadow-lg transition-all duration-300">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 sm:p-6 h-auto hover:bg-accent/10 rounded-none"
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-accent text-lg sm:text-xl">✦</span>
              <span className="font-bold text-sm sm:text-base md:text-xl text-foreground truncate">{title}</span>
            </div>
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-accent transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-accent/20 bg-background/10">
            <div className="prose prose-invert max-w-none">
              <div className="[&>h2]:text-foreground [&>h2]:text-lg sm:[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-4 sm:[&>h2]:mt-6 [&>h2]:mb-3 sm:[&>h2]:mb-4 [&>h2]:mt-0
                          [&>h3]:text-accent [&>h3]:text-base sm:[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-4 sm:[&>h3]:mt-6 [&>h3]:mb-2 sm:[&>h3]:mb-3 [&>h3]:mt-0
                          [&>h4]:text-accent [&>h4]:text-sm sm:[&>h4]:text-base [&>h4]:font-semibold [&>h4]:mt-3 sm:[&>h4]:mt-4 [&>h4]:mb-2 [&>h4]:mt-0
                          [&>p]:text-muted-foreground [&>p]:text-sm sm:[&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-3 sm:[&>p]:mb-4
                          [&>ul]:list-none [&>ul]:p-0 [&>ul]:my-3 sm:[&>ul]:my-4 [&>ul]:text-muted-foreground
                          [&>li]:flex [&>li]:items-start [&>li]:gap-2 sm:[&>li]:gap-3 [&>li]:mb-2 sm:[&>li]:mb-3 [&>li]:leading-normal [&>li]:text-sm sm:[&>li]:text-base
                          [&>li]:before:content-['✦'] [&>li]:before:text-accent [&>li]:before:mt-0.5 [&>li]:before:flex-shrink-0
                          [&_.feature-grid]:grid [&_.feature-grid]:grid-cols-1 [&_.feature-grid]:gap-3 [&_.feature-grid]:my-3 sm:[&_.feature-grid]:my-4
                          [&_.feature-card]:bg-accent/10 [&_.feature-card]:border [&_.feature-card]:border-accent/30 [&_.feature-card]:rounded-lg [&_.feature-card]:p-3 sm:[&_.feature-card]:p-4
                          [&_.feature-card>h4]:text-accent [&_.feature-card>h4]:text-sm sm:[&_.feature-card>h4]:text-base [&_.feature-card>h4]:font-semibold [&_.feature-card>h4]:mb-2 [&_.feature-card>h4]:mt-0
                          [&_.feature-card>p]:text-muted-foreground [&_.feature-card>p]:text-xs sm:[&_.feature-card>p]:text-sm m-0
                          md:[&_.feature-grid]:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
                          sm:[&_.feature-grid]:grid-cols-1 sm:[&_.feature-grid]:gap-3">
                {children}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
} 