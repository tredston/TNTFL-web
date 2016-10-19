import * as React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { VictoryLine, VictoryPie } from 'victory';

import PlayerNameLink from './player-name-link';
import LadderEntry from '../model/ladder-entry';
import Player, { Totals } from '../model/player';

function TrendChart(trend: number[]): JSX.Element {
  if (trend.length >= 2) {
    const data = trend.map((y, x) => {return {x, y}});
    const colour = trend[0] < trend[trend.length - 1] ? "#0000FF" : "#FF0000"
    return (
      <VictoryLine data={data} style={{data: {stroke: colour}}}/>
    );
  }
  else {
    return <div/>;
  }
}

function GamesChart(totals: Totals): JSX.Element {
  const data = [
    {x: 'Losses', y: totals.losses},
    {x: 'Draws', y: totals.games - totals.wins - totals.losses},
    {x: 'Wins', y: totals.wins},
  ];
  return (
    <VictoryPie
      data={data}
      colorScale={['#FF0000', '#FFC200', '#00FF00']}
    />
  );
}

function GoalChart(totals: Totals): JSX.Element {
  const data = [
    {x: 'Against', y: totals.against},
    {x: 'For', y: totals.for},
  ];
  return (
    <VictoryPie
      data={data}
      colorScale={['#FF0000', '#00FF00']}
    />
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
      <TableHeaderColumn dataField={'name'} dataSort={true} isKey={true} dataFormat={(n) => <PlayerNameLink base={''} name={n}/>}>Player</TableHeaderColumn>
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GoalChart(p)}>Goal ratio</TableHeaderColumn>
      <TableHeaderColumn dataField={'skill'} dataSort={true} dataAlign={'center'}>Skill</TableHeaderColumn>
      <TableHeaderColumn dataField={'trend'} dataFormat={(t: number[]) => TrendChart(t)}>Trend</TableHeaderColumn>
    </BootstrapTable>
  );
}
