import * as React from 'react';
import { CSSProperties } from 'react';
import { Player } from 'tntfl-api';

import { PieStatBox } from './stat-panel';

interface GoalsStatProps {
  player: Player;
  style?: CSSProperties;
}
export default function GoalsStat(props: GoalsStatProps): JSX.Element {
  const { player, style } = props;
  const data = {
    labels: ['For', 'Against'],
    datasets: [{
      data: [player.total._for, player.total.against],
      backgroundColor: ['blue', 'red'],
    }],
  };
  return (
    <PieStatBox title='Goals' style={style} data={data}>
      {player.total._for + player.total.against} goals
    </PieStatBox>
  );
}
