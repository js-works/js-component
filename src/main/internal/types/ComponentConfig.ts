import ComponentProps from './ComponentProps';
import { ComponentType, ReactNode } from 'react';
import { Validator } from 'js-spec';

type ComponentConfig<P extends ComponentProps> = {
  displayName: string,

  properties?: {
    [K in keyof P]?: {
      type?:
        P[K] extends boolean
        ? BooleanConstructor
        : P[K] extends number
        ? NumberConstructor
        : P[K] extends string
        ? StringConstructor
        : { new(): P[K] }
        | ObjectConstructor

      constraint?: Validator,
      nullable?: boolean,
      defaultValue?: P[K],
      inject?: React.Context<P[K]>
    }
  },
  
  methods?: Array<keyof P>,
  isErrorBoundary?: boolean,
  main: { (props?: P): any } | { new(props: P): React.Component<P> }
  // main: ComponentType<P>
}

export default ComponentConfig;
