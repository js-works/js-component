import React from 'react';

const specHintSymbol = Symbol.for('js-spec:hint');

export default function isElement(it) {
    return React.isValidElement(it);
}

isElement[specHintSymbol] = 'Must be a React element';
