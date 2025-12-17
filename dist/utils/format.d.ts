/**
 * RFC 5322 compliant email format validation
 * Validates email format with comprehensive checks
 */
export interface FormatValidationResult {
    isValid: boolean;
    error?: string;
}
/**
 * Validates email format with detailed error reporting
 */
export declare function validateFormat(email: string): FormatValidationResult;
/**
 * Simple boolean check for email format validity
 * For backward compatibility
 */
export declare function isValidFormat(email: string): boolean;
/**
 * Get detailed format validation errors
 */
export declare function getFormatErrors(email: string): string | null;
