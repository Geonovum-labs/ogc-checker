import threedMetadata from './3d-metadata';
import coreMetadata from './core-metadata';
import coreTemporal from './core-temporal';
import typesSchemasMetadata from './types-schemas-metadata';

export default [...coreMetadata, ...coreTemporal, ...threedMetadata, ...typesSchemasMetadata];
