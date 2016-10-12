import * as React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { VictoryLine } from 'victory';

import LadderEntry from '../model/ladder-entry';
import Player from '../model/player';

interface LadderProps {
  entries: LadderEntry[];
}
export default function Ladder(props: LadderProps): JSX.Element {
  function trendChart(trend: number[]): JSX.Element {
    const data = trend.map((y, x) => {return {x, y}});
    const colour = trend[0] < trend[trend.length - 1] ? "#0000FF" : "#FF0000"
    return (
      <VictoryLine data={data} style={{data: {stroke: colour}}}/>
    );
  }
  const { entries } = props;
  const flattened = entries.map(e => {
    return {
      rank: e.rank !== -1 ? e.rank : '-',
      name: e.name,
      games: e.player.total.games,
      wins: e.player.total.wins,
      draws: e.player.total.games - e.player.total.wins - e.player.total.losses,
      losses: e.player.total.losses,
      for: e.player.total.for,
      against: e.player.total.against,
      ratio: (e.player.total.wins / e.player.total.losses).toFixed(3),
      overrated: e.player.overrated.toFixed(3),
      skill: e.player.skill.toFixed(3),
      trend: e.trend,
    }
  });
  return (
    <BootstrapTable
      data={flattened}
      hover={true}
    >
      <TableHeaderColumn dataField={'rank'} dataSort={true} dataAlign={'center'}>Pos</TableHeaderColumn>
      <TableHeaderColumn dataField={'name'} dataSort={true} isKey={true}>Player</TableHeaderColumn>
      <TableHeaderColumn dataField={'games'} dataSort={true} dataAlign={'center'}>Games</TableHeaderColumn>
      <TableHeaderColumn dataField={'wins'} dataSort={true} dataAlign={'center'}>Wins</TableHeaderColumn>
      <TableHeaderColumn dataField={'draws'} dataSort={true} dataAlign={'center'}>Draws</TableHeaderColumn>
      <TableHeaderColumn dataField={'losses'} dataSort={true} dataAlign={'center'}>Losses</TableHeaderColumn>
      <TableHeaderColumn dataField={'for'} dataSort={true} dataAlign={'center'}>For</TableHeaderColumn>
      <TableHeaderColumn dataField={'against'} dataSort={true} dataAlign={'center'}>Against</TableHeaderColumn>
      <TableHeaderColumn dataField={'ratio'} dataSort={true} dataAlign={'center'}>Goal ratio</TableHeaderColumn>
      <TableHeaderColumn dataField={'overrated'} dataSort={true} dataAlign={'center'}>Overrated</TableHeaderColumn>
      <TableHeaderColumn dataField={'skill'} dataSort={true} dataAlign={'center'}>Skill</TableHeaderColumn>
      <TableHeaderColumn dataField={'trend'} dataFormat={(t: number[]) => trendChart(t)}>Trend</TableHeaderColumn>
    </BootstrapTable>
  );
}
