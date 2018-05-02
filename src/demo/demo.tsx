import { defineComponent } from '../main/js-reactify';
import React from 'react';
import ReactDOM from 'react-dom';

type CounterProps = {
  label?: string | null
}

type CounterState = {
  counter: number
}

const Counter = defineComponent<any>({
  displayName: 'Counter',

  properties: {
    label: {
      type: String,
      nullable: true,
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
          {' '}
          <button onClick={this.onClickDecrement}>-</button>
          {' ' + this.state.counter + ' '}
          <button onClick={this.onClickIncrement}>+</button>
        </div>
      );
    }
  }
});

ReactDOM.render(<Counter label="Counter:"/>, document.getElementById('main-content'));
