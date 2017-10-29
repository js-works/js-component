/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';
import PropTypes from 'prop-types';

import { Spec } from 'js-spec';

const translations = {
    en: {
        salutation: 'Hello, ladies and gentlemen'
    },

    de: {
        salutation: 'Hallo, meine Damen und Herren'
    },

    fr: {
        salutation: 'Salut, Mesdames, Messieurs'
    }
};

const AppMeta = {
    displayName: 'App',

    propTypes: {
        defaultLocale: PropTypes.oneOf(['en', 'fr', 'de']) 
    },

    defaultProps: {
        defaultLocale: 'en'
    },

    childContextTypes: {
        locale: PropTypes.string
    }
};

class AppComponent extends Reactify.Component {
    constructor(props) {
        super(props);
        this.state = { locale: props.defaultLocale }
    }

    getChildContext() {
        return {
            locale: this.state.locale
        };
    }

    setLocale(locale) {
        this.setState({ locale });
    }

    render() {
        return (
            <div>
                <label htmlFor="lang-selector">
                    Select language
                </label>
                <select
                    id="lang-selector"
                    value={ this.props.locale }
                    onChange={ ev => this.setLocale(ev.target.value) }
                >
                    <option value="en">en</option>
                    <option value="fr">fr</option>
                    <option value="de">de</option>
                </select>
                <section>
                    <Text />
                </section>
            </div>
        );
    }
};

const App = Reactify.createFactory(
    Object.assign(AppComponent, AppMeta));

const TextMeta = {
    displayName: 'Text',

    contextTypes: {
        locale: PropTypes.string
    }
};

function TextComponent(props, context) { 
    return (
        <div>
            { translations[context.locale].salutation }
        </div>
    );
}

const Text = Reactify.createFactory(
    Object.assign(TextComponent, TextMeta));

Reactify.render(<App/>, 'main-content');
