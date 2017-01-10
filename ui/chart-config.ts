import { formatEpoch } from './utils/utils';

export const options = {
  scales: {xAxes: [{
    type: 'time',
    time: {
      minUnit: 'minute',
    }
  }]},
  legend: {display: false},
  tooltips: {callbacks: {
    title: (tooltip: any, point: any) => formatEpoch(tooltip[0].xLabel / 1000),
    label: (tooltip: any, point: any) => tooltip.yLabel.toFixed(3),
  }},
  animation: false,
};
