import { defineComponent } from '../main/js-reactify';
import React from 'react';
import ReactDOM from 'react-dom';
import { Spec } from 'js-spec';

interface Logger extends Object {
  log(...args: any[]): void;
}

const
  nopLogger: Logger = {
    log() {
    }
  },

  consoleLogger: Logger = {
    log(...args: any[]) {
      console.log(...args);
    }
  };

const LoggerCtx = React.createContext<Logger>(nopLogger);

const DateCtx = React.createContext<Date>(null);

type CounterProps = {
  label?: string | null,
  initialValue?: number,
  logger?: Logger 
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
    },

    logger: {
      type: Object,
      defaultValue: nopLogger, 

      inject: {
        context: LoggerCtx,
        select: (arg: Date) => arg
      }
    }
  },

  main: class extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
      super(props);

      props.logger.log('Instanciating new component');

      this.state = { counter: props.initialValue };
      this.onClickDecrement = this.onClickDecrement.bind(this);
      this.onClickIncrement = this.onClickIncrement.bind(this);
    }

    onClickIncrement() {
      this.props.logger.log('Incrementing...');
      this.setState({ counter: this.state.counter + 1 });
    }

    onClickDecrement() {
      this.props.logger.log('Decrementing...');
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

ReactDOM.render(
  <LoggerCtx.Provider value={consoleLogger}>
    <Counter label="Counter:" logger={consoleLogger}/>
  </LoggerCtx.Provider>,
  document.getElementById('main-content'));
