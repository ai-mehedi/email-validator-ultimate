"use strict";
/**
 * Email typo suggestion module
 * Detects common typos in email domains and suggests corrections
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailSuggestion = getEmailSuggestion;
exports.hasTypo = hasTypo;
exports.getSuggestedEmail = getSuggestedEmail;
// Common domain typos and their corrections
const DOMAIN_TYPOS = {
    // Gmail typos
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gmali.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmaol.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gemail.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.om': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmailcom': 'gmail.com',
    'g]mail.com': 'gmail.com',
    // Yahoo typos
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'yhaoo.com': 'yahoo.com',
    'yhoo.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
    'yaoo.com': 'yahoo.com',
    'yahho.com': 'yahoo.com',
    'yaooh.com': 'yahoo.com',
    // Hotmail typos
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmil.com': 'hotmail.com',
    'hotmaill.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',
    'hotmail.co': 'hotmail.com',
    'htmail.com': 'hotmail.com',
    'hotnail.com': 'hotmail.com',
    'hotamil.com': 'hotmail.com',
    // Outlook typos
    'outlok.com': 'outlook.com',
    'outllok.com': 'outlook.com',
    'outlook.con': 'outlook.com',
    'outlook.co': 'outlook.com',
    'outloook.com': 'outlook.com',
    'outook.com': 'outlook.com',
    'outlool.com': 'outlook.com',
    'oultook.com': 'outlook.com',
    // iCloud typos
    'iclod.com': 'icloud.com',
    'icloud.con': 'icloud.com',
    'icould.com': 'icloud.com',
    'iclould.com': 'icloud.com',
    'icluod.com': 'icloud.com',
    // ProtonMail typos
    'protonmal.com': 'protonmail.com',
    'protonmail.con': 'protonmail.com',
    'protonmial.com': 'protonmail.com',
    'protonmai.com': 'protonmail.com',
    // Common TLD typos
    '.con': '.com',
    '.cmo': '.com',
    '.ocm': '.com',
    '.vom': '.com',
    '.xom': '.com',
    '.cpm': '.com',
    '.comn': '.com',
    '.comm': '.com',
    '.ent': '.net',
    '.nte': '.net',
    '.ogr': '.org',
    '.orgg': '.org',
};
// Popular domains for fuzzy matching
const POPULAR_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'protonmail.com',
    'aol.com',
    'live.com',
    'msn.com',
    'mail.com',
    'zoho.com',
    'yandex.com',
    'gmx.com',
    'fastmail.com',
];
/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++)
        dp[i][0] = i;
    for (let j = 0; j <= n; j++)
        dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
            else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[m][n];
}
/**
 * Find the closest matching domain using Levenshtein distance
 */
function findClosestDomain(domain, maxDistance = 2) {
    const normalizedDomain = domain.toLowerCase();
    // If domain is already a popular domain, no suggestion needed
    if (POPULAR_DOMAINS.includes(normalizedDomain)) {
        return null;
    }
    let closestDomain = null;
    let minDistance = Infinity;
    for (const popularDomain of POPULAR_DOMAINS) {
        const distance = levenshteinDistance(normalizedDomain, popularDomain);
        if (distance > 0 && distance <= maxDistance && distance < minDistance) {
            minDistance = distance;
            closestDomain = popularDomain;
        }
    }
    return closestDomain;
}
/**
 * Get email suggestion for potential typos
 */
function getEmailSuggestion(email) {
    const result = {
        hasSuggestion: false,
        original: email,
    };
    const atIndex = email.lastIndexOf('@');
    if (atIndex === -1) {
        return result;
    }
    const localPart = email.substring(0, atIndex);
    const domain = email.substring(atIndex + 1).toLowerCase();
    // Check direct typo mapping first
    if (DOMAIN_TYPOS[domain]) {
        const correctedDomain = DOMAIN_TYPOS[domain];
        result.hasSuggestion = true;
        result.suggested = `${localPart}@${correctedDomain}`;
        result.domain = {
            original: domain,
            suggested: correctedDomain,
        };
        return result;
    }
    // Check for TLD typos
    for (const [typo, correction] of Object.entries(DOMAIN_TYPOS)) {
        if (typo.startsWith('.') && domain.endsWith(typo)) {
            const correctedDomain = domain.slice(0, -typo.length) + correction;
            result.hasSuggestion = true;
            result.suggested = `${localPart}@${correctedDomain}`;
            result.domain = {
                original: domain,
                suggested: correctedDomain,
            };
            return result;
        }
    }
    // Use fuzzy matching for unknown domains
    const closestDomain = findClosestDomain(domain);
    if (closestDomain && closestDomain !== domain) {
        result.hasSuggestion = true;
        result.suggested = `${localPart}@${closestDomain}`;
        result.domain = {
            original: domain,
            suggested: closestDomain,
        };
    }
    return result;
}
/**
 * Check if email domain has a typo
 */
function hasTypo(email) {
    return getEmailSuggestion(email).hasSuggestion;
}
/**
 * Get suggested email correction (returns original if no typo detected)
 */
function getSuggestedEmail(email) {
    const suggestion = getEmailSuggestion(email);
    return suggestion.suggested || email;
}
