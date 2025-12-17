/**
 * Email Validator Ultimate
 * Advanced email validation library for Node.js
 *
 * @packageDocumentation
 * @module email-validator-ultimate
 */
import { isValidFormat, validateFormat, getFormatErrors } from "./utils/format";
import { hasMXRecord, getMxHost } from "./utils/mx";
import { isDisposable, checkDisposable, isDisposableDomainLocal, addDisposableDomains, removeDisposableDomains, addToWhitelist, removeFromWhitelist, resetDisposableDomains, getDisposableDomains, getWhitelistedDomains, getDisposableDomainsCount } from "./utils/disposable";
import { isGeneric, setGenericUsernames, addGenericUsernames, removeGenericUsernames, resetGenericUsernames, getGenericUsernames, getDefaultGenericUsernames } from "./utils/generic";
import { isFreeProvider } from "./utils/freeProvider";
import { getProvider } from "./utils/provider";
import { getQualityScore } from "./utils/score";
import { checkSMTP } from "./utils/smtp";
import { getEmailSuggestion, hasTypo, getSuggestedEmail } from "./utils/suggest";
import { ValidationCache, getGlobalCache, resetGlobalCache, createCacheKey } from "./utils/cache";
import { normalizeEmail, getCanonicalEmail, areEmailsEquivalent, extractPlusAlias } from "./utils/normalize";
import { analyzeRisk, isHighRisk, getRiskScore, getRiskLevelDescription } from "./utils/risk";
import { checkGravatar, hasGravatar, getGravatarHash, getGravatarUrl, getGravatarProfileUrl, getGravatarUrls } from "./utils/gravatar";
import { checkBlacklist, isBlacklisted, getDomainReputationScore, getAvailableBlacklists } from "./utils/blacklist";
import { ValidateOptions, BatchValidateOptions, ValidationResult, BatchValidationResult, ValidationPreset } from "./types";
export * from "./types";
export type { NormalizeOptions, NormalizeResult } from "./utils/normalize";
export type { RiskLevel, RiskFactor, RiskAnalysisResult } from "./utils/risk";
export type { GravatarResult, GravatarProfile } from "./utils/gravatar";
export type { BlacklistResult } from "./utils/blacklist";
export type { DisposableCheckResult } from "./utils/disposable";
export type { SuggestionResult } from "./utils/suggest";
export type { FormatValidationResult } from "./utils/format";
export type { CacheOptions } from "./utils/cache";
export { isValidFormat, validateFormat, getFormatErrors, hasMXRecord, getMxHost, isDisposable, checkDisposable, isDisposableDomainLocal, addDisposableDomains, removeDisposableDomains, addToWhitelist, removeFromWhitelist, resetDisposableDomains, getDisposableDomains, getWhitelistedDomains, getDisposableDomainsCount, isGeneric, setGenericUsernames, addGenericUsernames, removeGenericUsernames, resetGenericUsernames, getGenericUsernames, getDefaultGenericUsernames, isFreeProvider, getProvider, getQualityScore, checkSMTP, getEmailSuggestion, hasTypo, getSuggestedEmail, ValidationCache, getGlobalCache, resetGlobalCache, createCacheKey, normalizeEmail, getCanonicalEmail, areEmailsEquivalent, extractPlusAlias, analyzeRisk, isHighRisk, getRiskScore, getRiskLevelDescription, checkGravatar, hasGravatar, getGravatarHash, getGravatarUrl, getGravatarProfileUrl, getGravatarUrls, checkBlacklist, isBlacklisted, getDomainReputationScore, getAvailableBlacklists, };
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
export declare function validateEmail(options: ValidateOptions): Promise<ValidationResult>;
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
export declare function validateEmails(options: BatchValidateOptions): Promise<BatchValidationResult>;
/**
 * Quick email validation (format + MX only, no API calls)
 * Fastest validation method for basic checks
 *
 * @param email - Email address to validate
 * @returns Promise resolving to quick validation result
 */
export declare function quickValidate(email: string): Promise<{
    email: string;
    isValid: boolean;
    formatValid: boolean;
    hasMX: boolean;
    suggestion?: string;
}>;
/**
 * Validate email using a preset configuration
 *
 * @param email - Email address to validate
 * @param fromEmail - Sender email for SMTP check
 * @param preset - Validation preset ('quick', 'standard', 'thorough')
 * @returns Promise resolving to validation result
 */
export declare function validateWithPreset(email: string, fromEmail: string, preset?: ValidationPreset): Promise<ValidationResult>;
/**
 * Comprehensive email validation with all checks
 * Includes risk analysis, Gravatar check, and blacklist check
 *
 * @param email - Email address to validate
 * @param fromEmail - Sender email for SMTP check
 * @returns Promise resolving to comprehensive validation result
 */
export declare function validateEmailComprehensive(email: string, fromEmail: string): Promise<ValidationResult & {
    risk: ReturnType<typeof analyzeRisk>;
    gravatar: Awaited<ReturnType<typeof checkGravatar>>;
    blacklist: Awaited<ReturnType<typeof checkBlacklist>>;
    normalized: ReturnType<typeof normalizeEmail>;
}>;
/**
 * Check if email format is valid (synchronous)
 *
 * @param email - Email address to check
 * @returns Whether the email format is valid
 */
export declare function isEmailFormatValid(email: string): boolean;
/**
 * Get email quality score description
 *
 * @param score - Quality score (0-100)
 * @returns Human-readable description
 */
export declare function getScoreDescription(score: number): string;
/**
 * Clear validation cache
 */
export declare function clearCache(): void;
/**
 * Library version
 */
export declare const VERSION = "2.0.0";
