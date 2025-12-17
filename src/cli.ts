#!/usr/bin/env node
/**
 * Email Validator Ultimate CLI
 * Command line interface for email validation
 */

import { validateEmail, quickValidate, validateEmails } from './index';
import { analyzeRisk } from './utils/risk';
import { normalizeEmail } from './utils/normalize';
import { checkGravatar } from './utils/gravatar';
import { checkBlacklist } from './utils/blacklist';
import { getEmailSuggestion } from './utils/suggest';
import * as fs from 'fs';
import * as readline from 'readline';

const VERSION = '2.0.0';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

function printLogo(): void {
  console.log(colorize(`
╔═══════════════════════════════════════════════════════════╗
║         ${colorize('Email Validator Ultimate', 'cyan')} v${VERSION}              ║
║         Advanced Email Validation Tool                    ║
╚═══════════════════════════════════════════════════════════╝
`, 'bright'));
}

function printHelp(): void {
  console.log(`
${colorize('USAGE:', 'bright')}
  email-validator-ultimate <command> [options]

${colorize('COMMANDS:', 'bright')}
  ${colorize('validate', 'cyan')} <email>       Validate a single email address
  ${colorize('quick', 'cyan')} <email>          Quick validation (format + MX only)
  ${colorize('batch', 'cyan')} <file>           Validate emails from a file
  ${colorize('normalize', 'cyan')} <email>      Normalize email address
  ${colorize('risk', 'cyan')} <email>           Analyze email for risk patterns
  ${colorize('gravatar', 'cyan')} <email>       Check Gravatar profile
  ${colorize('blacklist', 'cyan')} <domain>     Check domain blacklist status
  ${colorize('suggest', 'cyan')} <email>        Get typo suggestions
  ${colorize('help', 'cyan')}                   Show this help message
  ${colorize('version', 'cyan')}                Show version

${colorize('OPTIONS:', 'bright')}
  --smtp              Enable SMTP validation
  --json              Output in JSON format
  --no-color          Disable colored output
  --from <email>      Sender email for SMTP check

${colorize('EXAMPLES:', 'bright')}
  email-validator-ultimate validate user@gmail.com
  email-validator-ultimate validate user@company.com --smtp --from noreply@myapp.com
  email-validator-ultimate batch emails.txt --json > results.json
  email-validator-ultimate normalize j.o.h.n+tag@gmail.com
  email-validator-ultimate risk suspicious123456@unknown.xyz
`);
}

function printResult(label: string, value: unknown, isGood?: boolean): void {
  const icon = isGood === undefined ? '•' : isGood ? '✓' : '✗';
  const iconColor = isGood === undefined ? 'blue' : isGood ? 'green' : 'red';
  console.log(`  ${colorize(icon, iconColor)} ${colorize(label + ':', 'bright')} ${value}`);
}

