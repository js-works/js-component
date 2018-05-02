import validateComponentConfig from '../internal/validation/validateComponentConfig';
import ComponentConfig from '../internal/types/ComponentConfig';
import ComponentProps from '../internal/types/ComponentProps';

import React, { ComponentType } from 'react';
//import { Spec, SpecValidator } from 'js-spec';

export default function defineComponent<P extends ComponentProps = {}>(config: ComponentConfig<P>): ComponentType<P> {
  const error = validateComponentConfig(config);

  if (error) {
    throw new TypeError('[defineComponent] Illegal component configuration: '
      + error.message)
  }

  let ret: ComponentType<P>;

  const meta: any = {};

  meta.displayName = config.displayName;

  if (config.properties) {
    meta.propTypes = {};
    meta.defaultProps = {};

    const propNames = Object.keys(config.properties);

    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig = config.properties[propName],
        type = propConfig.type || null,
        isPrimitiveType = type === Boolean || type === Number || type === String,
        nullable = !!propConfig.nullable,
        constraint = propConfig.constraint || null,
        hasDefaultValue = propConfig.hasOwnProperty('defaultValue'),
        defaultValue = propConfig.defaultValue;

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

      if (type || constraint || !nullable || !hasDefaultValue) {
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
              errorMsg = 'Must be of type ' + type.name;
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
            const result: any = null; // SpecValidator.from(constraint).validate(it);

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

    if (config.main.prototype instanceof React.Component) {
      const parentClass: any = config.main;

      ret = <any>class CustomComponent extends parentClass {};
    } else {
      ret = (props: P) => (<any>config.main)(props);
    }

    Object.assign(ret, meta);

    return ret;
  }
}
