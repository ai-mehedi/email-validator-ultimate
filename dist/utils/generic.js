"use strict";
/**
 * Generic/Role-based username detection
 * Identifies common role-based email addresses that are typically
 * shared mailboxes rather than personal addresses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGeneric = isGeneric;
exports.setGenericUsernames = setGenericUsernames;
exports.addGenericUsernames = addGenericUsernames;
exports.removeGenericUsernames = removeGenericUsernames;
exports.resetGenericUsernames = resetGenericUsernames;
exports.getGenericUsernames = getGenericUsernames;
exports.getDefaultGenericUsernames = getDefaultGenericUsernames;
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
function isGeneric(username, customList) {
    const listToUse = customList || genericUsernames;
    return listToUse.includes(username.toLowerCase());
}
/**
 * Set custom generic usernames list (replaces default)
 */
function setGenericUsernames(usernames) {
    genericUsernames = usernames.map(u => u.toLowerCase());
}
/**
 * Add usernames to the generic list
 */
function addGenericUsernames(usernames) {
    const lowercased = usernames.map(u => u.toLowerCase());
    genericUsernames = [...new Set([...genericUsernames, ...lowercased])];
}
/**
 * Remove usernames from the generic list
 */
function removeGenericUsernames(usernames) {
    const toRemove = new Set(usernames.map(u => u.toLowerCase()));
    genericUsernames = genericUsernames.filter(u => !toRemove.has(u));
}
/**
 * Reset to default generic usernames
 */
function resetGenericUsernames() {
    genericUsernames = [...DEFAULT_GENERIC_USERNAMES];
}
/**
 * Get current generic usernames list
 */
function getGenericUsernames() {
    return [...genericUsernames];
}
/**
 * Get the default generic usernames list
 */
function getDefaultGenericUsernames() {
    return [...DEFAULT_GENERIC_USERNAMES];
}
