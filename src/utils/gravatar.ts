/**
 * Gravatar Detection Module
 * Checks if an email address has an associated Gravatar profile
 * This can indicate a more established/legitimate email address
 */

import crypto from 'crypto';
import axios from 'axios';

const GRAVATAR_BASE_URL = 'https://www.gravatar.com';

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
export function getGravatarHash(email: string): string {
  return crypto
    .createHash('md5')
    .update(email.trim().toLowerCase())
    .digest('hex');
}

/**
 * Get Gravatar URL for an email
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  const hash = getGravatarHash(email);
  return `${GRAVATAR_BASE_URL}/avatar/${hash}?s=${size}&d=404`;
}

/**
 * Get Gravatar profile URL
 */
export function getGravatarProfileUrl(email: string): string {
  const hash = getGravatarHash(email);
  return `${GRAVATAR_BASE_URL}/${hash}`;
}

/**
 * Check if email has a Gravatar
 */
export async function checkGravatar(email: string): Promise<GravatarResult> {
  const hash = getGravatarHash(email);
  const gravatarUrl = `${GRAVATAR_BASE_URL}/avatar/${hash}?d=404`;
  const profileUrl = `${GRAVATAR_BASE_URL}/${hash}`;

  const result: GravatarResult = {
    hasGravatar: false,
    gravatarUrl: `${GRAVATAR_BASE_URL}/avatar/${hash}`,
    profileUrl,
    hash,
  };

  try {
    // Check if Gravatar image exists (returns 404 if not)
    const response = await axios.head(gravatarUrl, {
      timeout: 5000,
      validateStatus: (status) => status < 500,
    });

    result.hasGravatar = response.status === 200;

    // If Gravatar exists, try to fetch profile
    if (result.hasGravatar) {
      try {
        const profileResponse = await axios.get(`${GRAVATAR_BASE_URL}/${hash}.json`, {
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
      } catch {
        // Profile fetch failed, but Gravatar exists
      }
    }

    return result;
  } catch {
    // Request failed, assume no Gravatar
    return result;
  }
}

/**
 * Quick check if Gravatar exists (boolean only)
 */
export async function hasGravatar(email: string): Promise<boolean> {
  const result = await checkGravatar(email);
  return result.hasGravatar;
}

/**
 * Get Gravatar URLs without checking if they exist
 * (Useful for displaying placeholder or default images)
 */
export function getGravatarUrls(email: string, size: number = 200): {
  imageUrl: string;
  profileUrl: string;
  hash: string;
} {
  const hash = getGravatarHash(email);
  return {
    imageUrl: `${GRAVATAR_BASE_URL}/avatar/${hash}?s=${size}`,
    profileUrl: `${GRAVATAR_BASE_URL}/${hash}`,
    hash,
  };
}
