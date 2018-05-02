
alert(1)
alert(document.body.innerHTML)
//import { isPortal } from 'js-reactify';
import { isPortal } from '../main/js-reactify';
alert(isPortal)
import React from 'react';
alert(React)

//import React from 'react';
import ReactDOM from 'react-dom';
console.clear();
console.log(new Date);
//import { defineComponent } from '../main/js-reactify';

type CounterProps = {
  label?: string | null
}

type CounterState = {
  counter: number
}
/*
const Counter = defineComponent<any>({
  displayName: 'Counter',

  properties: {
    label: {
      type: String,
      nullable: null,
      defaultValue: null
    }
  },

  main: class extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
      super(props);

      this.state = { counter: 0 };
      this.onClickDecrement = this.onClickIncrement.bind(this);
      this.onClickIncrement = this.onClickDecrement.bind(this);
    }

    onClickIncrement() {
      this.setState({ counter: this.state.counter + 1 });
    }

    onClickDecrement() {
      this.setState({ counter: this.state.counter - 1 });
    }

    render() {
      const
        { label } = this.props,
        { counter } = this.state;

      return (
        <div>
          {label ? <label>{label}</label> : null}
          <button onClick={this.onClickDecrement}>-</button>
          {' ' + this.state.counter + ' '}
          <button onClick={this.onClickIncrement}>+</button>
        </div>
      );
    }
  }
});
*/
const Counter = () => <div>Juhuuuuu</div>;

ReactDOM.render(<Counter/>, document.getElementById('main-content'));
