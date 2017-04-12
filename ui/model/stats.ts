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
  longestGame: Game;
}

export interface BeltStat {
  player: string;
  count: number;
}

export interface Belt {
  current: BeltStat;
  best: BeltStat;
}

interface Stats {
  totals: Totals;
  records: Records;
  belt: Belt;
  gamesPerWeek: [number, number][];
}
export default Stats;
