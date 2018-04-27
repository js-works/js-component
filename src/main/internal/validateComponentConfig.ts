import { Spec, SpecValidator } from 'js-spec';

// --- constants needed for the validation --------------------------
const
    REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_.]*$/,
    REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
    REGEX_METHOD_NAME = /^[a-z][a-zA-Z0-9_-]*$/,

    FORBIDDEN_OPERATION_NAMES = new Set(
        ['props', 'state', 'context', 'shouldComponentUpdate',
            'setState', 'componentWillReceiveProps',
            'componentWillMount', 'componentDidMount',
            'componentWillUpdate', 'componentDidUpdate',
            'componentDidCatch', 'constructor', 'forceUpdate']);

// --- the spec of the component configuration ----------------------

const componentConfigSpec =
    Spec.and(
        Spec.shape({
            displayName:
                Spec.match(REGEX_DISPLAY_NAME),

            properties:
                Spec.optional(
                    Spec.and(
                        Spec.object,

                        Spec.keysOf(
                            Spec.match(REGEX_PROPERTY_NAME)),

                        Spec.valuesOf(
                            Spec.and(
                                Spec.shape({
                                    type:
                                        Spec.optional(Spec.function),
                                    
                                    constraint:
                                        Spec.optional(
                                            Spec.or(
                                                Spec.function,
                                                Spec.instanceOf(SpecValidator)
                                            )),

                                    nullable:
                                        Spec.optional(Spec.boolean),

                                    defaultValue:
                                        Spec.optional(Spec.any),

                                    getDefaultValue:
                                        Spec.optional(Spec.function),
                                }),
                            
                                Spec.valid(
                                    it => !it.hasOwnProperty('defaultValue')
                                        || it.getDefaultValue === undefined)
                                    .usingHint('Not allowed to set parameters "defaultValue" '
                                        + 'and "getDefaultValue" both at once'))))),

            methods:
                Spec.optional(
                    Spec.arrayOf(
                        Spec.and(
                            Spec.match(REGEX_METHOD_NAME),
                            Spec.notIn(FORBIDDEN_OPERATION_NAMES)))),

            isErrorBoundary:
                Spec.optional(Spec.boolean)
        }));

// --- the actual configuration validation function -----------------

export default function validateComponentConfig(config) {
    let ret = null;

    if (config === null || typeof config !== 'object') {
        ret = 'Component configuration must be an object';
    } else {
        ret = componentConfigSpec.validate(config);
    }

    return ret;
}
