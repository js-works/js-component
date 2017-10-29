import Component from './Component';
import determineComponentMeta from '../internal/helper/determineComponentMeta';
import buildInitFunction from '../internal/helper/buildInitFunction';
import { defineComponent } from 'js-surface';

export default function createFactory(type) {
    let ret;

    const
        typeIsString = typeof type === 'string',
        typeIsFunction = typeof type === 'function';

    if (!typeIsString && !typeIsFunction) {
        throw new Error(
            "[createFactory] First argument 'type' must be either a function "
                + 'or a string');
    }

    if (typeIsString) {
        ret = createElement.bind(type);
        ret.type = type;
    } else {
        let meta, componentConfig;
        
        try {
            meta = determineComponentMeta(type);
        } catch (error) {
            throw new Error('[createFactory] ' + error.message);
        }

        if (type.prototype instanceof Component) {
            componentConfig = Object.assign(
                { init: buildInitFunction(type, meta) },
                meta);
        } else {
            componentConfig = Object.assign(
                { render: props => type(props, props) },
                meta);
        }

        ret = defineComponent(componentConfig);
    }

    return ret;
}
