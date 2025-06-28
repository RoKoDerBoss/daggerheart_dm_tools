import { useState, useCallback } from 'react'
import { FeedbackFormData, FeedbackCategory } from '@/types/feedback'

interface UseFeedbackFormOptions {
  onSubmit?: (data: Partial<FeedbackFormData>) => Promise<void>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UseFeedbackFormReturn {
  // Form state
  formData: Partial<FeedbackFormData>
  isSubmitting: boolean
  isSubmitted: boolean
  submitError: string | null
  
  // Form actions
  handleFieldChange: (field: keyof FeedbackFormData, value: any) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
  clearError: () => void
  
  // Validation
  isValid: boolean
  errors: Record<string, string>
}

export const useFeedbackForm = (options: UseFeedbackFormOptions = {}): UseFeedbackFormReturn => {
  const { onSubmit, onSuccess, onError } = options

  // Form state
  const [formData, setFormData] = useState<Partial<FeedbackFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  // Field change handler
  const handleFieldChange = useCallback((field: keyof FeedbackFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear field-specific error when user starts typing (only if they've attempted submit)
    if (hasAttemptedSubmit && errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null)
    }
  }, [errors, submitError, hasAttemptedSubmit])

  // Form validation
  const validateForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.category) {
      newErrors.category = 'Please select a feedback category'
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Please provide a description of your feedback'
    }

    // Category-specific validation
    if (formData.category === 'bugs') {
      if (!formData.toolAffected) {
        newErrors.toolAffected = 'Please specify which tool has the bug'
      }
    }

    if (formData.category === 'features') {
      if (!formData.useCase?.trim()) {
        newErrors.useCase = 'Please describe your use case for this feature'
      }
    }

    if (formData.category === 'design') {
      if (!formData.specificPage?.trim()) {
        newErrors.specificPage = 'Please specify which page or section has the design issue'
      }
    }

    if (formData.category === 'copy') {
      if (!formData.textLocation?.trim()) {
        newErrors.textLocation = 'Please specify where the text issue is located'
      }
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }, [formData])

  // Check if form is valid (for submit button state)
  const { isValid } = validateForm()

  // Submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark that user has attempted submit
    setHasAttemptedSubmit(true)
    
    // Clear previous errors
    setSubmitError(null)
    setErrors({})
    
    // Validate form
    const validation = validateForm()
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Handle Netlify Forms submission
      const form = e.target as HTMLFormElement
      const formDataToSubmit = new FormData(form)
      
      // Add form data that might not be in form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSubmit.set(key, String(value))
        }
      })

      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSubmit as any).toString()
      })

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status} ${response.statusText}`)
      }

      // Call custom onSubmit if provided
      if (onSubmit) {
        await onSubmit(formData)
      }

      // Success handling
      setIsSubmitted(true)
      if (onSuccess) {
        onSuccess()
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setSubmitError(errorMessage)
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage))
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, onSubmit, onSuccess, onError])

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({})
    setIsSubmitting(false)
    setIsSubmitted(false)
    setSubmitError(null)
    setErrors({})
    setHasAttemptedSubmit(false)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setSubmitError(null)
  }, [])

  return {
    // Form state
    formData,
    isSubmitting,
    isSubmitted,
    submitError,
    
    // Form actions
    handleFieldChange,
    handleSubmit,
    resetForm,
    clearError,
    
    // Validation
    isValid,
    errors
  }
} 