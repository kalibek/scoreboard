import React, { Component } from 'react';
import { Player, Score, ScoreSum } from './model';
import { Button, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField } from '@material-ui/core';
import Timer from './Timer';
import { styles } from './styles';
import { calculateScores } from './utils';

interface Props {
  readonly: boolean;
  gameId: string;
  move: number;
  turn: number;
  players: Player[];
  scores: Score[];
  onScore: (s: Score) => void
  onFinish: () => void
  onUndo: () => void
}

interface State {
  word: string;
  score: number;
}

interface Move {
  move: number;
  scores: Score[];
}

class Scores extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      word: '',
      score: 0,
    }
  }

  setWord = (word: string) => {
    this.setState(prev => ({ ...prev, word }))
  };


  setScore = (score: number) => {
    this.setState(prev => ({ ...prev, score }))
  };

  saveScore = () => {
    this.props.onScore({
      turn: this.props.turn,
      move: this.props.move,
      score: this.state.score,
      word: this.state.word
    });
    this.setState(prev => ({
      ...prev, word: "", score: 0
    }))
  };

  getMoves = (): Move[] => {
    let moves: Move[] = [];
    this.props.scores.map(s => {
      if (typeof moves[s.move] === 'undefined') {
        moves[s.move] = {
          move: s.move,
          scores: []
        }
      }
      moves[s.move].scores.push(s)
    });
    return moves;
  };

  finish = () => {
    // Show who won
    let scoreboard = "Scoreboard: \n";
    calculateScores(this.props.players, this.props.scores).sort((a, b) => b.sum - a.sum)
      .map(s => scoreboard += `${this.props.players[s.turn].name} - ${s.sum}\n`);
    window.alert(scoreboard);
    // finish game
    this.props.onFinish();
  };

  render() {
    const playerName = this.props.players[this.props.turn].name;
    return <div>
      <h2>Game: <a href={`/${this.props.gameId}`}>{this.props.gameId}</a></h2>
      <h3>{playerName}'s turn</h3>

      {this.props.readonly ? "" :
        <div>
          <TextField label="word" onChange={e => this.setWord(e.target.value)} value={this.state.word}/>
          <TextField label="score" type="number" onChange={e => this.setScore(Number(e.target.value))}
                     value={this.state.score}/>
          <div>
            <Button style={styles.button} variant="contained" color="primary" onClick={this.saveScore}>Save</Button>
            <Button style={styles.button} variant="contained" color="default" onClick={this.props.onUndo}>Undo</Button>
          </div>
          <Timer/>
        </div>
      }
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {this.props.players.map(p => <TableCell key={p.name}>{p.name}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.getMoves().map(m =>
            <TableRow key={m.move}>
              <TableCell>{m.move + 1}</TableCell>
              {m.scores.map(s => <TableCell key={s.turn}>{s.word} - {s.score}</TableCell>)}
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            {calculateScores(this.props.players, this.props.scores).map(s => <TableCell key={s.turn}>{s.sum}</TableCell>)}
          </TableRow>
        </TableFooter>
      </Table>

      {this.props.readonly ? "" :
        <Button style={styles.button} variant="contained" color="primary" onClick={this.finish}>
          End Game
        </Button>
      }
    </div>;
  }
}

export default Scores;
