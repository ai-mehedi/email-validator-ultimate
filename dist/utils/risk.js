"use strict";
/**
 * Email Risk Analysis Module
 * Detects suspicious patterns in email addresses that may indicate
 * spam, bot, or fraudulent accounts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRisk = analyzeRisk;
exports.isHighRisk = isHighRisk;
exports.getRiskScore = getRiskScore;
exports.getRiskLevelDescription = getRiskLevelDescription;
// Keyboard patterns to detect
const KEYBOARD_PATTERNS = [
    'qwerty', 'qwertz', 'azerty', 'asdf', 'zxcv', 'qazwsx',
    '1234', '12345', '123456', '1234567', '12345678', '123456789',
    'abcd', 'abcde', 'abcdef',
    '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
    'aaaa', 'bbbb', 'cccc', 'dddd', 'eeee',
    'test', 'demo', 'sample', 'example', 'fake', 'temp', 'tmp',
];
// Suspicious words that may indicate fake accounts
const SUSPICIOUS_WORDS = [
    'noreply', 'no-reply', 'donotreply', 'do-not-reply',
    'spam', 'junk', 'trash', 'disposable', 'throwaway',
    'fake', 'temp', 'temporary', 'test', 'testing',
    'admin', 'administrator', 'root', 'system',
    'null', 'void', 'none', 'anonymous', 'anon',
    'xxx', 'yyy', 'zzz', 'aaa', 'bbb',
];
// Regex patterns for detection
const PATTERNS = {
    // More than 4 consecutive identical characters
    consecutiveChars: /(.)\1{4,}/i,
    // Random-looking string (many consonants together)
    randomConsonants: /[bcdfghjklmnpqrstvwxz]{5,}/i,
    // Too many numbers at the end
    numbersAtEnd: /\d{4,}$/,
    // Starts with numbers
    startsWithNumbers: /^\d+/,
    // All numbers in local part
    allNumbers: /^\d+@/,
    // Very short local part
    tooShort: /^.{1,2}@/,
    // Very long local part
    tooLong: /^.{40,}@/,
    // Multiple dots in a row (already invalid, but check anyway)
    multipleDots: /\.{2,}/,
    // Suspicious TLD patterns
    suspiciousTld: /\.(xyz|top|click|link|work|date|racing|download|stream|gdn|men|loan|win|bid)$/i,
    // UUID-like pattern
    uuidLike: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
    // Hash-like pattern (32+ hex chars)
    hashLike: /^[a-f0-9]{32,}@/i,
    // Mixed case that looks random
    randomMixedCase: /([A-Z][a-z]){4,}|([a-z][A-Z]){4,}/,
};
/**
 * Analyze email for risk patterns
 */
