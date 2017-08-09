import * as React from 'react';

import { StatBox } from './stat-panel';
import { getLadderLeagueClass, getNearlyInactiveClass } from '../../utils/utils';

interface RankStatBoxProps {
  rank: number;
  numActivePlayers: number;
  lastPlayed: number;
}
export default function RankStatBox(props: RankStatBoxProps): JSX.Element {
  const { rank, numActivePlayers, lastPlayed } = props;
  const now = (new Date()).getTime() / 1000;
  const league = getLadderLeagueClass(rank, numActivePlayers);
  const inactive = getNearlyInactiveClass(lastPlayed, now);
  const prettyRank = rank !== -1 ? rank : '-';
  return (
    <StatBox title='Current Ranking' style={{width: '100%'}} classes={`${league} ${inactive}`}>{prettyRank}</StatBox>
  );
}
