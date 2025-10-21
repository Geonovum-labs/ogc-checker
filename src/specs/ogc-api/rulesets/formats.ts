import spectralFormats from '@stoplight/spectral-formats';
type FormatFn = (document: unknown) => boolean;
type FormatNamespace = Record<string, unknown>;
let cachedOas30: FormatFn | undefined;
const lookup = (): FormatFn => {
  if (!cachedOas30) {
    const namespace = (spectralFormats as unknown as FormatNamespace) ?? {};
    const candidate = namespace.oas3_0;
    if (typeof candidate !== 'function') {
      throw new Error("Format 'oas3_0' is not available from @stoplight/spectral-formats.");
    }
    cachedOas30 = candidate as FormatFn;
  }
  return cachedOas30;
};
export const oas3_0: FormatFn = document => lookup()(document);