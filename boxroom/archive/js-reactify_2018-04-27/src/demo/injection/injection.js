/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';
import PropTypes from 'prop-types';

const ParentMeta = {
    displayName: 'Parent',

    propTypes: {
        masterValue: PropTypes.string
    },

    childContextTypes: {
        value: PropTypes.string
    }
}

class ParentComponent extends Reactify.Component {
    getChildContext() {
        return {
            value: this.props.masterValue
        };
    }

    render() {
        return (
            <div>
                <div>Provided value: { this.props.masterValue }</div>
                <div>
                    <ChildFunctionBased />
                    <ChildClassBased />
                </div>
            </div>
        );
    }
}

const Parent = Reactify.createFactory(
    Object.assign(ParentComponent, ParentMeta));

const ChildFunctionBasedMeta = {
    displayName: 'ChildFunctionBased',

    contextTypes: {
        value: PropTypes.string
    }
};

function ChildFunctionBasedComponent(props, context) {
    return (
        <div>ChildFunctionBased({ context.value })</div>
    );
}

const ChildFunctionBased = Reactify.createFactory(
    Object.assign(ChildFunctionBasedComponent, ChildFunctionBasedMeta));

const ChildClassBasedMeta = {
    displayName: 'ChildClassBased',

    contextTypes: {
        value: PropTypes.string
    }
};

class ChildClassBasedComponent extends Reactify.Component {
    render() {
        return (
            <div>ChildClassBased({ this.context.value })</div>
        );
    }
}

const ChildClassBased = Reactify.createFactory(
    Object.assign(ChildClassBasedComponent, ChildClassBasedMeta));

Reactify.render(<Parent masterValue="the injected value" />, 'main-content');
