import Achievement from './achievement';
import Game from './game';

export interface Totals {
  games: number;
  players: number;
  activePlayers: number;
  achievements: [Achievement, number][];
}

export interface Records {
  winningStreak: {
    player: string;
    count: number;
  };
  mostSignificant: Game[];
  leastSignificant: Game[];
}

interface Stats {
  totals: Totals;
  records: Records;
  gamesPerDay: [number, number][];
}
export default Stats;
