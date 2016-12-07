import * as React from 'react';
import { Pie } from 'react-chartjs-2';

import { TablePieChart } from './table-charts';
import { Totals } from '../model/player';

export default function GoalsChart(totals: Totals): JSX.Element {
  const data = {
    labels: ['Against', 'For'],
    datasets: [{
      data: [totals.against, totals.for],
      backgroundColor: ['#FF0000', '#0000FF'],
    }]
  }
  return (
    <TablePieChart data={data}/>
  );
}
