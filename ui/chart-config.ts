import { TimeUnit } from 'chart.js';

export const options = {
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        minUnit: 'hour' as TimeUnit,
      },
    }],
  },
  legend: {display: false},
  tooltips: {enabled: false},
  animation: {
    duration: 0,
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0,
    },
  },
};
