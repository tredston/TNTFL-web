import * as React from 'react';
import { Pie } from 'react-chartjs-2';

import ChartHolder from './chart-holder';
import { Totals } from '../model/player';

export default function GamesChart(totals: Totals): JSX.Element {
  const draws = totals.games - totals.wins - totals.losses;
  const data = {
    labels: ['Losses', 'Draws', 'Wins'],
    datasets: [{
      data: [totals.losses, draws, totals.wins],
      backgroundColor: ['#FF0000', '#FFC200', '#0000FF'],
    }]
  }
  const options = {
    legend: {display: false},
    animation: false,
  }
  return (
    <ChartHolder>
      <Pie data={data} options={options} />
    </ChartHolder>
  );
}
