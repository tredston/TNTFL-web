import Player from './player';

export interface TrendItem {
  date: number;
  skill: number;
}
interface LadderEntry {
  player: Player;
  trend: TrendItem[];
}
export default LadderEntry;
