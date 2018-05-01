const
  portalSymbol = Symbol.for('react.portal'),
  specHintSymbol = Symbol.for('js-spec:hint');

export default function isPortal(it: any): boolean {
  return it !== null
    && typeof it === 'object' && it.$$typeof === portalSymbol;
}

(<any>isPortal)[specHintSymbol] = 'Must be a React portal';
