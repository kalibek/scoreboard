import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { styles } from './styles';

interface State {
  handle: number,
  remained: number;
}

class Timer extends Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      handle: 0,
      remained: 60,
    }
  }

  countDown = () => {
    if(this.state.remained <= 0) {
      clearTimeout(this.state.handle);
    }
    this.setState(prev => ({ ...prev, remained: prev.remained - 1 }))
  };

  start = () => {
    clearTimeout(this.state.handle);
    const handle = window.setInterval(this.countDown, 1000);
    this.setState({ handle, remained: 60 });
  };

  render() {
    return <div>
      <h1>{this.state.remained}</h1>
      <Button
        style={styles.button}
        variant="contained"
        color="secondary"
        onClick={this.start}>Start Timer</Button>
    </div>;
  }

}

export default Timer;