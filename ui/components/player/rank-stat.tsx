import * as React from 'react';
import { CSSProperties } from 'react';

import { StatBox } from './stat-panel';
import { getLadderLeagueClass, getNearlyInactiveClass } from '../../utils/utils';

interface RankStatBoxProps {
  rank: number;
  numActivePlayers: number;
  activity: number;
  style?: CSSProperties;
}
export default function RankStatBox(props: RankStatBoxProps): JSX.Element {
  const { rank, numActivePlayers, activity, style } = props;
  const league = getLadderLeagueClass(rank, numActivePlayers);
  const inactive = getNearlyInactiveClass(activity);
  const prettyRank = rank !== -1 ? rank : '-';
  return (
    <StatBox title='Rank' style={style} classes={`${league} ${inactive}`}>
      {prettyRank}
    </StatBox>
  );
}
