import ComponentProps from '../types/ComponentProps';
import ComponentConfig from '../types/ComponentConfig';

export default function determineDefaultProps<P extends ComponentProps>
  (config: ComponentConfig<P>): Partial<P> | null {

  let ret: Partial<P> | null = null

  if (config.properties) {
    const keys = Object.keys(config.properties);

    for (let i = 0; i < keys.length; ++i) {
      const
        key: string = keys[i],
        propConfig = config.properties[key] as any; // TODO

      if (!propConfig.inject && propConfig.hasOwnProperty('defaultValue')) {
        const descriptor: any = Object.getOwnPropertyDescriptor(propConfig, 'defaultValue');

        if (!descriptor.get) {
          const value = descriptor.value

          if (value !== undefined) {
            ret = ret || {}
            ret[key] = descriptor.value
          }
        } else {
          ret = ret || {}

          Object.defineProperty(ret, key, {
            enumerable: true,
            get: descriptor.get
          });
        }
      }
    }
  }

  return ret;
}