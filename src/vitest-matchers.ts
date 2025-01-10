import { expect } from 'vitest';

expect.extend({
  toContainViolation(violations, code: string, message?: string | RegExp) {
    expect(Array.isArray(violations)).toBe(true);
    expect(violations).length(1);
    expect(violations[0]).toMatchObject({ code });

    if (message) {
      expect(violations[0]).toMatchObject({
        message: expect.stringMatching(message),
      });
    }

    return { pass: !this.isNot, message: () => `Violation for rule "${code}" is found in violation list.` };
  },
});
