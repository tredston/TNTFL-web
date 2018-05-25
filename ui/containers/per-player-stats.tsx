import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import { PerPlayerStat, PlayersApi } from 'tntfl-api';

import PerPlayerStatsView from '../components/player/per-player-stats';

interface PerPlayerStatsProps extends Props<PerPlayerStats> {
  playerName: string;
}
interface State {
  stats?: PerPlayerStat[];
}
export default class PerPlayerStats extends Component<PerPlayerStatsProps, State> {
  state = {
    stats: undefined,
  };

  async loadPerPlayerStats() {
    const { playerName } = this.props;
    const stats = await new PlayersApi(undefined, '', fetch).getPerPlayerStats(playerName);
    this.setState({stats} as State);
  }
  componentDidMount() {
    this.loadPerPlayerStats();
  }
  render(): JSX.Element {
    const { playerName } = this.props;
    const { stats } = this.state;
    return (
      <Panel>
        <Panel.Heading><h2>Per-Player Stats</h2></Panel.Heading>
        <Panel.Body>
          {stats
            ? <PerPlayerStatsView playerName={playerName} stats={stats}/>
            : 'Loading...'
          }
        </Panel.Body>
      </Panel>
    );
  }
}
