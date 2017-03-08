import * as React from 'react';
import { Line } from 'react-chartjs-2';

const options = {
  legend: {display: false},
  tooltips: {enabled: false},
  animation: false,
  maintainAspectRatio: false,
  responsive: false,
}

interface TapleLineChartProps {
  data: any;
}
export function TableLineChart(props: TapleLineChartProps): JSX.Element {
  const { data } = props;
  const width = 54;
  const sup = {
    scales: {
      xAxes: [{display: false}],
      yAxes: [{display: false}],
    },
  }
  return (
    <div style={{width, margin: 'auto'}}>
      <Line data={data} options={Object.assign({}, options, sup)} width={width} height={42}/>
    </div>
  );
}
