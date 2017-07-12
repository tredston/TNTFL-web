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
  const rankStyle = Object.assign({}, style, {width: '100%'});
  return (
    <StatBox title='Current Ranking' style={rankStyle} classes={`${league} ${inactive}`}>
      {prettyRank}
    </StatBox>
  );
}
