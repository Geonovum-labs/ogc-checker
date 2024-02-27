export enum DocumentTypes {
  FEATURE = 'Feature',
  FEATURE_COLLECTION = 'FeatureCollection',
}

export type FeatureDocument = Feature | FeatureCollection;

export interface Feature {
  type: DocumentTypes.FEATURE;
  conformsTo?: string[];
  time: Time | null;
}

export interface FeatureCollection {
  type: DocumentTypes.FEATURE_COLLECTION;
  conformsTo?: string[];
  features: Feature[];
}

export interface Time {
  date?: string;
  timestamp?: string;
  interval?: [string, string];
}
