import * as React from 'react';
import { Line } from 'react-chartjs-2';

import Game from '../model/game';
import { formatEpoch } from '../utils/utils';

interface PlayerSkillChartProps {
  playerName: string;
  games: Game[];
}
export default function PlayerSkillChart(props: PlayerSkillChartProps): JSX.Element {
  const { playerName, games } = props;
  let skill = 0;
  const skillLine = games.map((game) => {
    skill += game.red.name == playerName ? game.red.skillChange : game.blue.skillChange;
    return {x: game.date * 1000, y: skill};
  });
  const data = {datasets: [{
    data: skillLine,
    fill: false,
    borderColor: '#0000FF',
  }]};
  const options = {
    scales: {xAxes: [{type: 'time'}]},
    legend: {display: false},
    tooltips: {callbacks: {
      title: (tooltip: any, point: any) => formatEpoch(tooltip[0].xLabel / 1000),
      label: (tooltip: any, point: any) => tooltip.yLabel.toFixed(3),
    }},
    animation: false,
  };
  return (    
    <Line data={data} options={options}/>
  );
}
