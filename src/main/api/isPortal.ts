const portalSymbol = Symbol.for('react.portal');

const specHintSymbol = Symbol.for('js-spec:hint');

export default function isPortal(it: any): boolean {
    return it !== null
        && typeof it === 'object' && it.$$typeof === portalSymbol;
}

isPortal[specHintSymbol] = 'Must be a React portal';
