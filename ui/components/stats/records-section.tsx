import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { GlobalRecords } from 'tntfl-api';

import PlayerLink from './player-link';
import StatListItem from './stat-list-item';

interface RecordsSectionProps {
  records: GlobalRecords;
}
export default function RecordsSection(props: RecordsSectionProps): JSX.Element {
  const { records } = props;
  const { winningStreak, longestGame } = records;
  const longestGameGoals = longestGame.red.score + longestGame.blue.score;
  return (
    <Panel>
      <Panel.Heading>Records</Panel.Heading>
      <Panel.Body>
        <dl className='dl-horizontal'>
          <StatListItem
            name={'Longest winning streak'}
            value={<span><b>{winningStreak.count}</b> (<PlayerLink name={winningStreak.player} />)</span>}
          />
          <StatListItem
            name={'Longest game'}
            value={<span><b><a href={`/game/${longestGame.date}`}>{longestGameGoals} goals</a></b> (<PlayerLink name={longestGame.red.name} /> vs <PlayerLink name={longestGame.blue.name} />)</span>}
          />
        </dl>
      </Panel.Body>
    </Panel>
  );
}
