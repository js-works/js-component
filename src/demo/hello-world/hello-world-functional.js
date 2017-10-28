/** @jsx Reactify.createElement */ 
import Reactify from 'js-reactify';
import PropTypes from 'prop-types';

const meta = {
    displayName:  'HelloWorld',

    propTypes: {
        name: PropTypes.string
    },
};

function render({ name }) {
    return (
        <div style={{ display: 'block' }}>
             Hello { name }
        </div>
    );
}

const HelloWorld = Reactify.createFactory(
    Object.assign(render, meta));

Reactify.render(<HelloWorld name="Joan Doe"/>, 'main-content');
