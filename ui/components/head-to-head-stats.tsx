import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';

import Game from '../model/game';
import Player from '../model/player';

interface StatRowProps {
  name: string;
  player1value: number;
  player2value: number;
}
function StatRow(props: StatRowProps): JSX.Element {
  const { name, player1value, player2value } = props;
  const redAhead = player1value > player2value;
  const blueAhead = player2value > player1value;
  const redStyle = redAhead ? {backgroundColor: '#F00', color: 'white'} : undefined;
  const blueStyle = blueAhead ? {backgroundColor: '#00F', color: 'white'} : undefined;
  return (
    <tr>
      <td style={redStyle}>{player1value}</td>
      <td style={{fontWeight: 'bold'}}>{name}</td>
      <td style={blueStyle}>{player2value}</td>
    </tr>
  );
}

interface PointSwingRowProps {
  p1swing: number;
}
function PointSwingRow(props: PointSwingRowProps): JSX.Element {
  const { p1swing } = props;
  const v1formatted = p1swing > 0 ? p1swing.toFixed(3) : undefined
  const v2formatted = p1swing < 0 ? (-p1swing).toFixed(3) : undefined
  const redAhead = p1swing > 0
  const blueAhead = p1swing < 0;
  const redStyle = redAhead ? {backgroundColor: '#F00', color: 'white'} : undefined;
  const blueStyle = blueAhead ? {backgroundColor: '#00F', color: 'white'} : undefined;
  return (
    <tr>
      <td style={redStyle}>{v1formatted}</td>
      <td style={{fontWeight: 'bold'}}>Point Swing</td>
      <td style={blueStyle}>{v2formatted}</td>
    </tr>
  );
}

interface PredictRowProps extends Props<PredictRow> {
  root: string;
  player1: Player;
  player2: Player;
}
interface PredictRowState {
  predictedBlueGoalRatio: number;
}
class PredictRow extends Component<PredictRowProps, PredictRowState> {
  constructor(props: PredictRowProps, context: any) {
    super(props, context);
    this.state = {
      predictedBlueGoalRatio: undefined,
    };
  }
  async loadPrediction(props: PredictRowProps) {
    const { root, player1, player2 } = props;
    if (player1 !== undefined && player2 !== undefined) {
      const url = `${root}predict.cgi?player1Elo=${player1.skill}&player2Elo=${player2.skill}`;
      const r = await fetch(url);
      const j = await r.json();
      this.setState({predictedBlueGoalRatio: j.blueGoalRatio});
    }
  }
  componentDidMount() {
    this.loadPrediction(this.props);
  }
  componentWillReceiveProps(props: PredictRowProps) {
    this.loadPrediction(props);
  }
  render(): JSX.Element {
    const { predictedBlueGoalRatio } = this.state;
    if (predictedBlueGoalRatio === undefined) {
      return <tr></tr>
    }
    const blueScore = Math.round(predictedBlueGoalRatio * 10);
    const redScore = 10 - blueScore;
    const redAhead = redScore > blueScore;
    const blueAhead = blueScore > redScore;
    const redStyle = redAhead ? {backgroundColor: '#F00', color: 'white'} : undefined;
    const blueStyle = blueAhead ? {backgroundColor: '#00F', color: 'white'} : undefined;
    return (
      <tr>
        <td style={redStyle}>{redScore}</td>
        <td style={{fontWeight: 'bold'}}>Predicted Result</td>
        <td style={blueStyle}>{blueScore}</td>
      </tr>
    );
  }
}

interface HeadToHeadStatsProps extends Props<HeadToHeadStats> {
  root: string;
  player1: string;
  player2: string;
  games: Game[];
}
interface HeadToHeadStatsState {
  player1: Player;
  player2: Player;
}
export default class HeadToHeadStats extends Component<HeadToHeadStatsProps, HeadToHeadStatsState> {
  constructor(props: HeadToHeadStatsProps, context: any) {
    super(props, context);
    this.state = {
      player1: undefined,
      player2: undefined,
    };
  }
  async loadPlayer(playerName: string): Promise<Player> {
    const { root } = this.props;
    const url = `${root}player.cgi?method=view&view=json&player=${playerName}`;
    const r = await fetch(url);
    return await r.json();
  }
  async loadPlayers() {
    const { player1, player2 } = this.props;
    const p1 = this.loadPlayer(player1);
    const p2 = this.loadPlayer(player2);
    this.setState({player1: await p1, player2: await p2} as HeadToHeadStatsState);
  }
  componentDidMount() {
    this.loadPlayers();
  }
  render(): JSX.Element {
    const { root, player1, player2, games } = this.props;
    let p1swing = 0;
    let p1wins = 0;
    let p2wins = 0;
    let p1ys = 0;
    let p2ys = 0;
    let p1goals = 0;
    let p2goals = 0;
    games.forEach((game) => {
      let p1 = game.red;
      let p2 = game.blue;
      if (game.blue.name === player1) {
        p1 = game.blue;
        p2 = game.red;
      }
      p1swing += p1.skillChange;
      p1wins += p1.score > p2.score ? 1 : 0;
      p2wins += p2.score > p1.score ? 1 : 0;
      p1ys += (p1.score === 10 && p2.score === 0) ? 1 : 0;
      p2ys += (p2.score === 10 && p1.score === 0) ? 1 : 0;
      p1goals += p1.score;
      p2goals += p2.score;
    });
    const rows = [
      {name: 'Wins', p1: p1wins, p2: p2wins},
      {name: '10-0 Wins', p1: p1ys, p2: p2ys},
      {name: 'Goals', p1: p1goals, p2: p2goals},
    ];
    return (
      <Panel header={'Statistics'}>
        <Table style={{textAlign: 'center'}}>
          <tbody>
            <tr><td>{player1}</td><td></td><td>{player2}</td></tr>
            <PointSwingRow p1swing={p1swing}/>
            {rows.map((row, i) =>
              <StatRow name={row.name} player1value={row.p1} player2value={row.p2} key={`${i}`}/>
            )}
            <PredictRow root={root} player1={this.state.player1} player2={this.state.player2}/>
          </tbody>
        </Table>
      </Panel>
    );
  }
}
