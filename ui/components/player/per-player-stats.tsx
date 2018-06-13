import * as React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { PerPlayerStat } from 'tntfl-api';

import GamesChart from '../games-chart';
import PlayerName from '../player-name';

interface HeadToHeadLinkProps {
  player1: string;
  player2: string;
}
function HeadToHeadLink(props: HeadToHeadLinkProps): JSX.Element {
  const { player1, player2 } = props;
  return (
    <a href={`/headtohead/${player1}/${player2}`}>
      ⇋
    </a>
  );
}

function toTableData(stats: PerPlayerStat[]) {
  return stats && stats.sort((a: PerPlayerStat, b: PerPlayerStat) => b.skillChange - a.skillChange).map((s) => {
    return {
      opponent: s.opponent,
      for: s._for,
      against: s.against,
      games: s.games,
      wins: s.wins,
      draws: s.games - s.wins - s.losses,
      losses: s.losses,
      totals: {
        for: s._for,
        against: s.against,
        games: s.games,
        wins: s.wins,
        losses: s.losses,
      },
      skillChange: s.skillChange.toFixed(3),
    };
  });
}

interface PerPlayerStatsProps {
  playerName: string;
  stats: PerPlayerStat[];
}
export default function PerPlayerStats(props: PerPlayerStatsProps): JSX.Element {
  const { playerName, stats } = props;
  return (
    <BootstrapTable
      data={toTableData(stats)}
      hover={true}
      condensed={true}
      bodyStyle={{fontSize: 20}}
    >
      <TableHeaderColumn dataField={'opponent'} dataSort={true} isKey={true} dataFormat={(n) => <PlayerName name={n}/>}>Opponent</TableHeaderColumn>
      <TableHeaderColumn dataField={'opponent'} dataFormat={(n) => <HeadToHeadLink player1={playerName} player2={n}/>} dataAlign={'center'} width={'30'}></TableHeaderColumn>
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'games'} dataSort={true} dataAlign={'center'}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'wins'} dataSort={true} dataAlign={'center'}>Wins</TableHeaderColumn>
      <TableHeaderColumn dataField={'draws'} dataSort={true} dataAlign={'center'}>Draws</TableHeaderColumn>
      <TableHeaderColumn dataField={'losses'} dataSort={true} dataAlign={'center'}>Losses</TableHeaderColumn>
      <TableHeaderColumn dataField={'for'} dataSort={true} dataAlign={'center'}>For</TableHeaderColumn>
      <TableHeaderColumn dataField={'against'} dataSort={true} dataAlign={'center'}>Against</TableHeaderColumn>
      <TableHeaderColumn dataField={'skillChange'} dataSort={true} dataAlign={'center'}>Skill Change</TableHeaderColumn>
    </BootstrapTable>
  );
}
