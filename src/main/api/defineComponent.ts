import validateComponentConfig from '../internal/validation/validateComponentConfig';
import ComponentConfig from '../internal/types/ComponentConfig';
import ComponentProps from '../internal/types/ComponentProps';

import React, { ComponentType, Component } from 'react';
import { Spec, SpecValidator } from 'js-spec';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

const performValidations = React.Component.name === 'Component'; // TODO!!!!!!!!

export default function defineComponent<P extends ComponentProps = {}>(config: ComponentConfig<P>): ComponentType<P> {
  const error = !performValidations ? null : validateComponentConfig(config);

  if (error) {
    if (config && typeof config.displayName === 'string') {
      throw new TypeError(`[defineComponent] Illegal component configuration for '${config.displayName}': `
        + error.message);
    } else {
      throw new TypeError('[defineComponent] Illegal component configuration: '
        + error.message);
    }
  }

  let ret: ComponentType<P>;

  const
     meta: any = {},
     injectedContexts: React.Context<any>[] = [],
     contextInfoPairs: [string, number][] = [];

  meta.displayName = config.displayName;


  if (config.properties) {
    meta.propTypes = {};
    meta.defaultProps = {};

    const
      propNames = Object.keys(config.properties);

    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig = config.properties[propName],
        type = propConfig.type || null,
        isPrimitiveType = type === Boolean || type === Number || type === String,
        nullable = !!propConfig.nullable,
        constraint = propConfig.constraint || null,
        hasDefaultValue = propConfig.hasOwnProperty('defaultValue'),
        defaultValue = propConfig.defaultValue,
        inject = propConfig.inject || null;

      if (hasDefaultValue) {
        const descr = Object.getOwnPropertyDescriptor(propConfig, 'defaultValue');

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

      if (performValidations && (type || constraint || !nullable || !hasDefaultValue)) {
        meta.propTypes[propName] = (props: P) => {
          let
            it = props[propName],
            errorMsg = null;

          const
            isSomething = it !== undefined && it !== null,
            isDefaultValue = hasDefaultValue && it === defaultValue;

          if (!hasDefaultValue && it === undefined) {
            errorMsg = 'Property must not be undefined';
          }

          if (!errorMsg && !nullable && it === null) {
            errorMsg = 'Property must not be null';
          }

          if (!errorMsg && isPrimitiveType && isSomething
            && it.constructor !== type) {
              errorMsg = 'Must be a ' + type.name.toLowerCase();
          }
          
          if (!errorMsg && type && !isPrimitiveType && isSomething
            && !(it instanceof type)) {
            
            if (<any>type === Array || <any>type == Date) {
              errorMsg = 'Must be of type ' + type.name;
            } else {
              errorMsg = 'Illegal type';
            }
          }

          if (!errorMsg && constraint && !isDefaultValue) {
            const result: any = SpecValidator.from(constraint).validate(it);

            if (result) {
              errorMsg = result.message;
            }
          }

          return !errorMsg
              ? null
              : new TypeError(`Illegal prop \`${propName}\` `
                + `supplied to \'${config.displayName}'\: ${errorMsg}`);
        }
      }
    }
  }

  if (config.main.prototype instanceof React.Component) {
    const parentClass: { new(props: P): React.Component<P> } = <any>config.main;

    ret = class CustomComponent extends parentClass {
      constructor(props: P) {
        if (performValidations) {
          checkProps(props, config);
        }

        super(props);
      }

      static getDerivedStateFromProps(newProps: P, prevProps: P) {
        if (performValidations) {
          checkProps(newProps, config);
        }

        const f = (<any>parentClass).getDerivedStateFromProps;

        return f ? f(newProps, prevProps) : null;
      }
    };
  } else {
    ret = (props: P) => {
      checkProps(props, config);


      return (<any>config.main)(props);
    }
  }

  Object.assign(ret, meta);
  
  if (injectedContexts.length > 0) {
    const innerComponent = ret;

    ret = React.forwardRef((props, ref) => {
      const
        contextValues = new Array(injectedContexts.length),
        adjustedProps = { ref, ...<any>props };

      let node: React.ReactElement<any> = null;

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

function checkProps<P extends ComponentProps>(props: P, config: ComponentConfig<P>): void {
  if (performValidations && props !== lastCheckedProps) {
    lastCheckedProps = props;

    const keys = !props ? null : Object.keys(props);

    if (keys && keys.length > 0) {
      let illegalKeys = null;

      if (!config.properties) {
          illegalKeys = keys;
      } else {
          for (let i = 0; i < keys.length; ++i) {
              const key = keys[i];

              if (!config.properties[key]) {
                  illegalKeys = illegalKeys || [];

                  illegalKeys.push(key);
              }
          }
      }

      if (illegalKeys) {
          if (illegalKeys.length === 1) {
              console.error(`Warning: Illegal prop key \`${illegalKeys[0]}\` used for ${config.displayName}`);
          } else {
              console.error(`Warning: Illegal props keys used for ${config.displayName}: ` + illegalKeys)
          }
      }

      if (typeof config.validate === 'function') {
        const result = config.validate(props);

        let errorMsg = null;

        if (typeof result === 'string' && result !== '') {
          errorMsg = (<string>result).trim();
        } else if (result instanceof Error) {
          errorMsg = String(result.message).trim();
        } else if (result !== undefined && result !== null && result !== true) {
          errorMsg = '';
        }

        if (errorMsg === '') {
            console.error(`Warning: Invalid props used for \`${config.displayName}\` => Props:`, props);
        } else if (errorMsg) {
            console.error(`Warning: Invalid props used for \`${config.displayName}\`: ${errorMsg} => Props:`, props);
        }
      }
    }
  }
}

// --- locals -------------------------------------------------------

let lastCheckedProps: any = undefined;