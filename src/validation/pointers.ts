import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';
import { EditorState, Text } from '@uiw/react-codemirror';
import { COMPLEX_TYPES, PRIMITIVE_TYPES, TOKENS } from './constants';

export type JsonCoordinates = {
  keyFrom?: number;
  keyTo?: number;
  valueFrom: number;
  valueTo: number;
};

export type JsonPointerMap = Map<string, JsonCoordinates>;

const stripSurroundingQuotes = (str: string) => {
  return str.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
};

const getWord = (doc: Text, node: SyntaxNode | null, stripQuotes = true) => {
  const word = node ? doc.sliceString(node.from, node.to) : '';
  return stripQuotes ? stripSurroundingQuotes(word) : word;
};

const getChildrenNodes = (node: SyntaxNode) => {
  const children = [];
  let child = node.firstChild;

  while (child) {
    if (child) children.push(child);
    child = child?.nextSibling;
  }

  return children;
};

const getArrayNodeChildren = (node: SyntaxNode) => {
  return getChildrenNodes(node).filter(n => isValueNode(n));
};

const findNodeIndexInArrayNode = (arrayNode: SyntaxNode, valueNode: SyntaxNode) => {
  return getArrayNodeChildren(arrayNode).findIndex(n => n.from === valueNode.from && n.to === valueNode.to);
};

const getMatchingChildNode = (node: SyntaxNode, nodeName: string) => {
  return getChildrenNodes(node).find(n => n.name === nodeName) ?? null;
};

const isValueNode = (node: SyntaxNode) => {
  return [...PRIMITIVE_TYPES, ...COMPLEX_TYPES].includes(node.name);
};

const getJsonPointerAt = (docText: Text, node: SyntaxNode) => {
  const path: string[] = [];

  for (let n: SyntaxNode | null = node; n?.parent; n = n.parent) {
    if (n.parent.name === TOKENS.PROPERTY) {
      const name = getMatchingChildNode(n.parent, TOKENS.PROPERTY_NAME);

      if (name) {
        path.unshift(getWord(docText, name));
      }
    } else if (n.parent.name === TOKENS.ARRAY) {
      if (isValueNode(n)) {
        const index = findNodeIndexInArrayNode(n.parent, n);
        path.unshift(`${index}`);
      }
    }
  }

  return '/' + path.join('/');
};

export const getJsonPointers = (state: EditorState): JsonPointerMap => {
  const tree = syntaxTree(state);
  const pointers: JsonPointerMap = new Map();

  tree.cursor().iterate(nodeRef => {
    const node = nodeRef.node;
    const nextNode = node.nextSibling?.node;
    const pointer = getJsonPointerAt(state.doc, node);

    if (nextNode && TOKENS.PROPERTY_NAME === nodeRef.name) {
      pointers.set(pointer, {
        keyFrom: node.from,
        keyTo: node.to,
        valueFrom: nextNode.from,
        valueTo: nextNode.to,
      });
    }

    if (TOKENS.ARRAY === node.parent?.name && !['[', ']'].includes(node.name)) {
      pointers.set(pointer, {
        valueFrom: node.from,
        valueTo: node.to,
      });
    }

    return true;
  });

  return pointers;
};
