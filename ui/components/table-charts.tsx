import * as React from 'react';
import { Line, Pie } from 'react-chartjs-2';

const SIZE = 40;
const options = {
  legend: {display: false},
  tooltips: {enabled: false},
  animation: false,
  maintainAspectRatio: false,
}

interface TaplePieChartProps {
  data: any;
}
export function TablePieChart(props: TaplePieChartProps): JSX.Element {
  const { data } = props;
  return (
    <Pie data={data} options={options} width={SIZE} height={SIZE}/>
  );
}

interface TapleLineChartProps {
  data: any;
}
export function TableLineChart(props: TaplePieChartProps): JSX.Element {
  const { data } = props;
  const sup = {
    scales: {
      xAxes: [{display: false}],
      yAxes: [{display: false}],
    },
  }
  return (
    <Line data={data} options={Object.assign({}, options, sup)} width={SIZE} height={SIZE}/>
  );
}
