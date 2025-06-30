"use client"

import * as React from "react"
import { 
  FantasyCard, 
  FantasyCardHeader, 
  FantasyCardTitle, 
  FantasyCardContent 
} from "@/components/FantasyCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FeedbackFormData, 
  FeedbackCategory, 
  FEEDBACK_CATEGORIES,
  TOOL_OPTIONS,
  PRIORITY_LEVELS,
  MOBILE_DEVICE_OPTIONS
} from "@/types/feedback"
import { useFeedbackForm } from "@/hooks/useFeedbackForm"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, X } from "lucide-react"

interface FeedbackFormProps {
  onSubmit?: (data: Partial<FeedbackFormData>) => Promise<void> | void
  className?: string
}

const FeedbackForm = React.forwardRef<HTMLFormElement, FeedbackFormProps>(
  ({ onSubmit, className = "" }, ref) => {
    const {
      formData,
      isSubmitting,
      isSubmitted,
      submitError,
      handleFieldChange,
      handleSubmit,
      resetForm,
      clearError,
      isValid,
      errors
         } = useFeedbackForm({
       onSubmit: onSubmit ? async (data) => { 
         const result = onSubmit(data);
         if (result instanceof Promise) {
           await result;
         }
       } : undefined,
      onSuccess: () => {
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          resetForm()
        }, 5000)
      }
    })

    return (
      <FantasyCard variant="default" className={className}>    
        <FantasyCardContent>
          {/* Success Message */}
          {isSubmitted && (
            <Alert className="mb-6 mt-6 border-green-600 bg-green-50/10 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <div className="ml-2">
                <h4 className="font-medium">Thank you for your feedback!</h4>
                <p className="text-sm text-green-300 mt-1">
                  Your feedback has been submitted successfully. We appreciate you helping us improve the tools.
                </p>
              </div>
            </Alert>
          )}

          {/* Error Message */}
          {submitError && (
            <Alert className="mb-6 mt-6 border-red-600 bg-red-50/10 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2 flex-1">
                <h4 className="font-medium">Submission Error</h4>
                <p className="text-sm text-red-300 mt-1">{submitError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2 h-6 w-6 p-0 text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          )}

          {/* Field Validation Errors */}
          {Object.keys(errors).length > 0 && (
            <Alert className="mb-6 mt-6 border-yellow-600 bg-yellow-50/10 text-yellow-400">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">
                <h4 className="font-medium">Please correct the following:</h4>
                <ul className="text-sm text-yellow-300 mt-1 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}
          <form 
            ref={ref}
            onSubmit={handleSubmit}
            className="space-y-4"
            data-netlify="true"
            name="daggerheart-feedback"
            method="POST"
          >
            {/* Hidden field for Netlify form detection */}
            <input type="hidden" name="form-name" value="daggerheart-feedback" />
            
            {/* Honeypot field for spam protection */}
            <div className="hidden">
              <label htmlFor="bot-field">Don't fill this out if you're human:</label>
              <input type="text" name="bot-field" />
            </div>

            {/* Hidden fields for all optional form fields so Netlify can detect them */}
            <div className="hidden">
              {/* Bug report fields */}
              <input type="hidden" name="toolAffected" value={formData.toolAffected || ""} />
              <input type="hidden" name="stepsToReproduce" value={formData.stepsToReproduce || ""} />
              <input type="hidden" name="expectedBehavior" value={formData.expectedBehavior || ""} />
              <input type="hidden" name="actualBehavior" value={formData.actualBehavior || ""} />
              
              {/* Feature request fields */}
              <input type="hidden" name="useCase" value={formData.useCase || ""} />
              <input type="hidden" name="priorityLevel" value={formData.priorityLevel || ""} />
              
              {/* Design/UI issue fields */}
              <input type="hidden" name="specificPage" value={formData.specificPage || ""} />
              <input type="hidden" name="suggestedImprovement" value={formData.suggestedImprovement || ""} />
              
              {/* Usability problem fields */}
              <input type="hidden" name="taskAttempting" value={formData.taskAttempting || ""} />
              <input type="hidden" name="whereConfused" value={formData.whereConfused || ""} />
              
              {/* Performance issue fields */}
              <input type="hidden" name="deviceInfo" value={formData.deviceInfo || ""} />
              <input type="hidden" name="browserInfo" value={formData.browserInfo || ""} />
              
              {/* Mobile experience fields */}
              <input type="hidden" name="mobileDevice" value={formData.mobileDevice || ""} />
              <input type="hidden" name="orientationIssue" value={formData.orientationIssue || ""} />
              
              {/* Copy/text issue fields */}
              <input type="hidden" name="textLocation" value={formData.textLocation || ""} />
              <input type="hidden" name="suggestedText" value={formData.suggestedText || ""} />
            </div>

            {/* Category Selection */}
            <div className="space-y-2 pt-4">
              <label 
                htmlFor="category" 
                className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
              >
                What type of feedback do you have? *
              </label>
              <Select 
                value={formData.category || ""} 
                onValueChange={(value: FeedbackCategory) => handleFieldChange('category', value)}
                name="category"
                required
              >
                <SelectTrigger 
                  id="category"
                  className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                  aria-describedby="category-help"
                >
                  <SelectValue placeholder="Select feedback type..." />
                </SelectTrigger>
                <SelectContent className="bg-background border-2 border-gray-600 rounded-lg shadow-lg">
                  {FEEDBACK_CATEGORIES.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3 group"
                    >
                      <div>
                        <div className="font-medium">{category.label}</div>
                        <div className="text-xs text-foreground/70 group-focus:text-background/70 group-data-[highlighted]:text-background/70 mt-1">{category.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id="category-help" className="sr-only">
                Choose the type of feedback you want to provide
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
              >
                Describe your feedback *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Please provide details about your feedback..."
                className="w-full min-h-[120px] bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y"
                aria-describedby="description-help"
                required
              />
              <div id="description-help" className="sr-only">
                Provide detailed information about your feedback
              </div>
            </div>

            {/* Conditional Fields Based on Category */}
            {formData.category && (
              <div className="space-y-4 pt-4 border-t border-gray-600">
                <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-accent">
                  Additional Details
                </h3>
                
                {/* Bug Report Fields */}
                {formData.category === 'bugs' && (
                  <div className="space-y-4">
                    {/* Two column layout for smaller fields */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="toolAffected" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Which tool has the bug?
                        </label>
                        <Select 
                          value={formData.toolAffected || ""} 
                          onValueChange={(value) => handleFieldChange('toolAffected', value)}
                          name="toolAffected"
                        >
                          <SelectTrigger 
                            id="toolAffected"
                            className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                          >
                            <SelectValue placeholder="Select tool..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-2 border-gray-600 rounded-lg shadow-lg">
                            {TOOL_OPTIONS.map((tool) => (
                              <SelectItem 
                                key={tool} 
                                value={tool}
                                className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3"
                              >
                                {tool}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1"></div>
                    </div>
                    {/* Two column layout for input + textarea */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label 
                          htmlFor="expectedBehavior" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          What should happen?
                        </label>
                        <Input
                          id="expectedBehavior"
                          name="expectedBehavior"
                          value={formData.expectedBehavior || ""}
                          onChange={(e) => handleFieldChange('expectedBehavior', e.target.value)}
                          placeholder="Expected behavior..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label 
                          htmlFor="actualBehavior" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          What actually happens?
                        </label>
                        <Input
                          id="actualBehavior"
                          name="actualBehavior"
                          value={formData.actualBehavior || ""}
                          onChange={(e) => handleFieldChange('actualBehavior', e.target.value)}
                          placeholder="Actual behavior..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label 
                        htmlFor="stepsToReproduce" 
                        className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                      >
                        Steps to reproduce
                      </label>
                      <textarea
                        id="stepsToReproduce"
                        name="stepsToReproduce"
                        value={formData.stepsToReproduce || ""}
                        onChange={(e) => handleFieldChange('stepsToReproduce', e.target.value)}
                        placeholder="1. First do this... 2. Then do that..."
                        className="w-full min-h-[100px] bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y"
                      />
                    </div>
                  </div>
                )}

                {/* Feature Request Fields */}
                {formData.category === 'features' && (
                  <div className="space-y-4">
                    {/* Full width for textarea */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="useCase" 
                        className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                      >
                        What's your use case?
                      </label>
                      <textarea
                        id="useCase"
                        name="useCase"
                        value={formData.useCase || ""}
                        onChange={(e) => handleFieldChange('useCase', e.target.value)}
                        placeholder="How would this feature help your DMing?"
                        className="w-full min-h-[80px] bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y"
                      />
                    </div>
                    
                    {/* Single column for priority selection */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="priorityLevel" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Priority Level
                        </label>
                        <Select 
                          value={formData.priorityLevel || ""} 
                          onValueChange={(value: 'low' | 'medium' | 'high') => handleFieldChange('priorityLevel', value)}
                          name="priorityLevel"
                        >
                          <SelectTrigger 
                            id="priorityLevel"
                            className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                          >
                            <SelectValue placeholder="Select priority..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-2 border-gray-600 rounded-lg shadow-lg">
                            {PRIORITY_LEVELS.map((priority) => (
                              <SelectItem 
                                key={priority.value} 
                                value={priority.value}
                                className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3"
                              >
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1"></div>
                    </div>
                  </div>
                )}

                {/* Design/UI Issues Fields */}
                {formData.category === 'design' && (
                  <div className="space-y-4">
                    {/* Single column for page input */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="specificPage" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Which page/tool?
                        </label>
                        <Input
                          id="specificPage"
                          name="specificPage"
                          value={formData.specificPage || ""}
                          onChange={(e) => handleFieldChange('specificPage', e.target.value)}
                          placeholder="e.g., Monster Builder, Home Page..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="flex-1"></div>
                    </div>
                    
                    {/* Full width for textarea */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="suggestedImprovement" 
                        className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                      >
                        Suggested improvement
                      </label>
                      <textarea
                        id="suggestedImprovement"
                        name="suggestedImprovement"
                        value={formData.suggestedImprovement || ""}
                        onChange={(e) => handleFieldChange('suggestedImprovement', e.target.value)}
                        placeholder="How could this be improved?"
                        className="w-full min-h-[80px] bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y"
                      />
                    </div>
                  </div>
                )}

                {/* Usability Problems Fields */}
                {formData.category === 'usability' && (
                  <div className="space-y-4">
                    {/* Single column for task input */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="taskAttempting" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          What were you trying to do?
                        </label>
                        <Input
                          id="taskAttempting"
                          name="taskAttempting"
                          value={formData.taskAttempting || ""}
                          onChange={(e) => handleFieldChange('taskAttempting', e.target.value)}
                          placeholder="e.g., Create a monster, generate loot..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="flex-1"></div>
                    </div>
                    
                    {/* Full width for textarea */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="whereConfused" 
                        className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                      >
                        Where did you get confused?
                      </label>
                      <textarea
                        id="whereConfused"
                        name="whereConfused"
                        value={formData.whereConfused || ""}
                        onChange={(e) => handleFieldChange('whereConfused', e.target.value)}
                        placeholder="What part was confusing or unclear?"
                        className="w-full min-h-[80px] bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y"
                      />
                    </div>
                  </div>
                )}

                {/* Performance Issues Fields */}
                {formData.category === 'performance' && (
                  <div className="space-y-4">
                    {/* Two column layout for device and browser info */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="deviceInfo" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Device information
                        </label>
                        <Input
                          id="deviceInfo"
                          name="deviceInfo"
                          value={formData.deviceInfo || ""}
                          onChange={(e) => handleFieldChange('deviceInfo', e.target.value)}
                          placeholder="e.g., iPhone 12, MacBook Pro..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="browserInfo" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Browser information
                        </label>
                        <Input
                          id="browserInfo"
                          name="browserInfo"
                          value={formData.browserInfo || ""}
                          onChange={(e) => handleFieldChange('browserInfo', e.target.value)}
                          placeholder="e.g., Chrome 120, Safari 17..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Experience Fields */}
                {formData.category === 'mobile' && (
                  <div className="space-y-4">
                    {/* Two column layout for mobile selects */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="mobileDevice" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Mobile device type
                        </label>
                        <Select 
                          value={formData.mobileDevice || ""} 
                          onValueChange={(value) => handleFieldChange('mobileDevice', value)}
                          name="mobileDevice"
                        >
                          <SelectTrigger 
                            id="mobileDevice"
                            className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                          >
                            <SelectValue placeholder="Select device type..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-2 border-gray-600 rounded-lg shadow-lg">
                            {MOBILE_DEVICE_OPTIONS.map((device) => (
                              <SelectItem 
                                key={device} 
                                value={device}
                                className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3"
                              >
                                {device}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="orientationIssue" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Orientation issue
                        </label>
                        <Select 
                          value={formData.orientationIssue || ""} 
                          onValueChange={(value: 'portrait' | 'landscape' | 'both') => handleFieldChange('orientationIssue', value)}
                          name="orientationIssue"
                        >
                          <SelectTrigger 
                            id="orientationIssue"
                            className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors text-left"
                          >
                            <SelectValue placeholder="Select orientation..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-2 border-gray-600 rounded-lg shadow-lg">
                            <SelectItem value="portrait" className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3">
                              Portrait only
                            </SelectItem>
                            <SelectItem value="landscape" className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3">
                              Landscape only
                            </SelectItem>
                            <SelectItem value="both" className="text-foreground focus:bg-accent focus:text-background cursor-pointer p-3">
                              Both orientations
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Copy Issues Fields */}
                {formData.category === 'copy' && (
                  <div className="space-y-4">
                    {/* Single column for text location */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label 
                          htmlFor="textLocation" 
                          className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                        >
                          Where is the text issue?
                        </label>
                        <Input
                          id="textLocation"
                          name="textLocation"
                          value={formData.textLocation || ""}
                          onChange={(e) => handleFieldChange('textLocation', e.target.value)}
                          placeholder="e.g., Monster Builder help text..."
                          className="w-full h-12 bg-background border-2 border-gray-600 rounded-lg px-4 text-foreground focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="flex-1"></div>
                    </div>
                    
                    {/* Full width for textarea */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="suggestedText" 
                        className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide"
                      >
                        Suggested text
                      </label>
                      <textarea
                        id="suggestedText"
                        name="suggestedText"
                        value={formData.suggestedText || ""}
                        onChange={(e) => handleFieldChange('suggestedText', e.target.value)}
                        placeholder="How should it read instead?"
                        className="w-full min-h-[80px] bg-background border-2 border-gray-600 rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-y"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted || !isValid}
                className="fantasy-primary h-12 px-8 font-medium text-background bg-accent hover:bg-accent-hover focus:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby="submit-help"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submitted
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => resetForm()}
                disabled={isSubmitting}
                className="h-12 px-8 font-medium border-2 border-gray-600 text-foreground hover:border-accent/75 hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50"
              >
                {isSubmitted ? "Submit Another" : "Clear Form"}
              </Button>
            </div>
            <div id="submit-help" className="sr-only">
              Submit your feedback to help improve the tools
            </div>
          </form>
        </FantasyCardContent>
      </FantasyCard>
    )
  }
)

FeedbackForm.displayName = "FeedbackForm"

export { FeedbackForm } 