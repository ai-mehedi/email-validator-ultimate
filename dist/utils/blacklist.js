"use strict";
/**
 * DNS Blacklist (DNSBL) Check Module
 * Checks if email domain or mail server IP is listed in spam blacklists
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBlacklist = checkBlacklist;
exports.isBlacklisted = isBlacklisted;
exports.getDomainReputationScore = getDomainReputationScore;
exports.getAvailableBlacklists = getAvailableBlacklists;
const promises_1 = __importDefault(require("dns/promises"));
// Popular DNS blacklists for spam detection
const DNS_BLACKLISTS = [
    'zen.spamhaus.org',
    'bl.spamcop.net',
    'b.barracudacentral.org',
    'dnsbl.sorbs.net',
    'spam.dnsbl.sorbs.net',
    'dul.dnsbl.sorbs.net',
    'combined.abuse.ch',
    'dnsbl-1.uceprotect.net',
    'psbl.surriel.com',
    'all.s5h.net',
];
// Domain reputation blacklists
const DOMAIN_BLACKLISTS = [
    'dbl.spamhaus.org',
    'multi.surbl.org',
    'black.uribl.com',
];
/**
 * Reverse an IP address for DNSBL lookup
 */
function reverseIp(ip) {
    return ip.split('.').reverse().join('.');
}
/**
 * Check if an IP is listed in a DNSBL
 */
async function checkIpInDnsbl(ip, blacklist) {
    const reversedIp = reverseIp(ip);
    const query = `${reversedIp}.${blacklist}`;
    try {
        await promises_1.default.resolve4(query);
        return true; // If we get a response, it's listed
    }
    catch {
        return false; // Not listed or lookup failed
    }
}
/**
 * Check if a domain is listed in a domain blacklist
 */
async function checkDomainInDbl(domain, blacklist) {
    const query = `${domain}.${blacklist}`;
    try {
        await promises_1.default.resolve4(query);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get MX server IPs for a domain
 */
async function getMxServerIps(domain) {
    try {
        const mxRecords = await promises_1.default.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
            return [];
        }
        const ips = [];
        for (const mx of mxRecords.slice(0, 3)) { // Check top 3 MX servers
            try {
                const addresses = await promises_1.default.resolve4(mx.exchange);
                ips.push(...addresses);
            }
            catch {
                // Skip if can't resolve
            }
        }
        return [...new Set(ips)]; // Remove duplicates
    }
    catch {
        return [];
    }
}
/**
 * Check domain against DNS blacklists
 */
async function checkBlacklist(domain) {
    const listedIn = [];
    const checkedLists = [...DNS_BLACKLISTS, ...DOMAIN_BLACKLISTS];
    // Check domain blacklists first
    const domainChecks = DOMAIN_BLACKLISTS.map(async (bl) => {
        const isListed = await checkDomainInDbl(domain, bl);
        if (isListed) {
            listedIn.push(bl);
        }
    });
    // Get MX server IPs
    const mxIps = await getMxServerIps(domain);
    // Check IP blacklists if we have MX IPs
    const ipChecks = [];
    for (const ip of mxIps.slice(0, 2)) { // Limit to first 2 IPs
        for (const bl of DNS_BLACKLISTS.slice(0, 5)) { // Limit to first 5 blacklists
            ipChecks.push(checkIpInDnsbl(ip, bl).then((isListed) => {
                if (isListed) {
                    listedIn.push(`${bl} (IP: ${ip})`);
                }
            }));
        }
    }
    // Wait for all checks with timeout
    await Promise.race([
        Promise.all([...domainChecks, ...ipChecks]),
        new Promise((resolve) => setTimeout(resolve, 10000)), // 10 second timeout
    ]);
    // Calculate reputation score
    const uniqueListings = new Set(listedIn.map(l => l.split(' ')[0]));
    const listingRatio = uniqueListings.size / checkedLists.length;
    const reputationScore = Math.round(Math.max(0, (1 - listingRatio * 2) * 100));
    return {
        domain,
        isBlacklisted: listedIn.length > 0,
        listedIn: [...new Set(listedIn)],
        checkedLists,
        totalChecked: checkedLists.length,
        reputationScore,
        mxServers: mxIps,
    };
}
/**
 * Quick check if domain is blacklisted (boolean only)
 */
async function isBlacklisted(domain) {
    // Quick check against major lists only
    const quickLists = ['dbl.spamhaus.org', 'zen.spamhaus.org'];
    for (const bl of quickLists) {
        try {
            const isListed = await checkDomainInDbl(domain, bl);
            if (isListed)
                return true;
        }
        catch {
            // Continue checking
        }
    }
    return false;
}
/**
 * Get domain reputation score only
 */
async function getDomainReputationScore(domain) {
    const result = await checkBlacklist(domain);
    return result.reputationScore;
}
/**
 * Get list of available blacklists
 */
function getAvailableBlacklists() {
    return {
        dns: [...DNS_BLACKLISTS],
        domain: [...DOMAIN_BLACKLISTS],
    };
}
