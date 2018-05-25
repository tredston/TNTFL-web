import * as React from 'react';
import { PlayerTotals } from 'tntfl-api';

export default function GoalsChart(totals: PlayerTotals): JSX.Element {
  const total = totals._for + totals.against;
  const goalsFor = (totals._for / total) * 100;
  const against = (totals.against / total) * 100;
  return (
    <div style={{display: 'flex', border: '1px solid black', width: 75, height: 25}}>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#0000FF', width: `${goalsFor}%`}}/>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#FF0000', width: `${against}%`}}/>
    </div>
  );
}
