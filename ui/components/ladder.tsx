import * as React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Line } from 'react-chartjs-2';

import GamesChart from './games-chart';
import GoalsChart from './goals-chart';
import PlayerName from './player-name';
import Rank from './rank';
import LadderEntry from '../model/ladder-entry';
import Player, { Totals } from '../model/player';
import { getLadderLeagueClass, getNearlyInactiveClass } from '../utils/utils';

function TrendChart(trend: [number, number][]): JSX.Element {
  if (trend.length >= 2) {
    const trendLine = trend.map(([date, y], x) => {return {x, y}});
    const labels = trend.map((y, x) => '');
    const colour = trend[0][1] < trend[trend.length - 1][1] ? "#0000FF" : "#FF0000"
    const data = {
      datasets: [{
        data: trendLine,
        fill: false,
        borderColor: colour,
      }],
      labels,
    };
    const options = {
      scales: {
        xAxes: [{display: false}],
        yAxes: [{display: false}],
      },
      legend: {display: false},
      tooltips: {enabled: false},
      animation: false,
      maintainAspectRatio: false,
    };
    return (
      <Line data={data} options={options} width={50} height={50}/>
    );
  }
  else {
    return <div/>;
  }
}

interface LadderProps {
  entries: LadderEntry[];
}
export default function Ladder(props: LadderProps): JSX.Element {
  const { entries } = props;
  const flattened = entries.map(e => {
    return {
      rank: e.rank,
      name: e.name,
      games: e.player.total.games,
      wins: e.player.total.wins,
      draws: e.player.total.games - e.player.total.wins - e.player.total.losses,
      losses: e.player.total.losses,
      for: e.player.total.for,
      against: e.player.total.against,
      totals: e.player.total,
      skill: e.player.skill.toFixed(3),
      trend: e.trend,
    };
  });
  const numActivePlayers = entries.filter((e) => e.rank >= 1).length;
  const now = (new Date()).getTime() / 1000;
  return (
    <BootstrapTable
      data={flattened}
      hover={true}
      condensed={true}
      bodyStyle={{fontSize: 20}}
      trClassName={(row) => getNearlyInactiveClass(row.trend[row.trend.length - 1][0], now)}
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
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GoalsChart(p)}>Goals</TableHeaderColumn>
      <TableHeaderColumn dataField={'for'} dataSort={true} dataAlign={'center'}>For</TableHeaderColumn>
      <TableHeaderColumn dataField={'against'} dataSort={true} dataAlign={'center'}>Against</TableHeaderColumn>
      <TableHeaderColumn dataField={'skill'} dataSort={true} dataAlign={'center'}>Skill</TableHeaderColumn>
      <TableHeaderColumn dataField={'trend'} dataFormat={(t: [number, number][]) => TrendChart(t)}>Trend</TableHeaderColumn>
    </BootstrapTable>
  );
}
