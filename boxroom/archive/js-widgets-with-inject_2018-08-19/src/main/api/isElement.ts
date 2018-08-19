import React from 'react';

const specHintSymbol = Symbol.for('js-spec:hint');

export default function isElement(it: any): boolean {
  return React.isValidElement(it);
}

(<any>isElement)[specHintSymbol] = 'Must be a React element';
