import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Enhanced Button component with fantasy-themed variants
 * 
 * This component provides shadCN variants and fantasy-themed variants:
 * - Standard shadCN variants: default, destructive, ghost, link, outline, secondary
 * - Fantasy variants: fantasy-primary, fantasy-secondary
 * - Specialized variants: fear-control
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Fantasy-themed variants matching current .btn-primary and .btn-secondary styles
        "fantasy-primary":
          "bg-gradient-to-br from-accent to-accent-hover text-background rounded-lg px-6 py-3 font-semibold shadow-md hover:shadow-lg hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300 ease-in-out",
        "fantasy-secondary":
          "bg-transparent text-accent border-2 border-accent rounded-lg px-5 py-2.5 font-semibold hover:bg-accent hover:text-background transition-all duration-300 ease-in-out",
        
        // Fear Tracker specific variant - large circular buttons with solid color and intense glow
        "fear-control":
          "w-20 h-20 rounded-full text-2xl font-bold bg-accent text-background border-2 border-accent hover:shadow-[3px_3px_4px_rgba(0,0,0,0.2)] hover:shadow-accent-hover hover:-translate-y-1 active:translate-y-0 disabled:bg-gray-600 disabled:border-gray-600 disabled:ring-gray-600/20 disabled:shadow-gray-600/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg disabled:hover:ring-4 transition-all duration-300 ease-in-out flex items-center justify-center",
        
        // Dice Roller specific variant - inline clickable dice expressions with fantasy theming
        "dice":
          "inline-flex items-center gap-1 px-2 py-1 rounded-md border border-transparent bg-transparent text-foreground underline-offset-2 font-medium hover:text-accent hover:decoration-accent hover:shadow-sm active:shadow-inner disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all duration-200 ease-in-out touch-manipulation",
      },
      size: {
        default: "h-11 px-4 py-2", // 44px minimum for mobile
        sm: "h-11 rounded-md px-3 text-xs", // 44px minimum for mobile
        lg: "h-12 rounded-md px-8", // 48px for larger targets
        icon: "h-11 w-11", // 44px × 44px minimum for mobile
        
        // Fantasy-specific sizes that match current button padding and ensure mobile compliance
        "fantasy-default": "px-6 py-3 min-h-[44px]", // Ensure 44px minimum
        "fantasy-sm": "px-4 py-2 text-sm min-h-[44px]", // Ensure 44px minimum
        "fantasy-lg": "px-8 py-4 text-lg min-h-[48px]", // Larger target for primary actions
        
        // Fear control specific size (mobile responsive)
        "fear-control": "w-20 h-20 text-2xl sm:w-[70px] sm:h-[70px] sm:text-xl",
        
        // Dice roller specific size (mobile compliant inline elements)
        "dice": "min-h-[44px] min-w-[44px] px-2 py-1 text-sm sm:min-h-auto sm:min-w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button 