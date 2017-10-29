/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';

class ClockComponent extends Reactify.Component {
    static displayName = 'Clock'

    interval = null;

    constructor() {
        super();

        this.interval = null;

        this.state = {
            time: new Date().toLocaleDateString()
        }; 
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                time: new Date().toLocaleTimeString()
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    render() {
        return (
            <div>
                <h3>Current time</h3>
                <p>
                    { this.state.time }
                </p>
            </div>
        );
    }
}

const Clock = Reactify.createFactory(ClockComponent);

Reactify.render(<Clock />, 'main-content');
