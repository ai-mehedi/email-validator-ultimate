/**
 * Disposable Email Detection Module
 * Detects temporary/disposable email addresses using external API
 * and comprehensive local fallback list with custom domain management
 */

import axios from "axios";

const DISIFY_API = "https://www.disify.com/api/email";

// Comprehensive list of known disposable email domains
const DEFAULT_DISPOSABLE_DOMAINS = [
  // Popular temporary email services
  '10minutemail.com', '10minutemail.net', '10minmail.com',
  'guerrillamail.com', 'guerrillamail.org', 'guerrillamail.net', 'guerrillamail.biz',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io',
  'throwaway.email', 'throwawaymail.com',
  'mailinator.com', 'mailinator.net', 'mailinator.org',
  'maildrop.cc', 'maildrop.io',
  'fakeinbox.com', 'fakemailgenerator.com', 'fakemailgenerator.net',
  'sharklasers.com', 'guerrillamailblock.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'getnada.com', 'nada.email',
  'tempail.com', 'tempr.email', 'tempmailaddress.com',
  'discard.email', 'discardmail.com',
  'trashmail.com', 'trashmail.net', 'trashmail.org',
  'mohmal.com', 'mohmal.im',
  'tempinbox.com', 'temp-inbox.com',
  'emailondeck.com',
  'crazymailing.com',
  'mintemail.com',
  'mytrashmail.com',
  'mailnesia.com',
  'spamgourmet.com', 'spamgourmet.net',
  'spambox.us',
  'jetable.org',
  'getairmail.com',
  'dispostable.com',
  'anonymbox.com',
  'emkei.cz',
  'mailcatch.com',
  'mail-temp.com',
  'burnermail.io',
  '33mail.com',
  'spam4.me',
  'tmail.com',
  'inboxalias.com',
  'mailnull.com',
  'spamfree24.org',
  'mytemp.email',
  'tempmails.net',

  // Additional services
  'mailexpire.com', 'tempsky.com', 'mailforspam.com',
  'deadaddress.com', 'sogetthis.com', 'mailin8r.com',
  'mailmetrash.com', 'thankyou2010.com', 'trash2009.com',
  'mt2009.com', 'trashymail.com', 'antispam.de',
  'spamherelots.com', 'spamavert.com', 'uggsrock.com',
  'spamcannon.com', 'spamcannon.net', 'kasmail.com',
  'mailslite.com', 'messagebeamer.de', 'smellfear.com',
  'pookmail.com', 'mailnator.com', 'bumpymail.com',
  'fakedemail.com', 'incognitomail.com', 'emailthe.net',
  'spamobox.com', 'mailcatch.com', 'mailscrap.com',
  'willselfdestruct.com', 'shortmail.net', 'sofort-mail.de',
  'spambox.info', 'trashdevil.com', 'kurzepost.de',
  'objectmail.com', 'proxymail.eu', 'rcpt.at',
  'trash-mail.at', 'trashmail.at', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'wh4f.org',
  'mailzilla.com', 'mailzilla.org', 'zehnminutenmail.de',
  'tempmailer.com', 'tempomail.fr', 'throwam.com',
  'tilien.com', 'tmailinator.com', 'toiea.com',
  'trbvm.com', 'twinmail.de', 'tyldd.com',
  'uggsrock.com', 'upliftnow.com', 'uplipht.com',
  'venompen.com', 'veryrealemail.com', 'viditag.com',
  'viewcastmedia.com', 'viewcastmedia.net', 'viewcastmedia.org',
  'webm4il.info', 'wegwerfadresse.de', 'wetrainbayarea.com',
  'wetrainbayarea.org', 'wh4f.org', 'whyspam.me',
  'willhackforfood.biz', 'willselfdestruct.com', 'winemaven.info',
  'wolfsmail.tk', 'writeme.us', 'wronghead.com',
  'wuzup.net', 'wuzupmail.net', 'wwwnew.eu',
  'xagloo.com', 'xemaps.com', 'xents.com',
  'xmaily.com', 'xoxy.net', 'yapped.net',
  'yep.it', 'yogamaven.com', 'yopmail.com',
  'yopmail.fr', 'yopmail.net', 'yourdomain.com',
  'ypmail.webarnak.fr.eu.org', 'yuurok.com', 'zehnminuten.de',
  'zippymail.info', 'zoaxe.com', 'zoemail.org',

  // Russian services
  'mailru.com', 'tempmail.ru',

  // Asian services
  'guerrillamail.asia',
];

