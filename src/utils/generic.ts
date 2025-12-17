/**
 * Generic/Role-based username detection
 * Identifies common role-based email addresses that are typically
 * shared mailboxes rather than personal addresses
 */

// Extended list of generic/role-based usernames
const DEFAULT_GENERIC_USERNAMES = [
  // Administrative
  'admin',
  'administrator',
  'root',
  'webmaster',
  'postmaster',
  'hostmaster',
  'sysadmin',

  // Contact & Support
  'info',
  'information',
  'contact',
  'contactus',
  'support',
  'help',
  'helpdesk',
  'customerservice',
  'service',
  'feedback',
  'enquiry',
  'enquiries',
  'inquiry',
  'inquiries',

  // Sales & Marketing
  'sales',
  'marketing',
  'advertising',
  'promotions',
  'offers',
  'deals',
  'newsletter',
  'subscribe',
  'subscriptions',

  // Business Functions
  'billing',
  'accounts',
  'accounting',
  'finance',
  'invoices',
  'payments',
  'orders',
  'shipping',
  'returns',
  'refunds',

  // HR & Recruitment
  'hr',
  'humanresources',
  'careers',
  'jobs',
  'recruitment',
  'hiring',
  'resume',
  'resumes',
  'cv',
  'applications',

  // Technical
  'tech',
  'technical',
  'it',
  'ithelp',
  'developer',
  'dev',
  'development',
  'engineering',
  'security',
  'abuse',
  'spam',

  // Legal & Compliance
  'legal',
  'compliance',
  'privacy',
  'gdpr',
  'dmca',
  'copyright',

  // Media & PR
  'press',
  'media',
  'pr',
  'publicrelations',
  'news',
  'events',

  // General
  'office',
  'hello',
  'hi',
  'team',
  'staff',
  'noreply',
  'no-reply',
  'donotreply',
  'do-not-reply',
  'mailer-daemon',
  'mailerdaemon',
  'bounce',
  'bounces',
  'unsubscribe',
  'remove',
  'list',
  'listserv',
  'majordomo',
  'owner',
  'request',
  'all',
  'everyone',
  'group',
  'department',
];

// Current list (can be customized)
let genericUsernames = [...DEFAULT_GENERIC_USERNAMES];

/**
 * Check if username is a generic/role-based address
 */
export function isGeneric(username: string, customList?: string[]): boolean {
  const listToUse = customList || genericUsernames;
  return listToUse.includes(username.toLowerCase());
}

/**
 * Set custom generic usernames list (replaces default)
 */
export function setGenericUsernames(usernames: string[]): void {
  genericUsernames = usernames.map(u => u.toLowerCase());
}

/**
 * Add usernames to the generic list
 */
export function addGenericUsernames(usernames: string[]): void {
  const lowercased = usernames.map(u => u.toLowerCase());
  genericUsernames = [...new Set([...genericUsernames, ...lowercased])];
}

/**
 * Remove usernames from the generic list
 */
export function removeGenericUsernames(usernames: string[]): void {
  const toRemove = new Set(usernames.map(u => u.toLowerCase()));
  genericUsernames = genericUsernames.filter(u => !toRemove.has(u));
}

/**
 * Reset to default generic usernames
 */
export function resetGenericUsernames(): void {
  genericUsernames = [...DEFAULT_GENERIC_USERNAMES];
}

/**
 * Get current generic usernames list
 */
export function getGenericUsernames(): string[] {
  return [...genericUsernames];
}

/**
 * Get the default generic usernames list
 */
export function getDefaultGenericUsernames(): string[] {
  return [...DEFAULT_GENERIC_USERNAMES];
}
