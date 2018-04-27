import ComponentConfig from './ComponentConfig';
import validateComponentConfig from '../internal/validateComponentConfig';
import { Spec } from 'js-spec';


export default function componentMeta(config: ComponentConfig) {
    const
        ret: any = {},
        error = validateComponentConfig(config);

    if (error) {
        throw new TypeError('[componentMeta] Illegal component configuration: '
            + error.message)
    }

    ret.displayName = config.displayName;

    if (config.properties) {
        ret.propTypes = {};
        ret.defaultValues = {};

        const propNames = Object.keys(config.properties);

        for (let i = 0; i < propNames.length; ++i) {
            const
                propName = propNames[i],
                propConfig = config.properties[propName],
                type = propConfig.type || null,
                isPrimitiveType = type === Boolean || type === Number || type === String,
                nullable = !!propConfig.nullable,
                constraint = propConfig.constraint || null,
                hasDefaultValue = propConfig.hasOwnProperty('defaultValue'),
                defaultValue = propConfig.defaultValue || null,
                getDefaultValue = propConfig.getDefaultValue,
                mandatory = !hasDefaultValue && !getDefaultValue;

            if (hasDefaultValue) {
                ret.defaultProps[propName] = defaultValue;
            } else if (getDefaultValue) {
                Object.defineProperty(ret, propName, {
                    enumerable: true,
                    get: getDefaultValue
                });
            }

            if (type || constraint || !nullable || mandatory) {
                ret.propTypes[propName] = (it /* TODO */) => {
                    let
                        ret = null,
                        errorMsg = null;

                    const
                        isSomething = it !== undefined && it !== null,
                        isDefaultValue = hasDefaultValue && it === defaultValue;

                    if (mandatory && it === undefined) {
                        errorMsg = 'Property must not be undefined';
                    }

                    if (!errorMsg && !nullable && it === null) {
                        errorMsg = 'Property must not be null';
                    }

                    if (!errorMsg && isPrimitiveType && isSomething
                        && it.constructor !== type) {

                        errorMsg = 'Must be of type ' + type.name;
                    }

                    if (!errorMsg && type && isSomething
                        && !(it instanceof type)) {
                        
                        if (type === Array || type === Date) {
                            errorMsg = 'Must be of type ' + type.name;
                        } else {
                            errorMsg = 'Illegal type';
                        }
                    }

                    if (!errorMsg && constraint && !isDefaultValue) {
                        const result = Spec.valid(constraint);

                        if (result) {
                            errorMsg = result.message;
                        }
                    }

                    if (errorMsg) {
                        // TODO
                    }

                    return ret;
                }
            }
        }
    }

    return ret;
}