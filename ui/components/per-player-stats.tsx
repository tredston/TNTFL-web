import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
let LazyLoad = require('react-lazy-load');

import GamesChart from './games-chart';
import PlayerName from './player-name';
import PerPlayerStat from '../model/per-player-stat';

interface HeadToHeadLinkProps {
  base: string;
  player1: string;
  player2: string;
}
function HeadToHeadLink(props: HeadToHeadLinkProps): JSX.Element {
  const { base, player1, player2 } = props;
  return (
    <a href={`${base}headtohead/${player1}/${player2}/`}>
      <span className='glyphicon glyphicon-transfer'></span>
    </a>
  );
}

interface PerPlayerStatsProps extends Props<PerPlayerStats>{
  playerName: string;
  base: string;
}
interface State {
  stats: PerPlayerStat[];
}
export default class PerPlayerStats extends Component<PerPlayerStatsProps, State> {
  constructor(props: PerPlayerStatsProps, context: any) {
    super(props, context)
    this.state = {
      stats: undefined,
    };
  }
  async loadPerPlayerStats() {
    const { base, playerName } = this.props;
    const url = `${base}player.cgi?method=perplayerstats&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({stats: await r.json()} as State);
  }
  toTableData(stats: PerPlayerStat[]) {
    return stats && stats.sort((a: PerPlayerStat, b: PerPlayerStat) => b.skillChange - a.skillChange).map((s) => {
      return {
        opponent: s.opponent,
        for: s.for,
        against: s.against,
        games: s.games,
        wins: s.wins,
        draws: s.games - s.wins - s.losses,
        losses: s.losses,
        totals: {
          for: s.for,
          against: s.against,
          games: s.games,
          wins: s.wins,
          losses: s.losses,
        },
        skillChange: s.skillChange.toFixed(3),
      };
    });
  }
  render(): JSX.Element {
    const { playerName, base } = this.props;
    const { stats } = this.state;
    return (
      <Panel header={<h2>Per-Player Stats</h2>}>
        {!stats && 'Loading...'}
        <LazyLoad onContentVisible={() => this.loadPerPlayerStats()}>
          {stats
          ? <BootstrapTable
              data={this.toTableData(stats)}
              hover={true}
              condensed={true}
              bodyStyle={{fontSize: 20}}
            >
              <TableHeaderColumn dataField={'opponent'} dataSort={true} isKey={true} dataFormat={(n) => <PlayerName base={base} name={n}/>}>Opponent</TableHeaderColumn>
              <TableHeaderColumn dataField={'opponent'} dataFormat={(n) => <HeadToHeadLink player1={playerName} player2={n} base={base}/>} dataAlign={'center'} width={'30'}></TableHeaderColumn>
              <TableHeaderColumn dataField={'totals'} dataFormat={(p) => GamesChart(p)}>Games</TableHeaderColumn>
              <TableHeaderColumn dataField={'games'} dataSort={true} dataAlign={'center'}>Games</TableHeaderColumn>
              <TableHeaderColumn dataField={'wins'} dataSort={true} dataAlign={'center'}>Wins</TableHeaderColumn>
              <TableHeaderColumn dataField={'draws'} dataSort={true} dataAlign={'center'}>Draws</TableHeaderColumn>
              <TableHeaderColumn dataField={'losses'} dataSort={true} dataAlign={'center'}>Losses</TableHeaderColumn>
              <TableHeaderColumn dataField={'for'} dataSort={true} dataAlign={'center'}>For</TableHeaderColumn>
              <TableHeaderColumn dataField={'against'} dataSort={true} dataAlign={'center'}>Against</TableHeaderColumn>
              <TableHeaderColumn dataField={'skillChange'} dataSort={true} dataAlign={'center'}>Skill Change</TableHeaderColumn>
            </BootstrapTable>
          : <div/>}
        </LazyLoad>
      </Panel>
    );
  }
}
