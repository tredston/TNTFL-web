import * as React from 'react';
import { Pie } from 'react-chartjs-2';

import { Totals } from '../model/player';

export default function GoalsChart(totals: Totals): JSX.Element {
  const data = {
    labels: ['Against', 'For'],
    datasets: [{
      data: [totals.against, totals.for],
      backgroundColor: ['#FF0000', '#0000FF'],
    }]
  }
  const options = {
    legend: {display: false},
    animation: false,
    maintainAspectRatio: false,
  }
  return (
    <Pie data={data} options={options} width={50} height={50}/>
  );
}
