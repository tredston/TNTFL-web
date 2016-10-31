import * as React from 'react';

import { getLadderLeagueClass } from '../utils/utils';

interface RankProps {
  rank: number;
  numActivePlayers: number;
}
export default function Rank(props: RankProps): JSX.Element {
  const { rank, numActivePlayers } = props;
  const league = getLadderLeagueClass(rank, numActivePlayers);
  return (
    <div className={"ladder-position " + league} style={{width: '100%'}}>
      {rank}
    </div>
  );
}
