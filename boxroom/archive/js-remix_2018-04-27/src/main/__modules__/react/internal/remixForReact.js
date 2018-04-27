import React from 'react';

export default function remixForReact(config, component) {
    let ret;

    if (!config || typeof config !== 'object') {
        throw new TypeError('[remix] First argument must be an object');
    } else if (component !== undefined && typeof component !== 'function') {
        throw new TypeError( '[remix] Second argument must be a function');
    } else if (arguments.length > 1 && component === undefined) {
        throw new TypeError('[remix] Not allowed to set second argument '
            + 'explicitly to undefined');
    } else if (component) {
        const isComponentClass = component.prototype instanceof React.Component;

        if (!isComponentClass)  {
            if (config.operations) {
                throw new TypeError(
                    '[remix] Component configuration contains the parameter '
                        + '"operations" therefore the configuration cannot be '
                        + 'applied on a render function');
            } else if (config.isErrorBoundary) {
                throw new TypeError(
                    '[remix] Component configuration contains the parameter '
                        + '"isErrorBoundary" therefore the configuration '
                        + 'cannot be applied on a render function');
            }
        }
    }

    const error = validateComponentConfig(config);

    if (error) {
        throw new TypeError(`[remix] Invalid first argument: ${error.message}`);
    }

    if (component === undefined) {
        ret = component => remix(config, component);
    } else {
        const reactConfig = convertConfigForReact(config);

        if (component.prototype instanceof React.Component) { 
            ret = class CustomComponent extends component {};
        } else {
            ret = component.bind(null);
        }

        Object.assign(ret, reactConfig);
        
        const factory = React.createFactory(ret);

        Object.defineProperty(ret, 'factory', {
            get() {
                return this === ret ? factory : undefined;
            }
        });
        
        Object.defineProperty(ret, 'type', {
            get() {
                return this === ret ? ret : undefined;  
            }
        });

        Object.freeze(ret);
    }

    return ret;
}
