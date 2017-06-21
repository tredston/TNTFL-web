import Achievement from './achievement';
import Game from './game';

export interface AchievementCount extends Achievement {
  count: number;
}
export interface Totals {
  games: number;
  players: number;
  activePlayers: number;
  achievements: AchievementCount[];
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

export interface GamesPerWeekItem {
  date: number;
  count: number
}
interface Stats {
  totals: Totals;
  records: Records;
  belt: Belt;
  gamesPerWeek: GamesPerWeekItem[];
}
export default Stats;
