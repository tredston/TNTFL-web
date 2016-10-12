import Player from './player';

interface LadderEntry {
  rank: number;
  name: string;
  player: Player;
  trend: number[];
}
export default LadderEntry;
