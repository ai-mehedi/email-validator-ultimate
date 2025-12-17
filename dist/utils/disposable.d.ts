/**
 * Disposable Email Detection Module
 * Detects temporary/disposable email addresses using external API
 * and comprehensive local fallback list with custom domain management
 */
export interface DisposableCheckResult {
    isDisposable: boolean;
    source: 'api' | 'local' | 'whitelist' | 'error';
    confidence: 'high' | 'medium' | 'low';
    error?: string;
}
/**
 * Check if email is from a disposable email service (with detailed result)
 */
export declare function checkDisposable(email: string, skipApi?: boolean): Promise<DisposableCheckResult>;
/**
 * Simple boolean check for disposable email (backward compatible)
 */
export declare function isDisposable(email: string): Promise<boolean>;
/**
 * Check domain only against local list (synchronous, no API call)
 */
export declare function isDisposableDomainLocal(domain: string): boolean;
/**
 * Add domains to the disposable list
 */
export declare function addDisposableDomains(domains: string[]): void;
/**
 * Remove domains from the disposable list
 */
export declare function removeDisposableDomains(domains: string[]): void;
/**
 * Add domains to whitelist (will never be marked as disposable)
 */
export declare function addToWhitelist(domains: string[]): void;
/**
 * Remove domains from whitelist
 */
export declare function removeFromWhitelist(domains: string[]): void;
/**
 * Reset to default disposable domains list
 */
export declare function resetDisposableDomains(): void;
/**
 * Get current disposable domains list
 */
export declare function getDisposableDomains(): string[];
/**
 * Get current whitelist
 */
export declare function getWhitelistedDomains(): string[];
/**
 * Get count of disposable domains in database
 */
export declare function getDisposableDomainsCount(): number;
