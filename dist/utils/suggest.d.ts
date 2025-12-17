/**
 * Email typo suggestion module
 * Detects common typos in email domains and suggests corrections
 */
export interface SuggestionResult {
    hasSuggestion: boolean;
    original: string;
    suggested?: string;
    domain?: {
        original: string;
        suggested: string;
    };
}
/**
 * Get email suggestion for potential typos
 */
export declare function getEmailSuggestion(email: string): SuggestionResult;
/**
 * Check if email domain has a typo
 */
export declare function hasTypo(email: string): boolean;
/**
 * Get suggested email correction (returns original if no typo detected)
 */
export declare function getSuggestedEmail(email: string): string;
