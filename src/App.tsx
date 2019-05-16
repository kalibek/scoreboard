import React, { Component } from 'react';
import './App.css';
import Players from './Players';
import Scores from './Scores';
import { Game, Player, Score } from './model';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { styles } from './styles';
import uuid from 'uuid';
import GamesList from './GamesList';
import moment from 'moment';

class App extends Component<{}, Game> {
  constructor(props: any) {
    super(props);
    this.state = {
      gameId: "",
      players: [],
      gameStarted: false,
      scores: [],
      turn: 0,
      move: 0,
      readonly: false,
      date: ""
    };
  }

  componentDidMount(): void {
    const stateStr = localStorage.getItem("state")
    if (stateStr !== null) {
      this.setState({ ...JSON.parse(stateStr) })
    }
    const id = window.location.pathname.slice(1);
    if (id) {
      const ws = new WebSocket(`ws://${window.location.host}/ws/stream/${id}`,);
      ws.onmessage = e => {
        const state = JSON.parse(e.data);
        state.readonly = true;
        this.setState(state);
      };
      fetch(`/api/game/${id}`, { method: "GET" })
        .then(res => res.json())
        .then(d => {
          d.readonly = true;
          this.setState(d)
        });
    }
  }

  componentWillUpdate(nextProps: Readonly<{}>, nextState: Readonly<Game>, nextContext: any): void {
    if (!nextState.readonly) {
      localStorage.setItem("state", JSON.stringify(nextState));
      if (nextState.gameId !== '') {
        this.updateGame(nextState);
      }
    }
  }

  updateGame(game: Game) {
    fetch(`/api/game/${game.gameId}`, {
      method: "POST",
      body: JSON.stringify(game)
    })
  }

  addPlayer = (p: Player) => {
    this.setState(prev => ({ ...prev, players: [...prev.players, p] }));
  };
  removePlayer = () => {
    this.setState(prev => ({ ...prev, players: prev.players.slice(0, prev.players.length - 1) }));
  };

  startGame = () => {
    const gameId = uuid.v4();
    const date = moment().format();
    this.setState(prev => ({
      ...prev,
      gameStarted: true,
      gameId,
      date
    }));
  };

  endGame = () => {
    this.updateGame({ ...this.state, gameStarted: false });
    this.setState(prev => ({
      ...prev,
      gameStarted: false,
      scores: [],
      gameId: "",
      turn: 0,
      move: 0,
    }));
  };

  addScore = (score: Score) => {
    const move = this.state.turn >= this.state.players.length - 1 ? this.state.move + 1 : this.state.move;
    const turn = this.state.turn >= this.state.players.length - 1 ? 0 : this.state.turn + 1;
    this.setState(prev => ({ ...prev, scores: [...prev.scores, score], move, turn }));
  };

  undoMove = () => {
    const turn = this.state.turn <= 0 ? this.state.players.length - 1 : this.state.turn - 1;
    const move = this.state.turn <= 0 ? this.state.move - 1 : this.state.move;
    this.setState(prev => ({ ...prev, scores: prev.scores.slice(0, prev.scores.length - 1), move, turn }));
  };

  render() {
    return (<div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              <a href="/" style={styles.title}>Scoreboard</a>
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="content">

          {(this.state.gameStarted || (!this.state.gameStarted && this.state.readonly) ?
            <Scores
              readonly={this.state.readonly}
              turn={this.state.turn}
              move={this.state.move}
              players={this.state.players}
              scores={this.state.scores}
              gameId={this.state.gameId}
              onScore={this.addScore}
              onFinish={this.endGame}
              onUndo={this.undoMove}
            /> :
            <div>
              {this.state.readonly ? "" :
                <Button style={styles.button} variant="contained" color="primary" onClick={this.startGame}>
                  Start Game
                </Button>
              }
              <Players
                players={this.state.players}
                readonly={this.state.readonly}
                onAdd={this.addPlayer}
                onRemove={this.removePlayer}
              />
              <GamesList/>
            </div>)}
        </div>
      </div>
    );
  }

}

export default App;
