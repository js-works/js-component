import ComponentPropConfig from '../types/ComponentPropConfig';

export default function validateProperty<T>(it: T, propName: string, propConfig: ComponentPropConfig<T>, componentName: string) {
    let
      ret = null,
      errMsg = null;
  
    const
      nullable = propConfig.nullable === true,
      typeConstructor = propConfig.type || null,
      constraint = propConfig.constraint || null,
      hasDefaultValue = propConfig.hasOwnProperty('defaultValue'),
      isDefaultValue = hasDefaultValue && it === propConfig.defaultValue,
      propInfo = `'${propName}' of component '${componentName}'`

    if (it === undefined) {
      if (!propConfig.hasOwnProperty('defaultValue')) {
        errMsg = `Missing mandatory property ${propInfo}`;
      }
    } else if (it === null && nullable === true) {
      // Perfectly fine
    } else if (it === null && nullable === false) {
      errMsg = `Property ${propInfo} must not be null`;
    } else if (typeConstructor !== undefined && typeConstructor !== null) {
      const type = typeof it;
      
      switch (typeConstructor as any) {
      case Boolean:
        if (type !== 'boolean') {
          errMsg = `Property ${propInfo} must be boolean`;
        }
        
        break;
        
      case Number:
        if (type !== 'number') {
          errMsg = `Property ${propInfo} must be a number`;
        }
        
        break;
      
      case String:
        if (type !== 'string') {
          errMsg = `Property ${propInfo} must be a string`;
        }
        
        break;
        
      case Function:
        if (type !== 'function') {
          errMsg = `Property ${propInfo} must be a function`;
        }
        
        break;
        
      default:
        if (typeConstructor && !(it instanceof typeConstructor)) {
          errMsg = `The property ${propInfo} must be of type `
            + (typeConstructor.name || '<nameless>');
        }
      }
    }
  
    if (!errMsg && !(nullable && it === null) && constraint) {
      let err =
        typeof constraint === 'function' 
          ? constraint(it)
          : constraint.validate(it);
      
      if (err === undefined || err === null || err === true) {
        // everything fine
      } else if ((err as any) === false) {
        errMsg = `Invalid value for property ${propInfo}`;
      } else if (typeof err === 'string') {
        errMsg = `Invalid value for property ${propInfo} => ${err}`;
      } else if (err && typeof (err as any).message === 'string') {
        errMsg = `Invalid value for property ${propInfo} => `
          + (err as any).message;
      } else {
        const msg = String(err).trim();

        errMsg = `Invalid value for property ${propInfo}`;

        if (msg !== '') {
          errMsg += ` => ${msg}`;
        }
      }
    }
  
    if (errMsg) {
      ret = new Error(errMsg);
    } 
  
    return ret;
  }
