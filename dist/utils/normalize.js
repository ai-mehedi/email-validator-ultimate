"use strict";
/**
 * Email Normalization Module
 * Handles Gmail/Google dots, plus aliases, and provider-specific normalization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEmail = normalizeEmail;
exports.getCanonicalEmail = getCanonicalEmail;
exports.areEmailsEquivalent = areEmailsEquivalent;
exports.extractPlusAlias = extractPlusAlias;
// Providers that ignore dots in local part
const DOT_IGNORANT_PROVIDERS = [
    'gmail.com',
    'googlemail.com',
];
// Providers that support plus addressing
const PLUS_ADDRESSING_PROVIDERS = [
    'gmail.com',
    'googlemail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'yahoo.com',
    'protonmail.com',
    'proton.me',
    'fastmail.com',
    'icloud.com',
];
// Google domain aliases
const GOOGLE_DOMAINS = ['gmail.com', 'googlemail.com'];
/**
 * Normalize an email address
 */
function normalizeEmail(email, options = {}) {
    const { removeDots = true, removePlusAlias = true, lowercase = true, removeSubaddress = true, } = options;
    const original = email;
    let normalized = email.trim();
    // Lowercase
    if (lowercase) {
        normalized = normalized.toLowerCase();
    }
    const atIndex = normalized.lastIndexOf('@');
    if (atIndex === -1) {
        return {
            original,
            normalized,
            wasModified: original !== normalized,
            localPart: normalized,
            domain: '',
        };
    }
    let localPart = normalized.substring(0, atIndex);
    let domain = normalized.substring(atIndex + 1);
    // Normalize Google domains to gmail.com
    if (GOOGLE_DOMAINS.includes(domain)) {
        domain = 'gmail.com';
    }
    // Extract plus alias before removing
    let removedAlias;
    const plusIndex = localPart.indexOf('+');
    if (plusIndex !== -1) {
        removedAlias = localPart.substring(plusIndex + 1);
    }
    // Remove plus alias
    if (removePlusAlias || removeSubaddress) {
        if (PLUS_ADDRESSING_PROVIDERS.includes(domain) || removeSubaddress) {
            if (plusIndex !== -1) {
                localPart = localPart.substring(0, plusIndex);
            }
        }
    }
    // Remove dots for Gmail
    if (removeDots && DOT_IGNORANT_PROVIDERS.includes(domain)) {
        localPart = localPart.replace(/\./g, '');
    }
    normalized = `${localPart}@${domain}`;
    return {
        original,
        normalized,
        wasModified: original.toLowerCase() !== normalized,
        localPart,
        domain,
        removedAlias,
    };
}
/**
 * Get the canonical form of an email (most normalized version)
 */
function getCanonicalEmail(email) {
    return normalizeEmail(email).normalized;
}
/**
 * Check if two emails are equivalent (same after normalization)
 */
function areEmailsEquivalent(email1, email2) {
    return normalizeEmail(email1).normalized === normalizeEmail(email2).normalized;
}
/**
 * Extract plus alias from email
 */
function extractPlusAlias(email) {
    const atIndex = email.lastIndexOf('@');
    if (atIndex === -1)
        return null;
    const localPart = email.substring(0, atIndex);
    const plusIndex = localPart.indexOf('+');
    if (plusIndex === -1)
        return null;
    return localPart.substring(plusIndex + 1);
}
