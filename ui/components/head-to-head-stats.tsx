import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';

import Game from '../model/game';

interface StatRowProps {
  name: string;
  player1value: number | undefined;
  player2value: number | undefined;
}
function StatRow(props: StatRowProps): JSX.Element {
  const { name, player1value, player2value } = props;
  const v1formatted = player1value && (Number.isInteger(player1value) ? player1value : player1value.toFixed(3));
  const v2formatted = player2value && (Number.isInteger(player2value) ? player2value : player2value.toFixed(3));
  const redAhead = (player2value === undefined) || (player1value > player2value);
  const blueAhead = (player1value === undefined) || (player2value > player1value);
  const redStyle = redAhead ? {backgroundColor: '#F00', color: 'white'} : undefined;
  const blueStyle = blueAhead ? {backgroundColor: '#00F', color: 'white'} : undefined;
  return (
    <tr>
      <td style={redStyle}>{v1formatted}</td>
      <td style={{fontWeight: 'bold'}}>{name}</td>
      <td style={blueStyle}>{v2formatted}</td>
    </tr>
  );
}

interface HeadToHeadStatsProps {
  player1: string;
  player2: string;
  games: Game[];
}
export default function HeadToHeadStats(props: HeadToHeadStatsProps): JSX.Element {
  const { player1, player2, games } = props;
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
  return (
    <Panel header={'Statistics'}>
      <Table style={{textAlign: 'center'}}>
        <tbody>
        <tr><td>{player1}</td><td></td><td>{player2}</td></tr>
        <StatRow name={'Point Swing'} player1value={p1swing > 0 ? p1swing : undefined} player2value={(-p1swing) > 0 ? (-p1swing) : undefined}/>
        <StatRow name={'Wins'} player1value={p1wins} player2value={p2wins}/>
        <StatRow name={'10-0 Wins'} player1value={p1ys} player2value={p2ys}/>
        <StatRow name={'Goals'} player1value={p1goals} player2value={p2goals}/>
        <StatRow name={'Predicted Result'} player1value={0} player2value={0}/>
        </tbody>
      </Table>
    </Panel>
  );
}
