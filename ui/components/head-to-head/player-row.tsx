import * as React from 'react';
import { Player } from 'tntfl-api';

import PlayerName from '../player-name';
import Rank from '../rank';

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
  return (
    <tr>
      <td style={{width: '30%', padding: 0}}>
        <div style={{display: 'flex'}}>
          <div style={{width: '70%'}}>
            <PlayerName name={player1Name} base={base} colour={'red-player'}/>
          </div>
          <div style={{width: '30%'}}>
            {player1 ? <Rank rank={player1.rank} numActivePlayers={numActivePlayers}/> : 'Loading...'}
          </div>
        </div>
      </td>
      <td/>
      <td style={{width: '30%', padding: 0}}>
        <div style={{display: 'flex'}}>
          <div style={{width: '30%'}}>
            {player2 ? <Rank rank={player2.rank} numActivePlayers={numActivePlayers}/> : 'Loading...'}
          </div>
          <div style={{width: '70%'}}>
            <PlayerName name={player2Name} base={base} colour={'blue-player'}/>
          </div>
        </div>
      </td>
    </tr>
  );
}
