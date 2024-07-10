export const TOKENS = {
  STRING: 'String',
  NUMBER: 'Number',
  TRUE: 'True',
  FALSE: 'False',
  NULL: 'Null',
  OBJECT: 'Object',
  ARRAY: 'Array',
  PROPERTY: 'Property',
  PROPERTY_NAME: 'PropertyName',
  JSON_TEXT: 'JsonText',
};

export const PRIMITIVE_TYPES: string[] = [
  TOKENS.STRING, //
  TOKENS.NUMBER,
  TOKENS.TRUE,
  TOKENS.FALSE,
  TOKENS.NULL,
];

export const COMPLEX_TYPES: string[] = [
  TOKENS.OBJECT, //
  TOKENS.ARRAY,
];
