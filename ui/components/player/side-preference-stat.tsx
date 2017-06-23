import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { Player } from 'tntfl-api';

import { StatBox } from './stat-panel';

interface SidePreferenceStatProps {
  player: Player;
}
export default function SidePreferenceStat(props: SidePreferenceStatProps): JSX.Element {
  const { player } = props;
  const data = {
    labels: ['Red', 'Blue'],
    datasets: [{
      data: [player.total.gamesAsRed, player.total.games - player.total.gamesAsRed],
      backgroundColor: ['red', 'blue'],
    }],
  };
  const options = {
    legend: {display: false},
  };
  return (
    <StatBox title='Side preference'><Pie data={data} options={options}/></StatBox>
  );
}
