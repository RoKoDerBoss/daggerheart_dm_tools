import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FantasyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "elevated" | "interactive"
}

const FantasyCard = React.forwardRef<HTMLDivElement, FantasyCardProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const baseClasses = "fantasy-card relative overflow-hidden"
    const variantClasses = {
      default: "hover:border-accent hover:shadow-[0_10px_25px_rgba(251,191,36,0.2)] transition-all duration-300",
      elevated: "transform hover:scale-[1.02] hover:border-accent hover:shadow-[0_10px_25px_rgba(251,191,36,0.2)] hover:-translate-y-[1px] transition-all duration-300",
      interactive: "cursor-pointer hover:border-accent hover:shadow-[0_10px_25px_rgba(251,191,36,0.2)] hover:-translate-y-[1px] transition-all duration-300",
    }

    return (
      <Card
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {/* Fantasy gradient border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent-hover to-accent" />
        
        {children}
      </Card>
    )
  }
)
FantasyCard.displayName = "FantasyCard"

const FantasyCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn("relative z-10", className)}
    {...props}
  />
))
FantasyCardHeader.displayName = "FantasyCardHeader"

const FantasyCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn("text-accent font-cormorant text-xl", className)}
    {...props}
  />
))
FantasyCardTitle.displayName = "FantasyCardTitle"

const FantasyCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
FantasyCardDescription.displayName = "FantasyCardDescription"

const FantasyCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("relative z-10", className)}
    {...props}
  />
))
FantasyCardContent.displayName = "FantasyCardContent"

const FantasyCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn("relative z-10", className)}
    {...props}
  />
))
FantasyCardFooter.displayName = "FantasyCardFooter"

export { 
  FantasyCard, 
  FantasyCardHeader, 
  FantasyCardTitle, 
  FantasyCardDescription, 
  FantasyCardContent, 
  FantasyCardFooter 
} 