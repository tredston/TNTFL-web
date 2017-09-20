import * as React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { TrendItem, LadderEntry } from 'tntfl-api';

import GamesChart from './games-chart';
import PlayerName from './player-name';
import { TableLineChart } from './table-charts';
import { getLadderLeagueClass, getNearlyInactiveClass } from '../utils/utils';

function TrendChart(trend: TrendItem[]): JSX.Element {
  if (trend.length >= 2) {
    const trendLine = trend.map((item, x) => ({x, y: item.skill}));
    const labels = trend.map((item, x) => '');
    const colour = trend[0].skill < trend[trend.length - 1].skill ? '#0000FF' : '#FF0000';
    const data = {
      datasets: [{
        data: trendLine,
        fill: false,
        borderColor: colour,
      }],
      labels,
    };
    return (
      <TableLineChart data={data}/>
    );
  }
  else {
    return <div/>;
  }
}

interface LadderProps {
  entries: LadderEntry[];
  showInactive: boolean;
}
export default function Ladder(props: LadderProps): JSX.Element {
  let { entries } = props;
  const { showInactive } = props;
  if (!showInactive) {
    entries = entries.filter(e => e.player && e.player.rank >= 1);
  }
  const flattened = entries.map(e => {
    return e.player && {
      rank: e.player.rank,
      name: e.player.name,
      games: e.player.total.games,
      wins: e.player.total.wins,
      draws: e.player.total.games - e.player.total.wins - e.player.total.losses,
      losses: e.player.total.losses,
      for: e.player.total.for,
      against: e.player.total.against,
      totals: e.player.total,
      skill: e.player.skill.toFixed(3),
      trend: e.trend,
      activity: e.player.activity,
    };
  });
  const numActivePlayers = entries.filter((e) => e.player && e.player.rank >= 1).length;
  return (
    <BootstrapTable
      data={flattened}
      hover={true}
      condensed={true}
      bodyStyle={{fontSize: 20}}
      trClassName={(row) => getNearlyInactiveClass(row.activity)}
    >
      <TableHeaderColumn
        dataField={'rank'}
        dataSort={true}
        dataAlign={'center'}
        columnClassName={(r) => getLadderLeagueClass(r, numActivePlayers)}
        dataFormat={(r) => r !== -1 ? r : '-'}
      >Pos</TableHeaderColumn>
      <TableHeaderColumn dataField={'name'} dataSort={true} isKey={true} dataFormat={(n) => <PlayerName base={''} name={n}/>}>Player</TableHeaderColumn>
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'games'} dataSort={true} dataAlign={'center'}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'wins'} dataSort={true} dataAlign={'center'}>Wins</TableHeaderColumn>
      <TableHeaderColumn dataField={'draws'} dataSort={true} dataAlign={'center'}>Draws</TableHeaderColumn>
      <TableHeaderColumn dataField={'losses'} dataSort={true} dataAlign={'center'}>Losses</TableHeaderColumn>
      <TableHeaderColumn dataField={'for'} dataSort={true} dataAlign={'center'}>For</TableHeaderColumn>
      <TableHeaderColumn dataField={'against'} dataSort={true} dataAlign={'center'}>Against</TableHeaderColumn>
      <TableHeaderColumn dataField={'skill'} dataSort={true} dataAlign={'center'}>Skill</TableHeaderColumn>
      <TableHeaderColumn dataField={'trend'} dataFormat={(t: TrendItem[]) => TrendChart(t)}>Trend</TableHeaderColumn>
    </BootstrapTable>
  );
}
