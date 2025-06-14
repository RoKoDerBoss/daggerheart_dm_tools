import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"

interface FantasyTooltipProps extends React.ComponentPropsWithoutRef<typeof Tooltip> {
  children: React.ReactNode
}

interface FantasyTooltipTriggerProps extends React.ComponentPropsWithoutRef<typeof TooltipTrigger> {
  children: React.ReactNode
  className?: string
}

interface FantasyTooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipContent> {
  children: React.ReactNode
  variant?: "default" | "accent" | "muted"
  className?: string
}

const FantasyTooltip: React.FC<FantasyTooltipProps> = ({ children, ...props }) => (
  <Tooltip {...props}>
    {children}
  </Tooltip>
)

const FantasyTooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipTrigger>,
  FantasyTooltipTriggerProps
>(({ className, children, ...props }, ref) => (
  <TooltipTrigger
    ref={ref}
    className={cn("cursor-help", className)}
    {...props}
  >
    {children}
  </TooltipTrigger>
))
FantasyTooltipTrigger.displayName = "FantasyTooltipTrigger"

const FantasyTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContent>,
  FantasyTooltipContentProps
>(({ className, children, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-card border border-border text-foreground shadow-lg",
    accent: "bg-accent text-background border border-accent-hover shadow-lg shadow-accent/20",
    muted: "bg-muted text-muted-foreground border border-border shadow-lg"
  }

  return (
    <TooltipContent
      ref={ref}
      className={cn(
        "px-3 py-2 text-xs rounded-lg fantasy-tooltip z-50 max-w-xs",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  )
})
FantasyTooltipContent.displayName = "FantasyTooltipContent"

// Question mark tooltip component for consistent help indicators
interface QuestionTooltipProps {
  content: string
  variant?: "default" | "accent" | "muted"
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

const QuestionTooltip: React.FC<QuestionTooltipProps> = ({
  content,
  variant = "default",
  side = "top",
  className
}) => (
  <TooltipProvider>
    <FantasyTooltip>
      <FantasyTooltipTrigger className={cn("text-muted-foreground hover:text-accent transition-colors", className)}>
        <HelpCircle className="w-4 h-4" />
      </FantasyTooltipTrigger>
      <FantasyTooltipContent variant={variant} side={side}>
        {content}
      </FantasyTooltipContent>
    </FantasyTooltip>
  </TooltipProvider>
)

// Simple wrapper component for common tooltip use cases (kept for backwards compatibility)
interface SimpleTooltipProps {
  content: string
  children: React.ReactNode
  variant?: "default" | "accent" | "muted"
  side?: "top" | "right" | "bottom" | "left"
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  variant = "default",
  side = "top"
}) => (
  <TooltipProvider>
    <FantasyTooltip>
      <FantasyTooltipTrigger asChild>
        {children}
      </FantasyTooltipTrigger>
      <FantasyTooltipContent variant={variant} side={side}>
        {content}
      </FantasyTooltipContent>
    </FantasyTooltip>
  </TooltipProvider>
)

export { 
  FantasyTooltip, 
  FantasyTooltipTrigger, 
  FantasyTooltipContent,
  QuestionTooltip,
  SimpleTooltip,
  TooltipProvider
} 