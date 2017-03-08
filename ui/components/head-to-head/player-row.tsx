import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import PlayerName from '../player-name';
import Rank from '../rank';
import Player from '../../model/player';

interface PlayerRowProps {
  player1Name: string;
  player2Name: string;
  player1?: Player;
  player2?: Player;
  numActivePlayers: number;
  base: string;
}
export default function PlayerRow(props: PlayerRowProps): JSX.Element {
  const { player1Name, player2Name, player1, player2, numActivePlayers, base } = props;
  const columnStyle = {padding: 0};
  return (
    <tr>
      <td style={{width: '30%', padding: 0}}>
        <Grid fluid={true}>
          <Row>
            <Col xs={8} style={columnStyle}>
              <PlayerName name={player1Name} base={base}/>
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
              <PlayerName name={player2Name} base={base}/>
            </Col>
          </Row>
        </Grid>
      </td>
    </tr>
  );
}
