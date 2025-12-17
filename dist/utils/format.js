"use strict";
/**
 * RFC 5322 compliant email format validation
 * Validates email format with comprehensive checks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFormat = validateFormat;
exports.isValidFormat = isValidFormat;
exports.getFormatErrors = getFormatErrors;
// RFC 5322 compliant regex for email validation
const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
// Maximum email length per RFC 5321
const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_LENGTH = 64;
const MAX_DOMAIN_LENGTH = 253;
/**
 * Validates email format with detailed error reporting
 */
function validateFormat(email) {
    // Check for empty string
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'Email address is empty' };
    }
    // Check total length
    if (email.length > MAX_EMAIL_LENGTH) {
        return { isValid: false, error: `Email exceeds maximum length of ${MAX_EMAIL_LENGTH} characters` };
    }
    // Check for @ symbol
    const atIndex = email.lastIndexOf('@');
    if (atIndex === -1) {
        return { isValid: false, error: 'Email must contain @ symbol' };
    }
    const localPart = email.substring(0, atIndex);
    const domainPart = email.substring(atIndex + 1);
    // Check local part length
    if (localPart.length === 0) {
        return { isValid: false, error: 'Local part (before @) is empty' };
    }
    if (localPart.length > MAX_LOCAL_LENGTH) {
        return { isValid: false, error: `Local part exceeds maximum length of ${MAX_LOCAL_LENGTH} characters` };
    }
    // Check domain part length
    if (domainPart.length === 0) {
        return { isValid: false, error: 'Domain part (after @) is empty' };
    }
    if (domainPart.length > MAX_DOMAIN_LENGTH) {
        return { isValid: false, error: `Domain exceeds maximum length of ${MAX_DOMAIN_LENGTH} characters` };
    }
    // Check for consecutive dots
    if (email.includes('..')) {
        return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }
    // Check if local part starts or ends with dot
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return { isValid: false, error: 'Local part cannot start or end with a dot' };
    }
    // Check if domain has at least one dot (TLD required)
    if (!domainPart.includes('.')) {
        return { isValid: false, error: 'Domain must have at least one dot' };
    }
    // Check TLD length (minimum 2 characters)
    const tld = domainPart.split('.').pop() || '';
    if (tld.length < 2) {
        return { isValid: false, error: 'TLD must be at least 2 characters' };
    }
    // Final RFC 5322 regex check
    if (!EMAIL_REGEX.test(email)) {
        return { isValid: false, error: 'Email format does not match RFC 5322 standard' };
    }
    return { isValid: true };
}
/**
 * Simple boolean check for email format validity
 * For backward compatibility
 */
function isValidFormat(email) {
    return validateFormat(email).isValid;
}
/**
 * Get detailed format validation errors
 */
function getFormatErrors(email) {
    const result = validateFormat(email);
    return result.error || null;
}
