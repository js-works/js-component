import ComponentPropConfig from './ComponentPropConfig';
import React from 'react';
import { Validator } from 'js-spec';

export default interface ComponentConfig<P> {
  displayName: string,
  properties?: { [K in keyof P]: ComponentPropConfig<P[K]> },
  validate?: (props: P) => boolean | Error,
  isErrorBoundary?: boolean,
  main: { (props: P): React.ReactNode } | { new(props: P): React.Component }
  //main: React.ComponentType<P> 
}
