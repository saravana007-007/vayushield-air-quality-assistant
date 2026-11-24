import { describe, it, expect, vi } from 'vitest';
import { sanitizeForPdf, generateActionPlanPdf } from '../pdfService';
import { DEMO_PLANS } from '../../data/demoPlans';
import { AIR_PRESETS } from '../airQualityService';

vi.mock('jspdf', () => {
  const mockDoc = {
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    setFillColor: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    setTextColor: vi.fn().mockReturnThis(),
    setFontSize: vi.fn().mockReturnThis(),
    setFont: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    setDrawColor: vi.fn().mockReturnThis(),
    line: vi.fn().mockReturnThis(),
    roundedRect: vi.fn().mockReturnThis(),
    splitTextToSize: vi.fn((text: string) => [text]),
    addPage: vi.fn().mockReturnThis(),
    save: vi.fn().mockReturnThis(),
  };

  function MockJsPdf() {
    return mockDoc;
  }

  return {
    jsPDF: MockJsPdf,
  };
});

describe('services/pdfService', () => {
  describe('sanitizeForPdf', () => {
    it('returns empty string for empty input', () => {
      expect(sanitizeForPdf('')).toBe('');
    });

    it('replaces common non-Latin unicode characters with ASCII equivalents', () => {
      const input = `“Smart Action” ‘Plan’ — Micro: 25 \u03BCg/m³, arrow → test`;
      const output = sanitizeForPdf(input);

      expect(output).toContain('"Smart Action"');
      expect(output).toContain("'Plan'");
      expect(output).toContain('-');
      expect(output).toContain('u');
      expect(output).toContain('->');
    });

    it('substitutes unsupported unicode with question mark', () => {
      const input = 'Special symbol 🚀 in text';
      expect(sanitizeForPdf(input)).toContain('?');
    });
  });

  describe('generateActionPlanPdf', () => {
    it('creates document and invokes save without error', async () => {
      const airData = AIR_PRESETS['delhi-severe']!;
      const plan = DEMO_PLANS['delhi-severe']!;

      await expect(generateActionPlanPdf(airData, plan, 85)).resolves.toBeUndefined();
    });
  });
});
