import validateComponentConfig from '../internal/validation/validateComponentConfig';
import validateProperties from '../internal/validation/validateProperties'
import ComponentConfig from '../internal/types/ComponentConfig';
import ComponentPropConfig from '../internal/types/ComponentPropConfig';
import ComponentProps from '../internal/types/ComponentProps';
import React, { ComponentType, Component } from 'react';
import { Spec, SpecValidator } from 'js-spec';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

//export default function defineComponent<P extends ComponentProps>(config: ComponentConfig<P>): ComponentType<P> {
export default function defineComponent<P extends ComponentProps>(config: ComponentConfig<P>): React.ComponentType<P> {
  const error = validateComponentConfig(config);

  if (error) {
    if (config && typeof config.displayName === 'string') {
      throw new TypeError(
        "[defineComponent] Invalid component configuration for '"
          + `${config.displayName}': ${error.message}`);
    } else {
      throw new TypeError(
        `[defineComponent] Invaild component configuration: ${error.message}`);
    }
  }

  let ret: ComponentType<P>;

  const
     meta: any = {},
     injectedContexts: React.Context<any>[] = [],
     contextInfoPairs: [string, number][] = [];

  meta.displayName = config.displayName;


  if (config.properties) {
    meta.defaultProps = {};

    const
      propNames = Object.keys(config.properties);

    for (let i = 0; i < propNames.length; ++i) {
      const
        propName: keyof P = propNames[i],
        propConfig: any = config.properties[propName],
        type = propConfig.type || null,
        isPrimitiveType = type === Boolean || type === Number || type === String,
        nullable = !!propConfig.nullable,
        constraint = propConfig.constraint || null,
        hasDefaultValue = propConfig.hasOwnProperty('defaultValue'),
        defaultValue = propConfig.defaultValue,
        inject = propConfig.inject || null;

      if (hasDefaultValue) {
        const descr: any = Object.getOwnPropertyDescriptor(propConfig, 'defaultValue');

        if (typeof descr.get !== 'function') {
          meta.defaultProps[propName] = defaultValue;
        } else {
          Object.defineProperty(meta.defaultProps, propName, {
            enumerable: true,
            get: descr.get
          });
        }
      }

      if (inject) {
        let index = injectedContexts.indexOf(inject);

        if (index === -1) {
          index = injectedContexts.length;
          injectedContexts.push(inject);
        }

        contextInfoPairs.push([propName, index]);
      }
    }
  }

  if (config.main.prototype instanceof React.Component) {
    const parentClass: { new(props: P): React.Component<P> } = <any>config.main;

    ret = class CustomComponent extends parentClass {};
  } else {
    ret = (props: P) => {
      return (<any>config.main)(props);
    }
  }

  meta.propTypes = {
    '*': (props: P) => {
      return validateProperties(props, config);
    }
  };

  Object.assign(ret, meta);
  
  if (injectedContexts.length > 0) {
    const innerComponent = ret;

    ret = React.forwardRef((props, ref) => {
      const
        contextValues = new Array(injectedContexts.length),
        adjustedProps = { ref, ...<any>props };

      let node: React.ReactElement<any> | null = null;

      for (let i = 0; i < injectedContexts.length; ++i) {
        if (i === 0) {
          node = React.createElement(injectedContexts[0].Consumer,null, (value: any) =>{
            contextValues[0] = value;

            for (let j = 0; j < contextInfoPairs.length; ++j) {
              let [propName, contextIndex] = contextInfoPairs[i];

              if (props[propName] === undefined) {
                adjustedProps[propName] = contextValues[i];
              }
            }

            return React.createElement(innerComponent, adjustedProps);
          });
        } else {
          const currNode = node;
          
          node = React.createElement(injectedContexts[i].Consumer, null, (value: any) => {
            contextValues[i] = value; 

            return currNode;
          });
        }
      }

      return node;
    });
  }

  return ret;
}
