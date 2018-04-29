import ComponentProps from './ComponentProps';
import { ComponentType, ReactNode } from 'react';
import { Validator } from 'js-spec';

type ComponentConfig<P extends ComponentProps> = {
  displayName: string,
  properties?: { [K in keyof P]?: PropConfig<P[K]> },
  methods?: Array<keyof P>,
  isErrorBoundary?: boolean,
  //main: { (props?: P): any } | { new(props: P): React.Component<P> }
  main: ComponentType<P>
}


type PropConfig<T> = {
  type?:
    T extends boolean
    ? BooleanConstructor
    : T extends number
    ? NumberConstructor
    : T extends string
    ? StringConstructor
    : { new(): T };

  constraint?: Validator,
  nullable?: boolean,
  defaultValue?: T
}

export default ComponentConfig;
