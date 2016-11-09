import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import GamesChart from './games-chart';
import GoalsChart from './goals-chart';
import PlayerName from './player-name';
import PerPlayerStat from '../model/per-player-stat';

interface PerPlayerStatsProps {
  stats: PerPlayerStat[];
}
export default function PerPlayerStats(props: PerPlayerStatsProps): JSX.Element {
  const { stats } = props;
  const flattened = stats.sort((a: PerPlayerStat, b: PerPlayerStat) => b.skillChange - a.skillChange).map((s) => {
    return {
      opponent: s.opponent,
      totals: {
        for: s.for,
        against: s.against,
        games: s.games,
        wins: s.wins,
        losses: s.losses,
      },
      skillChange: s.skillChange.toFixed(3),
    }
  });
  return (
    <Panel>
      <BootstrapTable
        data={flattened}
        hover={true}
        condensed={true}
      >
        <TableHeaderColumn dataField={'opponent'} dataSort={true} isKey={true} dataFormat={(n) => <PlayerName base={''} name={n}/>}>Opponent</TableHeaderColumn>
        <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
        <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GoalsChart(p)}>Goals</TableHeaderColumn>
        <TableHeaderColumn dataField={'skillChange'} dataSort={true} dataAlign={'center'}>Skill Change</TableHeaderColumn>
      </BootstrapTable>
    </Panel>
  );
}
