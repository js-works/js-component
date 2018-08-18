import validateComponentConfig from '../internal/validation/validateComponentConfig';
import validateProperties from '../internal/validation/validateProperties'
import ComponentConfig from '../internal/types/ComponentConfig';
import ComponentProps from '../internal/types/ComponentProps';
import determineDefaultProps from '../internal/util/determineDefaultProps';
import React, { ComponentType } from 'react';

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
     contextData: [string, number, () => any][] = [];

  meta.displayName = config.displayName;

  if (config.properties) {
    const
      propNames = Object.keys(config.properties) as [keyof P & string];

    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig: any = config.properties[propName],
        inject = propConfig.inject || null;

      if (inject) {
        let index = injectedContexts.indexOf(inject);

        if (index === -1) {
          index = injectedContexts.length;
          injectedContexts.push(inject);
        }

        contextData.push([propName, index, () => propConfig.defaultValue]);
      }
    }

    meta.defaultProps = determineDefaultProps(config);
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

            for (let j = 0; j < contextData.length; ++j) {
              let [propName, contextIndex, getDefault] = contextData[i];

              if (props[propName] === undefined) {
                adjustedProps[propName] = contextValues[i];

                if (adjustedProps[propName] === undefined) {
                  adjustedProps[propName] = getDefault()
                }
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
