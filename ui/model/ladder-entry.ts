import Player from './player';

interface LadderEntry {
  rank: number;
  name: string;
  player: Player;
  trend: [number, number][];
}
export default LadderEntry;
