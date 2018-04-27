import remixForReact from '../remix/remixForReact';

import React from 'react';
import hyperscript from 'js-hyperscript/react';

const
    createContext = React.createContext,
    createElement = hyperscript,
    createPortal = React.createPortal,
    isElement = React.isValidElement, // TODO
    remix = remixForReact,
    Component = React.Component,
    PureComponent = React.PureComponent,
    Fragment = React.Fragment,
    
    Adapter = Object.freeze({
        name: 'react',
        api: Object.freeze({ React, ReactDOM })
    })

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
