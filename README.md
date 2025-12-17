<p align="center">
  <h1 align="center">Email Validator Ultimate</h1>
  <p align="center">
    <strong>The most comprehensive email validation library for Node.js</strong>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/email-validator-ultimate"><img src="https://img.shields.io/npm/v/email-validator-ultimate.svg?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/email-validator-ultimate"><img src="https://img.shields.io/npm/dm/email-validator-ultimate.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://github.com/ai-mehedi/email-validator-ultimate/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="license"></a>
    <a href="https://github.com/ai-mehedi/email-validator-ultimate"><img src="https://img.shields.io/github/stars/ai-mehedi/email-validator-ultimate?style=flat-square" alt="github stars"></a>
  </p>
</p>

---

## Overview

**Email Validator Ultimate** is a powerful, enterprise-grade email validation library that goes far beyond simple regex checks. It provides comprehensive validation including format verification, DNS/MX record lookup, SMTP inbox testing, disposable email detection, risk analysis, and much more.

### Why Choose Email Validator Ultimate?

| Feature | Basic Validators | Email Validator Ultimate |
|---------|------------------|--------------------------|
| RFC 5322 Format Check | Partial | Full |
| MX Record Validation | No | Yes |
| SMTP Inbox Check | No | Yes |
| Disposable Email Detection | No | Yes (150+ domains) |
| Typo Suggestions | No | Yes |
| Risk Analysis | No | Yes |
| Email Normalization | No | Yes |
| Gravatar Detection | No | Yes |
| DNS Blacklist Check | No | Yes |
| Batch Validation | No | Yes |
| CLI Tool | No | Yes |
| Caching | No | Yes |
| TypeScript Support | Varies | Full |

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
  - [Basic Validation](#basic-validation)
  - [Batch Validation](#batch-validation)
  - [Email Normalization](#email-normalization)
  - [Risk Analysis](#risk-analysis)
  - [Typo Suggestions](#typo-suggestions)
  - [Gravatar Detection](#gravatar-detection)
  - [DNS Blacklist Check](#dns-blacklist-check)
  - [Disposable Email Detection](#disposable-email-detection)
  - [SMTP Validation](#smtp-validation)
  - [Quality Scoring](#quality-scoring)
  - [Caching](#caching)
- [CLI Tool](#cli-tool)
- [API Reference](#api-reference)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
# Using npm
npm install email-validator-ultimate

# Using yarn
yarn add email-validator-ultimate

# Using pnpm
pnpm add email-validator-ultimate
```

### Global CLI Installation

```bash
npm install -g email-validator-ultimate
```

---

## Quick Start

### ES Modules (ESM)

```javascript
import { validateEmail } from 'email-validator-ultimate';

const result = await validateEmail({
  email: 'user@example.com',
  fromEmail: 'noreply@yourapp.com'
});

console.log(result.qualityScore); // 100
console.log(result.isValid);      // true
```

### CommonJS

```javascript
const { validateEmail } = require('email-validator-ultimate');

async function validate() {
  const result = await validateEmail({
    email: 'user@example.com',
    fromEmail: 'noreply@yourapp.com'
  });
  console.log(result);
}

validate();
```

---

## Features

### Basic Validation

The core `validateEmail` function performs comprehensive checks on an email address.

```javascript
import { validateEmail } from 'email-validator-ultimate';

const result = await validateEmail({
  email: 'user@gmail.com',
  fromEmail: 'noreply@yourapp.com',
  smtpCheck: false,    // Enable SMTP validation
  cache: true          // Enable caching for better performance
});
```

**Result Object:**

```javascript
{
  email: 'user@gmail.com',
  username: 'user',
  domain: 'gmail.com',
  formatValid: true,
  hasMX: true,
  isDisposable: false,
  isGeneric: false,
  isFree: true,
  provider: 'Gmail',
  mxRecord: 'gmail-smtp-in.l.google.com',
  canReceiveEmail: {
    smtpSuccess: false,
    message: 'SMTP check skipped',
    catchAll: false
  },
  qualityScore: 100,
  suggestion: null
}
```

---

### Batch Validation

Validate multiple emails efficiently with concurrency control.

```javascript
import { validateEmails } from 'email-validator-ultimate';

const result = await validateEmails({
  emails: [
    'user1@gmail.com',
    'user2@yahoo.com',
    'fake@tempmail.com',
    'admin@company.com'
  ],
  fromEmail: 'noreply@yourapp.com',
  concurrency: 10,  // Process 10 emails at a time
  onProgress: (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  }
});

console.log(`Valid: ${result.valid} / ${result.total}`);
console.log(`Average Score: ${result.summary.averageScore}`);
```

**Batch Result:**

```javascript
{
  total: 4,
  valid: 3,
  invalid: 1,
  processingTime: 1250,
  summary: {
    validFormat: 4,
    invalidFormat: 0,
    hasMX: 4,
    noMX: 0,
    disposable: 1,
    generic: 1,
    freeProvider: 2,
    averageScore: 75
  },
  results: [...] // Individual results
}
```

---

### Email Normalization

Normalize email addresses by removing dots, plus aliases, and standardizing domains.

```javascript
import { normalizeEmail, areEmailsEquivalent } from 'email-validator-ultimate';

// Gmail ignores dots and supports plus aliases
const result = normalizeEmail('J.O.H.N+newsletter@gmail.com');
console.log(result.normalized); // 'john@gmail.com'

// Check if two emails are the same person
const same = areEmailsEquivalent(
  'john.doe+work@gmail.com',
  'johndoe@gmail.com'
);
console.log(same); // true
```

**Normalization Result:**

```javascript
{
  original: 'J.O.H.N+newsletter@gmail.com',
  normalized: 'john@gmail.com',
  wasModified: true,
  localPart: 'john',
  domain: 'gmail.com',
  removedAlias: 'newsletter'
}
```

---

### Risk Analysis

Detect suspicious patterns that may indicate fake, bot, or spam accounts.

```javascript
import { analyzeRisk, isHighRisk } from 'email-validator-ultimate';

// Analyze email for risk patterns
const risk = analyzeRisk('xk3j5m2n9@unknown.xyz');

console.log(risk.riskLevel);   // 'high'
console.log(risk.riskScore);   // 65
console.log(risk.isHighRisk);  // true
console.log(risk.factors);     // Array of detected risk factors
```

**Risk Factors Detected:**

| Pattern | Description | Severity |
|---------|-------------|----------|
| `KEYBOARD_PATTERN` | Contains patterns like "qwerty", "12345" | Medium |
| `RANDOM_STRING` | Appears randomly generated | High |
| `ALL_NUMBERS` | Local part is only numbers | High |
| `UUID_PATTERN` | Contains UUID-like strings | High |
| `SUSPICIOUS_TLD` | Uses TLD associated with spam | High |
| `TOO_SHORT` | Very short local part | Medium |
| `CONSECUTIVE_CHARS` | 5+ repeated characters | High |

---

### Typo Suggestions

Automatically detect and suggest corrections for common email typos.

```javascript
import { getEmailSuggestion, getSuggestedEmail } from 'email-validator-ultimate';

// Get detailed suggestion
const suggestion = getEmailSuggestion('user@gmial.com');
console.log(suggestion);
// {
//   hasSuggestion: true,
//   suggested: 'user@gmail.com',
//   domain: { original: 'gmial.com', suggested: 'gmail.com' }
// }

// Quick correction
const corrected = getSuggestedEmail('user@hotmal.com');
console.log(corrected); // 'user@hotmail.com'
```

**Supported Typo Corrections:**

- **Gmail**: gmial, gmal, gmaill, gnail, gamil, gmail.con
- **Yahoo**: yaho, yahooo, yhaoo, yahoo.con
- **Hotmail**: hotmal, hotmial, htmail, hotnail
- **Outlook**: outlok, outllok, outlook.con
- **iCloud**: iclod, icould, icloud.con
- **TLDs**: .con → .com, .ent → .net, .ogr → .org

---

### Gravatar Detection

Check if an email has an associated Gravatar profile (indicates established user).

```javascript
import { checkGravatar, hasGravatar } from 'email-validator-ultimate';

// Full Gravatar check
const gravatar = await checkGravatar('user@example.com');
console.log(gravatar);
// {
//   hasGravatar: true,
//   gravatarUrl: 'https://www.gravatar.com/avatar/...',
//   profileUrl: 'https://www.gravatar.com/...',
//   hash: 'abc123...',
//   profile: { displayName: 'John Doe', ... }
// }

// Quick check
const exists = await hasGravatar('user@example.com');
console.log(exists); // true
```

---

### DNS Blacklist Check

Check if a domain's mail servers are listed in spam blacklists.

```javascript
import { checkBlacklist, isBlacklisted } from 'email-validator-ultimate';

// Full blacklist check
const blacklist = await checkBlacklist('suspicious-domain.com');
console.log(blacklist);
// {
//   domain: 'suspicious-domain.com',
//   isBlacklisted: true,
//   listedIn: ['zen.spamhaus.org', 'bl.spamcop.net'],
//   reputationScore: 35,
//   mxServers: ['10.20.30.40']
// }

// Quick check
const listed = await isBlacklisted('example.com');
console.log(listed); // false
```

---

### Disposable Email Detection

Detect temporary/throwaway email addresses with 150+ known disposable domains.

```javascript
import {
  isDisposable,
  addDisposableDomains,
  addToWhitelist
} from 'email-validator-ultimate';

// Check if disposable
const disposable = await isDisposable('user@tempmail.com');
console.log(disposable); // true

// Add custom disposable domains
addDisposableDomains(['custom-temp.com', 'another-temp.org']);

// Whitelist domains that should never be marked disposable
addToWhitelist(['mycompany-temp.com']);
```

---

### SMTP Validation

Test if an email inbox actually exists by connecting to the mail server.

```javascript
import { validateEmail } from 'email-validator-ultimate';

const result = await validateEmail({
  email: 'user@company.com',
  fromEmail: 'noreply@yourapp.com',
  smtpCheck: true,  // Enable SMTP validation
  debug: true       // See SMTP conversation
});

console.log(result.canReceiveEmail);
// {
//   smtpSuccess: true,
//   inboxExists: true,
//   catchAll: false,
//   message: 'Valid inbox (no catch-all)'
// }
```

**Requirements:**
- Server must allow outbound port 25
- Valid sender email address
- Some servers may block or rate-limit

---

### Quality Scoring

Get an intelligent quality score (0-100) based on multiple factors.

```javascript
import { validateEmail, getScoreDescription } from 'email-validator-ultimate';

const result = await validateEmail({
  email: 'user@gmail.com',
  fromEmail: 'noreply@app.com'
});

console.log(result.qualityScore);                    // 100
console.log(getScoreDescription(result.qualityScore)); // 'Excellent'
```

**Score Calculation:**

| Factor | Impact | Description |
|--------|--------|-------------|
| Invalid Format | Score = 0 | Hard fail |
| No MX Record | -40 | Cannot receive email |
| SMTP Failed | -30 | Inbox doesn't exist |
| Disposable | -20 | Temporary email |
| Generic Username | -10 | Role-based (admin, info) |
| Catch-All Domain | -5 | Accepts any address |

**Score Interpretation:**

| Score | Rating | Action |
|-------|--------|--------|
| 90-100 | Excellent | Safe to use |
| 70-89 | Good | Generally reliable |
| 50-69 | Fair | Use with caution |
| 30-49 | Poor | High risk |
| 0-29 | Very Poor | Reject |

---

### Caching

Built-in LRU cache for improved performance on repeated validations.

```javascript
import { validateEmail, clearCache, getGlobalCache } from 'email-validator-ultimate';

// Enable caching
const result = await validateEmail({
  email: 'user@gmail.com',
  fromEmail: 'noreply@app.com',
  cache: true
});

// Second call is instant (cached)
const cached = await validateEmail({
  email: 'user@gmail.com',
  fromEmail: 'noreply@app.com',
  cache: true
});

// View cache stats
console.log(getGlobalCache().stats());
// { size: 1, maxSize: 1000, ttl: 300000 }

// Clear when needed
clearCache();
```

---

## CLI Tool

Email Validator Ultimate includes a powerful command-line interface.

### Installation

```bash
npm install -g email-validator-ultimate
```

### Commands

```bash
# Validate single email
email-validator-ultimate validate user@gmail.com

# Or use the short alias
evu validate user@gmail.com

# Quick validation (format + MX only)
evu quick user@gmail.com

# Batch validation from file
evu batch emails.txt --json > results.json

# Normalize email
evu normalize "j.o.h.n+tag@gmail.com"

# Risk analysis
evu risk suspicious123@unknown.xyz

# Check Gravatar
evu gravatar user@gmail.com

# Check blacklists
evu blacklist suspicious-domain.com

# Typo suggestions
evu suggest user@gmial.com

# With SMTP check
evu validate user@company.com --smtp --from noreply@myapp.com

# JSON output
evu validate user@gmail.com --json
```

### CLI Output Example

```
╔═══════════════════════════════════════════════════════════╗
║         Email Validator Ultimate v2.1.0                   ║
║         Advanced Email Validation Tool                    ║
╚═══════════════════════════════════════════════════════════╝

Validating: user@gmail.com
──────────────────────────────────────────────────────
  • Email: user@gmail.com
  ✓ Format Valid: true
  ✓ Has MX Record: true
  ✓ Is Disposable: false
  ✓ Is Generic: false
  • Is Free Provider: true
  • Provider: Gmail
  • MX Record: gmail-smtp-in.l.google.com

  Quality Score:
  ██████████ 100/100
```

---

## API Reference

### Main Functions

| Function | Description |
|----------|-------------|
| `validateEmail(options)` | Comprehensive single email validation |
| `validateEmails(options)` | Batch validation with concurrency |
| `quickValidate(email)` | Fast validation (format + MX only) |
| `validateWithPreset(email, from, preset)` | Validate using presets |
| `validateEmailComprehensive(email, from)` | Full validation with all checks |

### Utility Functions

| Function | Description |
|----------|-------------|
| `normalizeEmail(email)` | Normalize email address |
| `areEmailsEquivalent(email1, email2)` | Check if emails are same person |
| `analyzeRisk(email)` | Get risk analysis |
| `checkGravatar(email)` | Check Gravatar profile |
| `checkBlacklist(domain)` | Check DNS blacklists |
| `getEmailSuggestion(email)` | Get typo suggestion |
| `isDisposable(email)` | Check if disposable |
| `isGeneric(username)` | Check if generic username |
| `getQualityScore(factors)` | Calculate quality score |

### Configuration Functions

| Function | Description |
|----------|-------------|
| `addDisposableDomains(domains)` | Add disposable domains |
| `removeDisposableDomains(domains)` | Remove disposable domains |
| `addToWhitelist(domains)` | Whitelist domains |
| `setGenericUsernames(usernames)` | Set generic usernames |
| `clearCache()` | Clear validation cache |

---

## TypeScript Support

Full TypeScript support with exported types.

```typescript
import {
  validateEmail,
  ValidateOptions,
  ValidationResult,
  RiskAnalysisResult,
  GravatarResult,
  BlacklistResult,
  NormalizeResult
} from 'email-validator-ultimate';

const options: ValidateOptions = {
  email: 'user@gmail.com',
  fromEmail: 'noreply@app.com',
  smtpCheck: true,
  cache: true
};

const result: ValidationResult = await validateEmail(options);
```

---

## Best Practices

### 1. Use Caching in Production

```javascript
const result = await validateEmail({
  email: 'user@example.com',
  fromEmail: 'noreply@app.com',
  cache: true  // Always enable in production
});
```

### 2. Use Appropriate Validation Level

```javascript
// For sign-up forms (quick response)
const quick = await quickValidate(email);

// For important operations (comprehensive)
const full = await validateEmail({ email, fromEmail, smtpCheck: true });
```

### 3. Handle Suggestions in UI

```javascript
const result = await validateEmail({ email, fromEmail });

if (result.suggestion) {
  // Show user: "Did you mean user@gmail.com?"
  showSuggestion(result.suggestion.suggested);
}
```

### 4. Batch Processing

```javascript
// Use appropriate concurrency based on your server
const result = await validateEmails({
  emails: largeList,
  fromEmail: 'noreply@app.com',
  concurrency: 5,  // Don't overwhelm mail servers
  skipDisposableCheck: true  // Skip API calls for speed
});
```

---

## Express.js Integration

```javascript
const express = require('express');
const { validateEmail, validateEmails } = require('email-validator-ultimate');

const app = express();
app.use(express.json());

// Single validation endpoint
app.post('/api/validate', async (req, res) => {
  try {
    const result = await validateEmail({
      email: req.body.email,
      fromEmail: 'noreply@yourapp.com',
      cache: true
    });

    res.json({
      valid: result.formatValid && result.hasMX && !result.isDisposable,
      score: result.qualityScore,
      suggestion: result.suggestion?.suggested
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Batch validation endpoint
app.post('/api/validate-batch', async (req, res) => {
  const result = await validateEmails({
    emails: req.body.emails,
    fromEmail: 'noreply@yourapp.com',
    concurrency: 10
  });

  res.json(result);
});

app.listen(3000);
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## Changelog

### v2.1.0
- Added email normalization (Gmail dots, plus aliases)
- Added risk pattern analysis
- Added Gravatar detection
- Added DNS blacklist checking
- Added CLI tool with multiple commands
- Expanded disposable domains to 150+
- Added whitelist functionality
- Added comprehensive validation function

### v2.0.0
- RFC 5322 compliant format validation
- Email typo suggestions
- Batch validation with concurrency
- LRU caching support
- Validation presets
- Full TypeScript definitions

### v1.0.0
- Initial release

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Aminul Islam (Mehedi Hasan)**

- Email: aminulislamdev23@gmail.com
- GitHub: [@ai-mehedi](https://github.com/ai-mehedi)

---

<p align="center">
  <sub>Built with love for the Node.js community</sub>
</p>
