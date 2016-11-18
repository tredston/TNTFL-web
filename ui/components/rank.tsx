import * as React from 'react';

import { getLadderLeagueClass } from '../utils/utils';

interface RankProps {
  rank: number;
  numActivePlayers: number;
}
export default function Rank(props: RankProps): JSX.Element {
  const { rank, numActivePlayers } = props;
  return (
    <div className={getLadderLeagueClass(rank, numActivePlayers)} style={{width: '100%'}}>
      {rank}
    </div>
  );
}
