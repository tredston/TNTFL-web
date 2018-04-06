import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
const LazyLoad = require('react-lazy-load');
import { PerPlayerStat, PlayersApi } from 'tntfl-api';

import PerPlayerStatsView from '../components/player/per-player-stats';

interface PerPlayerStatsProps extends Props<PerPlayerStats> {
  playerName: string;
  base: string;
}
interface State {
  stats?: PerPlayerStat[];
}
export default class PerPlayerStats extends Component<PerPlayerStatsProps, State> {
  state = {
    stats: undefined,
  };

  async loadPerPlayerStats() {
    const { base, playerName } = this.props;
    const api = new PlayersApi(fetch, base);
    const stats = await api.getPerPlayerStats({player: playerName});
    this.setState({stats} as State);
  }
  render(): JSX.Element {
    const { playerName, base } = this.props;
    const { stats } = this.state;
    // TODO No lazy load
    return (
      <Panel>
        <Panel.Heading><h2>Per-Player Stats</h2></Panel.Heading>
        <Panel.Body>
          {!stats && 'Loading...'}
          {/*<LazyLoad onContentVisible={() => this.loadPerPlayerStats()}>*/}
            {stats
            ? <PerPlayerStatsView playerName={playerName} base={base} stats={stats}/>
            : <div/>}
          {/*</LazyLoad>*/}
        </Panel.Body>
      </Panel>
    );
  }
}
