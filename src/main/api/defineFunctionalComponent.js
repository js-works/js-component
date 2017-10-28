import determineComponentMeta from 
    '../internal/helper/determineComponentMeta';

import Component from '../api/Component';

import { defineComponent } from 'js-surface';

export default function defineFunctionalComponent(renderFunction) {
    if (typeof renderFunction !== 'function') {
        throw new Error(
            '[defineFunctionalComponent] '
                + "First argument 'renderFunction' must be a function");
    } else if (renderFunction.prototype instanceof Component) {
        throw new Error(
            '[defineFunctionalComponent] '
                + "First argument 'renderFunction' must not be a component class");
    }

    let meta;
    
    try {
        meta = determineComponentMeta(renderFunction);
    } catch (error) {
        throw new Error('[defineFunctionComponent] ' + error.message);
    }

    const
        jsSurfaceConfig = Object.assign(
            { render: renderFunction },
            meta);

    return  defineComponent(jsSurfaceConfig);
}
