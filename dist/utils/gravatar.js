"use strict";
/**
 * Gravatar Detection Module
 * Checks if an email address has an associated Gravatar profile
 * This can indicate a more established/legitimate email address
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGravatarHash = getGravatarHash;
exports.getGravatarUrl = getGravatarUrl;
exports.getGravatarProfileUrl = getGravatarProfileUrl;
exports.checkGravatar = checkGravatar;
exports.hasGravatar = hasGravatar;
exports.getGravatarUrls = getGravatarUrls;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const GRAVATAR_BASE_URL = 'https://www.gravatar.com';
/**
 * Generate MD5 hash for Gravatar lookup
 */
function getGravatarHash(email) {
    return crypto_1.default
        .createHash('md5')
        .update(email.trim().toLowerCase())
        .digest('hex');
}
/**
 * Get Gravatar URL for an email
 */
function getGravatarUrl(email, size = 200) {
    const hash = getGravatarHash(email);
    return `${GRAVATAR_BASE_URL}/avatar/${hash}?s=${size}&d=404`;
}
/**
 * Get Gravatar profile URL
 */
function getGravatarProfileUrl(email) {
    const hash = getGravatarHash(email);
    return `${GRAVATAR_BASE_URL}/${hash}`;
}
/**
 * Check if email has a Gravatar
 */
async function checkGravatar(email) {
    const hash = getGravatarHash(email);
    const gravatarUrl = `${GRAVATAR_BASE_URL}/avatar/${hash}?d=404`;
    const profileUrl = `${GRAVATAR_BASE_URL}/${hash}`;
    const result = {
        hasGravatar: false,
        gravatarUrl: `${GRAVATAR_BASE_URL}/avatar/${hash}`,
        profileUrl,
        hash,
    };
    try {
        // Check if Gravatar image exists (returns 404 if not)
        const response = await axios_1.default.head(gravatarUrl, {
            timeout: 5000,
            validateStatus: (status) => status < 500,
        });
        result.hasGravatar = response.status === 200;
        // If Gravatar exists, try to fetch profile
        if (result.hasGravatar) {
            try {
                const profileResponse = await axios_1.default.get(`${GRAVATAR_BASE_URL}/${hash}.json`, {
                    timeout: 5000,
                    validateStatus: (status) => status < 500,
                });
                if (profileResponse.status === 200 && profileResponse.data?.entry?.[0]) {
                    const entry = profileResponse.data.entry[0];
                    result.profile = {
                        displayName: entry.displayName,
                        profileUrl: entry.profileUrl,
                        thumbnailUrl: entry.thumbnailUrl,
                        aboutMe: entry.aboutMe,
                        currentLocation: entry.currentLocation,
                    };
                }
            }
            catch {
                // Profile fetch failed, but Gravatar exists
            }
        }
        return result;
    }
    catch {
        // Request failed, assume no Gravatar
        return result;
    }
}
/**
 * Quick check if Gravatar exists (boolean only)
 */
async function hasGravatar(email) {
    const result = await checkGravatar(email);
    return result.hasGravatar;
}
/**
 * Get Gravatar URLs without checking if they exist
 * (Useful for displaying placeholder or default images)
 */
function getGravatarUrls(email, size = 200) {
    const hash = getGravatarHash(email);
    return {
        imageUrl: `${GRAVATAR_BASE_URL}/avatar/${hash}?s=${size}`,
        profileUrl: `${GRAVATAR_BASE_URL}/${hash}`,
        hash,
    };
}
