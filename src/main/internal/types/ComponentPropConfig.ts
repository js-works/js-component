import React from 'react';
import { Validator } from 'js-spec';

export default interface ComponentPropConfig<T> {
  type?:
    T extends boolean
    ? BooleanConstructor
    : T extends number
    ? NumberConstructor
    : T extends string
    ? StringConstructor
    : { new(): T }

  constraint?: Validator,
  nullable?: boolean,
  defaultValue?: T,
  inject?: React.Context<T>
}
