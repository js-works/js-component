import { Validator } from 'js-spec';

export default interface ContextConfig<T> {
  displayName: string,
  constraint?: Validator,
  nullable?: boolean,
  defaultValue?: T
}