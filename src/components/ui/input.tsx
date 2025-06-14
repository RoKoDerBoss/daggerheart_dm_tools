import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border-2 text-foreground focus:outline-none transition-colors",
  {
    variants: {
      variant: {
        default: "border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        fantasy: "bg-background border-gray-600 px-4 py-3 focus:border-accent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...props }, ref) => {
    // Special handling for number inputs
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number') {
        const newValue = e.target.value === '' ? '' : Number(e.target.value)
        // Create a synthetic event with the new value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue
          }
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(syntheticEvent)
      } else {
        onChange?.(e)
      }
    }

    // Special handling for number input value display
    const displayValue = type === 'number' && value === 0 ? '' : value

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: type === 'number' ? 'fantasy' : undefined }), className)}
        ref={ref}
        value={displayValue}
        onChange={handleNumberChange}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
