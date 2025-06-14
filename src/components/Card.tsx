import * as React from "react"
import { Card as ShadCNCard, CardContent as ShadCNCardContent, CardDescription as ShadCNCardDescription, CardFooter as ShadCNCardFooter, CardHeader as ShadCNCardHeader, CardTitle as ShadCNCardTitle } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Enhanced Card component with fantasy-themed variants
 * 
 * This component provides shadCN Card functionality and fantasy styling:
 * - Standard variants: default, outlined, elevated
 * - Fantasy variants: fantasy, fantasy-elevated, fantasy-interactive
 * 
 * The fantasy variants integrate with the .fantasy-card CSS class and provide
 * gradient borders, hover effects, and mystical theming.
 */

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow",
  {
    variants: {
      variant: {
        default: "",
        outlined: "border-2 border-border",
        elevated: "shadow-lg hover:shadow-xl transition-shadow duration-300",
      },
      hoverEffect: {
        none: "",
        subtle: "hover:shadow-md transition-shadow duration-300",
        strong: "hover:shadow-xl transition-shadow duration-300",
      }
    },
    defaultVariants: {
      variant: "default",
      hoverEffect: "none",
    },
  }
)

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated"
  hoverEffect?: "none" | "subtle" | "strong"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverEffect, children, ...props }, ref) => {
    return (
      <ShadCNCard
        ref={ref}
        className={cn(cardVariants({ variant, hoverEffect }), className)}
        {...props}
      >
        {children}
      </ShadCNCard>
    )
  }
)
Card.displayName = "Card"

// Enhanced CardHeader with fantasy theming options
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  fantasy?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, fantasy = false, ...props }, ref) => (
    <ShadCNCardHeader
      ref={ref}
      className={cn(
        fantasy && "relative z-10",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

// Enhanced CardTitle with fantasy theming options
export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  fantasy?: boolean
}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, fantasy = false, ...props }, ref) => (
    <ShadCNCardTitle
      ref={ref}
      className={cn(
        fantasy && "text-accent font-cormorant text-xl",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

// Enhanced CardDescription with fantasy theming
const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <ShadCNCardDescription
      ref={ref}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

// Enhanced CardContent with fantasy theming
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  fantasy?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, fantasy = false, ...props }, ref) => (
    <ShadCNCardContent
      ref={ref}
      className={cn(
        fantasy && "relative z-10",
        className
      )}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

// Enhanced CardFooter with fantasy theming
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  fantasy?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, fantasy = false, ...props }, ref) => (
    <ShadCNCardFooter
      ref={ref}
      className={cn(
        fantasy && "relative z-10",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// Export all components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card 