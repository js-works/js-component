const
    contextSymbol = Symbol.for('react.context'),
    providerSymbol = Symbol.for('react.provier'),
    specHintSymbol = Symbol.for('js-spec:hint');

export default function isContext(it) {
    return it !== null
        && typeof it === 'object'
        && it.$$typeof === contextSymbol
        && it.Provider !== null
        && typeof it.Provider === 'object'
        && it.Provider.$$typeof === providerSymbol
        && it.Provider.context === it
        && it.Consumer === it;
}

isContext[specHintSymbol] = 'Must be a React context';
