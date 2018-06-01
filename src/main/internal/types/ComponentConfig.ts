import ComponentProps from './ComponentProps';
import ComponentPropConfig from './ComponentPropConfig';
import React from 'react';
import { Validator } from 'js-spec';

export default interface ComponentConfig<P extends ComponentProps> {
  displayName: string,
  properties?: { [K in keyof P]?: ComponentPropConfig<P[K]> },
  validate?: (props: P) => boolean | Error,
  isErrorBoundary?: boolean,
  main: React.ComponentType 
}
