import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { GlobalRecords } from 'tntfl-api';

import PlayerLink from './player-link';
import StatListItem from './stat-list-item';

interface RecordsSectionProps {
  records: GlobalRecords;
  base: string;
}
export default function RecordsSection(props: RecordsSectionProps): JSX.Element {
  const { records, base } = props;
  const { winningStreak, longestGame } = records;
  const longestGameGoals = longestGame.red.score + longestGame.blue.score;
  return (
    <Panel header={'Records'}>
      <dl className='dl-horizontal'>
        <StatListItem
          name={'Longest winning streak'}
          value={<span><b>{winningStreak.count}</b> (<PlayerLink name={winningStreak.player} base={base}/>)</span>}
        />
        <StatListItem
          name={'Longest game'}
          value={<span><b><a href={`${base}game/${longestGame.date}`}>{longestGameGoals} goals</a></b> (<PlayerLink name={longestGame.red.name} base={base}/> vs <PlayerLink name={longestGame.blue.name} base={base}/>)</span>}
        />
      </dl>
    </Panel>
  );
}
