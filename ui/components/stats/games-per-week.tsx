import * as React from 'react';
import { TimeUnit } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GamesPerWeekItem } from 'tntfl-api';

import { options } from '../../chart-config';

interface GamesPerWeekProps {
  gamesPerWeek: GamesPerWeekItem[];
}
export default function GamesPerWeek(props: GamesPerWeekProps): JSX.Element {
  const { gamesPerWeek } = props;
  const data = {datasets: [{
    data: gamesPerWeek.map(d => ({x: d.date * 1000, y: d.count})),
    fill: false,
    borderColor: '#0000FF',
  }]};
  const localOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          minUnit: 'day' as TimeUnit,
        },
      }],
    },
  };
  return (
    <Line data={data} options={{...options, ...localOptions}} height={200}/>
  );
}
