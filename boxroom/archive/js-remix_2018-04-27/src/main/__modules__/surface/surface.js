import remix from './internal/remixForSurface';

import {
    createContext,
    createElement,
    createPortal,
    isElement,
    Adapter,
    Fragment
} from 'js-surface';

import { Component, PureComponent } from 'js-surface/common/classes';

const module = Object.freeze({
    createContext,
    createElement,
    createPortal,
    isElement,
    remix,
    Adapter,
    Component,
    Fragment,
    PUreComponent
});

export default module;

export {
    createContext,
    createElement,
    createPortal,
    isElement,
    remix,
    Adapter,
    Component,
    Fragment,
    PureComponent
};
