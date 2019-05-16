import { Button, CardActions } from '@material-ui/core';
import React, { Component } from 'react';
import { styles } from '../styles';

interface Props {
  onToggle: () => void;
}

interface State {
  handle: number,
  remained: number;
}

class Timer extends Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      handle: 0,
      remained: 60,
    }
  }

  countDown = () => {
    if (this.state.remained <= 0) {
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
    return <div style={styles.modal}>
      <Button onClick={this.props.onToggle} style={styles.right}>X</Button>
      <div style={styles.big}>{this.state.remained}</div>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button
          style={styles.button}
          variant="contained"
          color="secondary"
          onClick={this.start}>Start Timer</Button>
      </CardActions>
    </div>;
  }

}

export default Timer;