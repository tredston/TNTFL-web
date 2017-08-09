import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { Player } from 'tntfl-api';

import { StatBox } from './stat-panel';

interface GamesStatProps {
  player: Player;
}
export default function GamesStat(props: GamesStatProps): JSX.Element {
  const { player } = props;
  return (
    <StatBox title='Games'>
      {player.total.games} games
      <Pie
        data={{
          labels: ['Wins', 'Draws', 'Losses'],
          datasets: [{
            data: [
              player.total.wins,
              player.total.games - player.total.wins - player.total.losses,
              player.total.losses,
            ],
            backgroundColor: ['blue', 'rgb(255, 194, 0)', 'red'],
          }],
        }}
        options={{legend: {display: false}}}
      />
    </StatBox>
  );
}
