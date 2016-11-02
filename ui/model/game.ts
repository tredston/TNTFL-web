import Achievement from './achievement';

interface Side {
  name: string;
  score: number;
  rankChange: number;
  newRank: number;
  skillChange: number
  achievements: Achievement[];
}

interface DeletedInfo {
  by: string;
  at: number;
}

interface Game {
  red: Side;
  blue: Side;
  date: number;
  deleted?: DeletedInfo;
}
export default Game;
