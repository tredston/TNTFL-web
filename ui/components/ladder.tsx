import * as React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Line, Pie } from 'react-chartjs-2';

import PlayerName from './player-name';
import LadderEntry from '../model/ladder-entry';
import Player, { Totals } from '../model/player';

function TrendChart(trend: number[]): JSX.Element {
  if (trend.length >= 2) {
    const trendLine = trend.map((y, x) => {return {x, y}});
    const labels = trend.map((y, x) => '');
    const colour = trend[0] < trend[trend.length - 1] ? "#0000FF" : "#FF0000"
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
    };
    return (
      <Line data={data} options={options}/>
    );
  }
  else {
    return <div/>;
  }
}

function GamesChart(totals: Totals): JSX.Element {
  const draws = totals.games - totals.wins - totals.losses;
  const data = {
    labels: ['Losses', 'Draws', 'Wins'],
    datasets: [{
      data: [totals.losses, draws, totals.wins],
      backgroundColor: ['#FF0000', '#FFC200', '#0000FF'],
    }]
  }
  const options = {
    legend: {display: false},
  }
  return (
    <Pie data={data} options={options} />
  );
}

function GoalChart(totals: Totals): JSX.Element {
  const data = {
    labels: ['Against', 'For'],
    datasets: [{
      data: [totals.against, totals.for],
      backgroundColor: ['#FF0000', '#0000FF'],
    }]
  }
  const options = {
    legend: {display: false},
  }
  return (
    <Pie data={data} options={options} />
  );
}

interface LadderProps {
  entries: LadderEntry[];
}
export default function Ladder(props: LadderProps): JSX.Element {
  const { entries } = props;
  const flattened = entries.map(e => {
    return {
      rank: e.rank !== -1 ? e.rank : '-',
      name: e.name,
      totals: e.player.total,
      skill: e.player.skill.toFixed(3),
      trend: e.trend,
    }
  });
  return (
    <BootstrapTable
      data={flattened}
      hover={true}
      condensed={true}
    >
      <TableHeaderColumn dataField={'rank'} dataSort={true} dataAlign={'center'}>Pos</TableHeaderColumn>
      <TableHeaderColumn dataField={'name'} dataSort={true} isKey={true} dataFormat={(n) => <PlayerName base={''} name={n}/>}>Player</TableHeaderColumn>
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GoalChart(p)}>Goal ratio</TableHeaderColumn>
      <TableHeaderColumn dataField={'skill'} dataSort={true} dataAlign={'center'}>Skill</TableHeaderColumn>
      <TableHeaderColumn dataField={'trend'} dataFormat={(t: number[]) => TrendChart(t)}>Trend</TableHeaderColumn>
    </BootstrapTable>
  );
}
