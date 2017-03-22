import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
let LazyLoad = require('react-lazy-load');

import PerPlayerStatsView from '../components/player/per-player-stats';
import PerPlayerStat from '../model/per-player-stat';

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
  render(): JSX.Element {
    const { playerName, base } = this.props;
    const { stats } = this.state;
    return (
      <Panel header={<h2>Per-Player Stats</h2>}>
        {!stats && 'Loading...'}
        <LazyLoad onContentVisible={() => this.loadPerPlayerStats()}>
          {stats
          ? <PerPlayerStatsView playerName={playerName} base={base} stats={stats}/>
          : <div/>}
        </LazyLoad>
      </Panel>
    );
  }
}
