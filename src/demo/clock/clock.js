/** @jsx Reactify.createElement */
import Reactify from 'js-reactify';

class ClockComponent extends Reactify.Component {
    static displayName = 'Clock'

    interval = null;

    constructor() {
        this.interval = null;

        this.state = {
            time: new Date().toLocaleDateString()
        }; 
    }


    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                time: new Date().toLocaleDateString()
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

const Clock = Reactify.defineClassComponent(ClockComponent);

Reactify.render(<Clock />, 'main-content');
