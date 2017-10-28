import Component from './Component';
import determineComponentMeta from '../internal/helper/determineComponentMeta';
import buildInitFunction from '../internal/helper/buildInitFunction';
import { defineComponent } from 'js-surface';

export default function defineClassComponent(clazz) {
    if (typeof clazz !== 'function' 
            || !(clazz.prototype instanceof Component)) {

        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'clazz' must be "
            + "a class that extends class 'Component'");
    }

    let meta;
    
    try {
        meta = determineComponentMeta(clazz, false);
    } catch (error) {
        throw new Error('[defineClassComponent] ' + error.message);
    }

    const jsSurfaceConfig = Object.assign(
        { init: buildInitFunction(clazz, meta) },
        meta);

    return  defineComponent(jsSurfaceConfig);
}

