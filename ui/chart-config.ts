export const options = {
  scales: {xAxes: [{
    type: 'time',
    time: {
      minUnit: 'hour',
    },
  }]},
  legend: {display: false},
  tooltips: {enabled: false},
  animation: false,
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0,
    },
  },
};
