import { Player, Score, ScoreSum } from './model';

export const calculateScores = (players: Player[], scores: Score[]): ScoreSum[] => {
    let sums: ScoreSum[] = [];
    players.map(p => {
      sums[p.ord] = {
        turn: p.ord,
        sum: 0
      }
    });
    scores.map(s => {
      sums[s.turn].sum += s.score;
    });
    return sums;
  };