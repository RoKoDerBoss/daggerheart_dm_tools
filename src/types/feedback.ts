/**
 * TypeScript interfaces for the feedback form system
 * Used for user feedback collection on the Daggerheart DM Tools website
 */

export type FeedbackCategory = 
  | 'bugs' 
  | 'design' 
  | 'features' 
  | 'usability' 
  | 'performance' 
  | 'mobile' 
  | 'copy';

export interface FeedbackCategoryOption {
  value: FeedbackCategory;
  label: string;
  description: string;
}

export const FEEDBACK_CATEGORIES: FeedbackCategoryOption[] = [
  {
    value: 'features',
    label: 'Feature Requests',
    description: 'Suggest new features or improvements'
  },
  {
    value: 'bugs',
    label: 'Bug Report',
    description: 'Report issues, errors, or broken functionality'
  },
  {
    value: 'copy',
    label: 'Copy/Text Issues',
    description: 'Unclear text, typos, or confusing messaging'
  },
  {
    value: 'design',
    label: 'Design/UI Issues',
    description: 'Visual design problems or confusing interfaces'
  },
  {
    value: 'usability',
    label: 'Usability Problems',
    description: 'Difficulties using tools or confusing workflows'
  },
  {
    value: 'performance',
    label: 'Performance Issues',
    description: 'Slow loading times or laggy interactions'
  },
  {
    value: 'mobile',
    label: 'Mobile Experience',
    description: 'Problems using tools on mobile devices'
  }
];

export interface FeedbackFormData {
  category: FeedbackCategory;
  
  // Common fields for all categories
  description: string;
  
  // Conditional fields based on category
  // Bug reports
  toolAffected?: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  
  // Feature requests
  useCase?: string;
  priorityLevel?: 'low' | 'medium' | 'high';
  
  // Design/UI issues
  specificPage?: string;
  suggestedImprovement?: string;
  
  // Usability problems
  taskAttempting?: string;
  whereConfused?: string;
  
  // Performance issues
  deviceInfo?: string;
  browserInfo?: string;
  
  // Mobile experience
  mobileDevice?: string;
  orientationIssue?: 'portrait' | 'landscape' | 'both';
  
  // Copy issues
  textLocation?: string;
  suggestedText?: string;
}

export interface FeedbackFormValidation {
  category: boolean;
  description: boolean;
  toolAffected?: boolean;
  stepsToReproduce?: boolean;
  expectedBehavior?: boolean;
  actualBehavior?: boolean;
  useCase?: boolean;
  specificPage?: boolean;
  taskAttempting?: boolean;
  deviceInfo?: boolean;
  mobileDevice?: boolean;
  textLocation?: boolean;
}

export interface FeedbackFormState {
  data: Partial<FeedbackFormData>;
  validation: Partial<FeedbackFormValidation>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export type FeedbackFormAction = 
  | { type: 'SET_FIELD'; field: keyof FeedbackFormData; value: any }
  | { type: 'SET_VALIDATION'; field: keyof FeedbackFormValidation; isValid: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_SUBMIT_ERROR'; error: string | null }
  | { type: 'SET_SUBMIT_SUCCESS'; success: boolean }
  | { type: 'RESET_FORM' };

/**
 * Tool options for bug reports
 */
export const TOOL_OPTIONS = [
  'Monster Builder',
  'Loot Generator', 
  'Battle Points Calculator',
  'Fear Tracker',
  'Navigation/Menu',
  'Home Page',
  'Other'
];

/**
 * Priority levels for feature requests
 */
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low - Nice to have' },
  { value: 'medium', label: 'Medium - Would improve workflow' },
  { value: 'high', label: 'High - Essential for my use case' }
] as const;

/**
 * Mobile device categories
 */
export const MOBILE_DEVICE_OPTIONS = [
  'iPhone (small screen)',
  'iPhone (large screen)', 
  'Android phone',
  'iPad/tablet',
  'Other mobile device'
]; 