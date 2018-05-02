import { defineComponent } from '../main/js-reactify';
import React from 'react';
import ReactDOM from 'react-dom';
import { Spec } from 'js-spec';

type CounterProps = {
  label?: string | null,
  initialValue?: number
}

type CounterState = {
  counter: number
}

const Counter = defineComponent({
  displayName: 'Counter',

  properties: {
    label: {
      type: String,
      nullable: true,
      defaultValue: null
    },

    initialValue: {
      type: Number,
      constraint: Spec.integer,
      defaultValue: 0
    }
  },

  main: class extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
      super(props);

      this.state = { counter: props.initialValue };
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
