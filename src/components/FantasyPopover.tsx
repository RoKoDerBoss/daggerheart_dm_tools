import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface FantasyPopoverProps extends React.ComponentPropsWithoutRef<typeof Popover> {
  children: React.ReactNode
}

interface FantasyPopoverTriggerProps extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  children: React.ReactNode
  className?: string
}

interface FantasyPopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  children: React.ReactNode
  variant?: "info" | "help" | "warning" | "tip"
  className?: string
}

const FantasyPopover: React.FC<FantasyPopoverProps> = ({ children, ...props }) => (
  <Popover {...props}>
    {children}
  </Popover>
)

const FantasyPopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  FantasyPopoverTriggerProps
>(({ className, children, ...props }, ref) => (
  <PopoverTrigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center text-accent hover:text-accent-hover transition-colors cursor-help",
      className
    )}
    {...props}
  >
    {children}
  </PopoverTrigger>
))
FantasyPopoverTrigger.displayName = "FantasyPopoverTrigger"

const FantasyPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  FantasyPopoverContentProps
>(({ className, children, variant = "info", ...props }, ref) => {
  const variantStyles = {
    info: "bg-card border-2 border-border shadow-lg",
    help: "bg-card border-2 border-accent/30 shadow-lg shadow-accent/10",
    warning: "bg-card border-2 border-warning/50 shadow-lg shadow-warning/20",
    tip: "bg-card border-2 border-success/40 shadow-lg shadow-success/15"
  }

  const variantIcons = {
    info: <Info className="w-4 h-4" />,
    help: "❓",
    warning: "⚠️",
    tip: "💡"
  }

  return (
    <PopoverContent
      ref={ref}
      className={cn(
        "w-80 p-4 rounded-xl fantasy-popover z-50",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        <div className="flex items-start space-x-3">
          <div className="text-lg flex-shrink-0 mt-0.5">
            {variant === "info" ? (
              <div className="text-accent">
                {variantIcons[variant]}
              </div>
            ) : (
              variantIcons[variant]
            )}
          </div>
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </PopoverContent>
  )
})
FantasyPopoverContent.displayName = "FantasyPopoverContent"

// Specialized popover components for common use cases
interface HelpPopoverProps {
  title: string
  children: React.ReactNode
  trigger?: React.ReactNode
}

const HelpPopover: React.FC<HelpPopoverProps> = ({
  title,
  children,
  trigger = (
    <div className="w-4 h-4 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors flex items-center justify-center text-xs font-bold">
      ?
    </div>
  )
}) => (
  <FantasyPopover>
    <FantasyPopoverTrigger>{trigger}</FantasyPopoverTrigger>
    <FantasyPopoverContent variant="help">
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-accent">
          {title}
        </h4>
        <div className="text-sm text-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </FantasyPopoverContent>
  </FantasyPopover>
)

interface InfoPopoverProps {
  title: string
  children: React.ReactNode
  trigger?: React.ReactNode
}

const InfoPopover: React.FC<InfoPopoverProps> = ({
  title,
  children,
  trigger = (
    <div className="w-4 h-4 rounded-full bg-accent/20 text-accent hover:bg-accent/30 hover:text-accent transition-colors flex items-center justify-center">
      <Info className="w-3 h-3" />
    </div>
  )
}) => (
  <FantasyPopover>
    <FantasyPopoverTrigger>{trigger}</FantasyPopoverTrigger>
    <FantasyPopoverContent variant="info">
      <div className="space-y-2">
        <h4 className="font-cormorant text-base font-semibold text-foreground">
          {title}
        </h4>
        <div className="text-sm text-muted leading-relaxed">
          {children}
        </div>
      </div>
    </FantasyPopoverContent>
  </FantasyPopover>
)

interface TipPopoverProps {
  children: React.ReactNode
  trigger?: React.ReactNode
}

const TipPopover: React.FC<TipPopoverProps> = ({
  children,
  trigger = (
    <div className="w-4 h-4 rounded-full bg-success/20 text-success hover:bg-success/30 transition-colors flex items-center justify-center text-xs font-bold">
      💡
    </div>
  )
}) => (
  <FantasyPopover>
    <FantasyPopoverTrigger>{trigger}</FantasyPopoverTrigger>
    <FantasyPopoverContent variant="tip">
      <div className="text-sm text-foreground leading-relaxed">
        {children}
      </div>
    </FantasyPopoverContent>
  </FantasyPopover>
)

interface WarningPopoverProps {
  title: string
  children: React.ReactNode
  trigger?: React.ReactNode
}

const WarningPopover: React.FC<WarningPopoverProps> = ({
  title,
  children,
  trigger = (
    <div className="w-4 h-4 rounded-full bg-warning/20 text-warning hover:bg-warning/30 transition-colors flex items-center justify-center text-xs font-bold">
      ⚠️
    </div>
  )
}) => (
  <FantasyPopover>
    <FantasyPopoverTrigger>{trigger}</FantasyPopoverTrigger>
    <FantasyPopoverContent variant="warning">
      <div className="space-y-2">
        <h4 className="font-cormorant text-base font-semibold text-warning">
          {title}
        </h4>
        <div className="text-sm text-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </FantasyPopoverContent>
  </FantasyPopover>
)

export { 
  FantasyPopover, 
  FantasyPopoverTrigger, 
  FantasyPopoverContent,
  HelpPopover,
  InfoPopover,
  TipPopover,
  WarningPopover
} 