async function validateCommand(email: string, options: { smtp?: boolean; from?: string; json?: boolean }): Promise<void> {
  const fromEmail = options.from || 'noreply@validator.local';

  console.log(colorize(`\nValidating: ${email}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  try {
    const result = await validateEmail({
      email,
      fromEmail,
      smtpCheck: options.smtp || false,
      skipDisposableCheck: false,
    });

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    printResult('Email', result.email);
    printResult('Format Valid', result.formatValid, result.formatValid);
    printResult('Has MX Record', result.hasMX, result.hasMX);
    printResult('Is Disposable', result.isDisposable, !result.isDisposable);
    printResult('Is Generic', result.isGeneric, !result.isGeneric);
    printResult('Is Free Provider', result.isFree);
    printResult('Provider', result.provider);
    printResult('MX Record', result.mxRecord || 'N/A');

    if (options.smtp) {
      console.log(colorize('\n  SMTP Check:', 'bright'));
      printResult('  Can Receive', result.canReceiveEmail.smtpSuccess, result.canReceiveEmail.smtpSuccess);
      printResult('  Message', result.canReceiveEmail.message);
      printResult('  Catch-All', result.canReceiveEmail.catchAll, !result.canReceiveEmail.catchAll);
    }

    if (result.suggestion) {
      console.log(colorize('\n  Suggestion:', 'yellow'));
      printResult('  Did you mean', result.suggestion.suggested);
    }

    console.log(colorize('\n  Quality Score:', 'bright'));
    const scoreColor = result.qualityScore >= 70 ? 'green' : result.qualityScore >= 40 ? 'yellow' : 'red';
    console.log(`  ${colorize('█'.repeat(Math.floor(result.qualityScore / 10)), scoreColor)}${'░'.repeat(10 - Math.floor(result.qualityScore / 10))} ${result.qualityScore}/100`);

  } catch (error) {
    console.error(colorize(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red'));
  }
}

async function quickCommand(email: string, options: { json?: boolean }): Promise<void> {
  console.log(colorize(`\nQuick Validation: ${email}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  try {
    const result = await quickValidate(email);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    printResult('Email', result.email);
    printResult('Format Valid', result.formatValid, result.formatValid);
    printResult('Has MX', result.hasMX, result.hasMX);
    printResult('Is Valid', result.isValid, result.isValid);

    if (result.suggestion) {
      printResult('Suggestion', result.suggestion);
    }
  } catch (error) {
    console.error(colorize(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red'));
  }
}

async function batchCommand(filePath: string, options: { json?: boolean; smtp?: boolean; from?: string }): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.error(colorize(`Error: File not found: ${filePath}`, 'red'));
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const emails = fileContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  console.log(colorize(`\nBatch Validation: ${emails.length} emails`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  const fromEmail = options.from || 'noreply@validator.local';

  const result = await validateEmails({
    emails,
    fromEmail,
    smtpCheck: options.smtp || false,
    concurrency: 5,
    onProgress: (completed, total) => {
      if (!options.json) {
        process.stdout.write(`\r  Progress: ${completed}/${total} (${Math.round(completed / total * 100)}%)`);
      }
    },
  });

  if (!options.json) {
    console.log('\n');
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(colorize('\nSummary:', 'bright'));
  printResult('Total', result.total);
  printResult('Valid', result.valid, result.valid > 0);
  printResult('Invalid', result.invalid, result.invalid === 0);
  printResult('Processing Time', `${result.processingTime}ms`);
  printResult('Average Score', result.summary.averageScore);

  console.log(colorize('\nBreakdown:', 'bright'));
  printResult('Valid Format', result.summary.validFormat);
  printResult('Has MX', result.summary.hasMX);
  printResult('Disposable', result.summary.disposable, result.summary.disposable === 0);
  printResult('Generic', result.summary.generic);
  printResult('Free Provider', result.summary.freeProvider);
}

function normalizeCommand(email: string, options: { json?: boolean }): void {
  console.log(colorize(`\nNormalizing: ${email}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  const result = normalizeEmail(email);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printResult('Original', result.original);
  printResult('Normalized', result.normalized);
  printResult('Was Modified', result.wasModified, !result.wasModified);
  printResult('Local Part', result.localPart);
  printResult('Domain', result.domain);

  if (result.removedAlias) {
    printResult('Removed Alias', result.removedAlias);
  }
}

function riskCommand(email: string, options: { json?: boolean }): void {
  console.log(colorize(`\nRisk Analysis: ${email}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  const result = analyzeRisk(email);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const riskColor = result.riskLevel === 'low' ? 'green' :
    result.riskLevel === 'medium' ? 'yellow' :
    result.riskLevel === 'high' ? 'red' : 'red';

  printResult('Risk Level', colorize(result.riskLevel.toUpperCase(), riskColor));
  printResult('Risk Score', `${result.riskScore}/100`);
  printResult('Is High Risk', result.isHighRisk, !result.isHighRisk);

  if (result.factors.length > 0) {
    console.log(colorize('\n  Risk Factors:', 'bright'));
    result.factors.forEach(factor => {
      console.log(`    ${colorize('•', 'yellow')} ${factor.description} (${factor.severity})`);
    });
  } else {
    console.log(colorize('\n  No risk factors detected', 'green'));
  }
}

async function gravatarCommand(email: string, options: { json?: boolean }): Promise<void> {
  console.log(colorize(`\nGravatar Check: ${email}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  try {
    const result = await checkGravatar(email);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    printResult('Has Gravatar', result.hasGravatar, result.hasGravatar);
    printResult('Hash', result.hash);
    printResult('Image URL', result.gravatarUrl);
    printResult('Profile URL', result.profileUrl);

    if (result.profile) {
      console.log(colorize('\n  Profile:', 'bright'));
      if (result.profile.displayName) printResult('  Name', result.profile.displayName);
      if (result.profile.currentLocation) printResult('  Location', result.profile.currentLocation);
    }
  } catch (error) {
    console.error(colorize(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red'));
  }
}

async function blacklistCommand(domain: string, options: { json?: boolean }): Promise<void> {
  console.log(colorize(`\nBlacklist Check: ${domain}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  try {
    const result = await checkBlacklist(domain);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    printResult('Domain', result.domain);
    printResult('Is Blacklisted', result.isBlacklisted, !result.isBlacklisted);
    printResult('Reputation Score', `${result.reputationScore}/100`);
    printResult('Lists Checked', result.totalChecked);

    if (result.listedIn.length > 0) {
      console.log(colorize('\n  Listed In:', 'red'));
      result.listedIn.forEach(list => {
        console.log(`    ${colorize('✗', 'red')} ${list}`);
      });
    }

    if (result.mxServers && result.mxServers.length > 0) {
      console.log(colorize('\n  MX Servers:', 'bright'));
      result.mxServers.forEach(ip => {
        console.log(`    • ${ip}`);
      });
    }
  } catch (error) {
    console.error(colorize(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red'));
  }
}

function suggestCommand(email: string, options: { json?: boolean }): void {
  console.log(colorize(`\nTypo Suggestion: ${email}`, 'cyan'));
  console.log(colorize('─'.repeat(50), 'dim'));

  const result = getEmailSuggestion(email);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printResult('Original', result.original);
  printResult('Has Suggestion', result.hasSuggestion);

  if (result.hasSuggestion && result.suggested) {
    printResult('Suggested', colorize(result.suggested, 'green'));
    if (result.domain) {
      printResult('Domain Change', `${result.domain.original} → ${result.domain.suggested}`);
    }
  } else {
    console.log(colorize('  No typos detected', 'green'));
  }
}

// Parse command line arguments
function parseArgs(): { command: string; args: string[]; options: Record<string, string | boolean> } {
  const args = process.argv.slice(2);
  const options: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        options[key] = args[++i];
      } else {
        options[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return {
    command: positional[0] || 'help',
    args: positional.slice(1),
    options,
  };
}

// Main entry point
async function main(): Promise<void> {
  const { command, args, options } = parseArgs();

  if (options['no-color']) {
    Object.keys(colors).forEach(key => {
      colors[key as keyof typeof colors] = '';
    });
  }

  switch (command) {
    case 'validate':
      if (!args[0]) {
        console.error(colorize('Error: Email address required', 'red'));
        process.exit(1);
      }
      printLogo();
      await validateCommand(args[0], {
        smtp: options.smtp === true,
        from: options.from as string,
        json: options.json === true,
      });
      break;

    case 'quick':
      if (!args[0]) {
        console.error(colorize('Error: Email address required', 'red'));
        process.exit(1);
      }
      printLogo();
      await quickCommand(args[0], { json: options.json === true });
      break;

    case 'batch':
      if (!args[0]) {
        console.error(colorize('Error: File path required', 'red'));
        process.exit(1);
      }
      printLogo();
      await batchCommand(args[0], {
        json: options.json === true,
        smtp: options.smtp === true,
        from: options.from as string,
      });
      break;

    case 'normalize':
      if (!args[0]) {
        console.error(colorize('Error: Email address required', 'red'));
        process.exit(1);
      }
      printLogo();
      normalizeCommand(args[0], { json: options.json === true });
      break;

    case 'risk':
      if (!args[0]) {
        console.error(colorize('Error: Email address required', 'red'));
        process.exit(1);
      }
      printLogo();
      riskCommand(args[0], { json: options.json === true });
      break;

    case 'gravatar':
      if (!args[0]) {
        console.error(colorize('Error: Email address required', 'red'));
        process.exit(1);
      }
      printLogo();
      await gravatarCommand(args[0], { json: options.json === true });
      break;

    case 'blacklist':
      if (!args[0]) {
        console.error(colorize('Error: Domain required', 'red'));
        process.exit(1);
      }
      printLogo();
      await blacklistCommand(args[0], { json: options.json === true });
      break;

    case 'suggest':
      if (!args[0]) {
        console.error(colorize('Error: Email address required', 'red'));
        process.exit(1);
      }
      printLogo();
      suggestCommand(args[0], { json: options.json === true });
      break;

    case 'version':
      console.log(`email-validator-ultimate v${VERSION}`);
      break;

    case 'help':
    default:
      printLogo();
      printHelp();
      break;
  }
}

main().catch(console.error);
