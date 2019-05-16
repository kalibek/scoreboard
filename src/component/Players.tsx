import React, { Component } from 'react';
import { Player } from '../model';
import { Button, List, ListItem, TextField, Typography } from '@material-ui/core';
import { styles } from '../styles';

interface Props {
  readonly: boolean;
  onAdd: (p: Player) => void;
  onRemove: () => void;
  players: Player[];
}

interface State {
  name: string;
  ord: number;
}

class Players extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      ord: props.players.length,
    }
  }

  setName = (name: string) => {
    this.setState(prev => ({ ...prev, name }))
  };

  savePlayer = () => {
    this.props.onAdd({
      ord: this.state.ord,
      name: this.state.name,
    });
    this.setState(prev => ({ ...prev, ord: prev.ord + 1, name: '' }))
  };

  removePlayer = () => {
    this.props.onRemove();
    this.setState(prev => ({ ...prev, ord: prev.ord - 1 }))
  };

  render() {
    return <div>
      {this.props.readonly ? "" :
        <div>
          <h3>Add Player</h3>
          <TextField label="Player Name" onChange={e => this.setName(e.target.value)} value={this.state.name}/>
          <Button style={styles.button} variant="contained" color="primary" onClick={this.savePlayer}>Save</Button>
        </div>
      }
      <h3>Players list</h3>
      <List>
        {this.props.players.map(p =>
          <ListItem key={p.ord}>
            <Typography>{p.ord}. {p.name}</Typography>
          </ListItem>
        )}
      </List>
      {this.props.readonly ? "" :
        <Button style={styles.button} variant="contained" color="primary" onClick={this.removePlayer}>
          Remove last
        </Button>
      }
    </div>;
  }
}

export default Players;