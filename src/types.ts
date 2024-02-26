export enum DocumentTypes {
  FEATURE = 'Feature',
  FEATURE_COLLECTION = 'FeatureCollection',
}

export type FeatureDocument = Feature | FeatureCollection;

export interface Feature {
  type: DocumentTypes.FEATURE;
  time: Time | null;
}

export interface FeatureCollection {
  type: DocumentTypes.FEATURE_COLLECTION;
  features: Feature[];
}

export interface Time {
  date: string;
  timestamp: string;
  interval: [string, string];
}
