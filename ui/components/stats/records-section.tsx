import * as React from 'react';
import { Panel } from 'react-bootstrap';

import { Records } from '../../model/stats';

interface RecordsSectionProps {
  records: Records;
  base: string;
}
export default function RecordsSection(props: RecordsSectionProps): JSX.Element {
  const { records, base } = props;
  const player = records.winningStreak.player;
  return (
    <Panel header={'Records'}>
      <dl className='dl-horizontal'>
        <dt style={{whiteSpace: 'normal'}}>Longest winning streak</dt>
        <dd><b>{records.winningStreak.count}</b> (<a href={`${base}player/${player}`}>{player}</a>)</dd>
      </dl>
    </Panel>
  );
}
