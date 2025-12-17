/**
 * Email Risk Analysis Module
 * Detects suspicious patterns in email addresses that may indicate
 * spam, bot, or fraudulent accounts
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export interface RiskFactor {
    code: string;
    description: string;
    severity: RiskLevel;
    score: number;
}
export interface RiskAnalysisResult {
    riskLevel: RiskLevel;
    riskScore: number;
    factors: RiskFactor[];
    isHighRisk: boolean;
    summary: string;
}
/**
 * Analyze email for risk patterns
 */
export declare function analyzeRisk(email: string): RiskAnalysisResult;
/**
 * Quick check if email is high risk
 */
export declare function isHighRisk(email: string): boolean;
/**
 * Get risk score only
 */
export declare function getRiskScore(email: string): number;
/**
 * Get risk level description
 */
export declare function getRiskLevelDescription(level: RiskLevel): string;
