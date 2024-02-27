import { GeometryTypes, Position } from '../../types';
import { Rule } from '../ruleValidation';

type Coordinates = Position | Position[] | Position[][] | Position[][][] | Position[][][][] | Position[][][][][];

const getDimensions = (coordinates: Coordinates): number[] => {
  if (typeof coordinates[0] === 'number') {
    return [coordinates.length];
  }

  return coordinates.flatMap(c => getDimensions(c as Exclude<Coordinates, Position>));
};

const rules: Rule[] = [];

rules.push({
  name: '/req/core/coordinate-dimension',
  validateFeature: feature => {
    if (feature.geometry !== null) {
      const dimensions = getDimensions(feature.geometry.coordinates);

      if (dimensions.some(dimension => dimension !== dimensions[0])) {
        return {
          pointer: '/geometry',
          message: 'All positions in a geometry object SHALL have the same dimension.',
        };
      }
    }

    if (feature.place !== null) {
      const geometry = feature.place;
      let dimensions: number[] = [];

      if (geometry.type === GeometryTypes.PRISM) {
        dimensions = getDimensions(geometry.base.coordinates);
      } else if (geometry.type === GeometryTypes.MULTIPRISM) {
        dimensions = geometry.prisms.flatMap(p => getDimensions(p.base.coordinates));
      } else {
        dimensions = getDimensions(geometry.coordinates);
      }

      if (dimensions.some(dimension => dimension !== dimensions[0])) {
        return {
          pointer: '/place',
          message: 'All positions in a geometry object SHALL have the same dimension.',
        };
      }
    }
  },
});

export default rules;
