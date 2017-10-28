/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';
import PropTypes from 'prop-types';

const counterInfoMeta = {
    displayName:  'CounterInfo',

    propTypes: {
        value: PropTypes.number
    }
};

function CounterInfoComponent(props) {
    return (
        <label>
            <b>{ props.value }</b>
        </label>
    );
}

const CounterInfo = Reactify.defineFunctionalComponent(
    Object.assign(CounterInfoComponent, counterInfoMeta));

// --------------------------------------------------------------------

const counterMeta = {
    displayName: 'Counter',

    propTypes: {
        initialValue: PropTypes.number,
        onChange: PropTypes.func
    },

    defaultProps: {
        initialValue: 0
    },

    exportedMethods: ['resetCounter']
};

class CounterComponent extends Reactify.Component {
    constructor(props) {
        super(props);

        this.state = { counterValue: props.initialValue };
    }

    increaseCounter(delta) {
        this.setState({ counterValue: this.state.counterValue + delta });
    }

    shouldComponentUpdate() {
        console.log('[shouldComponentUpdate]', arguments);
        return true;
    }

    componentWillReceiveProps(nextProps) {
        console.log('[componentWillReceiveProps]', arguments);
    }

    componentWillChangeState(nextState) {
        console.log('[componentWillChangeState]', arguments);
    }

    componentDidChangeState(prevState) {
        console.log('[componentDidChangeState]', arguments);

        if (this.props.onChange) {
            this.props.onChange({
                type: 'change',
                value: this.state.counterValue
            });
        }
    }

    componentWillMount() {
        console.log('[componentWillMount]', arguments);
    }

    componentDidMount() {
        console.log('[componentDidMount]', arguments);
    }

    componentWillUpdate() {
        console.log('[componentWillUpdate]', arguments);
    }

    componentDidUpdate() {
        console.log('[componentDidUpdate]', arguments);
    }

    componentWillUnmount() {
        console.log('[componentWillUnmount]:', arguments);
    }

    resetCounter(value = 0) {
        this.state = { counterValue: value };
    }

    render() {
        return (
            <span className="counter">
                <button
                    className="btn btn-default"
                    onClick={ () => this.increaseCounter(-1) }
                    >
                    -
                </button>
                <div style={{ width: '30px', display: 'inline-block', textAlign: 'center' }}>
                    <CounterInfo value= { this.state.counterValue } />
                </div>
                <button
                    className="btn btn-default"
                    onClick={ () => this.increaseCounter(1) }
                    >
                    +
                </button>
            </span>
        );
    }
}

const Counter = Reactify.defineClassComponent(
    Object.assign(CounterComponent, counterMeta));

// --------------------------------------------------------------------

const counterCtrlMeta = {
    displayName: 'CounterCtrl',
};

class CounterCtrlComponent extends Reactify.Component {
    render() {
        let counterInstance = null;

        return (
            <div className="counter-ctrl">
                <button className="btn button-info"
                    onClick={ () => counterInstance.resetCounter(0) }>

                    Set to 0
                </button>
                <Counter ref={ it => { counterInstance = it; } } />
                <button className="btn button-info"
                    onClick={ () => counterInstance.resetCounter(100) }>

                    Set to 100
                </button>
            </div>
        );
    }
}

const CounterCtrl = Reactify.defineClassComponent(
    Object.assign(CounterCtrlComponent, counterCtrlMeta));

Reactify.render(CounterCtrl(), 'main-content');