// Mutable list that can be customized
let disposableDomains = new Set(DEFAULT_DISPOSABLE_DOMAINS);

// Whitelist - domains that should never be marked as disposable
let whitelistedDomains = new Set<string>();

export interface DisposableCheckResult {
  isDisposable: boolean;
  source: 'api' | 'local' | 'whitelist' | 'error';
  confidence: 'high' | 'medium' | 'low';
  error?: string;
}

/**
 * Check if email is from a disposable email service (with detailed result)
 */
export async function checkDisposable(email: string, skipApi: boolean = false): Promise<DisposableCheckResult> {
  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    return { isDisposable: false, source: 'error', confidence: 'low', error: 'Invalid email format' };
  }

  // Check whitelist first
  if (whitelistedDomains.has(domain)) {
    return { isDisposable: false, source: 'whitelist', confidence: 'high' };
  }

  // Check local list (fast, high confidence)
  if (disposableDomains.has(domain)) {
    return { isDisposable: true, source: 'local', confidence: 'high' };
  }

  // Skip API if requested
  if (skipApi) {
    return { isDisposable: false, source: 'local', confidence: 'medium' };
  }

  // Try API check for unknown domains
  try {
    const res = await axios.get(`${DISIFY_API}/${email}`, { timeout: 5000 });
    if (res.data?.disposable === true) {
      return { isDisposable: true, source: 'api', confidence: 'high' };
    }
    return { isDisposable: false, source: 'api', confidence: 'high' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      isDisposable: false,
      source: 'error',
      confidence: 'low',
      error: `API check failed: ${errorMessage}`
    };
  }
}

/**
 * Simple boolean check for disposable email (backward compatible)
 */
export async function isDisposable(email: string): Promise<boolean> {
  const result = await checkDisposable(email);
  return result.isDisposable;
}

/**
 * Check domain only against local list (synchronous, no API call)
 */
export function isDisposableDomainLocal(domain: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  if (whitelistedDomains.has(normalizedDomain)) {
    return false;
  }
  return disposableDomains.has(normalizedDomain);
}

/**
 * Add domains to the disposable list
 */
export function addDisposableDomains(domains: string[]): void {
  domains.forEach(domain => {
    disposableDomains.add(domain.toLowerCase());
  });
}

/**
 * Remove domains from the disposable list
 */
export function removeDisposableDomains(domains: string[]): void {
  domains.forEach(domain => {
    disposableDomains.delete(domain.toLowerCase());
  });
}

/**
 * Add domains to whitelist (will never be marked as disposable)
 */
export function addToWhitelist(domains: string[]): void {
  domains.forEach(domain => {
    whitelistedDomains.add(domain.toLowerCase());
  });
}

/**
 * Remove domains from whitelist
 */
export function removeFromWhitelist(domains: string[]): void {
  domains.forEach(domain => {
    whitelistedDomains.delete(domain.toLowerCase());
  });
}

/**
 * Reset to default disposable domains list
 */
export function resetDisposableDomains(): void {
  disposableDomains = new Set(DEFAULT_DISPOSABLE_DOMAINS);
  whitelistedDomains.clear();
}

/**
 * Get current disposable domains list
 */
export function getDisposableDomains(): string[] {
  return Array.from(disposableDomains);
}

/**
 * Get current whitelist
 */
export function getWhitelistedDomains(): string[] {
  return Array.from(whitelistedDomains);
}

/**
 * Get count of disposable domains in database
 */
export function getDisposableDomainsCount(): number {
  return disposableDomains.size;
}
