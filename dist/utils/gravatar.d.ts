/**
 * Gravatar Detection Module
 * Checks if an email address has an associated Gravatar profile
 * This can indicate a more established/legitimate email address
 */
export interface GravatarResult {
    /** Whether a Gravatar profile exists */
    hasGravatar: boolean;
    /** URL to the Gravatar image */
    gravatarUrl: string;
    /** URL to the Gravatar profile */
    profileUrl: string;
    /** Hash used for Gravatar lookup */
    hash: string;
    /** Profile data if available */
    profile?: GravatarProfile;
}
export interface GravatarProfile {
    displayName?: string;
    profileUrl?: string;
    thumbnailUrl?: string;
    aboutMe?: string;
    currentLocation?: string;
}
/**
 * Generate MD5 hash for Gravatar lookup
 */
export declare function getGravatarHash(email: string): string;
/**
 * Get Gravatar URL for an email
 */
export declare function getGravatarUrl(email: string, size?: number): string;
/**
 * Get Gravatar profile URL
 */
export declare function getGravatarProfileUrl(email: string): string;
/**
 * Check if email has a Gravatar
 */
export declare function checkGravatar(email: string): Promise<GravatarResult>;
/**
 * Quick check if Gravatar exists (boolean only)
 */
export declare function hasGravatar(email: string): Promise<boolean>;
/**
 * Get Gravatar URLs without checking if they exist
 * (Useful for displaying placeholder or default images)
 */
export declare function getGravatarUrls(email: string, size?: number): {
    imageUrl: string;
    profileUrl: string;
    hash: string;
};
