/**
 * DNS Blacklist (DNSBL) Check Module
 * Checks if email domain or mail server IP is listed in spam blacklists
 */
export interface BlacklistResult {
    /** Domain that was checked */
    domain: string;
    /** Whether domain is blacklisted */
    isBlacklisted: boolean;
    /** List of blacklists where domain was found */
    listedIn: string[];
    /** List of blacklists that were checked */
    checkedLists: string[];
    /** Number of lists checked */
    totalChecked: number;
    /** Reputation score (0-100, higher is better) */
    reputationScore: number;
    /** MX server IPs that were checked */
    mxServers?: string[];
}
/**
 * Check domain against DNS blacklists
 */
export declare function checkBlacklist(domain: string): Promise<BlacklistResult>;
/**
 * Quick check if domain is blacklisted (boolean only)
 */
export declare function isBlacklisted(domain: string): Promise<boolean>;
/**
 * Get domain reputation score only
 */
export declare function getDomainReputationScore(domain: string): Promise<number>;
/**
 * Get list of available blacklists
 */
export declare function getAvailableBlacklists(): {
    dns: string[];
    domain: string[];
};
