import ComponentConfig from '../types/ComponentConfig';
import isContext from '../../api/isContext';
import { Spec, SpecValidator } from 'js-spec';

// --- constants needed for the validation --------------------------
const
  REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_.]*$/,
  REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/;

// --- the spec of the component configuration ----------------------

const componentConfigSpec =
  Spec.and(
    Spec.shape({
      displayName:
        Spec.match(REGEX_DISPLAY_NAME),

      properties:
        Spec.optional(
          Spec.and(
            Spec.object,

            Spec.keysOf(
              Spec.match(REGEX_PROPERTY_NAME)),

            Spec.valuesOf(
              Spec.shape({
                type:
                  Spec.optional(Spec.function),
                
                constraint:
                  Spec.optional(Spec.validator),

                nullable:
                  Spec.optional(Spec.boolean),

                defaultValue:
                  Spec.optional(Spec.any),

                inject:
                  Spec.optional(isContext)
              })))),

      validate:
        Spec.optional(Spec.function),

      isErrorBoundary:
        Spec.optional(Spec.boolean),

      main:
        Spec.function
    }));

// --- the actual configuration validation function -----------------

export default function validateComponentConfig(config: ComponentConfig<any>): Error {
  let ret = null;

  if (config === null || typeof config !== 'object') {
    ret = new TypeError('Component configuration must be an object');
  } else {
    ret = componentConfigSpec.validate(config);
  }

  return ret;
}
