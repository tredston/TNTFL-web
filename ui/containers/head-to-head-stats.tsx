import * as React from 'react';
import { Component, Props } from 'react';

import Game from '../model/game';
import Player from '../model/player';
import HeadToHeadStatsView from '../components/head-to-head/head-to-head-stats';

interface HeadToHeadStatsProps extends Props<HeadToHeadStats> {
  base: string;
  player1: string;
  player2: string;
  games: Game[];
}
interface HeadToHeadStatsState {
  player1: Player;
  player2: Player;
  activePlayers: {[key: number]: number};
}
export default class HeadToHeadStats extends Component<HeadToHeadStatsProps, HeadToHeadStatsState> {
  constructor(props: HeadToHeadStatsProps, context: any) {
    super(props, context);
    this.state = {
      player1: undefined,
      player2: undefined,
      activePlayers: undefined,
    };
  }
  async loadPlayer(playerName: string): Promise<Player> {
    const { base } = this.props;
    const url = `${base}player.cgi?method=view&view=json&player=${playerName}`;
    const r = await fetch(url);
    return await r.json();
  }
  async loadPlayers() {
    const { player1, player2 } = this.props;
    const p1 = this.loadPlayer(player1);
    const p2 = this.loadPlayer(player2);
    this.setState({player1: await p1, player2: await p2} as HeadToHeadStatsState);
  }
  async loadActivePlayers() {
    const { base } = this.props;
    const url = `${base}activeplayers.cgi`;
    const r = await fetch(url);
    this.setState({activePlayers: await r.json()} as HeadToHeadStatsState);
  }
  componentDidMount() {
    this.loadPlayers();
    this.loadActivePlayers();
  }
  render(): JSX.Element {
    const { base, player1: player1Name, player2: player2Name, games } = this.props;
    const { player1, player2, activePlayers } = this.state;
    return (
      <HeadToHeadStatsView
        base={base}
        player1Name={player1Name}
        player2Name={player2Name}
        player1={player1}
        player2={player2}
        games={games}
        activePlayers={activePlayers}
      />
    );
  }
}