function analyzeRisk(email) {
    const factors = [];
    let totalScore = 0;
    const atIndex = email.lastIndexOf('@');
    if (atIndex === -1) {
        return {
            riskLevel: 'critical',
            riskScore: 100,
            factors: [{ code: 'INVALID_FORMAT', description: 'Invalid email format', severity: 'critical', score: 100 }],
            isHighRisk: true,
            summary: 'Invalid email format',
        };
    }
    const localPart = email.substring(0, atIndex).toLowerCase();
    const domain = email.substring(atIndex + 1).toLowerCase();
    // Check keyboard patterns
    for (const pattern of KEYBOARD_PATTERNS) {
        if (localPart.includes(pattern)) {
            factors.push({
                code: 'KEYBOARD_PATTERN',
                description: `Contains keyboard pattern: "${pattern}"`,
                severity: 'medium',
                score: 15,
            });
            totalScore += 15;
            break; // Only count once
        }
    }
    // Check suspicious words
    for (const word of SUSPICIOUS_WORDS) {
        if (localPart.includes(word)) {
            factors.push({
                code: 'SUSPICIOUS_WORD',
                description: `Contains suspicious word: "${word}"`,
                severity: 'medium',
                score: 20,
            });
            totalScore += 20;
            break;
        }
    }
    // Check consecutive characters
    if (PATTERNS.consecutiveChars.test(localPart)) {
        factors.push({
            code: 'CONSECUTIVE_CHARS',
            description: 'Contains 5+ consecutive identical characters',
            severity: 'high',
            score: 25,
        });
        totalScore += 25;
    }
    // Check random consonants
    if (PATTERNS.randomConsonants.test(localPart)) {
        factors.push({
            code: 'RANDOM_STRING',
            description: 'Appears to be randomly generated',
            severity: 'high',
            score: 30,
        });
        totalScore += 30;
    }
    // Check numbers at end
    if (PATTERNS.numbersAtEnd.test(localPart)) {
        factors.push({
            code: 'NUMBERS_AT_END',
            description: 'Has 4+ numbers at the end',
            severity: 'low',
            score: 10,
        });
        totalScore += 10;
    }
    // Check starts with numbers
    if (PATTERNS.startsWithNumbers.test(localPart)) {
        factors.push({
            code: 'STARTS_WITH_NUMBERS',
            description: 'Local part starts with numbers',
            severity: 'low',
            score: 5,
        });
        totalScore += 5;
    }
    // Check all numbers
    if (PATTERNS.allNumbers.test(email)) {
        factors.push({
            code: 'ALL_NUMBERS',
            description: 'Local part contains only numbers',
            severity: 'high',
            score: 35,
        });
        totalScore += 35;
    }
    // Check too short
    if (PATTERNS.tooShort.test(email)) {
        factors.push({
            code: 'TOO_SHORT',
            description: 'Local part is very short (1-2 characters)',
            severity: 'medium',
            score: 15,
        });
        totalScore += 15;
    }
    // Check too long
    if (PATTERNS.tooLong.test(email)) {
        factors.push({
            code: 'TOO_LONG',
            description: 'Local part is unusually long (40+ characters)',
            severity: 'medium',
            score: 20,
        });
        totalScore += 20;
    }
    // Check suspicious TLD
    if (PATTERNS.suspiciousTld.test(domain)) {
        factors.push({
            code: 'SUSPICIOUS_TLD',
            description: 'Domain uses a TLD commonly associated with spam',
            severity: 'high',
            score: 25,
        });
        totalScore += 25;
    }
    // Check UUID-like
    if (PATTERNS.uuidLike.test(localPart)) {
        factors.push({
            code: 'UUID_PATTERN',
            description: 'Contains UUID-like pattern (likely auto-generated)',
            severity: 'high',
            score: 40,
        });
        totalScore += 40;
    }
    // Check hash-like
    if (PATTERNS.hashLike.test(email)) {
        factors.push({
            code: 'HASH_PATTERN',
            description: 'Appears to be a hash (likely auto-generated)',
            severity: 'high',
            score: 45,
        });
        totalScore += 45;
    }
    // Calculate digit ratio
    const digits = (localPart.match(/\d/g) || []).length;
    const digitRatio = digits / localPart.length;
    if (digitRatio > 0.5 && localPart.length > 5) {
        factors.push({
            code: 'HIGH_DIGIT_RATIO',
            description: 'More than 50% of local part is numbers',
            severity: 'medium',
            score: 20,
        });
        totalScore += 20;
    }
    // Cap score at 100
    totalScore = Math.min(100, totalScore);
    // Determine risk level
    let riskLevel;
    if (totalScore >= 70) {
        riskLevel = 'critical';
    }
    else if (totalScore >= 45) {
        riskLevel = 'high';
    }
    else if (totalScore >= 20) {
        riskLevel = 'medium';
    }
    else {
        riskLevel = 'low';
    }
    // Generate summary
    let summary;
    if (factors.length === 0) {
        summary = 'No suspicious patterns detected';
    }
    else if (factors.length === 1) {
        summary = factors[0].description;
    }
    else {
        summary = `${factors.length} risk factors detected`;
    }
    return {
        riskLevel,
        riskScore: totalScore,
        factors,
        isHighRisk: totalScore >= 45,
        summary,
    };
}
/**
 * Quick check if email is high risk
 */
function isHighRisk(email) {
    return analyzeRisk(email).isHighRisk;
}
/**
 * Get risk score only
 */
function getRiskScore(email) {
    return analyzeRisk(email).riskScore;
}
/**
 * Get risk level description
 */
function getRiskLevelDescription(level) {
    switch (level) {
        case 'low':
            return 'Low risk - Email appears legitimate';
        case 'medium':
            return 'Medium risk - Some suspicious patterns detected';
        case 'high':
            return 'High risk - Multiple suspicious patterns detected';
        case 'critical':
            return 'Critical risk - Email is likely fake or auto-generated';
    }
}
