import { Validator } from 'js-spec';

type ComponentConfig = {
    displayName: string,

    properties?: {
        [index: string]: ({
            type: Function,
            constraint?: Validator
            nullable?: boolean,
            defaultValue?: any,         // "defaultValue" and "getDefaultValue"
            getDefaultValue?: () => any // must not be set both at once
        })
    },

    isErrorBoundary?: boolean,

    methods?: string[]
}

export default ComponentConfig;
