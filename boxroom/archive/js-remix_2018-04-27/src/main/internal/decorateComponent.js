import React from 'react';

export default function decorateComponent(component, config) {
    const convertedConfig = convertToReactConfig(config);

    if (component.prototype instanceof React.Component) {
        ret = class Component extends component {
            get context() {
                throw new Error(
                    'Not allowed to access context for component '
                        + `"${config.displayName}"`);
            }

            set context() {
                throw new Error(
                    'Not allowed to access context for component '
                        + `"${config.displayName}"`);
            }
        };
    } else {
        ret = props => component(props);
    }

    const factory = React.createFactory(ret);

    Object.defineProperty(ret, 'factory', {
        get() {
            return this === ret ? factory : undefined;
        }
    });

    Object.assign(ret, convertedConfig);
    Object.freeze(ret);

    return ret;
}
