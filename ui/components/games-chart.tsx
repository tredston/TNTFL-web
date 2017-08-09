import * as React from 'react';
import { PlayerTotals } from 'tntfl-api';

export default function GamesChart(totals: PlayerTotals): JSX.Element {
  const win = (totals.wins / totals.games) * 100;
  const draw = ((totals.games - totals.wins - totals.losses) / totals.games) * 100;
  const loss = (totals.losses / totals.games) * 100;
  return (
    <div style={{display: 'flex', border: '1px solid black', width: '100%', height: 25}}>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#0000FF', width: `${win}%`}}/>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#FFC200', width: `${draw}%`}}/>
      <div style={{display: 'inline-block', height: '100%', backgroundColor: '#FF0000', width: `${loss}%`}}/>
    </div>
  );
}
