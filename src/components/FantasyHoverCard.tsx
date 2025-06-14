import * as React from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

interface FantasyHoverCardProps extends React.ComponentPropsWithoutRef<typeof HoverCard> {
  children: React.ReactNode
}

interface FantasyHoverCardTriggerProps extends React.ComponentPropsWithoutRef<typeof HoverCardTrigger> {
  children: React.ReactNode
  className?: string
}

interface FantasyHoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardContent> {
  children: React.ReactNode
  variant?: "feature" | "dice" | "info"
  className?: string
}

const FantasyHoverCard: React.FC<FantasyHoverCardProps> = ({ children, ...props }) => (
  <HoverCard {...props}>
    {children}
  </HoverCard>
)
FantasyHoverCard.displayName = "FantasyHoverCard"

const FantasyHoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardTrigger>,
  FantasyHoverCardTriggerProps
>(({ className, children, ...props }, ref) => (
  <HoverCardTrigger
    ref={ref}
    className={cn(
      "cursor-help underline decoration-accent decoration-dashed underline-offset-2 hover:decoration-accent-hover hover:text-accent transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </HoverCardTrigger>
))
FantasyHoverCardTrigger.displayName = "FantasyHoverCardTrigger"

const FantasyHoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardContent>,
  FantasyHoverCardContentProps
>(({ className, children, variant = "info", ...props }, ref) => {
  const variantStyles = {
    feature: "bg-card border-2 border-accent/30 shadow-lg shadow-accent/20",
    dice: "bg-card border-2 border-accent/50 shadow-lg shadow-accent/30 relative overflow-hidden",
    info: "bg-card border-2 border-border shadow-lg"
  }

  return (
    <HoverCardContent
      ref={ref}
      className={cn(
        "w-80 p-4 rounded-xl fantasy-hover-card z-50",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {/* Fantasy gradient border for dice variant */}
      {variant === "dice" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent-hover to-accent" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </HoverCardContent>
  )
})
FantasyHoverCardContent.displayName = "FantasyHoverCardContent"

// Specialized content components for different use cases
interface FeatureHoverCardProps {
  featureName: string
  description: string
  trigger: React.ReactNode
}

const FeatureHoverCard: React.FC<FeatureHoverCardProps> = ({
  featureName,
  description,
  trigger
}) => (
  <FantasyHoverCard>
    <FantasyHoverCardTrigger>{trigger}</FantasyHoverCardTrigger>
    <FantasyHoverCardContent variant="feature">
      <div className="space-y-2">
        <h4 className="font-cormorant text-lg font-semibold text-accent">
          {featureName}
        </h4>
        <p className="text-sm text-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </FantasyHoverCardContent>
  </FantasyHoverCard>
)

interface DiceHoverCardProps {
  diceType: string
  description: string
  trigger: React.ReactNode
}

const DiceHoverCard: React.FC<DiceHoverCardProps> = ({
  diceType,
  description,
  trigger
}) => (
  <FantasyHoverCard>
    <FantasyHoverCardTrigger className="font-mono text-accent font-semibold">
      {trigger}
    </FantasyHoverCardTrigger>
    <FantasyHoverCardContent variant="dice">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-accent rounded text-background text-xs font-bold flex items-center justify-center">
            🎲
          </div>
          <h4 className="font-cormorant text-lg font-semibold text-accent">
            {diceType}
          </h4>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </FantasyHoverCardContent>
  </FantasyHoverCard>
)

export { 
  FantasyHoverCard, 
  FantasyHoverCardTrigger, 
  FantasyHoverCardContent,
  FeatureHoverCard,
  DiceHoverCard
} 