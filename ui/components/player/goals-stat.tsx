import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { Player } from 'tntfl-api';

import { StatBox } from './stat-panel';

interface GoalsStatProps {
  player: Player;
}
export default function GoalsStat(props: GoalsStatProps): JSX.Element {
  const { player } = props;
  return (
    <StatBox title='Goals'>
      {player.total.for + player.total.against} goals
      <Pie
        data={{
          labels: ['For', 'Against'],
          datasets: [{
            data: [player.total.for, player.total.against],
            backgroundColor: ['blue', 'red'],
          }],
        }}
        options={{legend: {display: false}}}
      />
    </StatBox>
  );
}
