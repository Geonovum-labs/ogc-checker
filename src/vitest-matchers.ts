import { ISpectralDiagnostic } from '@stoplight/spectral-core';
import { expect } from 'vitest';

expect.extend({
  toContainViolation(violations: ISpectralDiagnostic[], code: string, count: number = 1, message?: string | RegExp) {
    expect(Array.isArray(violations)).toBe(true);
    expect(violations).length(count);

    violations.forEach(violation => {
      expect(violation).toMatchObject({ code });

      if (message) {
        expect(violation).toMatchObject({
          message: expect.stringMatching(message),
        });
      }
    });

    return { pass: !this.isNot, message: () => `Violation for rule "${code}" is found in violation list.` };
  },
});
