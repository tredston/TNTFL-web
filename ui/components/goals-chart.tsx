import * as React from 'react';
import { Pie } from 'react-chartjs-2';

import { TablePieChart } from './table-charts';
import { Totals } from '../model/player';

export default function GoalsChart(totals: Totals): JSX.Element {
  const total = totals.for + totals.against;
  const goalsFor = (totals.for / total) * 100;
  const against = (totals.against / total) * 100;
  return (
    <div style={{display: 'flex', border: '1px solid black', width: 75, height: 25}}>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#0000FF', width: `${goalsFor}%`}}/>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#FF0000', width: `${against}%`}}/>
    </div>
  );
}
