import determineComponentMeta from 
    '../internal/helper/determineComponentMeta';

import { defineComponent } from 'js-surface';

export default function defineFunctionalComponent(renderFunction) {
    if (typeof renderFunction !== 'function') {
        throw new Error(
            '[defineFunctionalComponent] '
                + "First argument 'renderFunction' must be a function");
    }

    let meta;
    
    try {
        meta = determineComponentMeta(renderFunction, true);
    } catch (error) {
        throw new Error('[defineFunctionComponent] ' + error.message);
    }

    const
        jsSurfaceConfig = Object.assign(
            { render: renderFunction },
            meta);

    return  defineComponent(jsSurfaceConfig);
}
