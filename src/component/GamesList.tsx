import React, { Component } from 'react';
import { Game } from '../model';
import { List, ListItem } from '@material-ui/core';
import { calculateScores } from '../service';

interface State {
  games: Game[]
}

class GamesList extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      games: []
    }
  }

  componentDidMount(): void {
    fetch(`/api/game`, { method: "GET" })
      .then(res => res.json())
      .then(d => this.setState({ games: d }))
  }

  private getGames() {
    return this.state.games.sort((a, b) => {
      if (a.date > b.date) {
        return -1
      }
      if (a.date < b.date) {
        return 1
      }
      return 0;
    });
  }

  private getWinner(game: Game) {
    return game.players[calculateScores(game.players, game.scores)
      .sort((a, b) => b.sum - a.sum)[0].turn].name;
  }

  render() {
    const games = this.getGames();
    return <List>
      {games.map(g =>
        <ListItem key={g.gameId}>
          <a href={`/${g.gameId}`}>{g.date}</a> - {g.gameStarted ? "In Progress" : `Finished (Winner: ${this.getWinner(g)})`}
        </ListItem>
      )}
    </List>;
  }


}

export default GamesList;

