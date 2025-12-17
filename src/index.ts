/**
 * Email Validator Ultimate
 * Advanced email validation library for Node.js
 *
 * @packageDocumentation
 * @module email-validator-ultimate
 */

// Core validation utilities
import { isValidFormat, validateFormat, getFormatErrors } from "./utils/format";
import { hasMXRecord, getMxHost } from "./utils/mx";
import {
  isDisposable,
  checkDisposable,
  isDisposableDomainLocal,
  addDisposableDomains,
  removeDisposableDomains,
  addToWhitelist,
  removeFromWhitelist,
  resetDisposableDomains,
  getDisposableDomains,
  getWhitelistedDomains,
  getDisposableDomainsCount,
} from "./utils/disposable";
import {
  isGeneric,
  setGenericUsernames,
  addGenericUsernames,
  removeGenericUsernames,
  resetGenericUsernames,
  getGenericUsernames,
  getDefaultGenericUsernames,
} from "./utils/generic";
import { isFreeProvider } from "./utils/freeProvider";
import { getProvider } from "./utils/provider";
import { getQualityScore } from "./utils/score";
import { checkSMTP } from "./utils/smtp";

// Advanced features
import {
  getEmailSuggestion,
  hasTypo,
  getSuggestedEmail,
} from "./utils/suggest";
import {
  ValidationCache,
  getGlobalCache,
  resetGlobalCache,
  createCacheKey,
} from "./utils/cache";
import {
  normalizeEmail,
  getCanonicalEmail,
  areEmailsEquivalent,
  extractPlusAlias,
} from "./utils/normalize";
import {
  analyzeRisk,
  isHighRisk,
  getRiskScore,
  getRiskLevelDescription,
} from "./utils/risk";
import {
  checkGravatar,
  hasGravatar,
  getGravatarHash,
  getGravatarUrl,
  getGravatarProfileUrl,
  getGravatarUrls,
} from "./utils/gravatar";
import {
  checkBlacklist,
  isBlacklisted,
  getDomainReputationScore,
  getAvailableBlacklists,
} from "./utils/blacklist";

// Types
import {
  ValidateOptions,
  BatchValidateOptions,
  ValidationResult,
  BatchValidationResult,
  SMTPResult,
  ValidationPreset,
  VALIDATION_PRESETS,
} from "./types";

// Re-export all types
export * from "./types";

// Re-export type definitions from modules
export type { NormalizeOptions, NormalizeResult } from "./utils/normalize";
export type { RiskLevel, RiskFactor, RiskAnalysisResult } from "./utils/risk";
export type { GravatarResult, GravatarProfile } from "./utils/gravatar";
export type { BlacklistResult } from "./utils/blacklist";
export type { DisposableCheckResult } from "./utils/disposable";
export type { SuggestionResult } from "./utils/suggest";
export type { FormatValidationResult } from "./utils/format";
export type { CacheOptions } from "./utils/cache";

// Re-export all utilities for advanced usage
export {
  // Format validation
  isValidFormat,
  validateFormat,
  getFormatErrors,

  // MX record
  hasMXRecord,
  getMxHost,

  // Disposable email detection
  isDisposable,
  checkDisposable,
  isDisposableDomainLocal,
  addDisposableDomains,
  removeDisposableDomains,
  addToWhitelist,
  removeFromWhitelist,
  resetDisposableDomains,
  getDisposableDomains,
  getWhitelistedDomains,
  getDisposableDomainsCount,

  // Generic username detection
  isGeneric,
  setGenericUsernames,
  addGenericUsernames,
  removeGenericUsernames,
  resetGenericUsernames,
  getGenericUsernames,
  getDefaultGenericUsernames,

  // Provider detection
  isFreeProvider,
  getProvider,

  // Quality scoring
  getQualityScore,

  // SMTP validation
  checkSMTP,

  // Typo suggestions
  getEmailSuggestion,
  hasTypo,
  getSuggestedEmail,

  // Caching
  ValidationCache,
  getGlobalCache,
  resetGlobalCache,
  createCacheKey,

  // Email normalization
  normalizeEmail,
  getCanonicalEmail,
  areEmailsEquivalent,
  extractPlusAlias,

  // Risk analysis
  analyzeRisk,
  isHighRisk,
  getRiskScore,
  getRiskLevelDescription,

  // Gravatar
  checkGravatar,
  hasGravatar,
  getGravatarHash,
  getGravatarUrl,
  getGravatarProfileUrl,
  getGravatarUrls,

  // Blacklist
  checkBlacklist,
  isBlacklisted,
  getDomainReputationScore,
  getAvailableBlacklists,
};

