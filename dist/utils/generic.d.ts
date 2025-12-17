/**
 * Generic/Role-based username detection
 * Identifies common role-based email addresses that are typically
 * shared mailboxes rather than personal addresses
 */
/**
 * Check if username is a generic/role-based address
 */
export declare function isGeneric(username: string, customList?: string[]): boolean;
/**
 * Set custom generic usernames list (replaces default)
 */
export declare function setGenericUsernames(usernames: string[]): void;
/**
 * Add usernames to the generic list
 */
export declare function addGenericUsernames(usernames: string[]): void;
/**
 * Remove usernames from the generic list
 */
export declare function removeGenericUsernames(usernames: string[]): void;
/**
 * Reset to default generic usernames
 */
export declare function resetGenericUsernames(): void;
/**
 * Get current generic usernames list
 */
export declare function getGenericUsernames(): string[];
/**
 * Get the default generic usernames list
 */
export declare function getDefaultGenericUsernames(): string[];
