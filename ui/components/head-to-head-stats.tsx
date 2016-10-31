import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';

import PlayerName from './player-name';
import Rank from './rank';
import Game from '../model/game';
import Player from '../model/player';

interface StatRowProps {
  name?: string;
  redValue?: string | number;
  blueValue?: string | number;
  redAhead?: boolean;
  blueAhead?: boolean;
}
function StatRow(props: StatRowProps): JSX.Element {
  const { name, redValue, blueValue, redAhead, blueAhead} = props;
  const redStyle = redAhead ? {backgroundColor: '#F00', color: 'white'} : undefined;
  const blueStyle = blueAhead ? {backgroundColor: '#00F', color: 'white'} : undefined;
  return (
    <tr>
      <td style={Object.assign({width: '30%'}, redStyle)}>{redValue}</td>
      <td style={{fontWeight: 'bold'}}>{name}</td>
      <td style={Object.assign({width: '30%'}, blueStyle)}>{blueValue}</td>
    </tr>
  );
}

interface PlayerRowProps {
  player1Name: string;
  player2Name: string;
  player1?: Player;
  player2?: Player;
}
function PlayerRow(props: PlayerRowProps): JSX.Element {
  const { player1Name, player2Name, player1, player2 } = props;
  const redValue = player1 ? player1.name : player1Name;
  const blueValue = player2 ? player2.name : player2Name;
  const columnStyle = {padding: 0};
  const numActivePlayers = 0;
  return (
    <tr>
      <td style={{width: '30%', padding: 0}}>
        <Grid fluid={true}>
          <Row>
            <Col xs={8} style={columnStyle}>
              <PlayerName name={player1Name} base={''}/>
            </Col>
            <Col xs={4} style={columnStyle}>
              {player1 ? <Rank rank={player1.rank} numActivePlayers={numActivePlayers}/> : 'Loading...'}
            </Col>
          </Row>
        </Grid>
      </td>
      <td/>
      <td style={{width: '30%', padding: 0}}>
        <Grid fluid={true}>
          <Row>
            <Col xs={4} style={columnStyle}>
              {player2 ? <Rank rank={player2.rank} numActivePlayers={numActivePlayers}/> : 'Loading...'}
            </Col>
            <Col xs={8} style={columnStyle}>
              <PlayerName name={player2Name} base={''}/>
            </Col>
          </Row>
        </Grid>
      </td>
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
  return (
    <StatRow name={'Point Swing'} redValue={v1formatted} blueValue={v2formatted} redAhead={redAhead} blueAhead={blueAhead}/>
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
      return <StatRow name={'Predicted Result'} redValue={'Loading...'} blueValue={'Loading...'}/>
    }
    const blueScore = Math.round(predictedBlueGoalRatio * 10);
    const redScore = 10 - blueScore;
    const redAhead = redScore > blueScore;
    const blueAhead = blueScore > redScore;
    return (
      <StatRow name={'Predicted Result'} redValue={redScore} blueValue={blueScore} redAhead={redAhead} blueAhead={blueAhead}/>
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
            <PlayerRow player1Name={player1} player2Name={player2} player1={this.state.player1} player2={this.state.player2}/>
            <PointSwingRow p1swing={p1swing}/>
            {rows.map(({name, p1, p2}, i) =>
              <StatRow name={name} redValue={p1} blueValue={p2} redAhead={p1 > p2} blueAhead={p2 > p1} key={`${i}`}/>
            )}
            <PredictRow root={root} player1={this.state.player1} player2={this.state.player2}/>
          </tbody>
        </Table>
      </Panel>
    );
  }
}
