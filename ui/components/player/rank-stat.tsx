import * as React from 'react';
import { CSSProperties } from 'react';

import { StatBox } from './stat-panel';
import { getLadderLeagueClass, getNearlyInactiveClass } from '../../utils/utils';

interface RankStatBoxProps {
  rank: number;
  numActivePlayers: number;
  lastPlayed: number;
  style?: CSSProperties;
}
export default function RankStatBox(props: RankStatBoxProps): JSX.Element {
  const { rank, numActivePlayers, lastPlayed, style } = props;
  const now = (new Date()).getTime() / 1000;
  const league = getLadderLeagueClass(rank, numActivePlayers);
  const inactive = getNearlyInactiveClass(lastPlayed, now);
  const prettyRank = rank !== -1 ? rank : '-';
  return (
    <StatBox title='Rank' style={style} classes={`${league} ${inactive}`}>
      {prettyRank}
    </StatBox>
  );
}
