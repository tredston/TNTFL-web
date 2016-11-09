import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import GamesChart from './games-chart';
import GoalsChart from './goals-chart';
import PlayerName from './player-name';
import PerPlayerStat from '../model/per-player-stat';

interface HeadToHeadLinkProps {
  player1: string;
  player2: string;
}
function HeadToHeadLink(props: HeadToHeadLinkProps): JSX.Element {
  const { player1, player2 } = props;
  const base = '';
  return (
    <a href={`${base}headtohead/${player1}/${player2}/`}>
      <span className='glyphicon glyphicon-transfer'></span>
    </a>
  );
}

interface PerPlayerStatsProps {
  playerName: string;
  stats: PerPlayerStat[];
}
export default function PerPlayerStats(props: PerPlayerStatsProps): JSX.Element {
  const { playerName, stats } = props;
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
        <TableHeaderColumn dataField={'opponent'} dataFormat={(n) => <HeadToHeadLink player1={playerName} player2={n}/>}></TableHeaderColumn>
        <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
        <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GoalsChart(p)}>Goals</TableHeaderColumn>
        <TableHeaderColumn dataField={'skillChange'} dataSort={true} dataAlign={'center'}>Skill Change</TableHeaderColumn>
      </BootstrapTable>
    </Panel>
  );
}
