import React, { ReactNode } from 'react';

const specHintSymbol = Symbol.for('js-spec:hint');

export default function isNode(it: any): boolean {
  const type = typeof it;

  return it === undefined
    || it === null
    || typeof it !== 'object'
    || typeof it[Symbol.iterator] === 'function'
    || React.isValidElement(it);
}

(<any>isNode)[specHintSymbol] = 'Must be a React element';
