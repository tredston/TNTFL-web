import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { GlobalTotals } from 'tntfl-api';

interface StatsSectionProps {
  totals: GlobalTotals;
}
export default function StatsSection(props: StatsSectionProps): JSX.Element {
  const { totals } = props;
  return (
    <Panel>
      <Panel.Heading>Stats</Panel.Heading>
      <Panel.Body>
        <dl className='dl-horizontal'>
          <dt>Total games</dt>
          <dd>{totals.games}</dd>
          <dt>Total players</dt>
          <dd>{totals.players}</dd>
          <dt>Active players</dt>
          <dd>{`${totals.activePlayers} (${((totals.activePlayers / totals.players) * 100).toFixed(2)}%)`}</dd>
        </dl>
      </Panel.Body>
    </Panel>
  );
}
