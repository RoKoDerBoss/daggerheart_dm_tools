import * as React from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-accent text-background px-4 py-2 rounded-md font-medium",
        "focus:outline-none focus:ring-2 focus:ring-accent-hover focus:ring-offset-2",
        "transition-all duration-200",
        className
      )}
      tabIndex={1}
    >
      {children}
    </a>
  )
}

export { SkipLink } 