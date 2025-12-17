/**
 * Email Normalization Module
 * Handles Gmail/Google dots, plus aliases, and provider-specific normalization
 */
export interface NormalizeOptions {
    /** Remove dots from local part (Gmail style) */
    removeDots?: boolean;
    /** Remove plus aliases (user+tag@domain.com -> user@domain.com) */
    removePlusAlias?: boolean;
    /** Convert to lowercase */
    lowercase?: boolean;
    /** Remove subaddressing for all providers */
    removeSubaddress?: boolean;
}
export interface NormalizeResult {
    /** Original email */
    original: string;
    /** Normalized email */
    normalized: string;
    /** Whether email was modified */
    wasModified: boolean;
    /** Local part after normalization */
    localPart: string;
    /** Domain after normalization */
    domain: string;
    /** Plus alias that was removed (if any) */
    removedAlias?: string;
}
/**
 * Normalize an email address
 */
export declare function normalizeEmail(email: string, options?: NormalizeOptions): NormalizeResult;
/**
 * Get the canonical form of an email (most normalized version)
 */
export declare function getCanonicalEmail(email: string): string;
/**
 * Check if two emails are equivalent (same after normalization)
 */
export declare function areEmailsEquivalent(email1: string, email2: string): boolean;
/**
 * Extract plus alias from email
 */
export declare function extractPlusAlias(email: string): string | null;
