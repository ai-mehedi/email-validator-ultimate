"use strict";
/**
 * Email Validator Ultimate
 * Advanced email validation library for Node.js
 *
 * @packageDocumentation
 * @module email-validator-ultimate
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklisted = exports.checkBlacklist = exports.getGravatarUrls = exports.getGravatarProfileUrl = exports.getGravatarUrl = exports.getGravatarHash = exports.hasGravatar = exports.checkGravatar = exports.getRiskLevelDescription = exports.getRiskScore = exports.isHighRisk = exports.analyzeRisk = exports.extractPlusAlias = exports.areEmailsEquivalent = exports.getCanonicalEmail = exports.normalizeEmail = exports.createCacheKey = exports.resetGlobalCache = exports.getGlobalCache = exports.ValidationCache = exports.getSuggestedEmail = exports.hasTypo = exports.getEmailSuggestion = exports.checkSMTP = exports.getQualityScore = exports.getProvider = exports.isFreeProvider = exports.getDefaultGenericUsernames = exports.getGenericUsernames = exports.resetGenericUsernames = exports.removeGenericUsernames = exports.addGenericUsernames = exports.setGenericUsernames = exports.isGeneric = exports.getDisposableDomainsCount = exports.getWhitelistedDomains = exports.getDisposableDomains = exports.resetDisposableDomains = exports.removeFromWhitelist = exports.addToWhitelist = exports.removeDisposableDomains = exports.addDisposableDomains = exports.isDisposableDomainLocal = exports.checkDisposable = exports.isDisposable = exports.getMxHost = exports.hasMXRecord = exports.getFormatErrors = exports.validateFormat = exports.isValidFormat = void 0;
exports.VERSION = exports.getAvailableBlacklists = exports.getDomainReputationScore = void 0;
exports.validateEmail = validateEmail;
exports.validateEmails = validateEmails;
exports.quickValidate = quickValidate;
exports.validateWithPreset = validateWithPreset;
exports.validateEmailComprehensive = validateEmailComprehensive;
exports.isEmailFormatValid = isEmailFormatValid;
exports.getScoreDescription = getScoreDescription;
exports.clearCache = clearCache;
// Core validation utilities
const format_1 = require("./utils/format");
Object.defineProperty(exports, "isValidFormat", { enumerable: true, get: function () { return format_1.isValidFormat; } });
Object.defineProperty(exports, "validateFormat", { enumerable: true, get: function () { return format_1.validateFormat; } });
Object.defineProperty(exports, "getFormatErrors", { enumerable: true, get: function () { return format_1.getFormatErrors; } });
const mx_1 = require("./utils/mx");
Object.defineProperty(exports, "hasMXRecord", { enumerable: true, get: function () { return mx_1.hasMXRecord; } });
Object.defineProperty(exports, "getMxHost", { enumerable: true, get: function () { return mx_1.getMxHost; } });
const disposable_1 = require("./utils/disposable");
Object.defineProperty(exports, "isDisposable", { enumerable: true, get: function () { return disposable_1.isDisposable; } });
Object.defineProperty(exports, "checkDisposable", { enumerable: true, get: function () { return disposable_1.checkDisposable; } });
Object.defineProperty(exports, "isDisposableDomainLocal", { enumerable: true, get: function () { return disposable_1.isDisposableDomainLocal; } });
Object.defineProperty(exports, "addDisposableDomains", { enumerable: true, get: function () { return disposable_1.addDisposableDomains; } });
Object.defineProperty(exports, "removeDisposableDomains", { enumerable: true, get: function () { return disposable_1.removeDisposableDomains; } });
Object.defineProperty(exports, "addToWhitelist", { enumerable: true, get: function () { return disposable_1.addToWhitelist; } });
Object.defineProperty(exports, "removeFromWhitelist", { enumerable: true, get: function () { return disposable_1.removeFromWhitelist; } });
Object.defineProperty(exports, "resetDisposableDomains", { enumerable: true, get: function () { return disposable_1.resetDisposableDomains; } });
Object.defineProperty(exports, "getDisposableDomains", { enumerable: true, get: function () { return disposable_1.getDisposableDomains; } });
Object.defineProperty(exports, "getWhitelistedDomains", { enumerable: true, get: function () { return disposable_1.getWhitelistedDomains; } });
Object.defineProperty(exports, "getDisposableDomainsCount", { enumerable: true, get: function () { return disposable_1.getDisposableDomainsCount; } });
const generic_1 = require("./utils/generic");
Object.defineProperty(exports, "isGeneric", { enumerable: true, get: function () { return generic_1.isGeneric; } });
Object.defineProperty(exports, "setGenericUsernames", { enumerable: true, get: function () { return generic_1.setGenericUsernames; } });
Object.defineProperty(exports, "addGenericUsernames", { enumerable: true, get: function () { return generic_1.addGenericUsernames; } });
Object.defineProperty(exports, "removeGenericUsernames", { enumerable: true, get: function () { return generic_1.removeGenericUsernames; } });
Object.defineProperty(exports, "resetGenericUsernames", { enumerable: true, get: function () { return generic_1.resetGenericUsernames; } });
Object.defineProperty(exports, "getGenericUsernames", { enumerable: true, get: function () { return generic_1.getGenericUsernames; } });
Object.defineProperty(exports, "getDefaultGenericUsernames", { enumerable: true, get: function () { return generic_1.getDefaultGenericUsernames; } });
const freeProvider_1 = require("./utils/freeProvider");
Object.defineProperty(exports, "isFreeProvider", { enumerable: true, get: function () { return freeProvider_1.isFreeProvider; } });
const provider_1 = require("./utils/provider");
Object.defineProperty(exports, "getProvider", { enumerable: true, get: function () { return provider_1.getProvider; } });
const score_1 = require("./utils/score");
Object.defineProperty(exports, "getQualityScore", { enumerable: true, get: function () { return score_1.getQualityScore; } });
const smtp_1 = require("./utils/smtp");
Object.defineProperty(exports, "checkSMTP", { enumerable: true, get: function () { return smtp_1.checkSMTP; } });
// Advanced features
const suggest_1 = require("./utils/suggest");
Object.defineProperty(exports, "getEmailSuggestion", { enumerable: true, get: function () { return suggest_1.getEmailSuggestion; } });
Object.defineProperty(exports, "hasTypo", { enumerable: true, get: function () { return suggest_1.hasTypo; } });
Object.defineProperty(exports, "getSuggestedEmail", { enumerable: true, get: function () { return suggest_1.getSuggestedEmail; } });
const cache_1 = require("./utils/cache");
Object.defineProperty(exports, "ValidationCache", { enumerable: true, get: function () { return cache_1.ValidationCache; } });
Object.defineProperty(exports, "getGlobalCache", { enumerable: true, get: function () { return cache_1.getGlobalCache; } });
Object.defineProperty(exports, "resetGlobalCache", { enumerable: true, get: function () { return cache_1.resetGlobalCache; } });
Object.defineProperty(exports, "createCacheKey", { enumerable: true, get: function () { return cache_1.createCacheKey; } });
const normalize_1 = require("./utils/normalize");
Object.defineProperty(exports, "normalizeEmail", { enumerable: true, get: function () { return normalize_1.normalizeEmail; } });
Object.defineProperty(exports, "getCanonicalEmail", { enumerable: true, get: function () { return normalize_1.getCanonicalEmail; } });
Object.defineProperty(exports, "areEmailsEquivalent", { enumerable: true, get: function () { return normalize_1.areEmailsEquivalent; } });
Object.defineProperty(exports, "extractPlusAlias", { enumerable: true, get: function () { return normalize_1.extractPlusAlias; } });
const risk_1 = require("./utils/risk");
Object.defineProperty(exports, "analyzeRisk", { enumerable: true, get: function () { return risk_1.analyzeRisk; } });
Object.defineProperty(exports, "isHighRisk", { enumerable: true, get: function () { return risk_1.isHighRisk; } });
Object.defineProperty(exports, "getRiskScore", { enumerable: true, get: function () { return risk_1.getRiskScore; } });
Object.defineProperty(exports, "getRiskLevelDescription", { enumerable: true, get: function () { return risk_1.getRiskLevelDescription; } });
const gravatar_1 = require("./utils/gravatar");
Object.defineProperty(exports, "checkGravatar", { enumerable: true, get: function () { return gravatar_1.checkGravatar; } });
Object.defineProperty(exports, "hasGravatar", { enumerable: true, get: function () { return gravatar_1.hasGravatar; } });
Object.defineProperty(exports, "getGravatarHash", { enumerable: true, get: function () { return gravatar_1.getGravatarHash; } });
Object.defineProperty(exports, "getGravatarUrl", { enumerable: true, get: function () { return gravatar_1.getGravatarUrl; } });
Object.defineProperty(exports, "getGravatarProfileUrl", { enumerable: true, get: function () { return gravatar_1.getGravatarProfileUrl; } });
Object.defineProperty(exports, "getGravatarUrls", { enumerable: true, get: function () { return gravatar_1.getGravatarUrls; } });
const blacklist_1 = require("./utils/blacklist");
Object.defineProperty(exports, "checkBlacklist", { enumerable: true, get: function () { return blacklist_1.checkBlacklist; } });
Object.defineProperty(exports, "isBlacklisted", { enumerable: true, get: function () { return blacklist_1.isBlacklisted; } });
Object.defineProperty(exports, "getDomainReputationScore", { enumerable: true, get: function () { return blacklist_1.getDomainReputationScore; } });
Object.defineProperty(exports, "getAvailableBlacklists", { enumerable: true, get: function () { return blacklist_1.getAvailableBlacklists; } });
// Types
const types_1 = require("./types");
// Re-export all types
__exportStar(require("./types"), exports);
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
async function validateEmail(options) {
    const { email, fromEmail, smtpCheck = false, debug = false, timeout, skipDisposableCheck = false, cache = false, customGenericUsernames, } = options;
    // Check cache first
    if (cache) {
        const cacheKey = (0, cache_1.createCacheKey)(email, { smtpCheck, skipDisposableCheck });
        const cached = (0, cache_1.getGlobalCache)().get(cacheKey);
        if (cached) {
            return cached;
        }
    }
    const normalizedEmail = email.toLowerCase().trim();
    const [username, domain] = normalizedEmail.split("@");
    // Format validation with detailed error
    const formatResult = (0, format_1.validateFormat)(normalizedEmail);
    const formatValid = formatResult.isValid;
    const formatError = formatResult.error;
    // Get email suggestion for typos
    const suggestion = (0, suggest_1.getEmailSuggestion)(normalizedEmail);
    // MX record check
    const hasMX = domain ? await (0, mx_1.hasMXRecord)(domain) : false;
    const mxHost = domain ? await (0, mx_1.getMxHost)(domain) : null;
    // Disposable email check
    const disposable = skipDisposableCheck ? false : await (0, disposable_1.isDisposable)(normalizedEmail);
    // Generic username check
    const generic = (0, generic_1.isGeneric)(username || '', customGenericUsernames);
    // Free provider check
    const free = domain ? (0, freeProvider_1.isFreeProvider)(domain) : false;
    // Provider identification
    const provider = domain ? (0, provider_1.getProvider)(domain) : 'Unknown';
    // SMTP check (conditional)
    let smtpResult = {
        smtpSuccess: false,
        message: "SMTP check skipped",
        catchAll: false,
    };
    if (smtpCheck && hasMX && formatValid) {
        smtpResult = await (0, smtp_1.checkSMTP)(normalizedEmail, debug, fromEmail);
    }
    // Quality score calculation
    const qualityScore = (0, score_1.getQualityScore)({
        formatValid,
        hasMX,
        disposable,
        generic,
        catchAll: smtpResult.catchAll ?? false,
        smtpCheckResult: smtpCheck ? smtpResult.smtpSuccess : true,
    });
    const result = {
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
        const cacheKey = (0, cache_1.createCacheKey)(email, { smtpCheck, skipDisposableCheck });
        (0, cache_1.getGlobalCache)().set(cacheKey, result);
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
async function validateEmails(options) {
    const { emails, fromEmail, smtpCheck = false, concurrency = 5, timeout, skipDisposableCheck = false, cache = true, onProgress, } = options;
    const startTime = Date.now();
    const results = [];
    let completed = 0;
    // Process emails in batches
    const batches = [];
    for (let i = 0; i < emails.length; i += concurrency) {
        batches.push(emails.slice(i, i + concurrency));
    }
    for (const batch of batches) {
        const batchPromises = batch.map(email => validateEmail({
            email,
            fromEmail,
            smtpCheck,
            timeout,
            skipDisposableCheck,
            cache,
        }));
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
async function quickValidate(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const [, domain] = normalizedEmail.split("@");
    const formatValid = (0, format_1.isValidFormat)(normalizedEmail);
    const hasMX = domain ? await (0, mx_1.hasMXRecord)(domain) : false;
    const suggestionResult = (0, suggest_1.getEmailSuggestion)(normalizedEmail);
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
async function validateWithPreset(email, fromEmail, preset = 'standard') {
    const presetOptions = types_1.VALIDATION_PRESETS[preset];
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
async function validateEmailComprehensive(email, fromEmail) {
    const normalizedEmail = email.toLowerCase().trim();
    const [, domain] = normalizedEmail.split("@");
    // Run all checks in parallel
    const [basicValidation, risk, gravatar, blacklist,] = await Promise.all([
        validateEmail({ email, fromEmail, smtpCheck: true }),
        Promise.resolve((0, risk_1.analyzeRisk)(normalizedEmail)),
        (0, gravatar_1.checkGravatar)(normalizedEmail),
        domain ? (0, blacklist_1.checkBlacklist)(domain) : Promise.resolve({
            domain: '',
            isBlacklisted: false,
            listedIn: [],
            checkedLists: [],
            totalChecked: 0,
            reputationScore: 0,
        }),
    ]);
    const normalized = (0, normalize_1.normalizeEmail)(normalizedEmail);
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
function isEmailFormatValid(email) {
    return (0, format_1.isValidFormat)(email);
}
/**
 * Get email quality score description
 *
 * @param score - Quality score (0-100)
 * @returns Human-readable description
 */
function getScoreDescription(score) {
    if (score >= 90)
        return 'Excellent';
    if (score >= 70)
        return 'Good';
    if (score >= 50)
        return 'Fair';
    if (score >= 30)
        return 'Poor';
    return 'Very Poor';
}
/**
 * Clear validation cache
 */
function clearCache() {
    (0, cache_1.resetGlobalCache)();
}
/**
 * Library version
 */
exports.VERSION = '2.0.0';
