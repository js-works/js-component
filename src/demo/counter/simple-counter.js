/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';
import PropTypes from 'prop-types';

class SimpleCounterComponent extends Reactify.Component {
    static displayName = 'SimpleCounter'

    static propTypes = {
        label: PropTypes.string,
        initialValue: PropTypes.number
    }

    static defaultProps = {
        label: 'Counter',
        initalValue: 0
    }

    constructor(props) {
        super(props);
        this.state = { counterValue: props.initialValue };
    }

    incrementCounter(delta) {
        this.setState({
            counterValue: this.state.counterValue + delta
        });
    }

    componentWillMount() {
        console.log('compentWillMount');
        //alert('compentWillMount');
    }

    componentDidMount() {
        console.log('compentDidMount');
        //alert('compentDidMount');
    }

    componentWillUpdate() {
        console.log('compentWillUpdate');
    } 

    componentDidUpdate() {
        console.log('compentDidUpdate');
    }

    shouldCompnentUpdate(...args) {
        console.log('should update', 'args:', args);
        return true;
    }

    render() {
        return (
            <div className="simple-counter">
                <label className="simple-counter-label btn">
                    { this.props.label }
                </label>
                <button
                    className="simple-counter-decrease-button btn btn-default"
                    onClick={ () => this.incrementCounter(-1) }
                    >
                    -
                </button>
                <div className="simple-counter-value btn">
                    { this.state.counterValue } 
                </div>
                <button
                    className="simple-counter-decrease-button btn btn-default"
                    onClick={ () => this.incrementCounter(1) }
                    >
                    + 
                </button>
            </div>
        );
    }
}

const SimpleCounter = Reactify.defineClassComponent(SimpleCounterComponent);

Reactify.render(<SimpleCounter initialValue={100} />, 'main-content');