/**
 * Validate a single email address with comprehensive checks
 *
 * @param options - Validation options
 * @returns Promise resolving to validation result
 *
 * @example
 * ```typescript
 * const result = await validateEmail({
 *   email: 'user@gmail.com',
 *   fromEmail: 'noreply@myapp.com',
 *   smtpCheck: true
 * });
 * console.log(result.qualityScore); // 100
 * ```
 */
export async function validateEmail(options: ValidateOptions): Promise<ValidationResult> {
  const {
    email,
    fromEmail,
    smtpCheck = false,
    debug = false,
    timeout,
    skipDisposableCheck = false,
    cache = false,
    customGenericUsernames,
  } = options;

  // Check cache first
  if (cache) {
    const cacheKey = createCacheKey(email, { smtpCheck, skipDisposableCheck });
    const cached = getGlobalCache<ValidationResult>().get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const normalizedEmail = email.toLowerCase().trim();
  const [username, domain] = normalizedEmail.split("@");

  // Format validation with detailed error
  const formatResult = validateFormat(normalizedEmail);
  const formatValid = formatResult.isValid;
  const formatError = formatResult.error;

  // Get email suggestion for typos
  const suggestion = getEmailSuggestion(normalizedEmail);

  // MX record check
  const hasMX = domain ? await hasMXRecord(domain) : false;
  const mxHost = domain ? await getMxHost(domain) : null;

  // Disposable email check
  const disposable = skipDisposableCheck ? false : await isDisposable(normalizedEmail);

  // Generic username check
  const generic = isGeneric(username || '', customGenericUsernames);

  // Free provider check
  const free = domain ? isFreeProvider(domain) : false;

  // Provider identification
  const provider = domain ? getProvider(domain) : 'Unknown';

  // SMTP check (conditional)
  let smtpResult: SMTPResult = {
    smtpSuccess: false,
    message: "SMTP check skipped",
    catchAll: false,
  };

  if (smtpCheck && hasMX && formatValid) {
    smtpResult = await checkSMTP(normalizedEmail, debug, fromEmail);
  }

  // Quality score calculation
  const qualityScore = getQualityScore({
    formatValid,
    hasMX,
    disposable,
    generic,
    catchAll: smtpResult.catchAll ?? false,
    smtpCheckResult: smtpCheck ? smtpResult.smtpSuccess : true,
  });

  const result: ValidationResult = {
    email: normalizedEmail,
    username: username || '',
    domain: domain || '',
    formatValid,
    formatError,
    hasMX,
    isDisposable: disposable,
    isGeneric: generic,
    isFree: free,
    provider,
    mxRecord: mxHost,
    canReceiveEmail: smtpResult,
    qualityScore,
    suggestion: suggestion.hasSuggestion ? suggestion : undefined,
  };

  // Cache result
  if (cache) {
    const cacheKey = createCacheKey(email, { smtpCheck, skipDisposableCheck });
    getGlobalCache<ValidationResult>().set(cacheKey, result);
  }

  return result;
}

/**
 * Validate multiple emails with concurrency control
 *
 * @param options - Batch validation options
 * @returns Promise resolving to batch validation result
 *
 * @example
 * ```typescript
 * const result = await validateEmails({
 *   emails: ['user1@gmail.com', 'user2@yahoo.com'],
 *   fromEmail: 'noreply@myapp.com',
 *   concurrency: 10,
 *   onProgress: (completed, total) => console.log(`${completed}/${total}`)
 * });
 * console.log(`Valid: ${result.valid}/${result.total}`);
 * ```
 */
export async function validateEmails(options: BatchValidateOptions): Promise<BatchValidationResult> {
  const {
    emails,
    fromEmail,
    smtpCheck = false,
    concurrency = 5,
    timeout,
    skipDisposableCheck = false,
    cache = true,
    onProgress,
  } = options;

  const startTime = Date.now();
  const results: ValidationResult[] = [];
  let completed = 0;

  // Process emails in batches
  const batches: string[][] = [];
  for (let i = 0; i < emails.length; i += concurrency) {
    batches.push(emails.slice(i, i + concurrency));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(email =>
      validateEmail({
        email,
        fromEmail,
        smtpCheck,
        timeout,
        skipDisposableCheck,
        cache,
      })
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    completed += batch.length;
    if (onProgress) {
      onProgress(completed, emails.length);
    }
  }

  // Calculate summary statistics
  const summary = {
    validFormat: results.filter(r => r.formatValid).length,
    invalidFormat: results.filter(r => !r.formatValid).length,
    hasMX: results.filter(r => r.hasMX).length,
    noMX: results.filter(r => !r.hasMX).length,
    disposable: results.filter(r => r.isDisposable).length,
    generic: results.filter(r => r.isGeneric).length,
    freeProvider: results.filter(r => r.isFree).length,
    averageScore: results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length)
      : 0,
  };

  const validCount = results.filter(r => r.formatValid && r.hasMX && !r.isDisposable).length;

  return {
    total: emails.length,
    valid: validCount,
    invalid: emails.length - validCount,
    processingTime: Date.now() - startTime,
    results,
    summary,
  };
}

/**
 * Quick email validation (format + MX only, no API calls)
 * Fastest validation method for basic checks
 *
 * @param email - Email address to validate
 * @returns Promise resolving to quick validation result
 */
export async function quickValidate(email: string): Promise<{
  email: string;
  isValid: boolean;
  formatValid: boolean;
  hasMX: boolean;
  suggestion?: string;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const [, domain] = normalizedEmail.split("@");

  const formatValid = isValidFormat(normalizedEmail);
  const hasMX = domain ? await hasMXRecord(domain) : false;
  const suggestionResult = getEmailSuggestion(normalizedEmail);

  return {
    email: normalizedEmail,
    isValid: formatValid && hasMX,
    formatValid,
    hasMX,
    suggestion: suggestionResult.suggested,
  };
}

/**
 * Validate email using a preset configuration
 *
 * @param email - Email address to validate
 * @param fromEmail - Sender email for SMTP check
 * @param preset - Validation preset ('quick', 'standard', 'thorough')
 * @returns Promise resolving to validation result
 */
export async function validateWithPreset(
  email: string,
  fromEmail: string,
  preset: ValidationPreset = 'standard'
): Promise<ValidationResult> {
  const presetOptions = VALIDATION_PRESETS[preset];
  return validateEmail({
    email,
    fromEmail,
    ...presetOptions,
  });
}

/**
 * Comprehensive email validation with all checks
 * Includes risk analysis, Gravatar check, and blacklist check
 *
 * @param email - Email address to validate
 * @param fromEmail - Sender email for SMTP check
 * @returns Promise resolving to comprehensive validation result
 */
export async function validateEmailComprehensive(
  email: string,
  fromEmail: string
): Promise<ValidationResult & {
  risk: ReturnType<typeof analyzeRisk>;
  gravatar: Awaited<ReturnType<typeof checkGravatar>>;
  blacklist: Awaited<ReturnType<typeof checkBlacklist>>;
  normalized: ReturnType<typeof normalizeEmail>;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const [, domain] = normalizedEmail.split("@");

  // Run all checks in parallel
  const [
    basicValidation,
    risk,
    gravatar,
    blacklist,
  ] = await Promise.all([
    validateEmail({ email, fromEmail, smtpCheck: true }),
    Promise.resolve(analyzeRisk(normalizedEmail)),
    checkGravatar(normalizedEmail),
    domain ? checkBlacklist(domain) : Promise.resolve({
      domain: '',
      isBlacklisted: false,
      listedIn: [],
      checkedLists: [],
      totalChecked: 0,
      reputationScore: 0,
    }),
  ]);

  const normalized = normalizeEmail(normalizedEmail);

  return {
    ...basicValidation,
    risk,
    gravatar,
    blacklist,
    normalized,
  };
}

/**
 * Check if email format is valid (synchronous)
 *
 * @param email - Email address to check
 * @returns Whether the email format is valid
 */
export function isEmailFormatValid(email: string): boolean {
  return isValidFormat(email);
}

/**
 * Get email quality score description
 *
 * @param score - Quality score (0-100)
 * @returns Human-readable description
 */
export function getScoreDescription(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Very Poor';
}

/**
 * Clear validation cache
 */
export function clearCache(): void {
  resetGlobalCache();
}

/**
 * Library version
 */
export const VERSION = '2.0.0';
