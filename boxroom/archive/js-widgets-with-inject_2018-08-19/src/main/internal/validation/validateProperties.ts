import validateProperty from './validateProperty'
import ComponentConfig from '../types/ComponentConfig';
import ComponentProps from '../types/ComponentProps';

export default function validateProperties<Props extends ComponentProps>(props: Props, config: ComponentConfig<Props>) {
  let result = null;

  const
    componentName = config.displayName,
    propNames = config.properties ? Object.keys(config.properties) : [],
    messages = [];

  if (config.properties) {
    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propValue = props[propName],
        propConfig = config.properties[propName],
        result = validateProperty(propValue, propName, propConfig!, componentName);

      if (result) {
        messages.push(result.message);
      }
    }
  }

  const
    usedPropNames = Object.keys(props),
    invalidPropNames = [];

  for (let i = 0; i < usedPropNames.length; ++i) {
    const usedPropName = usedPropNames[i];

    if (config.properties && !config.properties.hasOwnProperty(usedPropName)) {
      if (usedPropName !== 'key' && usedPropName !=='ref') { // TODO: => DIO bug
        invalidPropNames.push(usedPropName);
      }
    }
  }

  if (invalidPropNames.length == 1) {
    messages.push(`Invalid prop key "${invalidPropNames[0]}"`);
  } else if (invalidPropNames.length > 1) {
    messages.push('Invalid prop keys: ' + invalidPropNames.join(', '));
  }

  if (config.validate) {
    const error = config.validate(props);

    if (error) {
      messages.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (messages.length === 1) {
    result = new Error(messages[0]);
  } else if (messages.length > 1) {
    result = new Error(`\n- ${messages.join('\n- ')}`);
  }

  return result;
}
