import validateContextConfig from '../internal/validation/validateContextConfig';
import validateProperty from '../internal/validation/validateProperty';
import ContextConfig from '../internal/types/ContextConfig';
import React from 'react';

export default function defineContext<T>(config: ContextConfig<T>) {
  const error = validateContextConfig(config);

  if (error) {
    const errorMsg = prettifyErrorMsg(error.message, config);

    console.error(errorMsg);
    throw new TypeError(errorMsg);
  }

  const ret = React.createContext(config.defaultValue);

  (ret.Provider as any).propTypes = {
    '*': (props: any) => {
      let result = validateProperty(props.value, 'value', config);

      if (result === null) {
        const illegalKeys =
          Object.keys(props)
            .filter(it => it !== 'value' && it !== 'key' && it !== 'children');

        if (illegalKeys.length === 1) {
          result = new Error('Illegal key: ' + illegalKeys[0]);
        } else if (illegalKeys.length > 1) {
          result = new Error('Illegal keys: ' + illegalKeys.join(', '));
        }
      }

      return !result
        ? null
        : new Error(`Error while providing context "${config.displayName}": `
          +  result.message);
    }
  };

  return ret; 
}

function prettifyErrorMsg(errorMsg: string, config: ContextConfig<any>) {
  return config && typeof config === 'object'
    && typeof config.displayName === 'string'
    && config.displayName.trim().length > 0
    ? '[defineContext] Invalid configuration for context '
      + `"${config.displayName}" => ${errorMsg} `
    : `[defineContext] Invalid context configuration => ${errorMsg}`;
}