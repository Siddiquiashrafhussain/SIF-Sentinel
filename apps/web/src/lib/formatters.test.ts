import {
  formatSifClass,
  formatConfidence,
  formatDate,
  formatDateTime,
  formatPercentage,
  formatReportType,
  formatReviewStatus,
  formatLsrName,
  formatBarrierStatus,
} from './formatters';

describe('Formatters', () => {
  describe('formatSifClass', () => {
    it('formats SIF classes correctly', () => {
      expect(formatSifClass('HIGH_SIF')).toBe('High Sif');
      expect(formatSifClass('CRITICAL_SIF')).toBe('Critical Sif');
      expect(formatSifClass('NON_SIF')).toBe('Non Sif');
    });
    it('handles null/undefined', () => {
      expect(formatSifClass(null)).toBe('Unknown');
      expect(formatSifClass(undefined)).toBe('Unknown');
    });
  });

  describe('formatConfidence', () => {
    it('formats normal values', () => {
      expect(formatConfidence(0)).toBe('0.0%');
      expect(formatConfidence(0.5)).toBe('50.0%');
      expect(formatConfidence(0.948)).toBe('94.8%');
      expect(formatConfidence(1)).toBe('100.0%');
    });
    it('handles boundary and invalid values', () => {
      expect(formatConfidence(-0.1)).toBe('Invalid');
      expect(formatConfidence(1.1)).toBe('Invalid');
    });
    it('handles null/undefined', () => {
      expect(formatConfidence(null)).toBe('Unknown');
      expect(formatConfidence(undefined)).toBe('Unknown');
    });
  });

  describe('formatPercentage', () => {
    it('formats normal values', () => {
      expect(formatPercentage(0)).toBe('0.0%');
      expect(formatPercentage(50)).toBe('50.0%');
      expect(formatPercentage(94.8)).toBe('94.8%');
      expect(formatPercentage(100)).toBe('100.0%');
    });
    it('handles invalid values', () => {
      expect(formatPercentage(-10)).toBe('Invalid');
    });
    it('handles null/undefined', () => {
      expect(formatPercentage(null)).toBe('Unknown');
      expect(formatPercentage(undefined)).toBe('Unknown');
    });
  });

  describe('formatDate', () => {
    it('handles normal dates', () => {
      expect(formatDate('2023-01-01')).toBe(new Date('2023-01-01').toLocaleDateString());
    });
    it('handles invalid dates', () => {
      expect(formatDate('not-a-date')).toBe('Invalid Date');
    });
    it('handles null/undefined', () => {
      expect(formatDate(null)).toBe('Unknown');
    });
  });
});
