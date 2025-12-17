/**
 * Type definitions for email-validator-ultimate
 */

/**
 * Options for single email validation
 */
export interface ValidateOptions {
  /** Email address to validate */
  email: string;
  /** Sender email address (required for SMTP check) */
  fromEmail: string;
  /** Enable SMTP inbox validation (default: false) */
  smtpCheck?: boolean;
  /** Enable SMTP debug logging (default: false) */
  debug?: boolean;
  /** SMTP connection timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Skip disposable email API check (default: false) */
  skipDisposableCheck?: boolean;
  /** Enable result caching (default: false) */
  cache?: boolean;
  /** Custom list of generic usernames to check */
  customGenericUsernames?: string[];
}

/**
 * Options for batch email validation
 */
export interface BatchValidateOptions {
  /** Array of email addresses to validate */
  emails: string[];
  /** Sender email address (required for SMTP check) */
  fromEmail: string;
  /** Enable SMTP inbox validation (default: false) */
  smtpCheck?: boolean;
  /** Maximum concurrent validations (default: 5) */
  concurrency?: number;
  /** SMTP connection timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Skip disposable email API check (default: false) */
  skipDisposableCheck?: boolean;
  /** Enable result caching (default: true for batch) */
  cache?: boolean;
  /** Callback for progress updates */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * SMTP check result
 */
export interface SMTPResult {
  /** Whether SMTP check succeeded */
  smtpSuccess: boolean;
  /** Whether inbox exists */
  inboxExists?: boolean;
  /** Whether domain is catch-all */
  catchAll: boolean;
  /** Descriptive message */
  message: string;
}

/**
 * Email suggestion result
 */
export interface SuggestionInfo {
  /** Whether a suggestion is available */
  hasSuggestion: boolean;
  /** Suggested corrected email */
  suggested?: string;
  /** Domain correction details */
  domain?: {
    original: string;
    suggested: string;
  };
}

/**
 * Single email validation result
 */
export interface ValidationResult {
  /** Original email address (normalized to lowercase) */
  email: string;
  /** Username part (before @) */
  username: string;
  /** Domain part (after @) */
  domain: string;
  /** Whether email format is valid (RFC 5322) */
  formatValid: boolean;
  /** Format validation error message (if invalid) */
  formatError?: string;
  /** Whether domain has MX records */
  hasMX: boolean;
  /** Whether email is from disposable service */
  isDisposable: boolean;
  /** Whether username is generic/role-based */
  isGeneric: boolean;
  /** Whether email is from free provider */
  isFree: boolean;
  /** Email provider name */
  provider: string;
  /** Primary MX record hostname */
  mxRecord: string | null;
  /** SMTP validation result */
  canReceiveEmail: SMTPResult;
  /** Email quality score (0-100) */
  qualityScore: number;
  /** Typo suggestion (if detected) */
  suggestion?: SuggestionInfo;
}

/**
 * Batch validation result
 */
export interface BatchValidationResult {
  /** Total emails processed */
  total: number;
  /** Number of valid emails */
  valid: number;
  /** Number of invalid emails */
  invalid: number;
  /** Processing time in milliseconds */
  processingTime: number;
  /** Individual results */
  results: ValidationResult[];
  /** Summary statistics */
  summary: {
    validFormat: number;
    invalidFormat: number;
    hasMX: number;
    noMX: number;
    disposable: number;
    generic: number;
    freeProvider: number;
    averageScore: number;
  };
}

/**
 * Quality score breakdown
 */
export interface QualityScoreOptions {
  formatValid: boolean;
  hasMX: boolean;
  disposable: boolean;
  generic: boolean;
  catchAll: boolean;
  smtpCheckResult: boolean;
}

/**
 * Validation preset types
 */
export type ValidationPreset = 'quick' | 'standard' | 'thorough';

/**
 * Preset configurations
 */
export const VALIDATION_PRESETS: Record<ValidationPreset, Partial<ValidateOptions>> = {
  quick: {
    smtpCheck: false,
    skipDisposableCheck: true,
    cache: true,
  },
  standard: {
    smtpCheck: false,
    skipDisposableCheck: false,
    cache: true,
  },
  thorough: {
    smtpCheck: true,
    skipDisposableCheck: false,
    cache: false,
  },
};
