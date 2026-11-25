import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface VercelConfig {
  headers: Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
}

const config = JSON.parse(
  readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8')
) as VercelConfig;

describe('security configuration', () => {
  it('allows every external API domain in the connect-src CSP directive', () => {
    const csp = config.headers
      .flatMap((rule) => rule.headers)
      .find((header) => header.key === 'Content-Security-Policy')?.value;
    expect(csp).toBeDefined();

    const connectSrc =
      csp
        ?.split(';')
        .map((directive) => directive.trim())
        .find((directive) => directive.startsWith('connect-src')) ?? '';

    for (const domain of [
      'https://api.open-meteo.com',
      'https://geocoding-api.open-meteo.com',
      'https://generativelanguage.googleapis.com',
    ]) {
      expect(connectSrc).toContain(domain);
    }
  });
});
