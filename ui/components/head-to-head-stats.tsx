import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Row, Col, Table } from 'react-bootstrap';

import Game from '../model/game';

interface HeadToHeadStatsProps {
  player1: string;
  player2: string;
  games: Game[];
}
export default function HeadToHeadStats(props: HeadToHeadStatsProps): JSX.Element {
  const { player1, player2 } = props;
  return (
    <Panel header={'Statistics'}>
      <Table>
        <tbody>
        <tr><td>{player1}</td><td></td><td>{player2}</td></tr>
        <tr><td></td><td>Points Swing</td><td></td></tr>
        <tr><td></td><td>Wins</td><td></td></tr>
        <tr><td></td><td>10-0 Wins</td><td></td></tr>
        <tr><td></td><td>Goals</td><td></td></tr>
        <tr><td></td><td>Predicted Result</td><td></td></tr>
        </tbody>
      </Table>
    </Panel>
  );
}
