import convertPropType from './convertPropType';

export default function determineComponentMeta(subject, functional) {
    const
        ret = {},
        displayName = subject.displayName || 'Anonymous',

        propTypes = subject.propTypes,
        defaultProps = subject.defaultProps,
        contextTypes = subject.contextTypes,
        childContextTypes = subject.childContextTypes,
        exportedMethods = subject.exportedMethods,

        hasPropTypes = propTypes !== undefined && propTypes !== null,
        hasDefaultProps = defaultProps !== undefined && defaultProps !== null,
        hasContextTypes = contextTypes !== undefined && contextTypes !== null,

        hasChildContextTypes =
            childContextTypes !== undefined && childContextTypes !== null,
        
        hasExportedMethods = exportedMethods !== undefined
            exportedMethods !== null;

    ret.displayName = displayName;

    if (hasPropTypes) {
        if (typeof propTypes !== 'object') {
            throw new Error("Meta field 'propTypes' must be an object");
        }

        for (const key of Object.keys(propTypes)) {
            const propType = propTypes[key];

            if (typeof propType !== 'function') {
                throw new Error(
                    `Meta field 'propTypes.${key}' must be a function`);
            }

            if (!ret.properties) {
                ret.properties = {};
            }

            ret.properties[key] = {
                constraint: convertPropType(propType, key, displayName),
                defaultValue: undefined
            };
        }           
    }

    if (hasDefaultProps) {
        if (typeof defaultProps !== 'object') {
            throw new Error("Meta field 'defaultProps' must be an object");
        }

        for (const key of Object.keys(defaultProps)) {
            if (!ret.properties) {
                ret.properties = {};
            }

            if (!ret.properties[key]) {
                ret.properties[key] = {};
            }

            ret.properties[key].defaultValue = defaultProps[key];
        }
    }

    if (hasContextTypes) {
        if (typeof contextTypes !== 'object') {
            throw new Error("Meta field 'contextTypes' must be an object");
        }

        for (const key of Object.keys(contextTypes)) {
            const contextType = contextTypes[key];

            if (typeof contextType !== 'function') {
                throw new Error(
                    `Meta field 'contextTypes.${key}' must be a function`);
            }

            if (!ret.properties) {
                ret.properties = {};
            }

            if (ret.properties[key]) {
                throw new Error(
                    `Key '${key}' must not be used for both properties '
                        + 'and context at the same time`);
            }

            ret.properties[key] = {
                constraint: convertPropType(contextType, key, displayName),
                defaultValue: undefined
            };
        }           
    }

    if (hasChildContextTypes) {
        if (typeof contextTypes !== 'object') {
            throw new Error("Meta field 'contextTypes' must be an object or empty");
        }

        const provides = Object.keys(contextTypes);

        if (provides.length > 0) {
            ret.provides = provides;
        }
    }

    if (hasExportedMethods) {
        if (!Array.isArray(exportedMethods)) {
            throw new Error(
                "Meta field 'exportedMethods' must be an array or empty");
        }

        if (exportedMethods.length > 0) {
            ret.methods = exported;
        }
    }

    return ret;
}
