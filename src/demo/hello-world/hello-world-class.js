/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';
import PropTypes from 'prop-types';

const meta = {
    displayName: 'HelloWorld',

    propTypes: {
        name: PropTypes.string
    },

    defaultProps: {
        name: 'Stranger'
    }
};

class CustomComponent extends Reactify.Component {
    constructor(props) {
        super(props);

        console.log('constructor', props);
    }

    shouldComponentUpdate() {
        console.log('shouldUpdate');

        return true;
    }

    componentWillReceiveProps(...args) {
        console.log('componentWillRecieveProps', ...args);
    }

    componentWillMount(...args) {
        console.log('componentWillMount', ...args);
    }

    componentDidMount(...args) {
        console.log('componentDidMount', ...args);
    }

    componentWillUpdate(...args) {
        console.log('componentWillUpdate', ...args);
    }

    componentDidUpdate(...args) {
        console.log('componentDidUpdate', ...args);
    }

    render() {
        return (
            <div>
                Hello { this.props.name }
            </div>
        );
    }
}

const HelloWorld = Reactify.defineClassComponent(
    Object.assign(CustomComponent, meta));

Reactify.render(HelloWorld({ name: 'John Doe' }), 'main-content');
