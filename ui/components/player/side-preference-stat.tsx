import * as React from 'react';
import { CSSProperties } from 'react';
import { Player } from 'tntfl-api';

import { PieStatBox } from './stat-panel';

interface SidePreferenceStatProps {
  player: Player;
  style?: CSSProperties;
}
export default function SidePreferenceStat(props: SidePreferenceStatProps): JSX.Element {
  const { player, style } = props;
  const gamesAsRed = player.total.gamesAsRed || 0;
  const data = {
    labels: ['Red', 'Blue'],
    datasets: [{
      data: [gamesAsRed, player.total.games - gamesAsRed],
      backgroundColor: ['red', 'blue'],
    }],
  };
  return (
    <PieStatBox title='Side preference' style={style} data={data}/>
  );
}
