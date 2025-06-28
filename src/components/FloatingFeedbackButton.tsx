'use client'

import React from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SimpleTooltip } from '@/components/FantasyTooltip'

interface FloatingFeedbackButtonProps {
  className?: string
}

export const FloatingFeedbackButton: React.FC<FloatingFeedbackButtonProps> = ({ 
  className = "" 
}) => {
  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}>
      <SimpleTooltip content="Share your feedback">
        <Button 
          asChild
          size="lg"
          className="
            fantasy-primary 
            h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14
            rounded-full 
            bg-accent hover:bg-accent-hover 
            text-background 
            border-2 border-accent-hover
            shadow-lg hover:shadow-xl
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background
            active:scale-95 sm:active:scale-98
            touch-manipulation
            cursor-pointer
          "
          aria-label="Open feedback form"
        >
          <Link href="/feedback">
            <MessageSquare 
              className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" 
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="sr-only">Feedback</span>
          </Link>
        </Button>
      </SimpleTooltip>
    </div>
  )
}

FloatingFeedbackButton.displayName = "FloatingFeedbackButton"

export default FloatingFeedbackButton 