import * as React from 'react';
import { CSSProperties } from 'react';
import { Player } from 'tntfl-api';

import { PieStatBox } from './stat-panel';

interface GamesStatProps {
  player: Player;
  style?: CSSProperties;
}
export default function GamesStat(props: GamesStatProps): JSX.Element {
  const { player, style } = props;
  const data = {
    labels: ['Wins', 'Draws', 'Losses'],
    datasets: [{
      data: [
        player.total.wins,
        player.total.games - player.total.wins - player.total.losses,
        player.total.losses,
      ],
      backgroundColor: ['blue', 'rgb(255, 194, 0)', 'red'],
    }],
  };
  return (
    <PieStatBox title='Games' style={style} data={data}>
      {player.total.games} games
    </PieStatBox>
  );
}
