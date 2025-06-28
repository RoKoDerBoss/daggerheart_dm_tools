import { FeedbackForm } from '@/components/FeedbackForm'
import { FantasyCard, FantasyCardContent } from "@/components/FantasyCard"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen fantasy-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cormorant font-bold text-foreground mb-6">
              Share Your <span className="text-accent">Feedback</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Help us improve the Daggerheart DM Tools. Your feedback is anonymous and greatly appreciated!
            </p>
          </div>

          {/* Feedback Form Section */}
          <div className="mb-8">
            <FeedbackForm className="w-full" />
          </div>

          {/* Anonymous Submission Info */}
          <div className="text-center">
            <FantasyCard variant="no-hover">
              <FantasyCardContent className="p-6">
                <div className="flex flex-col gap-2 text-foreground/80 leading-relaxed">
                  <span className="text-accent font-semibold">Anonymous submission</span>
                  We don't collect any personal information. 
                  Your feedback is only used to improve this website.
                </div>
              </FantasyCardContent>
            </FantasyCard>
          </div>
        </div>
      </div>
    </div>
  )
} 