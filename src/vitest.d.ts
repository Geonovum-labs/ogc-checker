/* eslint-disable @typescript-eslint/no-empty-object-type */
import 'vitest';

interface CustomMatchers<R = unknown> {
  toContainViolation: (code: string, count: number = 1, message?: string | RegExp) => R;
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
