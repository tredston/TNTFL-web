import * as React from 'react';
import { Line } from 'react-chartjs-2';

import { options } from '../../chart-config';

interface GamesPerDayProps {
  gamesPerDay: [number, number][];
}
export default function GamesPerDay(props: GamesPerDayProps): JSX.Element {
  const { gamesPerDay } = props;
  const data = {datasets: [{
    data: gamesPerDay.map(d => {return {x: d[0] * 1000, y: d[1]}}),
    fill: false,
    borderColor: '#0000FF',
  }]};
  const localOptions = {
    maintainAspectRatio: false,
    scales: {xAxes: [{
      type: 'time',
      time: {
        minUnit: 'day',
      },
    }]},
  };
  return (
    <Line data={data} options={Object.assign({}, options, localOptions)} height={200}/>
  );
}
