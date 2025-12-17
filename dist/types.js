"use strict";
/**
 * Type definitions for email-validator-ultimate
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_PRESETS = void 0;
/**
 * Preset configurations
 */
exports.VALIDATION_PRESETS = {
    quick: {
        smtpCheck: false,
        skipDisposableCheck: true,
        cache: true,
    },
    standard: {
        smtpCheck: false,
        skipDisposableCheck: false,
        cache: true,
    },
    thorough: {
        smtpCheck: true,
        skipDisposableCheck: false,
        cache: false,
    },
};
